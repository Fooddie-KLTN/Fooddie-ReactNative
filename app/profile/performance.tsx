import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

interface PerformanceData {
  completedDeliveries: number;
  rejectedOrders: number;
  failedDeliveries: number;
  totalOrders: number;
  activeDeliveries: number;
  rejectionRatio: number;
  completionRatio: number;
  failureRatio: number;
  averageResponseTime: number;
  status: string;
  averageRating: number;
  totalEarnings: number;
}

export default function PerformanceScreen() {
  const router = useRouter();
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/shippers/performance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPerformanceData(data);
      }
    } catch (err) {
      console.error('Error fetching performance data:', err);
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
          <Text style={styles.title}>📊 Hiệu suất giao hàng</Text>
        </View>

        {performanceData && (
          <>
            {/* Overall Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thống kê tổng quan</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{performanceData.completedDeliveries}</Text>
                  <Text style={styles.statLabel}>Đơn hoàn thành</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{performanceData.activeDeliveries}</Text>
                  <Text style={styles.statLabel}>Đang giao</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{performanceData.rejectedOrders}</Text>
                  <Text style={styles.statLabel}>Từ chối</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{performanceData.totalOrders}</Text>
                  <Text style={styles.statLabel}>Tổng đơn</Text>
                </View>
              </View>
            </View>

            {/* Performance Ratios */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tỷ lệ hiệu suất</Text>
              
              <View style={styles.ratioCard}>
                <Text style={styles.ratioLabel}>Tỷ lệ hoàn thành</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { 
                    width: `${performanceData.completionRatio * 100}%`,
                    backgroundColor: '#4CAF50' 
                  }]} />
                </View>
                <Text style={styles.ratioValue}>{(performanceData.completionRatio * 100).toFixed(1)}%</Text>
              </View>

              <View style={styles.ratioCard}>
                <Text style={styles.ratioLabel}>Tỷ lệ từ chối</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { 
                    width: `${performanceData.rejectionRatio * 100}%`,
                    backgroundColor: '#FF9800' 
                  }]} />
                </View>
                <Text style={styles.ratioValue}>{(performanceData.rejectionRatio * 100).toFixed(1)}%</Text>
              </View>

              <View style={styles.ratioCard}>
                <Text style={styles.ratioLabel}>Tỷ lệ thất bại</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { 
                    width: `${performanceData.failureRatio * 100}%`,
                    backgroundColor: '#F44336' 
                  }]} />
                </View>
                <Text style={styles.ratioValue}>{(performanceData.failureRatio * 100).toFixed(1)}%</Text>
              </View>
            </View>

            {/* Additional Metrics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chỉ số khác</Text>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>⭐ Đánh giá trung bình</Text>
                <Text style={styles.metricValue}>{performanceData.averageRating.toFixed(1)}/5.0</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>⏱️ Thời gian phản hồi TB</Text>
                <Text style={styles.metricValue}>{performanceData.averageResponseTime.toFixed(1)} phút</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>📋 Trạng thái tài khoản</Text>
                <Text style={[styles.metricValue, { 
                  color: performanceData.status === 'APPROVED' ? '#4CAF50' : '#FF9800' 
                }]}>
                  {performanceData.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
                </Text>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9F6508',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  ratioCard: {
    marginBottom: 16,
  },
  ratioLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  ratioValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  metricCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  metricLabel: {
    fontSize: 14,
    color: '#333',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9F6508',
  },
});