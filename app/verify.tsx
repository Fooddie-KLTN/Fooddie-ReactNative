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

export default function OTPVerificationScreen() {
  const router = useRouter();
  const { phone, name, password } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (otp === '123456') {
      await AsyncStorage.setItem(
        'user',
        JSON.stringify({ name: String(name), phone: String(phone) })
      );
      router.replace({
        pathname: '/',
        params: { phone: String(phone), name: String(name) },
      });
    } else {
      setError('Mã OTP không chính xác. Vui lòng thử lại.');
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

      <Text style={styles.title}>Nhập mã OTP</Text>
      <Text style={styles.subtitle}>Đã gửi mã tới số: {phone}</Text>

      <TextInput
        placeholder="Nhập mã OTP"
        keyboardType="number-pad"
        style={styles.input}
        value={otp}
        onChangeText={(text) => {
          setOtp(text);
          setError('');
        }}
        maxLength={6}
      />

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Xác nhận</Text>
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
    marginBottom: 40,
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
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 10,
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
    backgroundColor: '#4CAF50',
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
