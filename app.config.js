import 'dotenv/config';

export default {
  expo: {
    name: 'Fooddie',
    slug: 'Fooddie',
    version: '1.0.0',
    orientation: 'portrait',
    owner: "ducquan",
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.anonymous.Fooddie'
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff'
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      baseUrl: process.env.EXPO_PUBLIC_API_URL_DOMAIN_BE,
      MAPBOX_ACCESS_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
      router: {
        origin: false
      },
       eas: {
        projectId: "38f3c1bb-f78e-40b5-8c8f-ae0fe2c601cc"
      }
    }
  }
};
