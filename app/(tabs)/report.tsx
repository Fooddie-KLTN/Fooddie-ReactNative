import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const screenWidth = Dimensions.get('window').width;
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

interface ReportData {
  period: string;
  dateRange: {
    from: string;
    to: string;
  };
  labels: string[];
  data: {
    earnings: number[];
    deliveryCount: number[];
    avgEarningsPerDelivery: number[];
  };
  summary: {
    totalEarnings: number;
    totalDeliveries: number;
    avgEarningsPerDelivery: number;
    bestDay: {
      date: string;
      earnings: number;
      deliveries: number;
    };
    worstDay: {
      date: string;
      earnings: number;
    };
    formatted: {
      totalEarnings: string;
      avgEarningsPerDelivery: string;
      avgEarningsPerDay: string;
    };
  };
  analytics: {
    peakPerformanceDays: string[];
    consistency: number;
    trend: string;
    workloadDistribution: {
      lightDays: number;
      moderateDays: number;
      heavyDays: number;
    };
  };
}

export default function ReportScreen() {
  const [filter, setFilter] = useState<'today' | 'week' | 'month'>('week');
  const [chartType, setChartType] = useState<'earnings' | 'deliveries' | 'average'>('earnings');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const token = await AsyncStorage.getItem('token');
    try {
      const url = new URL(`${apiUrl}/shippers/income-report`);
      url.searchParams.append('range', filter);
      if (filter === 'month') {
        url.searchParams.append('month', month.toString());
        url.searchParams.append('year', year.toString());
      }

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error('⚠️ Failed to fetch income report:', err);
      setReportData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, month, year]);

  const onRefresh = () => {
    fetchData(true);
  };

  const getChartData = () => {
    if (!reportData) return { labels: [], datasets: [{ data: [] }] };

    let data: number[];
    switch (chartType) {
      case 'deliveries':
        data = reportData.data.deliveryCount;
        break;
      case 'average':
        data = reportData.data.avgEarningsPerDelivery;
        break;
      default:
        data = reportData.data.earnings;
    }

    return {
      labels: reportData.labels,
      datasets: [{ data: data.length > 0 ? data : [0] }]
    };
  };

  const getPieData = () => {
    if (!reportData || reportData.data.earnings.length === 0) return [];

    return reportData.data.earnings.map((value, index) => ({
      name: reportData.labels[index],
      population: value,
      color: ['#F47C48', '#FDCB6E', '#FF9F43', '#FF6D3F', '#FF8A65', '#FFA726', '#FF7043'][index % 7],
      legendFontColor: '#333',
      legendFontSize: 12,
    })).filter(item => item.population > 0);
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return '#4CAF50';
      case 'declining': return '#F44336';
      case 'stable': return '#FF9800';
      default: return '#999';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '❓';
    }
  };

  const chartConfig = {
    backgroundGradientFrom: '#FFFDF4',
    backgroundGradientTo: '#FFFDF4',
    decimalPlaces: 0,
    color: (opacity = 1) => {
      switch (chartType) {
        case 'deliveries': return `rgba(76, 175, 80, ${opacity})`;
        case 'average': return `rgba(156, 39, 176, ${opacity})`;
        default: return `rgba(255, 111, 0, ${opacity})`;
      }
    },
    labelColor: () => '#4A2E00',
    barPercentage: 0.6,
    style: { borderRadius: 12 },
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('vi-VN')}đ`;
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.header}>📊 Thống kê thu nhập</Text>

      {/* Bộ lọc thời gian */}
      <View style={styles.filterRow}>
        {(['today', 'week', 'month'] as const).map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => setFilter(key)}
            style={[styles.filterButton, filter === key && styles.filterButtonActive]}
          >
            <Text style={filter === key ? styles.filterTextActive : styles.filterText}>
              {key === 'today' ? 'Hôm nay' : key === 'week' ? 'Tuần' : 'Tháng'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chọn tháng/năm nếu lọc theo tháng */}
      {filter === 'month' && (
        <View style={styles.pickerRow}>
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>Tháng</Text>
            <Picker selectedValue={month} onValueChange={setMonth}>
              {Array.from({ length: 12 }, (_, i) => (
                <Picker.Item key={i + 1} label={`Tháng ${i + 1}`} value={i + 1} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>Năm</Text>
            <Picker selectedValue={year} onValueChange={setYear}>
              {[2023, 2024, 2025].map((y) => (
                <Picker.Item key={y} label={`${y}`} value={y} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {loading ? (
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      ) : reportData ? (
        <>
          {/* Tổng thu nhập */}
          <View style={styles.box}>
            <Text style={styles.label}>Tổng {filter === 'today' ? 'hôm nay' : filter === 'week' ? 'tuần này' : `tháng ${month}/${year}`}:</Text>
            <Text style={styles.amount}>{reportData.summary.formatted.totalEarnings}</Text>
          </View>

          {/* Biểu đồ loại cột hoặc đường */}
          {reportData.data.earnings.length > 0 ? (
            <BarChart
              data={getChartData()}
              width={screenWidth - 32}
              height={250}
              yAxisLabel=""
              yAxisSuffix={chartType === 'deliveries' ? '' : 'đ'}
              chartConfig={chartConfig}
              showValuesOnTopOfBars
              verticalLabelRotation={0}
              style={styles.chart}
            />
          ) : (
            <Text style={styles.noDataText}>
              Không có dữ liệu để hiển thị trong khoảng thời gian này
            </Text>
          )}

          {/* Biểu đồ tròn cho phân bố thu nhập */}
          {reportData.data.earnings.length > 0 && getPieData().length > 0 && (
            <>
              <Text style={styles.pieChartTitle}>📈 Phân bố thu nhập theo ngày</Text>
              <PieChart
                data={getPieData()}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                style={styles.chart}
              />
            </>
          )}
        </>
      ) : (
        <Text style={styles.noDataText}>
          Không thể tải dữ liệu báo cáo. Vui lòng thử lại.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFDF4', 
    padding: 16 
  },
  header: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#4A2E00', 
    marginBottom: 20,
    textAlign: 'center'
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666'
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontSize: 16,
    fontStyle: 'italic'
  },

  box: {
    backgroundColor: '#FFEEC8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  label: { fontSize: 16, color: '#6A4A00' },
  amount: { fontSize: 22, fontWeight: 'bold', color: '#9F6508', marginTop: 6 },

  chart: { 
    borderRadius: 16,
    marginVertical: 16,
  },
  pieChartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A2E00',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },

  // Summary Cards
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFEEC8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  summaryLabel: { 
    fontSize: 14, 
    color: '#6A4A00',
    marginBottom: 4,
  },
  summaryValue: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#9F6508',
  },

  // Analytics
  analyticsContainer: {
    marginBottom: 16,
  },
  analyticsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFD580',
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A2E00',
    marginBottom: 12,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  analyticsLabel: {
    fontSize: 14,
    color: '#666',
  },
  analyticsValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  workloadTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A2E00',
    marginTop: 8,
    marginBottom: 8,
  },
  workloadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workloadItem: {
    alignItems: 'center',
    flex: 1,
  },
  workloadLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  workloadValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9F6508',
  },

  // Best Day
  bestDayContainer: {
    alignItems: 'center',
  },
  bestDayLabel: {
    fontSize: 14,
    color: '#666',
  },
  bestDayValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A2E00',
    marginVertical: 4,
  },
  bestDayEarnings: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },

  filterRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16 
  },
  filterButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD580',
    alignItems: 'center',
  },
  filterButtonActive: { backgroundColor: '#FFD580' },
  filterText: { color: '#444' },
  filterTextActive: { color: '#000', fontWeight: 'bold' },

  chartTypeRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16 
  },
  chartTypeBtn: {
    flex: 1,
    padding: 8,
    marginHorizontal: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD580',
    alignItems: 'center',
  },
  chartTypeBtnActive: { backgroundColor: '#FFD580' },
  chartTypeText: { color: '#444', fontSize: 12 },
  chartTypeTextActive: { fontWeight: 'bold', color: '#000', fontSize: 12 },

  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD580',
  },
  pickerLabel: {
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingTop: 8,
    color: '#4A2E00',
  },
});
