// components/ExternalLink.js
// expo-router Link مُستبدل بـ TouchableOpacity + Linking
import { TouchableOpacity, Linking } from 'react-native';

export function ExternalLink({ href, children, style, ...rest }) {
  return (
    <TouchableOpacity
      style={style}
      onPress={() => Linking.openURL(href)}
      {...rest}>
      {children}
    </TouchableOpacity>
  );
}
