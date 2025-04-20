import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{
        title: 'Trang chủ',
        tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
      }} />
      <Tabs.Screen name="history" options={{
        title: 'Lịch sử',
        tabBarIcon: ({ color, size }) => <Ionicons name="time" size={size} color={color} />,
      }} />
      <Tabs.Screen name="notifications" options={{
        title: 'Thông báo',
        tabBarIcon: ({ color, size }) => <Ionicons name="notifications" size={size} color={color} />,
      }} />
      <Tabs.Screen name="report" options={{
        title: 'Báo cáo',
        tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Tài khoản',
        tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
      }} />
    </Tabs>
  );
}
