// app/(public)/detector.js
// شاشة الكاشف الذكي

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
  ScrollView, Alert, Animated, Dimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import ENV from '../../config';

const { width } = Dimensions.get('window');

const FraudCheckerScreen = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [classification, setClassification] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [resultAnimation] = useState(new Animated.Value(0));
  const [progressAnimation] = useState(new Animated.Value(0));
  const { user } = useAuth();

  useEffect(() => { resetState(); }, []);

  useEffect(() => {
    if (percentage !== null) {
      Animated.timing(progressAnimation, { toValue: percentage / 100, duration: 800, useNativeDriver: false }).start();
    } else {
      progressAnimation.setValue(0);
    }
  }, [percentage]);

  const resetState = () => {
    setResult(''); setAdvice(''); setClassification(null);
    setPercentage(null); setErrorMessage(null); progressAnimation.setValue(0);
  };

  const sanitizeInput = (text) => {
    const sanitized = text.replace(/[^\u0600-\u06FFa-zA-Z0-9\s.,!?،؛:\-()@$]/g, '');
    setCharacterCount(sanitized.length);
    return sanitized;
  };

  const isValidInput = (text) => {
    const trimmed = text.trim();
    if (trimmed.length < 5 || trimmed.length > 1000) return false;
    return /[a-zA-Z0-9\u0600-\u06FF]/.test(trimmed);
  };

  const checkFraud = async (text) => {
    try {
      const response = await fetch(`${ENV.FASTAPI_URL}/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const data = await response.json();
      return { classification: data.classification, percentage: data.percentage, advice: data.advice };
    } catch {
      return { classification: 'حدث خطأ في التحقق', percentage: null, advice: 'لم نتمكن من تحليل النص. يرجى المحاولة مرة أخرى لاحقًا.' };
    }
  };

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const animateResult = () => {
    resultAnimation.setValue(0);
    Animated.timing(resultAnimation, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };

  const handleCheck = async () => {
    if (!user) {
      Alert.alert('تسجيل الدخول مطلوب', 'يجب تسجيل الدخول قبل استخدام الكاشف.', [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تسجيل الدخول', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }
    const sanitizedText = sanitizeInput(inputText);
    if (!sanitizedText.trim() || !isValidInput(sanitizedText)) {
      setErrorMessage('النص المدخل غير صالح أو قصير جدًا');
      setResult(''); setClassification(null); setAdvice(''); setPercentage(null);
      shakeError(); return;
    }
    setLoading(true); setErrorMessage(null);
    try {
      const fraudResult = await checkFraud(sanitizedText);
      setClassification(fraudResult.classification);
      setPercentage(fraudResult.percentage);
      setResult(`${fraudResult.classification}${fraudResult.percentage ? ` (${fraudResult.percentage}%)` : ''}`);
      setAdvice(fraudResult.advice);
      animateResult();
    } catch {
      setErrorMessage('حدث خطأ في المعالجة. حاول مرة أخرى.');
      setResult(''); setClassification(null); setAdvice(''); setPercentage(null);
      shakeError();
    } finally {
      setLoading(false);
    }
  };

  const getStatusData = () => {
    if (percentage === null) return { color: '#CCCCCC', backgroundColor: '#F5F5F5' };
    if (percentage < 50) return { color: '#D32F2F', backgroundColor: '#FFEBEE' };
    if (percentage < 85) return { color: '#FF8C00', backgroundColor: '#FFF3E0' };
    return { color: '#2E7D32', backgroundColor: '#E8F5E9' };
  };

  const statusData = getStatusData();
  const progressWidth = progressAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, width - 80] });

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>الكاشف الذكي</Text>
        <Text style={styles.subtitle}>تحقق من النصوص المشبوهة باستخدام الذكاء الاصطناعي</Text>
        <View style={styles.card}>
          <Text style={styles.label}>أدخل النص للتحقق:</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} multiline numberOfLines={4} maxLength={1000} value={inputText} onChangeText={(text) => { setInputText(sanitizeInput(text)); if (errorMessage) setErrorMessage(null); }} placeholder="اكتب النص المشبوه هنا..." textAlign="right" textAlignVertical="top" />
            <Text style={styles.charCounter}>{characterCount}/1000</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleCheck} disabled={loading} activeOpacity={0.8}>
            {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.buttonText}>تحقق من النص</Text>}
          </TouchableOpacity>
        </View>

        {errorMessage && (
          <Animated.View style={[styles.errorBox, { transform: [{ translateX: shakeAnimation }] }]}>
            <View style={styles.errorIndicator} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </Animated.View>
        )}

        {result && (
          <Animated.View style={[styles.resultCard, { opacity: resultAnimation }]}>
            <View style={[styles.resultHeader, { backgroundColor: statusData.backgroundColor }]}>
              <View style={[styles.statusIndicator, { backgroundColor: statusData.color }]} />
              <Text style={[styles.resultHeaderText, { color: statusData.color }]}>نتيجة التحليل</Text>
            </View>
            <View style={styles.resultContent}>
              <View style={styles.resultTextContainer}>
                <Text style={styles.result}>{result}</Text>
                {percentage !== null && (
                  <View style={styles.progressBarContainer}>
                    <Animated.View style={[styles.progressBar, { width: progressWidth, backgroundColor: statusData.color }]} />
                  </View>
                )}
              </View>
              {percentage !== null && (
                <View style={[styles.percentageCircle, { borderColor: statusData.color }]}>
                  <Text style={[styles.percentageText, { color: statusData.color }]}>{percentage}%</Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {advice && (
          <Animated.View style={[styles.adviceContainer, { opacity: resultAnimation }]}>
            <Text style={styles.adviceTitle}>تحليل الذكاء الاصطناعي:</Text>
            <Text style={styles.adviceText}>{advice}</Text>
          </Animated.View>
        )}

        {result && (
          <TouchableOpacity style={styles.resetButton} onPress={() => { setInputText(''); resetState(); setCharacterCount(0); }}>
            <Text style={styles.resetButtonText}>فحص نص جديد</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContainer: { padding: 16, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', alignSelf: 'center', marginBottom: 8, color: '#003D4D', textAlign: 'center' },
  subtitle: { fontSize: 16, alignSelf: 'center', marginBottom: 24, color: '#555', textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, elevation: 3 },
  label: { fontSize: 16, marginBottom: 12, color: '#333', textAlign: 'right', fontWeight: '600' },
  inputContainer: { position: 'relative', marginBottom: 20 },
  input: { borderColor: '#E0E0E0', borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: '#F9FAFC', height: 140, writingDirection: 'rtl' },
  charCounter: { position: 'absolute', bottom: 10, left: 10, fontSize: 12, color: '#777' },
  button: { backgroundColor: '#003D4D', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', height: 54, elevation: 3 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorBox: { backgroundColor: '#FFEBEE', borderRadius: 12, padding: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  errorIndicator: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#CC0000', marginRight: 10 },
  errorText: { color: '#CC0000', fontSize: 15, flex: 1, textAlign: 'right' },
  resultCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, elevation: 3, overflow: 'hidden' },
  resultHeader: { padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  statusIndicator: { width: 14, height: 14, borderRadius: 7, marginLeft: 10 },
  resultHeaderText: { fontSize: 17, fontWeight: 'bold', marginRight: 8 },
  resultContent: { padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resultTextContainer: { flex: 1, alignItems: 'flex-end' },
  result: { fontSize: 18, color: '#333', fontWeight: 'bold', textAlign: 'right', marginBottom: 10 },
  progressBarContainer: { width: '100%', height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  progressBar: { height: 8, borderRadius: 4 },
  percentageCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 3, justifyContent: 'center', alignItems: 'center', marginLeft: 16 },
  percentageText: { fontSize: 16, fontWeight: 'bold' },
  adviceContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 3 },
  adviceTitle: { fontSize: 17, fontWeight: 'bold', color: '#003D4D', textAlign: 'right', marginBottom: 12 },
  adviceText: { fontSize: 15, color: '#333', lineHeight: 24, textAlign: 'right' },
  resetButton: { backgroundColor: '#E0E0E0', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  resetButtonText: { color: '#333', fontSize: 15, fontWeight: '600' },
});

export default FraudCheckerScreen;
