// src/screens/IntroScreen.tsx
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { Image } from 'react-native';

const IntroScreen = ({ navigation }: any) => {
  return (
    <Onboarding
      onSkip={() => navigation.replace('Login')}
      onDone={() => navigation.replace('Login')}
      pages={[
        {
          backgroundColor: '#fff',
          image: <Image source={require('../assets/intro1.png')} />,
          title: 'Chào mừng đến với Foodie',
          subtitle: 'Ứng dụng giao đồ ăn tiện lợi cho tài xế.',
        },
        {
          backgroundColor: '#fdeb93',
          image: <Image source={require('../assets/intro2.png')} />,
          title: 'Giao hàng nhanh chóng',
          subtitle: 'Nhận đơn - Giao hàng - Kiếm tiền mỗi ngày!',
        },
        {
          backgroundColor: '#e9bcbe',
          image: <Image source={require('../assets/intro3.png')} />,
          title: 'Quản lý đơn dễ dàng',
          subtitle: 'Xem lịch sử giao hàng, thông tin khách hàng, v.v.',
        },
      ]}
    />
  );
};

export default IntroScreen;
