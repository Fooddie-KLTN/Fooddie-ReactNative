import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Hàm tính khoảng cách giữa 2 tọa độ (km)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export default function HomeScreen() {
  const { name: paramName, phone: paramPhone } = useLocalSearchParams();
  const [user, setUser] = useState<{ name?: string; phone?: string }>({});
  const [online, setOnline] = useState(false);

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
        if (saved) setUser(JSON.parse(saved));
      }
    };

    initUser();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header gradient */}
      <LinearGradient
        colors={['#9F6508', '#F3C871', '#FFF3B4']}
        style={styles.header}
      >
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <View style={styles.statusBox}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: online ? '#4CAF50' : '#D32F2F' },
            ]}
          />
          <Text style={styles.statusText}>
            {online ? 'Đang hoạt động' : 'Ngoại tuyến'}
          </Text>
          <Switch value={online} onValueChange={setOnline} />
        </View>
      </LinearGradient>

      {/* Info name */}
      <View style={styles.nameBox}>
        <Text style={styles.greeting}>Xin chào,</Text>
        <Text style={styles.name}>{user.name || 'Tài xế'}</Text>
      </View>

      {/* Map */}
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

      {/* Box thông tin */}
      <View style={styles.infoBox}>
        <Text style={styles.info}>
          Quãng đường: <Text style={styles.bold}>{distance.toFixed(2)} km</Text>
        </Text>
        <Text style={styles.info}>
          Giá cước: <Text style={styles.bold}>{price.toLocaleString()} VND</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
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
  nameBox: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  greeting: {
    fontSize: 16,
    color: '#444',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  map: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  info: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
});
