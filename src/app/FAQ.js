// app/FAQ.js
// شاشة الأسئلة الشائعة

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';

const faqs = [
  {
    question: 'ما هو الغرض من هذا التطبيق؟',
    answer: 'التطبيق يهدف إلى المساعدة في كشف محاولات الاحتيال من خلال تحليل النصوص.',
  },
  {
    question: 'كيف يعمل نظام كشف الاحتيال؟',
    answer: 'يعتمد على تقنيات الذكاء الاصطناعي لتحليل النصوص وتحديد الأنماط المشبوهة.',
  },
  {
    question: 'هل البيانات التي أُدخلها آمنة؟',
    answer: 'نعم، نحن نحرص على حماية خصوصيتك، ولا نقوم بمشاركة البيانات مع أي جهة خارجية.',
  },
  {
    question: 'هل يدعم التطبيق اللغة العربية؟',
    answer: 'نعم، التطبيق يدعم اللغة العربية بشكل كامل.',
  },
  {
    question: 'هل يمكن استخدام التطبيق بدون إنترنت؟',
    answer: 'بعض الميزات تحتاج اتصال بالإنترنت لتحليل النصوص بشكل دقيق.',
  },
];

export default function FAQScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#003c3c" barStyle="light-content" />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('MenuScreen')}>
          <Text style={styles.backText}>{'< القائمة'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>الأسئلة الشائعة</Text>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqBox}>
            <Text style={styles.question}>{faq.question}</Text>
            <Text style={styles.answer}>{faq.answer}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    backgroundColor: '#0C343C',
    paddingTop: StatusBar.currentHeight || 25,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  content: { padding: 20 },
  title: {
    color: '#D6A21E',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  faqBox: {
    borderWidth: 1,
    borderColor: '#003c3c',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  question: { color: '#003c3c', fontSize: 16, fontWeight: '600', marginBottom: 8 },
  answer: { color: '#333', fontSize: 14, lineHeight: 22 },
});
