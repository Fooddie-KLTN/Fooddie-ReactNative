import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

interface DashboardData {
  deliveryStats: {
    totalCompletedDeliveries: number;
    completionRate: number;
    onTimeDeliveryRate: number;
    averageDeliveryTime: number;
  };
  earnings: {
    totalEarnings: number;
    monthlyEarnings: number;
    weeklyEarnings: number;
    dailyEarnings: number;
    formattedEarnings: {
      total: string;
      monthly: string;
      weekly: string;
      daily: string;
    };
  };
  performanceRanking: {
    level: string;
    score: number;
  };
  achievements: Array<{
    name: string;
    description: string;
    earned: boolean;
    progress: number;
  }>;
}

export default function ProfileScreen() {
  const router = useRouter();

  // State lưu thông tin người dùng
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  // Hàm lấy thông tin tài xế
  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/shippers/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setName(data.name || '');
        setPhone(data.phone || '');
      } else {
        Alert.alert('❌ Lỗi', data.message || 'Không thể tải thông tin hồ sơ');
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin:', err);
      Alert.alert('❌ Lỗi', 'Không thể kết nối đến máy chủ');
    }
  };

  // Hàm lấy dữ liệu dashboard
  const fetchDashboard = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/shippers/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setDashboardData(data);
      } else {
        console.error('Không thể tải dữ liệu dashboard:', data.message);
      }
    } catch (err) {
      console.error('Lỗi khi lấy dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchDashboard();
  }, []);

  // Hàm đăng xuất
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      router.replace('/phone');
    } catch (err) {
      console.error('Lỗi khi đăng xuất:', err);
    }
  };

  // Hàm điều hướng đến trang hiệu suất
  const handleViewPerformance = () => {
    router.push('/profile/performance');
  };

  // Hàm điều hướng đến trang thu nhập
  const handleViewEarnings = () => {
    router.push('/profile/earnings');
  };

  // Hàm điều hướng đến trang thành tích
  const handleViewAchievements = () => {
    router.push('/profile/achievements');
  };

  const earnedAchievements = dashboardData?.achievements?.filter(a => a.earned) || [];
  const totalAchievements = dashboardData?.achievements?.length || 0;

  return (
    <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <Image source={require('../../assets/images/avatar.jpg')} style={styles.avatar} />
          <Text style={styles.name}>{name || 'Không tên'}</Text>
          <Text style={styles.phone}>{phone || 'Chưa có số điện thoại'}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={styles.editText}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </View>

        {/* Performance Overview */}
        {dashboardData && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>📊 Tổng quan hiệu suất</Text>
            
            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{dashboardData.deliveryStats.totalCompletedDeliveries}</Text>
                <Text style={styles.statLabel}>Đơn hoàn thành</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{dashboardData.performanceRanking.level}</Text>
                <Text style={styles.statLabel}>Cấp độ</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{dashboardData.earnings.formattedEarnings.total}</Text>
                <Text style={styles.statLabel}>Tổng thu nhập</Text>
              </View>
            </View>

            {/* Performance Card */}
            <TouchableOpacity style={styles.infoCard} onPress={handleViewPerformance}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>🎯 Hiệu suất giao hàng</Text>
                <Text style={styles.cardArrow}>›</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardDetail}>
                  Tỷ lệ hoàn thành: {dashboardData.deliveryStats.completionRate.toFixed(1)}%
                </Text>
                <Text style={styles.cardDetail}>
                  Giao đúng giờ: {dashboardData.deliveryStats.onTimeDeliveryRate.toFixed(1)}%
                </Text>
                <Text style={styles.cardDetail}>
                  Thời gian TB: {dashboardData.deliveryStats.averageDeliveryTime.toFixed(1)} phút
                </Text>
              </View>
            </TouchableOpacity>

            {/* Earnings Card */}
            <TouchableOpacity style={styles.infoCard} onPress={handleViewEarnings}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>💰 Thu nhập chi tiết</Text>
                <Text style={styles.cardArrow}>›</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardDetail}>
                  Tháng này: {dashboardData.earnings.formattedEarnings.monthly}
                </Text>
                <Text style={styles.cardDetail}>
                  Tuần này: {dashboardData.earnings.formattedEarnings.weekly}
                </Text>
                <Text style={styles.cardDetail}>
                  Hôm nay: {dashboardData.earnings.formattedEarnings.daily}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Achievements Card */}
            <TouchableOpacity style={styles.infoCard} onPress={handleViewAchievements}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>🏆 Thành tích</Text>
                <Text style={styles.cardArrow}>›</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardDetail}>
                  Đã đạt: {earnedAchievements.length}/{totalAchievements} thành tích
                </Text>
                {earnedAchievements.slice(0, 2).map((achievement, index) => (
                  <Text key={index} style={styles.achievementPreview}>
                    🏅 {achievement.name}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.menu}>
          <MenuItem label="Xác minh tài khoản" onPress={() => router.push('/profile/verification')} />
          <MenuItem label="Cài đặt" onPress={() => router.push('/profile/settings')} />
          <MenuItem label="Đổi mật khẩu" onPress={() => router.push('/profile/change-password')} />
          <MenuItem label="Giới thiệu bạn bè" onPress={() => router.push('/profile/change-password')} />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginBottom: 20,
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
  
  // Stats Section
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#ffffffcc',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9F6508',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  
  // Info Cards
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardArrow: {
    fontSize: 18,
    color: '#9F6508',
    fontWeight: 'bold',
  },
  cardContent: {
    gap: 4,
  },
  cardDetail: {
    fontSize: 14,
    color: '#666',
  },
  achievementPreview: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500',
  },
  
  // Menu
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
    margin: 20,
    backgroundColor: '#ff4d4d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontWeight: '600' },
});
