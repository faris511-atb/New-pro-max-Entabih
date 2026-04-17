// components/ui/IconSymbol.js
// fallback لـ Android والـ web - يستخدم MaterialIcons
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';

// تعيين أسماء SF Symbols إلى MaterialIcons
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
};

export function IconSymbol({ name, size = 24, color, style }) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
