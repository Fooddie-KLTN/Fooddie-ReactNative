// src/screens/LoginWithPassword.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const mockUsers = [
  { phone: '0901234567', password: '123456', name: 'Tài xế A' },
  { phone: '0912345678', password: 'password', name: 'Tài xế B' },
];

const LoginWithPassword = ({ route, navigation }: any) => {
  const { phone } = route.params;
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const user = mockUsers.find(u => u.phone === phone && u.password === password);
    if (user) {
      Alert.alert('Đăng nhập thành công', `Chào ${user.name}`);
      navigation.replace('Home');
    } else {
      Alert.alert('Sai mật khẩu', 'Vui lòng thử lại');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập mật khẩu</Text>
      <Text style={styles.subtitle}>{phone}</Text>
      <TextInput
        placeholder="Mật khẩu"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginWithPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#444',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
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
    backgroundColor: '#0097A7',
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
