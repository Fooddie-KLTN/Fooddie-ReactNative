// app/+not-found.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>😵‍💫 Không tìm thấy trang</Text>
      <Text style={styles.subtext}>Đường dẫn không hợp lệ hoặc màn hình chưa được tạo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff3f0' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#ff5555' },
  subtext: { fontSize: 16, marginTop: 10, color: '#888' },
});
