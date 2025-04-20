import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';

const notifications = [
  {
    id: '1',
    title: 'Xác nhận đơn hàng',
    content: 'Bạn đã nhận thành công đơn hàng ĐH001.',
    detail: 'Đơn hàng ĐH001 đã được hệ thống xác nhận vào lúc 14:05, ngày 20/04. Hãy đảm bảo bạn đến đúng giờ để nhận hàng và giao cho khách đúng hẹn.',
  },
  {
    id: '2',
    title: 'Bảo trì hệ thống',
    content: 'Hệ thống sẽ bảo trì lúc 3:00 sáng mai.',
    detail: 'Chúng tôi sẽ tiến hành bảo trì hệ thống vào lúc 3:00 sáng ngày 21/04 để nâng cấp hiệu năng. Trong thời gian này, ứng dụng sẽ tạm thời không thể sử dụng.',
  },
  {
    id: '3',
    title: 'Chúc mừng!',
    content: 'Bạn có 5 đơn hoàn thành hôm nay 🎉',
    detail: 'Xin chúc mừng bạn đã hoàn thành 5 đơn hàng trong ngày hôm nay. Tiếp tục duy trì phong độ và nhận thêm phần thưởng từ hệ thống nhé!',
  },
];

export default function NotificationScreen() {
  const [selected, setSelected] = useState<any>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông báo</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelected(item)}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardContent}>{item.content}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal chi tiết */}
      {selected && (
        <Modal
          visible={!!selected}
          transparent
          animationType="slide"
          onRequestClose={() => setSelected(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selected.title}</Text>
              <Text style={styles.modalDetail}>{selected.detail}</Text>

              <Pressable style={styles.modalClose} onPress={() => setSelected(null)}>
                <Text style={styles.modalCloseText}>Đóng</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBEF' },
  header: {
    fontSize: 20,
    fontWeight: '700',
    padding: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#FFE0B2',
    borderWidth: 1,
    borderColor: '#E6A959',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#5D3707',
    marginBottom: 4,
  },
  cardContent: {
    fontSize: 14,
    color: '#333',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000077',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#9F6508',
  },
  modalDetail: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  modalClose: {
    marginTop: 24,
    backgroundColor: '#9F6508',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: '600',
  },
});
