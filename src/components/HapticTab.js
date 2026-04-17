// components/HapticTab.js
// يُضيف اهتزازاً خفيفاً عند الضغط على تبويبات شريط التنقل
import { TouchableOpacity, Platform } from 'react-native';

export function HapticTab({ onPress, onPressIn, children, style, ...rest }) {
  const handlePressIn = (ev) => {
    if (Platform.OS === 'ios') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (_) {
        // expo-haptics غير متاح في CLI - تجاهل الخطأ
      }
    }
    onPressIn?.(ev);
  };

  return (
    <TouchableOpacity
      style={style}
      onPress={onPress}
      onPressIn={handlePressIn}
      activeOpacity={0.8}
      {...rest}>
      {children}
    </TouchableOpacity>
  );
}
