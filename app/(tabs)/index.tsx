import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
  Modal,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import '../../constants/mapbox';
import { useOrderConfirmedForShipper } from '@/hooks/useGetOrder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [online, setOnline] = useState(false);
  const [route, setRoute] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newOrder, setNewOrder] = useState<any>(null);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [hasPickedUp, setHasPickedUp] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [orderReceivedAt, setOrderReceivedAt] = useState<Date | null>(null);

  const cameraRef = useRef<MapboxGL.Camera>(null);
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // ✅ NEW: Real-time location tracking
  useEffect(() => {
    let isMounted = true;

    const initializeLocation = async () => {
      try {
        // Request permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          return;
        }

        // Get initial location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        if (isMounted) {
          setCurrentPosition([
            location.coords.longitude,
            location.coords.latitude,
          ]);
        }

        // Start watching location changes
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000, // Update every 5 seconds
            distanceInterval: 10, // Or when moved 10 meters
          },
          (newLocation) => {
            if (isMounted) {
              const newPos: [number, number] = [
                newLocation.coords.longitude,
                newLocation.coords.latitude,
              ];
              
              console.log('[📍] Location updated:', newPos);
              setCurrentPosition(newPos);
            }
          }
        );

        locationSubscriptionRef.current = subscription;

      } catch (error) {
        console.error('Error setting up location tracking:', error);
      }
    };

    initializeLocation();

    // Cleanup function
    return () => {
      isMounted = false;
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
        locationSubscriptionRef.current = null;
      }
    };
  }, []);

  // ✅ UPDATED: Send location to server when delivering
  useEffect(() => {
    console.log('[DEBUG] useEffect locationInterval: newOrder =', newOrder, ', currentPosition =', currentPosition);

    // Clear any existing interval
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }

    // Start interval only when there's an active order
    if (newOrder && currentPosition) {
      locationIntervalRef.current = setInterval(async () => {
        try {
          const [longitude, latitude] = currentPosition;
          
          console.log('[🚚] Posting location to BE:', { latitude, longitude });
          
          const token = await AsyncStorage.getItem('token');
          await fetch(`${Constants.expoConfig?.extra?.apiUrl}/shippers/update-location`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude }),
          });
        } catch (err) {
          console.warn('[🚚] Failed to update location:', err);
        }
      }, 10000); // Send to server every 10 seconds
    }

    // Cleanup function
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    };
  }, [newOrder, currentPosition]); // Added currentPosition as dependency

  const { newOrders } = useOrderConfirmedForShipper({
    latitude: currentPosition?.[1]?.toString() || '',
    longitude: currentPosition?.[0]?.toString() || '',
  }, 9999, online);

  useEffect(() => {
    if (newOrders.length > 0) {
      console.log('[📦] New Order:', newOrders[0]); 
      setNewOrder(newOrders[0]);  
      setModalVisible(true);
      setOrderReceivedAt(new Date()); // Track when order was received
    }
  }, [newOrders]); 

  useEffect(() => {
    const fetchRoute = async () => {
      if (!currentPosition || !destination) return;
  
      const token = Constants.expoConfig?.extra?.MAPBOX_ACCESS_TOKEN;
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${currentPosition.join(',')};${destination.join(',')}?geometries=geojson&access_token=${token}`;
  
      try {
        const res = await fetch(url);
        const data = await res.json();
        const coords = data.routes[0]?.geometry;
        if (coords) {
          setRoute({ type: 'Feature', properties: {}, geometry: coords });
        }
      } catch (err) {
        console.warn('Failed to fetch route:', err);
      }
    };
  
    fetchRoute();
  }, [currentPosition, destination]);
  

  const handleAcceptOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || typeof token !== 'string' || !token.includes('.')) {
        Alert.alert('❌ Token không hợp lệ', 'Vui lòng đăng nhập lại.');
        return;
      }

      // Calculate actual response time
      const responseTimeSeconds = orderReceivedAt 
        ? Math.floor((new Date().getTime() - orderReceivedAt.getTime()) / 1000)
        : 30;

      console.log('[✅] Accepting order:', newOrder?.id, 'Response time:', responseTimeSeconds, 'seconds');

      const res = await fetch(`${Constants.expoConfig?.extra?.apiUrl}/shippers/accept-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          orderId: newOrder.id,
          responseTimeSeconds 
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setModalVisible(false);
        setOnline(false); // chuyển trạng thái offline
        setOrderReceivedAt(null); // Clear the timestamp
        const { latitude, longitude } = newOrder.restaurant;
        if (latitude && longitude) {
          setDestination([parseFloat(longitude), parseFloat(latitude)]);
        }
      } else {
        Alert.alert('❌ Lỗi', result.message || 'Không thể nhận đơn');
      }
    } catch (error) {
      console.error('Accept order error:', error);
      Alert.alert('❌ Lỗi', 'Có lỗi xảy ra.');
    }
  };

  const handleRejectOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('❌ Token không hợp lệ', 'Vui lòng đăng nhập lại.');
        return;
      }

      // Calculate actual response time
      const responseTimeSeconds = orderReceivedAt 
        ? Math.floor((new Date().getTime() - orderReceivedAt.getTime()) / 1000)
        : 30;

      console.log('[🚫] Rejecting order:', newOrder?.id, 'Response time:', responseTimeSeconds, 'seconds');

      const res = await fetch(`${Constants.expoConfig?.extra?.apiUrl}/shippers/reject-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          orderId: newOrder.id,
          responseTimeSeconds 
        }),
      });

      const result = await res.json();

      if (res.ok) {
        Alert.alert('🚫 Từ chối đơn', 'Bạn đã từ chối đơn hàng này');
        setModalVisible(false);
        setNewOrder(null);
        setOrderReceivedAt(null);
        
        // Show warning if present in response
        if (result.warning) {
          setTimeout(() => {
            Alert.alert('⚠️ Cảnh báo', result.warning);
          }, 1000);
        }
      } else {
        Alert.alert('❌ Lỗi', result.message || 'Không thể từ chối đơn hàng');
      }
    } catch (error) {
      console.error('Reject order error:', error);
      Alert.alert('❌ Lỗi', 'Có lỗi xảy ra khi từ chối đơn hàng');
    }
  };

  const handlePickup = () => {
    setHasPickedUp(true);

    try {
      const token = AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('❌ Token không hợp lệ', 'Vui lòng đăng nhập lại.');
        return;
      }

      fetch(`${Constants.expoConfig?.extra?.apiUrl}/shippers/get-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: newOrder.id }),
      });

          Alert.alert('✅ Đã lấy món từ nhà hàng');

    } catch (error) {
      console.error('Pickup error:', error);
      Alert.alert('❌ Lỗi', 'Đã xảy ra lỗi khi lấy món từ nhà hàng');
    }



    const lat = parseFloat(newOrder.address.latitude);
    const lon = parseFloat(newOrder.address.longitude);
    if (!isNaN(lat) && !isNaN(lon)) {
      setDestination([lon, lat]); // chuyển sang chỉ đường đến địa chỉ giao hàng
    }
  };

  const handleCompleteOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('❌ Token không hợp lệ', 'Vui lòng đăng nhập lại.');
        return;
      }
  
      const res = await fetch(`${Constants.expoConfig?.extra?.apiUrl}/shippers/complete-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: newOrder.id }),
      });
  
      const result = await res.json();
  
      if (res.ok) {
        Alert.alert('✅ Đơn hoàn thành', 'Bạn đã giao đơn thành công!');
        setNewOrder(null);
        setRoute(null);
        setHasPickedUp(false);
        setOnline(true); // Cho phép nhận đơn tiếp theo
      } else {
        Alert.alert('❌ Lỗi', result.message || 'Không thể hoàn thành đơn hàng');
      }
    } catch (err) {
      console.error('Complete order error:', err);
      Alert.alert('❌ Lỗi', 'Đã xảy ra lỗi khi hoàn thành đơn hàng');
    }
  };
  

  const handleCancelOrder = () => {

    try {
      const token = AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('❌ Token không hợp lệ', 'Vui lòng đăng nhập lại.');
        return;
      }

      fetch(`${Constants.expoConfig?.extra?.apiUrl}/shippers/cancel-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: newOrder.id }),
      });
    Alert.alert('🚫 Huỷ đơn', 'Bạn đã huỷ đơn này');




    }
    catch (error) {
      console.error('Cancel order error:', error);
      Alert.alert('❌ Lỗi', 'Đã xảy ra lỗi khi huỷ đơn hàng');
    }

    setNewOrder(null);
    setRoute(null);
    setOnline(true); // chuyển lại online
  };

  const fullAddress = [
    newOrder?.restaurant?.address?.street,
    newOrder?.restaurant?.address?.ward,
    newOrder?.restaurant?.address?.district,
    newOrder?.restaurant?.address?.city,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <View style={styles.statusBox}>
          <View style={[styles.statusDot, { backgroundColor: online ? '#4CAF50' : '#D32F2F' }]} />
          <Text style={styles.statusText}>{online ? 'Đang hoạt động' : 'Ngoại tuyến'}</Text>
          <Switch value={online} onValueChange={setOnline} />
        </View>
      </View>

      {currentPosition && (
        <MapboxGL.MapView style={styles.map} styleURL={MapboxGL.StyleURL.Street}>
          <MapboxGL.Camera ref={cameraRef} centerCoordinate={currentPosition} zoomLevel={13} />

          <MapboxGL.PointAnnotation id="current-location" coordinate={currentPosition}>
            <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.markerCurrent}>
                <Animated.View
                  style={[
                    styles.halo,
                    {
                      transform: [{
                        scale: pulseAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2],
                        }),
                      }],
                      opacity: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 0],
                      }),
                    },
                  ]}
                />
                <View style={styles.innerDot} />
              </View>
            </View>
          </MapboxGL.PointAnnotation>

          {/* Marker nhà hàng */}
          {newOrder?.restaurant?.latitude && newOrder?.restaurant?.longitude && (
            <MapboxGL.PointAnnotation
              id="restaurant-marker"
              coordinate={[
                parseFloat(newOrder.restaurant.longitude),
                parseFloat(newOrder.restaurant.latitude),
              ]}
            >
              <MaterialIcons name="storefront" size={30} color="#9F6508" />
            </MapboxGL.PointAnnotation>
          )}

          {/* Marker địa chỉ giao hàng */}
          {hasPickedUp && newOrder?.address?.latitude && newOrder?.address?.longitude && (
            <MapboxGL.PointAnnotation
              id="delivery-marker"
              coordinate={[
                parseFloat(newOrder.address.longitude),
                parseFloat(newOrder.address.latitude),
              ]}
            >
              <MaterialIcons name="home" size={30} color="#D32F2F" />
            </MapboxGL.PointAnnotation>
          )}


          {route && route?.type === 'Feature' && (
            <MapboxGL.ShapeSource id="routeSource" shape={route}>
              <MapboxGL.LineLayer
                id="routeLine"
                style={{ lineColor: '#1E90FF', lineWidth: 4, lineCap: 'round', lineJoin: 'round' }}
              />
            </MapboxGL.ShapeSource>
          )}
        </MapboxGL.MapView>
      )}

      

      {/* Nút quay lại vị trí hiện tại */}
      {currentPosition && (
        <TouchableOpacity
          onPress={() => {
            if (cameraRef.current) {
              cameraRef.current.flyTo(currentPosition, 1000);
            }
          }}
          style={styles.recenterButton}
        >
          <MaterialIcons name="my-location" size={24} color="#9F6508" />
        </TouchableOpacity>
      )}

      {/* Thông tin đơn hàng sau khi nhận */}
      {newOrder && !modalVisible && (
        <View style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 6,
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
            {newOrder.restaurant?.name}
          </Text>
          <Text style={{ marginBottom: 8 }}>Địa chỉ: {fullAddress}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
            {!hasPickedUp ? (
              <>
                <TouchableOpacity
                  onPress={handlePickup}
                  style={{ flex: 1, backgroundColor: '#F3C871', padding: 10, borderRadius: 8 }}
                >
                  <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Đã lấy món</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCancelOrder}
                  style={{ flex: 1, backgroundColor: '#D32F2F', padding: 10, borderRadius: 8 }}
                >
                  <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Huỷ</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={handleCompleteOrder}
                style={{ flex: 1, backgroundColor: '#4CAF50', padding: 10, borderRadius: 8 }}
              >
                <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Hoàn thành</Text>
              </TouchableOpacity>
            )}

              <TouchableOpacity
                onPress={() => setDetailModalVisible(true)}
                style={{ flex: 1, backgroundColor: '#2196F3', padding: 10, borderRadius: 8 }}
              >
                <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Chi tiết món</Text>
              </TouchableOpacity>

          </View>

        </View>
      )}

      <Modal visible={detailModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalTitle}>🧾 Chi tiết đơn hàng</Text>

              <Text style={styles.label}>
                🏪 Nhà hàng: <Text style={styles.value}>{newOrder?.restaurant?.name || 'Không rõ'}</Text>
              </Text>

              <Text style={styles.label}>
                📍 Địa chỉ nhà hàng:{' '}
                <Text style={styles.value}>
                  {[newOrder?.restaurant?.address?.street, newOrder?.restaurant?.address?.ward, newOrder?.restaurant?.address?.district, newOrder?.restaurant?.address?.city]
                    .filter(Boolean)
                    .join(', ') || 'Không rõ'}
                </Text>
              </Text>

              <Text style={styles.label}>
                🏠 Giao tới:{' '}
                <Text style={styles.value}>
                  {[newOrder?.address?.street, newOrder?.address?.ward, newOrder?.address?.district, newOrder?.address?.city]
                    .filter(Boolean)
                    .join(', ') || 'Không rõ'}
                </Text>
              </Text>

              <Text style={[styles.label, { marginTop: 10 }]}>🍽️ Món cần mua:</Text>
              {newOrder?.orderDetails?.map((d: { food: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }; quantity: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, idx: React.Key | null | undefined) => (
                <Text key={idx} style={styles.value}>
                  • {d.food.name} x{d.quantity}
                </Text>
              ))}

              {/* ✅ Nút đóng đặt trong ScrollView để luôn hiển thị */}
              <TouchableOpacity
                onPress={() => setDetailModalVisible(false)}
                style={[styles.acceptBtn, { marginTop: 20 }]}
              >
                <Text style={styles.btnText}>Đóng</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>



      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🚨 Đơn hàng mới</Text>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>
                🏪 Từ: <Text style={styles.value}>{newOrder?.restaurant?.name || 'Không rõ'}</Text>
              </Text>

              <Text style={styles.label}>
                📍 Địa chỉ:{' '}
                <Text style={styles.value}>
                  {fullAddress || 'Không rõ'}
                </Text>
              </Text>

              <Text style={styles.label}>
                💰 Tổng tiền:{' '}
                <Text style={styles.value}>
                  {newOrder?.total?.toLocaleString()}đ
                </Text>
              </Text>

              <Text style={styles.label}>
                🚚 Phí ship:{' '}
                <Text style={styles.value}>
                  {(newOrder?.shippingFee || 0).toLocaleString()}đ
                </Text>
              </Text>

              <Text style={styles.label}>
                💵 Thu nhập:{' '}
                <Text style={[styles.value, { color: '#4CAF50', fontWeight: 'bold' }]}>
                  {(newOrder?.shipperEarnings || 0).toLocaleString()}đ
                </Text>
              </Text>

              <Text style={styles.label}>
                📏 Cách bạn:{' '}
                <Text style={styles.value}>
                  {newOrder?.distanceFromShipper?.toFixed(2) || '–'} km
                </Text>
              </Text>

              <Text style={styles.label}>
                📦 Khoảng cách giao:{' '}
                <Text style={styles.value}>
                  {(newOrder?.deliveryDistance || 0).toFixed(2)} km
                </Text>
              </Text>

              <Text style={styles.label}>
                ⏱️ Thời gian dự kiến:{' '}
                <Text style={styles.value}>
                  {newOrder?.estimatedDeliveryTime || 30} phút
                </Text>
              </Text>

              {/* Add basic financial calculations */}
              {newOrder?.shippingFee && newOrder?.shipperEarnings && (
                <>
                  <View style={styles.separator} />
                  <Text style={[styles.label, { fontSize: 16, color: '#2196F3' }]}>💰 Chi tiết thu nhập:</Text>
                  
                  <Text style={styles.label}>
                    💳 Thu nhập gộp:{' '}
                    <Text style={styles.value}>
                      {newOrder.shipperEarnings.toLocaleString()}đ
                    </Text>
                  </Text>

                  <Text style={styles.label}>
                    ⛽ Chi phí xăng dự kiến:{' '}
                    <Text style={styles.value}>
                      {Math.round((newOrder.deliveryDistance || 0) * 3000).toLocaleString()}đ
                    </Text>
                  </Text>

                  <Text style={styles.label}>
                    💚 Lợi nhuận ròng:{' '}
                    <Text style={[styles.value, { 
                      color: newOrder.shipperEarnings > ((newOrder.deliveryDistance || 0) * 3000) ? '#4CAF50' : '#F44336',
                      fontWeight: 'bold' 
                    }]}>
                      {Math.max(0, newOrder.shipperEarnings - ((newOrder.deliveryDistance || 0) * 3000)).toLocaleString()}đ
                    </Text>
                  </Text>

                  <Text style={styles.label}>
                    🛣️ Thu nhập/km:{' '}
                    <Text style={styles.value}>
                      {newOrder.deliveryDistance > 0 ? Math.round(newOrder.shipperEarnings / newOrder.deliveryDistance).toLocaleString() : 0}đ/km
                    </Text>
                  </Text>
                </>
              )}

              {/* Delivery Details */}
              <View style={styles.separator} />
              <Text style={[styles.label, { fontSize: 16, color: '#FF9800' }]}>🚚 Thông tin giao hàng:</Text>
              
              <Text style={styles.label}>
                📦 Loại giao hàng:{' '}
                <Text style={styles.value}>
                  {newOrder?.deliveryType === 'scheduled' ? 'Đặt trước' : 'Giao ngay'}
                </Text>
              </Text>

              {newOrder?.requestedDeliveryTime && (
                <Text style={styles.label}>
                  🕒 Yêu cầu giao lúc:{' '}
                  <Text style={styles.value}>
                    {newOrder.requestedDeliveryTime}
                  </Text>
                </Text>
              )}
            </ScrollView>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.rejectBtn} onPress={handleRejectOrder}>
                <Text style={styles.btnText}>Từ chối</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptBtn} onPress={handleAcceptOrder}>
                <Text style={styles.btnText}>Nhận đơn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDECB2' },
  header: {
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3C871', // màu đậm hơn
  },
  logo: {
    width: 140, // logo to hơn
    height: 60,
    resizeMode: 'contain',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  map: {
    flex: 1,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3B4',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#9F6508',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%', // ✅ Giới hạn chiều cao để cuộn được
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  
  modalHeader: {
    backgroundColor: '#F3C871',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4E2C0B',
  },
  modalContent: {
    gap: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4E2C0B',
    lineHeight: 22,
  },
  value: {
    fontWeight: '400',
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rejectBtn: {
    backgroundColor: '#D32F2F',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptBtn: {
    backgroundColor: '#4CAF50',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff', // hoặc màu nền tương phản
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center'
  },
  markerCurrent: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
    overflow: 'visible',
  },
  halo: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 87, 34, 0.5)',
    zIndex: -1,
  },
  innerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
});
