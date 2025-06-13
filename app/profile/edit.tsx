import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Picker } from '@react-native-picker/picker';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

export default function EditProfile() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cccd, setCccd] = useState('');
  const [driverLicense, setDriverLicense] = useState('');

  const now = new Date();
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(now.getFullYear() - 20);

  useEffect(() => {
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
          setCccd(data.cccd || '');
          setDriverLicense(data.driverLicense || '');

          const [y, m, d] = (data.birthday || '').split('-').map(Number);
          if (y && m && d) {
            setYear(y);
            setMonth(m);
            setDay(d);
          }
        } else {
          Alert.alert('❌ Lỗi', data.message || 'Không thể tải hồ sơ');
        }
      } catch (err) {
        console.error('Fetch profile error:', err);
        Alert.alert('❌ Lỗi', 'Lỗi kết nối máy chủ');
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token');
    const birthday = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    try {
      const res = await fetch(`${apiUrl}/shippers/update-profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone, birthday, cccd, driverLicense }),
      });

      const json = await res.json();
      if (res.ok) {
        Alert.alert('✅ Thành công', 'Hồ sơ đã được cập nhật');
      } else {
        Alert.alert('❌ Lỗi', json.message || 'Không thể cập nhật hồ sơ');
      }
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert('❌ Lỗi', 'Lỗi kết nối máy chủ');
    }
  };

  return (
    <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>

        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Họ tên" />
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Số điện thoại" keyboardType="phone-pad" />
        <TextInput style={styles.input} value={cccd} onChangeText={setCccd} placeholder="Số CCCD" keyboardType="numeric" />
        <TextInput style={styles.input} value={driverLicense} onChangeText={setDriverLicense} placeholder="Số GPLX" />

        <Text style={styles.label}>Ngày sinh</Text>
        <View style={styles.pickerRow}>
          <Picker style={styles.picker} selectedValue={day} onValueChange={setDay}>
            {Array.from({ length: 31 }, (_, i) => (
              <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
            ))}
          </Picker>
          <Picker style={styles.picker} selectedValue={month} onValueChange={setMonth}>
            {Array.from({ length: 12 }, (_, i) => (
              <Picker.Item key={i + 1} label={`Tháng ${i + 1}`} value={i + 1} />
            ))}
          </Picker>
          <Picker style={styles.picker} selectedValue={year} onValueChange={setYear}>
            {Array.from({ length: 60 }, (_, i) => {
              const y = now.getFullYear() - i;
              return <Picker.Item key={y} label={`${y}`} value={y} />;
            })}
          </Picker>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#fff' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  label: { color: '#fff', fontSize: 16, marginBottom: 8 },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
  },
  picker: { flex: 1 },
  saveBtn: {
    backgroundColor: '#ffffffcc',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: { fontWeight: '600', color: '#9F6508' },
});
