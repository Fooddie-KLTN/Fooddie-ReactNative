import { Slot, Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkState = async () => {
      try {
        const seenIntro = await AsyncStorage.getItem('seen_intro');
        const user = await AsyncStorage.getItem('user');

        if (!seenIntro) {
          setInitialRoute('/intro');
        } else if (!user) {
          setInitialRoute('/phone');
        } else {
          setInitialRoute('/'); // tab bar
        }
      } catch (err) {
        console.error('AsyncStorage error:', err);
        setInitialRoute('/intro');
      }
    };

    checkState();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF914D" />
      </View>
    );
  }

  return (
    <>
      <Redirect href={initialRoute as any} />

      <Slot />
    </>
  );
}
