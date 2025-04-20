// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ route }: any) => {
  const [user, setUser] = useState({ name: '', phone: '' });

  useEffect(() => {
    const initUser = async () => {
      if (route.params?.name && route.params?.phone) {
        const newUser = {
          name: route.params.name,
          phone: route.params.phone,
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
      <Text style={styles.welcome}>Chào {user.name || 'tài xế'} 👋</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 10.762622,
          longitude: 106.660172,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: 10.762622, longitude: 106.660172 }}
          title="Vị trí hiện tại"
          description="Đây là bạn"
        />
      </MapView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
    margin: 16,
  },
  map: {
    flex: 1,
  },
});
