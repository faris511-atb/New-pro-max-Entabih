// app/(praviate)/_layout.js
// Layout الشاشات الخاصة (تتطلب تسجيل دخول)
// في CLI: التحقق من الجلسة يتم في AppNavigator.js

import React from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function Layout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
