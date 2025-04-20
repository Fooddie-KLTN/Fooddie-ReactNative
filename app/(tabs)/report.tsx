import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ReportScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>💰 Báo cáo thu nhập</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Hôm nay:</Text>
        <Text style={styles.amount}>145.000đ</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Tháng này:</Text>
        <Text style={styles.amount}>3.452.000đ</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF', padding: 20 },
  header: { fontSize: 20, fontWeight: '600', marginBottom: 20 },
  card: {
    backgroundColor: '#E9E4F0',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: { fontSize: 16, color: '#555' },
  amount: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 4 },
});
