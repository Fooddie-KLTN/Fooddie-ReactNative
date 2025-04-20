import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
      <Text style={styles.title}>Đổi mật khẩu</Text>

      <TextInput placeholder="Mật khẩu hiện tại" secureTextEntry style={styles.input} value={current} onChangeText={setCurrent} />
      <TextInput placeholder="Mật khẩu mới" secureTextEntry style={styles.input} value={newPass} onChangeText={setNewPass} />
      <TextInput placeholder="Xác nhận mật khẩu mới" secureTextEntry style={styles.input} value={confirm} onChangeText={setConfirm} />

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Lưu mật khẩu mới</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  btn: {
    backgroundColor: '#ffffffcc',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#9F6508', fontWeight: '600' },
});
