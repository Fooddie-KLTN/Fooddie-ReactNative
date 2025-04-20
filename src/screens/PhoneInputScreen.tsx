// src/screens/PhoneInputScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const PhoneInputScreen = ({ navigation } : any) => {
  const [phone, setPhone] = useState('');

  const handleNext = () => {
    // logic đơn giản: nếu số điện thoại kết thúc bằng số chẵn => có tài khoản
    const hasAccount = parseInt(phone.slice(-1)) % 2 === 0;

    if (hasAccount) {
      navigation.navigate('LoginWithPassword', { phone });
    } else {
      navigation.navigate('CreateAccount', { phone });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập số điện thoại</Text>
      <TextInput
        placeholder="Ví dụ: 0901234567"
        style={styles.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        maxLength={10}
      />
      <TouchableOpacity style={styles.button} onPress={handleNext} disabled={phone.length < 9}>
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PhoneInputScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E1', // pastel nhẹ nhàng
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: '#444',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#FF914D',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
