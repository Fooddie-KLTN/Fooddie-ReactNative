import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function IntroScreen() {
  const router = useRouter();
  
  const handleDone = async () => {
    await AsyncStorage.setItem('seen_intro', 'true');
    router.replace('/phone');
  };

  return (
    <Onboarding
      onSkip={handleDone}
      onDone={handleDone}
      pages={[
        {
          backgroundColor: '#fff',
          image: <Image source={require('../assets/images/intro1.png')} style={{ width: 250, height: 250 }} />,
          title: 'Chào mừng đến với Foodie',
          subtitle: 'Ứng dụng giao đồ ăn tiện lợi cho tài xế.',
        },
        {
          backgroundColor: '#fdeb93',
          image: <Image source={require('../assets/images/intro1.png')} style={{ width: 250, height: 250 }} />,
          title: 'Giao hàng nhanh chóng',
          subtitle: 'Nhận đơn - Giao hàng - Kiếm tiền mỗi ngày!',
        },
        {
          backgroundColor: '#e9bcbe',
          image: <Image source={require('../assets/images/intro1.png')} style={{ width: 250, height: 250 }} />,
          title: 'Quản lý đơn dễ dàng',
          subtitle: 'Xem lịch sử giao hàng, thông tin khách hàng, v.v.',
        },
      ]}
    />
  );
}
