import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const notifications = [
  { id: '1', content: 'Bạn đã nhận thành công đơn hàng ĐH001.' },
  { id: '2', content: 'Hệ thống sẽ bảo trì lúc 3:00 sáng mai.' },
  { id: '3', content: 'Bạn có 5 đơn hoàn thành hôm nay 🎉' },
];

export default function NotificationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔔 Thông báo</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBEF' },
  header: { fontSize: 20, fontWeight: '600', padding: 16 },
  item: {
    backgroundColor: '#FDF1F1',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
});
