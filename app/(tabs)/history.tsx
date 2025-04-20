import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';

const orders = [
  {
    id: '1',
    code: 'ĐH001',
    address: '123 Lê Lợi',
    amount: '45.000đ',
    store: 'Cơm tấm Minh Long',
    customer: 'Nguyễn Văn A',
    deliveryTo: '456 Nguyễn Văn Cừ',
    bill: [
      { name: 'Cơm sườn', quantity: 1, price: 25000 },
      { name: 'Nước suối', quantity: 1, price: 10000 },
    ],
    shipFee: 10000,
  },
  {
    id: '2',
    code: 'ĐH002',
    address: '98 Trần Hưng Đạo',
    amount: '72.000đ',
    store: 'Bún bò Huế 3A',
    customer: 'Trần Thị B',
    deliveryTo: '25 Nguyễn Thị Minh Khai',
    bill: [
      { name: 'Bún bò Huế', quantity: 2, price: 30000 },
      { name: 'Trà đá', quantity: 2, price: 2000 },
    ],
    shipFee: 8000,
  },
];

export default function HistoryScreen() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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
            onPress={() => setSelectedOrder(item)}
          >
            <Text style={styles.textBold}>{item.code}</Text>
            <Text style={styles.address}>{item.address}</Text>
            <Text style={styles.amount}>{item.amount}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal chi tiết */}
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
        <Text>Cửa hàng: {selectedOrder.store}</Text>
        <Text>Nơi nhận: {selectedOrder.deliveryTo}</Text>
        <Text>Khách hàng: {selectedOrder.customer}</Text>

        <Text style={styles.sectionTitle}>Chi tiết món:</Text>
        {selectedOrder.bill && selectedOrder.bill.map((item: any, idx: number) => (
          <View key={idx} style={styles.billRow}>
            <Text>{idx + 1}.</Text>
            <Text style={{ flex: 1 }}>{item.name}</Text>
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
            {Array.isArray(selectedOrder.bill)
              ? selectedOrder.bill.reduce(
                  (sum: number, item: { price: number; quantity: number; }) => sum + item.price * item.quantity,
                  selectedOrder.shipFee
                ).toLocaleString()
              : '0'}đ
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
