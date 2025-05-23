import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Constants from 'expo-constants';
import '../../constants/mapbox'; // Cần đảm bảo file này setAccessToken đúng

export default function HomeScreen() {
  const [online, setOnline] = useState(false);
  const [route, setRoute] = useState<any>(null);

  const origin: [number, number] = [106.660172, 10.762622];      // Hồ Con Rùa
  const destination: [number, number] = [106.680, 10.769];       // Quận 5

  useEffect(() => {
    const fetchRoute = async () => {
      const token = Constants.expoConfig?.extra?.MAPBOX_ACCESS_TOKEN;
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.join(',')};${destination.join(',')}?geometries=geojson&access_token=${token}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        const coords = data.routes[0]?.geometry;
        if (coords) {
          setRoute({
            type: 'Feature',
            properties: {},
            geometry: coords,
          });
        }
      } catch (err) {
        console.warn('Failed to fetch route:', err);
      }
    };

    fetchRoute();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <View style={styles.statusBox}>
          <View style={[
            styles.statusDot,
            { backgroundColor: online ? '#4CAF50' : '#D32F2F' }
          ]} />
          <Text style={styles.statusText}>
            {online ? 'Đang hoạt động' : 'Ngoại tuyến'}
          </Text>
          <Switch value={online} onValueChange={setOnline} />
        </View>
      </View>

      {/* Map */}
      <MapboxGL.MapView style={styles.map} styleURL={MapboxGL.StyleURL.Street}>
        <MapboxGL.Camera
          centerCoordinate={origin}
          zoomLevel={13}
        />

        <MapboxGL.PointAnnotation id="origin" coordinate={origin}>
          <View style={styles.markerOrigin} />
        </MapboxGL.PointAnnotation>

        <MapboxGL.PointAnnotation id="destination" coordinate={destination}>
          <View style={styles.markerDest} />
        </MapboxGL.PointAnnotation>

        {route && (
          <MapboxGL.ShapeSource id="routeSource" shape={route}>
            <MapboxGL.LineLayer
              id="routeLine"
              style={{
                lineColor: '#1E90FF',
                lineWidth: 4,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>
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
    backgroundColor: '#FFF3B4',
  },
  logo: {
    width: 100,
    height: 40,
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
  markerOrigin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerDest: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3D00',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
