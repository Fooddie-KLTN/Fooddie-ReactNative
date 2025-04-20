import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const mockUsers = [
  { phone: '0901234567', password: '123456', name: 'Tài xế A' },
  { phone: '0908551402', password: 'password', name: 'Yoku' },
];

export default function LoginScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const user = mockUsers.find(u => u.phone === phone && u.password === password);
    if (user) {
      await AsyncStorage.setItem(
        'user',
        JSON.stringify({ name: user.name, phone: user.phone })
      );
      router.replace({
        pathname: '/',
        params: { name: user.name, phone: user.phone },
      });
    } else {
      setError('Mật khẩu không đúng. Vui lòng thử lại.');
    }
  };

  return (
    <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Nhập mật khẩu</Text>
      <Text style={styles.subtitle}>{phone}</Text>

      <TextInput
        placeholder="Mật khẩu"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError('');
        }}
      />

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A2E00',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#5f3f0d',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  errorText: {
    color: '#c62828',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#8D5100',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
