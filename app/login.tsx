import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

export default function LoginScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;

  const handleLogin = async () => {
    try {
      const res = await fetch(`${apiUrl}/auth/login-driver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: phone, password }),
      });
  
      const data = await res.json();
  
      if (data.status === 'pending') {
        Alert.alert('Tài khoản đang chờ duyệt', 'Vui lòng quay lại sau khi được xét duyệt.');
        return;
      }
  
      if (data.status === 'rejected') {
        Alert.alert('Tài khoản bị từ chối', 'Vui lòng liên hệ quản trị viên để biết thêm chi tiết.');
        return;
      }
  
      if (res.ok && data.status === 'approved') {
        await AsyncStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          username: data.user.username,
          phone: data.user.phone,
          token: data.access_token,
        }));
        router.replace('/');
      } else {
        const msg = data.message || 'Đăng nhập thất bại';
        setError(msg);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
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
