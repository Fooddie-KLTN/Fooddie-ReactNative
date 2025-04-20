import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
      <View style={styles.topSection}>
        <Image source={require('../../assets/images/avatar.jpg')} style={styles.avatar} />
        <Text style={styles.name}>Trần Văn A</Text>
        <Text style={styles.phone}>@0901234567</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/profile/edit')}
        >
          <Text style={styles.editText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menu}>
        <MenuItem label="Xác minh tài khoản" onPress={() => router.push('/profile/verification')} />
        <MenuItem label="Cài đặt" onPress={() => router.push('/profile/settings')} />
        <MenuItem label="Đổi mật khẩu" onPress={() => router.push('/profile/change-password')} />
        <MenuItem label="Giới thiệu bạn bè" onPress={() => router.push('/profile/refer-friends')} />
      </View>

      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const MenuItem = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuText}>{label}</Text>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  phone: { fontSize: 16, color: '#fff8', marginBottom: 12 },
  editButton: {
    backgroundColor: '#ffffffcc',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  editText: { color: '#9F6508', fontWeight: '600' },
  menu: { paddingHorizontal: 20 },
  menuItem: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuText: { fontSize: 16, fontWeight: '500' },
  arrow: { fontSize: 18, color: '#999' },
  logoutBtn: {
    marginTop: 'auto',
    margin: 20,
    backgroundColor: '#ff4d4d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontWeight: '600' },
});
