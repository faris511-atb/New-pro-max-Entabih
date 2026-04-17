// app/(praviate)/add_report.js
// شاشة إضافة بلاغ - بدون expo-font

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Alert,
  SafeAreaView, ScrollView, ActivityIndicator, Platform, StatusBar, KeyboardAvoidingView,
} from 'react-native';
import ENV from '../../config';

const MAIN_TYPES = { TEXT: 'رسالة نصية', PHONE: 'رقم هاتف' };
const TEXT_SUBTYPES = { EMAIL: 'بريد إلكتروني', SCAMMER: 'تواصل اجتماعي' };

export default function ReportScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [mainType, setMainType] = useState('');
  const [subType, setSubType] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [scammerText, setScammerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('user_id');
      if (!token || !userId) {
        Alert.alert('تنبيه', 'يجب تسجيل الدخول أولاً.');
        navigation.replace('Login');
      }
    };
    checkLogin();
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!title || title.trim().length < 12) errors.title = 'يرجى إدخال عنوان مناسب';
    if (!mainType) errors.mainType = 'يرجى اختيار نوع الإدخال';
    if (!description || description.trim().length < 30) errors.description = 'يرجى إدخال وصف مفصل';
    if (mainType === MAIN_TYPES.PHONE) {
      if (!phoneNumber) errors.phoneNumber = 'يرجى إدخال رقم الهاتف';
      else if (phoneNumber.length > 15) errors.phoneNumber = 'يجب ألا يتجاوز رقم الهاتف 15 رقماً';
    }
    if (mainType === MAIN_TYPES.TEXT) {
      if (!subType) { errors.subType = 'يرجى اختيار نوع الرسالة'; }
      else if (subType === TEXT_SUBTYPES.EMAIL) {
        if (!email) errors.email = 'يرجى إدخال البريد الإلكتروني';
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'يرجى إدخال بريد إلكتروني صحيح';
      } else if (subType === TEXT_SUBTYPES.SCAMMER) {
        if (!scammerText || scammerText.length < 15) errors.scammerText = 'يرجى إدخال محتوى الرسالة الاحتيالية';
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [title, mainType, subType, description, phoneNumber, email, scammerText]);

  const resetForm = useCallback(() => {
    setTitle(''); setMainType(''); setSubType(''); setDescription('');
    setPhoneNumber(''); setEmail(''); setScammerText(''); setValidationErrors({});
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const userIdString = await AsyncStorage.getItem('user_id');
      const user_id = userIdString ? parseInt(userIdString) : null;
      if (!user_id) { Alert.alert('خطأ', 'تعذر تحديد المستخدم.'); setIsSubmitting(false); return; }

      const aiRes = await fetch(`${ENV.FASTAPI_URL}/moderate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, description,
          phone_number: mainType === MAIN_TYPES.PHONE ? phoneNumber : '',
          email: mainType === MAIN_TYPES.TEXT && subType === TEXT_SUBTYPES.EMAIL ? email : '',
        }),
      });
      const aiData = await aiRes.json();
      if (aiData.classification !== 'جيد') {
        Alert.alert('بلاغ غير مقبول', 'تم رفض البلاغ لأنه غير جاد أو غير موثوق.', [{ text: 'موافق' }]);
        setIsSubmitting(false); return;
      }

      const payload = {
        title, description,
        phone_number: mainType === MAIN_TYPES.PHONE ? phoneNumber : null,
        email: mainType === MAIN_TYPES.TEXT && subType === TEXT_SUBTYPES.EMAIL ? email : null,
        scammer_text: mainType === MAIN_TYPES.TEXT && subType === TEXT_SUBTYPES.SCAMMER ? scammerText : null,
        reported_at: new Date().toISOString(),
        user_id,
      };

      const response = await fetch(`${ENV.FASTAPI_URL}/send-report`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (response.ok) {
        Alert.alert('تم الإرسال', 'تم إرسال البلاغ بنجاح!', [{ text: 'موافق', onPress: resetForm }]);
      } else {
        Alert.alert('خطأ', 'فشل إرسال البلاغ. حاول مرة أخرى.');
      }
    } catch { Alert.alert('خطأ', 'حدث خطأ أثناء إرسال البلاغ.'); }
    finally { setIsSubmitting(false); }
  }, [validateForm, title, mainType, subType, description, phoneNumber, email, scammerText]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#003D4D" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>أبلغ عن حالة</Text>
        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.navigate('ReportsScreen')}>
          <Text style={styles.exitText}>‹ خروج</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.form}>
            <Text style={styles.label}>عنوان البلاغ</Text>
            {validationErrors.title && <Text style={styles.errorText}>{validationErrors.title}</Text>}
            <TextInput style={styles.input} placeholder="مثال: رسالة احتيال وظيفية أو بنكية" value={title} onChangeText={setTitle} textAlign="right" placeholderTextColor="#999" />

            <Text style={styles.label}>نوع البلاغ</Text>
            {validationErrors.mainType && <Text style={styles.errorText}>{validationErrors.mainType}</Text>}
            <View style={styles.caseTypeContainer}>
              {Object.values(MAIN_TYPES).map((type) => (
                <TouchableOpacity key={type} style={[styles.caseTypeButton, mainType === type && styles.selectedCaseType]} onPress={() => { setMainType(type); setSubType(''); setEmail(''); setScammerText(''); }}>
                  <Text style={[styles.caseTypeText, mainType === type && styles.selectedCaseTypeText]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {mainType === MAIN_TYPES.PHONE && (
              <>
                <Text style={styles.label}>رقم الهاتف</Text>
                {validationErrors.phoneNumber && <Text style={styles.errorText}>{validationErrors.phoneNumber}</Text>}
                <TextInput style={styles.input} placeholder="0501234567" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} textAlign="right" placeholderTextColor="#999" />
              </>
            )}

            <Text style={styles.label}>وصف الحالة</Text>
            {validationErrors.description && <Text style={styles.errorText}>{validationErrors.description}</Text>}
            <TextInput style={styles.textArea} multiline placeholder="اكتب وصفًا مفصلًا..." value={description} onChangeText={setDescription} textAlign="right" textAlignVertical="top" placeholderTextColor="#999" />

            {mainType === MAIN_TYPES.TEXT && (
              <>
                <Text style={styles.label}>اختر النوع الفرعي</Text>
                {validationErrors.subType && <Text style={styles.errorText}>{validationErrors.subType}</Text>}
                <View style={styles.caseTypeContainer}>
                  {Object.values(TEXT_SUBTYPES).map((type) => (
                    <TouchableOpacity key={type} style={[styles.caseTypeButton, subType === type && styles.selectedCaseType]} onPress={() => { setSubType(type); setEmail(''); setScammerText(''); }}>
                      <Text style={[styles.caseTypeText, subType === type && styles.selectedCaseTypeText]}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {mainType === MAIN_TYPES.TEXT && subType === TEXT_SUBTYPES.EMAIL && (
              <>
                <Text style={styles.label}>البريد الإلكتروني</Text>
                {validationErrors.email && <Text style={styles.errorText}>{validationErrors.email}</Text>}
                <TextInput style={styles.input} placeholder="example@email.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} textAlign="right" placeholderTextColor="#999" />
              </>
            )}

            {mainType === MAIN_TYPES.TEXT && subType === TEXT_SUBTYPES.SCAMMER && (
              <>
                <Text style={styles.label}>نص الرسالة</Text>
                {validationErrors.scammerText && <Text style={styles.errorText}>{validationErrors.scammerText}</Text>}
                <TextInput style={styles.input} placeholder="مثال: اسم الحساب المحتال ومنصته" value={scammerText} onChangeText={setScammerText} textAlign="right" placeholderTextColor="#999" />
              </>
            )}

            <TouchableOpacity style={[styles.submitButton, isSubmitting && styles.disabledButton]} onPress={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>إرسال البلاغ</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
              <Text style={styles.resetButtonText}>إعادة تعيين النموذج</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#003D4D', marginBottom: 10 },
  header: { backgroundColor: '#003D4D', height: 60, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginTop: 17, fontFamily: 'Changa-SemiBold' },
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingBottom: 20, marginBottom: -30 },
  scrollContent: { padding: 16 },
  form: { backgroundColor: '#fff', borderRadius: 12, marginTop: 30, padding: 16, elevation: 3 },
  label: { fontSize: 16, fontWeight: '500', color: '#003D4D', marginVertical: 8, textAlign: 'right' },
  errorText: { color: '#D32F2F', fontSize: 12, marginBottom: 4, textAlign: 'right' },
  input: { borderColor: '#003D4D', borderWidth: 1, borderRadius: 8, padding: 12, backgroundColor: '#FFF', color: '#333', marginBottom: 10, textAlign: 'right' },
  textArea: { borderColor: '#003D4D', borderWidth: 1, borderRadius: 8, padding: 12, minHeight: 100, textAlignVertical: 'top', color: '#333', backgroundColor: '#FFF', marginBottom: 10, textAlign: 'right' },
  caseTypeContainer: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 16 },
  caseTypeButton: { flex: 1, borderWidth: 1, borderColor: '#003D4D', padding: 10, borderRadius: 8, marginHorizontal: 4, backgroundColor: '#FFF', alignItems: 'center' },
  selectedCaseType: { backgroundColor: '#003D4D' },
  caseTypeText: { color: '#003D4D', fontWeight: '500' },
  selectedCaseTypeText: { color: '#FFF' },
  submitButton: { backgroundColor: '#003D4D', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  disabledButton: { backgroundColor: '#78909C' },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  resetButton: { borderColor: '#888', borderWidth: 1, borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 12 },
  resetButtonText: { color: '#333', fontSize: 14 },
  exitButton: { position: 'absolute', right: 16, top: 16 },
  exitText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 0 },
});