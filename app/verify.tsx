import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const { phone, name, password } = useLocalSearchParams();
  const [otp, setOtp] = useState('');



  const handleVerify = async () => {
    if (otp === '123456') {
      await AsyncStorage.setItem('user', JSON.stringify({ name: String(name), phone: String(phone) }));
      Alert.alert('Xác thực thành công', 'Tài khoản đã được tạo!');
      router.replace({
        pathname: '/',
        params: { phone: String(phone), name: String(name) },
      });
    } else {
      Alert.alert('Sai mã OTP', 'Vui lòng nhập lại');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập mã OTP</Text>
      <Text style={styles.subtitle}>Đã gửi mã tới số {phone}</Text>
      <TextInput
        placeholder="Nhập mã OTP"
        keyboardType="number-pad"
        style={styles.input}
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 10,
    color: '#555',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#43A047',
    paddingVertical: 14,
    paddingHorizontal: 32,
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
