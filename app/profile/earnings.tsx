import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

interface EarningsData {
  totalEarnings: number;
  dailyEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  averageEarningsPerDelivery: number;
  formattedEarnings: {
    total: string;
    daily: string;
    weekly: string;
    monthly: string;
    perDelivery: string;
  };
}

export default function EarningsScreen() {
  const router = useRouter();
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/shippers/earnings-breakdown`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setEarningsData(data);
      }
    } catch (err) {
      console.error('Error fetching earnings data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>‹ Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>💰 Thu nhập chi tiết</Text>
        </View>

        {earningsData && (
          <>
            {/* Total Earnings */}
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Tổng thu nhập</Text>
              <Text style={styles.totalAmount}>{earningsData.formattedEarnings.total}</Text>
              <Text style={styles.avgAmount}>
                TB mỗi đơn: {earningsData.formattedEarnings.perDelivery}
              </Text>
            </View>

            {/* Period Breakdown */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thu nhập theo thời gian</Text>
              
              <View style={styles.earningCard}>
                <View style={styles.earningRow}>
                  <Text style={styles.earningLabel}>📅 Hôm nay</Text>
                  <Text style={styles.earningAmount}>{earningsData.formattedEarnings.daily}</Text>
                </View>
              </View>

              <View style={styles.earningCard}>
                <View style={styles.earningRow}>
                  <Text style={styles.earningLabel}>📊 Tuần này</Text>
                  <Text style={styles.earningAmount}>{earningsData.formattedEarnings.weekly}</Text>
                </View>
              </View>

              <View style={styles.earningCard}>
                <View style={styles.earningRow}>
                  <Text style={styles.earningLabel}>📈 Tháng này</Text>
                  <Text style={styles.earningAmount}>{earningsData.formattedEarnings.monthly}</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Xem báo cáo chi tiết</Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/(tabs)/report')}
              >
                <Text style={styles.actionButtonText}>📊 Xem báo cáo thu nhập đầy đủ</Text>
                <Text style={styles.actionArrow}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Earnings Tips */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 Mẹo tăng thu nhập</Text>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>• Giao hàng đúng giờ để được thưởng</Text>
                <Text style={styles.tipText}>• Nhận đơn trong giờ cao điểm</Text>
                <Text style={styles.tipText}>• Duy trì đánh giá cao từ khách hàng</Text>
                <Text style={styles.tipText}>• Hoạt động thường xuyên để có nhiều đơn hơn</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingText: { 
    textAlign: 'center', 
    marginTop: 50, 
    fontSize: 18, 
    color: '#fff' 
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  totalCard: {
    margin: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  avgAmount: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  section: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  earningCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  earningRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningLabel: {
    fontSize: 16,
    color: '#333',
  },
  earningAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9F6508',
  },
  actionButton: {
    backgroundColor: '#9F6508',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  actionArrow: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  tipCard: {
    backgroundColor: '#FFF3B4',
    borderRadius: 8,
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
});