import MapboxGL from '@rnmapbox/maps';
import Constants from 'expo-constants';

MapboxGL.setAccessToken(Constants.expoConfig?.extra?.MAPBOX_ACCESS_TOKEN || '');
