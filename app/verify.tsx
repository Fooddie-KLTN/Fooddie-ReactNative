import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [resending, setResending] = useState(false);
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;

  // Gửi OTP khi vào màn hình
  useEffect(() => {
    if (phone) sendOTP();
  }, [phone]);

  const sendOTP = async () => {
    try {
      setResending(true);
      const res = await fetch(`${apiUrl}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      console.log('Send OTP response:', data);
      if (!res.ok) throw new Error(data.message || 'Lỗi gửi OTP');
      Alert.alert('Thành công', 'Mã OTP đã được gửi về số điện thoại');
    } catch (error) {
      Alert.alert('Lỗi', 'Không gửi được OTP. Vui lòng thử lại.');
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    try {
      const res = await fetch(`${apiUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();
      if (res.ok && data.status === 'pending') {
        Alert.alert('Thông báo', 'Đăng ký thành công. Vui lòng chờ duyệt.');
        router.replace('/phone');
      } else if (data.status === 'rejected') {
        Alert.alert('Tài khoản bị từ chối', 'Vui lòng liên hệ hỗ trợ.');
      } else {
        Alert.alert('Xác minh thất bại', data.message || 'OTP không chính xác');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xác minh OTP');
    }
  };

  return (
    <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
      <Text style={styles.title}>Nhập mã OTP</Text>
      <Text style={styles.subtitle}>Mã đã được gửi đến số {phone}</Text>

      <TextInput
        placeholder="Nhập OTP"
        keyboardType="number-pad"
        style={styles.input}
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Xác minh</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={sendOTP} disabled={resending} style={styles.resendButton}>
        <Text style={styles.resendText}>{resending ? 'Đang gửi...' : 'Gửi lại mã'}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, color: '#4A2E00' },
  subtitle: { fontSize: 16, marginBottom: 20, color: '#5f3f0d' },
  input: {
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
    backgroundColor: '#8D5100',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  resendButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  resendText: {
    color: '#333',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
