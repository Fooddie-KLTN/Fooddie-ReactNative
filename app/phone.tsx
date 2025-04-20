import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function PhoneInputScreen() {
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleNext = () => {
    const hasAccount = parseInt(phone.slice(-1)) % 2 === 0;
    if (hasAccount) {
      router.push({ pathname: '/login', params: { phone } });
    } else {
      router.push({ pathname: '/register', params: { phone } });
    }
  };

  return (
    <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Nhập số điện thoại</Text>

      <TextInput
        placeholder="Ví dụ: 0901234567"
        style={styles.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        maxLength={10}
      />

      <TouchableOpacity
        style={[styles.button, phone.length < 9 && { opacity: 0.5 }]}
        onPress={handleNext}
        disabled={phone.length < 9}
      >
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#4A2E00',
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
    backgroundColor: '#8D5100',
    paddingVertical: 14,
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
