import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const screenWidth = Dimensions.get('window').width;
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

export default function ReportScreen() {
  const [filter, setFilter] = useState<'today' | 'week' | 'month'>('week');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [total, setTotal] = useState<number>(0);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [year, setYear] = useState(now.getFullYear());

  const fetchData = async () => {
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
      const json = await res.json();
      setLabels(json.labels || []);
      setData(json.data || []);
      setTotal(json.total || 0);
    } catch (err) {
      console.error('⚠️ Failed to fetch income report:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, month, year]);

  const pieData = data.length > 0
  ? data.map((value, index) => ({
      name: labels[index],
      population: value,
      color: ['#F47C48', '#FDCB6E', '#FF9F43', '#FF6D3F', '#FF8A65', '#FFA726', '#FF7043'][index % 7],
      legendFontColor: '#333',
      legendFontSize: 12,
    }))
  : [];

  const chartConfig = {
    backgroundGradientFrom: '#FFFDF4',
    backgroundGradientTo: '#FFFDF4',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 111, 0, ${opacity})`,
    labelColor: () => '#4A2E00',
    barPercentage: 0.6,
    style: { borderRadius: 12 },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📊 Báo cáo thu nhập</Text>

      {/* Bộ lọc thời gian */}
      <View style={styles.filterRow}>
        {['today', 'week', 'month'].map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => setFilter(key as any)}
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

      {/* Chuyển loại biểu đồ */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() => setChartType('bar')}
          style={[styles.toggleBtn, chartType === 'bar' && styles.toggleBtnActive]}
        >
          <Text style={chartType === 'bar' ? styles.toggleTextActive : styles.toggleText}>Biểu đồ cột</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setChartType('pie')}
          style={[styles.toggleBtn, chartType === 'pie' && styles.toggleBtnActive]}
        >
          <Text style={chartType === 'pie' ? styles.toggleTextActive : styles.toggleText}>Biểu đồ tròn</Text>
        </TouchableOpacity>
      </View>

      {/* Tổng thu nhập */}
      <View style={styles.box}>
        <Text style={styles.label}>Tổng {filter === 'today' ? 'hôm nay' : filter === 'week' ? 'tuần này' : `tháng ${month}/${year}`}:</Text>
        <Text style={styles.amount}>{total.toLocaleString()}đ</Text>
      </View>

      {/* Biểu đồ */}
      {chartType === 'bar' && data.length > 0 ? (
        <BarChart
          data={{
            labels: labels,
            datasets: [{ data }],
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
        ) : chartType === 'pie' && data.length > 0 ? (
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
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
          Không có dữ liệu để hiển thị
        </Text>
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
