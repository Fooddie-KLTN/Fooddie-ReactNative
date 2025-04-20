import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Verification() {
  return (
    <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
      <Text style={styles.title}>Xác minh tài khoản</Text>
      <Text style={styles.desc}>Bạn đã được xác minh ✔️</Text>

      <TouchableOpacity style={styles.verifyAgain}>
        <Text style={styles.textBtn}>Gửi lại yêu cầu xác minh</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff' },
  desc: { fontSize: 16, color: '#fff', marginTop: 10 },
  verifyAgain: {
    marginTop: 20,
    backgroundColor: '#ffffffcc',
    padding: 14,
    borderRadius: 10,
  },
  textBtn: { color: '#9F6508', fontWeight: '600' },
});
