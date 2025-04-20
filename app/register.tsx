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
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!name || !password || !confirm) {
      return setError('Vui lòng nhập đầy đủ thông tin');
    }
    if (password !== confirm) {
      return setError('Mật khẩu không khớp');
    }

    router.push({
      pathname: '/verify',
      params: { phone, name, password },
    });
  };

  return (
    <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Tạo tài khoản mới</Text>
      <Text style={styles.subtitle}>Số điện thoại: {phone}</Text>

      <TextInput
        placeholder="Tên tài xế"
        style={styles.input}
        value={name}
        onChangeText={(text) => {
          setName(text);
          setError('');
        }}
      />
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
      <TextInput
        placeholder="Xác nhận mật khẩu"
        secureTextEntry
        style={styles.input}
        value={confirm}
        onChangeText={(text) => {
          setConfirm(text);
          setError('');
        }}
      />

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
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
    marginBottom: 16,
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
