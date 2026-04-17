// app/login.js
// شاشة تسجيل الدخول

import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  I18nManager,
} from 'react-native';
import { useAuth } from './context/AuthContext';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      Alert.alert('تم تسجيل الدخول', 'أهلاً فيك!');
      navigation.replace('MainTabs');
    } else {
      Alert.alert('فشل تسجيل الدخول', 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
  };

  return (
    <View style={styles.container}>
      {/* زر الرجوع */}
      <TouchableOpacity
        onPress={() => navigation.navigate('MainTabs')}
        style={styles.backButton}>
        <Text style={styles.backButtonText}>{'>'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>تسجيل الدخول</Text>

      <Text style={styles.label}>البريد الإلكتروني:</Text>
      <TextInput
        placeholder="أدخل بريدك الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, { textAlign: 'right', writingDirection: 'rtl' }]}
      />

      <Text style={styles.label}>كلمة المرور:</Text>
      <TextInput
        placeholder="أدخل كلمة المرور"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { textAlign: 'right', writingDirection: 'rtl' }]}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0B4C5F" style={{ marginTop: 10 }} />
      ) : (
        <TouchableOpacity style={styles.signupButton} onPress={handleLogin}>
          <Text style={styles.signupButtonText}>تسجيل الدخول</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('Signup')}
        style={styles.loginLink}>
        <Text style={styles.loginText}>ليس لديك حساب؟ سجل الآن</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  backButton: { position: 'absolute', top: 40, right: 10, padding: 10 },
  backButtonText: { fontSize: 40, color: '#0B4C5F' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#0B4C5F',
    writingDirection: 'rtl',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  signupButton: {
    backgroundColor: '#0B4C5F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loginLink: { marginTop: 25, alignItems: 'center' },
  loginText: {
    color: '#0B4C5F',
    fontSize: 14,
    textDecorationLine: 'underline',
    writingDirection: 'rtl',
  },
});

export default LoginScreen;
