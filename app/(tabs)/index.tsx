import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Switch,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

// Hàm tính khoảng cách giữa 2 tọa độ (đơn vị: km)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // bán kính Trái đất (km)

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // km
};

export default function HomeScreen() {
  const { name: paramName, phone: paramPhone } = useLocalSearchParams();
  const [user, setUser] = useState<{ name?: string; phone?: string }>({});
  const [online, setOnline] = useState(false);

  // Điểm giả lập: vị trí bắt đầu và kết thúc
  const origin = { latitude: 10.762622, longitude: 106.660172 };
  const destination = { latitude: 10.769, longitude: 106.680 };

  const distance = getDistance(
    origin.latitude,
    origin.longitude,
    destination.latitude,
    destination.longitude
  );
  const price = Math.round(distance * 10000);

  useEffect(() => {
    const initUser = async () => {
      if (paramName && paramPhone) {
        const newUser = {
          name: String(paramName),
          phone: String(paramPhone),
        };
        setUser(newUser);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
      } else {
        const saved = await AsyncStorage.getItem('user');
        if (saved) {
          setUser(JSON.parse(saved));
        } else {
          Alert.alert('Không tìm thấy thông tin', 'Hãy đăng nhập lại!');
        }
      }
    };

    initUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.hello}>👋 Xin chào,</Text>
        <Text style={styles.username}>{user.name || 'Tài xế'}</Text>

        <View style={styles.statusContainer}>
          <Text style={{ fontWeight: '600', marginRight: 8 }}>
            {online ? '🟢 Online' : '🔴 Offline'}
          </Text>
          <Switch value={online} onValueChange={setOnline} />
        </View>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={origin} title="Vị trí hiện tại" />
        <Marker coordinate={destination} title="Điểm đến" pinColor="green" />
        <Polyline
          coordinates={[origin, destination]}
          strokeWidth={4}
          strokeColor="#2196F3"
        />
      </MapView>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          📍 Quãng đường: <Text style={styles.bold}>{distance.toFixed(2)} km</Text>
        </Text>
        <Text style={styles.infoText}>
          💰 Giá cước: <Text style={styles.bold}>{price.toLocaleString()} VND</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  hello: {
    fontSize: 18,
    color: '#444',
  },
  username: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FF6D00',
  },
  statusContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  map: { flex: 1 },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#444',
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
  },
});
