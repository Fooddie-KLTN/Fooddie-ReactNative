import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFF3B4',
          borderTopWidth: 0.5,
          borderTopColor: '#ccc',
          height: 60,
          paddingBottom: 4,
        },
        tabBarActiveTintColor: '#9F6508',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          switch (route.name) {
            case 'index':
              iconName = 'home';
              break;
            case 'history':
              iconName = 'time';
              break;
            case 'notifications':
              iconName = 'notifications';
              break;
            case 'report':
              iconName = 'stats-chart';
              break;
            case 'profile':
              iconName = 'person';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Trang chủ' }} />
      <Tabs.Screen name="history" options={{ title: 'Lịch sử' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Thông báo' }} />
      <Tabs.Screen name="report" options={{ title: 'Báo cáo' }} />
      <Tabs.Screen name="profile" options={{ title: 'Tài khoản' }} />
    </Tabs>
  );
}
