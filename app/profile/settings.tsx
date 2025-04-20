import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Settings() {
  return (
    <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
      <Text style={styles.title}>Cài đặt</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Nhận thông báo</Text>
        <Switch value={true} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Chế độ tiết kiệm pin</Text>
        <Switch value={false} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 20 },
  row: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { fontSize: 16 },
});
