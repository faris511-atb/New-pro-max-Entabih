// app/_layout.js
// الـ Layout الجذري - يُغلف التطبيق بـ AuthProvider
// استُبدل expo-router Slot بـ React Navigation في AppNavigator

import React from 'react';
import { AuthProvider } from './context/AuthContext';

// هذا الملف يُستخدم كمرجع للهيكل الأصلي.
// نقطة الدخول الفعلية في CLI هي App.js في جذر المشروع.

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
