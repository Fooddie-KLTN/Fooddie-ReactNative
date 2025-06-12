import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

export default function HistoryScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);


  // Lấy dữ liệu lịch sử đơn hàng từ API
  const fetchOrders = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${apiUrl}/shippers/order-history?page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Đảm bảo gửi token xác thực
        },
      });
      const data = await response.json();
      setOrders(data); // Lưu danh sách đơn hàng vào state
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getTotal = (bill: any[], ship: number) =>
    bill.reduce((sum, item) => sum + item.price * item.quantity, 0) + ship;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lịch sử đơn hàng</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedOrder(item)} // Hiển thị chi tiết khi bấm
          >
            <Text style={styles.textBold}>{item.code}</Text>
            <Text style={styles.address}>{item.address.street}</Text>
            <Text style={styles.amount}>{item.total.toLocaleString()}đ</Text>
            <Text style={styles.status}>{item.status}</Text> {/* Hiển thị trạng thái */}
          </TouchableOpacity>
        )}
      />

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <Modal
          visible={!!selectedOrder}
          animationType="slide"
          transparent
          onRequestClose={() => setSelectedOrder(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedOrder.code}</Text>
              <Text>Cửa hàng: {selectedOrder.restaurant.name}</Text>
              <Text>Nơi nhận: {selectedOrder.deliveryTo}</Text>
              <Text>Khách hàng: {selectedOrder.user.name}</Text>

              <Text style={styles.sectionTitle}>Chi tiết món:</Text>
              {selectedOrder.orderDetails && selectedOrder.orderDetails.map((item: any, idx: number) => (
                <View key={idx} style={styles.billRow}>
                  <Text>{idx + 1}.</Text>
                  <Text style={{ flex: 1 }}>{item.food.name}</Text>
                  <Text>{item.quantity}x</Text>
                  <Text>{(item.price * item.quantity).toLocaleString()}đ</Text>
                </View>
              ))}

              <View style={styles.billRow}>
                <Text style={{ flex: 1 }}>Phí ship</Text>
                <Text>{selectedOrder.shipFee.toLocaleString()}đ</Text>
              </View>

              <View style={[styles.billRow, { borderTopWidth: 1, paddingTop: 6 }]}>
                <Text style={{ flex: 1, fontWeight: 'bold' }}>Tổng cộng</Text>
                <Text style={{ fontWeight: 'bold' }}>
                  {getTotal(selectedOrder.orderDetails, selectedOrder.shipFee).toLocaleString()}đ
                </Text>
              </View>

              <Pressable
                style={styles.closeBtn}
                onPress={() => setSelectedOrder(null)}
              >
                <Text style={styles.closeText}>Đóng</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF3F0' },
  header: {
    fontSize: 20,
    fontWeight: '700',
    padding: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  textBold: { fontWeight: '600', fontSize: 16, marginBottom: 4 },
  address: { color: '#555' },
  amount: { color: '#9F6508', fontWeight: '600', marginTop: 6 },
  status: { color: '#777', marginTop: 6 }, // Hiển thị trạng thái

  modalOverlay: {
    flex: 1,
    backgroundColor: '#0005',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#9F6508',
  },
  sectionTitle: {
    marginTop: 14,
    marginBottom: 6,
    fontWeight: '600',
    color: '#333',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 6,
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#9F6508',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontWeight: '600' },
});
