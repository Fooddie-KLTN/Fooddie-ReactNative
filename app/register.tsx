import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';

export default function RegisterScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [showPicker, setShowPicker] = useState(false);
  const [cccd, setCccd] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [error, setError] = useState('');

  const apiUrl = Constants.expoConfig?.extra?.apiUrl;

  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${
      (date.getMonth() + 1).toString().padStart(2, '0')
    }/${date.getFullYear()}`;
  };

  const handleNext = async () => {
    if (!name || !password || !confirm || !birthday || !cccd || !driverLicense) {
      return setError('Vui lòng nhập đầy đủ thông tin');
    }
    if (password !== confirm) {
      return setError('Mật khẩu không khớp');
    }

    const payload = {
      username: phone,
      password,
      name,
      phone,
      birthday: birthday.toISOString().split('T')[0],
      cccd,
      driverLicense,
    };

    try {
      const res = await fetch(`${apiUrl}/auth/register-driver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Đăng ký thất bại');

      router.push('/phone');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      </View>

      <Text style={styles.title}>Tạo tài khoản mới</Text>
      <Text style={styles.subtitle}>Số điện thoại: {phone}</Text>

      <TextInput placeholder="Tên tài xế" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Mật khẩu" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
      <TextInput placeholder="Xác nhận mật khẩu" secureTextEntry style={styles.input} value={confirm} onChangeText={setConfirm} />
      <TextInput placeholder="Số CCCD" style={styles.input} value={cccd} onChangeText={setCccd} />
      <TextInput placeholder="Số GPLX" style={styles.input} value={driverLicense} onChangeText={setDriverLicense} />

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateInput}>
        <Text>{birthday ? formatDate(birthday) : 'Chọn ngày sinh'}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={birthday || new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setBirthday(date);
          }}
        />
      )}

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Tạo tài khoản</Text>
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
    marginBottom: 12,
    color: '#5f3f0d',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 14,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  dateInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
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
