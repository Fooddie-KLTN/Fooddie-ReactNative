import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const orders = [
  { id: '1', code: 'ĐH001', address: '123 Lê Lợi', amount: '45.000đ' },
  { id: '2', code: 'ĐH002', address: '98 Trần Hưng Đạo', amount: '72.000đ' },
  { id: '3', code: 'ĐH003', address: '5 Nguyễn Trãi', amount: '38.000đ' },
];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 Lịch sử đơn hàng</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.textBold}>{item.code}</Text>
            <Text>{item.address}</Text>
            <Text style={{ color: '#888' }}>{item.amount}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F6' },
  header: { fontSize: 20, fontWeight: '600', padding: 16, color: '#444' },
  card: {
    backgroundColor: '#FFF2F2',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
  },
  textBold: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
});
