import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function EditProfile() {
  const [name, setName] = useState('Trần Văn A');
  const [phone, setPhone] = useState('0901234567');

  return (
    <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Họ tên" />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Số điện thoại" keyboardType="phone-pad" />

      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveText}>Lưu thay đổi</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#fff' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  saveBtn: {
    backgroundColor: '#ffffffcc',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: { fontWeight: '600', color: '#9F6508' },
});
