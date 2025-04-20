import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const weeklyData = [150000, 180000, 210000, 170000, 240000, 300000, 280000];
const todayData = [145000];
const monthData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 250000) + 100000);

export default function ReportScreen() {
  const [filter, setFilter] = useState<'today' | 'week' | 'month'>('week');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  const getData = () => {
    switch (filter) {
      case 'today': return todayData;
      case 'week': return weeklyData;
      case 'month': return monthData;
    }
  };

  const labels = () => {
    if (filter === 'today') return ['Hôm nay'];
    if (filter === 'week') return ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    return Array.from({ length: 30 }, (_, i) => `Ngày ${i + 1}`);
  };

  const pieData = getData().map((value, index) => ({
    name: labels()[index],
    population: value,
    color: ['#F47C48', '#FDCB6E', '#FF9F43', '#FF6D3F', '#FF8A65', '#FFA726', '#FF7043'][index % 7],
    legendFontColor: '#333',
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundGradientFrom: '#FFFDF4',
    backgroundGradientTo: '#FFFDF4',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 111, 0, ${opacity})`,
    labelColor: () => '#4A2E00',
    barPercentage: 0.6,
    style: { borderRadius: 12 },
  };

  const total = getData().reduce((sum, val) => sum + val, 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📊 Báo cáo thu nhập</Text>

      {/* Bộ lọc */}
      <View style={styles.filterRow}>
        {['today', 'week', 'month'].map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => setFilter(key as any)}
            style={[
              styles.filterButton,
              filter === key && styles.filterButtonActive,
            ]}
          >
            <Text style={filter === key ? styles.filterTextActive : styles.filterText}>
              {key === 'today' ? 'Hôm nay' : key === 'week' ? 'Tuần' : 'Tháng'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chuyển đổi chart */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() => setChartType('bar')}
          style={[styles.toggleBtn, chartType === 'bar' && styles.toggleBtnActive]}
        >
          <Text style={chartType === 'bar' ? styles.toggleTextActive : styles.toggleText}>
            Biểu đồ cột
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setChartType('pie')}
          style={[styles.toggleBtn, chartType === 'pie' && styles.toggleBtnActive]}
        >
          <Text style={chartType === 'pie' ? styles.toggleTextActive : styles.toggleText}>
            Biểu đồ tròn
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tổng thu nhập */}
      <View style={styles.box}>
        <Text style={styles.label}>Tổng {filter === 'today' ? 'hôm nay' : filter === 'week' ? 'tuần này' : 'tháng này'}:</Text>
        <Text style={styles.amount}>{total.toLocaleString()}đ</Text>
      </View>

      {/* Biểu đồ */}
      {chartType === 'bar' ? (
        <BarChart
          data={{
            labels: labels(),
            datasets: [{ data: getData() }],
          }}
          width={screenWidth - 32}
          height={250}
          yAxisLabel=""
          yAxisSuffix="đ"
          chartConfig={chartConfig}
          showValuesOnTopOfBars
          verticalLabelRotation={0}
          style={styles.chart}
        />
      ) : (
        <PieChart
          data={pieData}
          width={screenWidth - 32}
          height={250}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="12"
          style={styles.chart}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDF4', padding: 16 },
  header: { fontSize: 20, fontWeight: '700', color: '#4A2E00', marginBottom: 20 },

  box: {
    backgroundColor: '#FFEEC8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  label: { fontSize: 16, color: '#6A4A00' },
  amount: { fontSize: 22, fontWeight: 'bold', color: '#9F6508', marginTop: 6 },

  chart: { borderRadius: 16 },

  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
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

  toggleRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  toggleBtn: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD580',
    width: '45%',
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: '#FFD580' },
  toggleText: { color: '#444' },
  toggleTextActive: { fontWeight: 'bold', color: '#000' },
});
