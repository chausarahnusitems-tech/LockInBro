import { Text, View } from 'react-native';

import { styles } from '../styles/styles';

export function Section({ children, title }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.list}>{children}</View>
    </View>
  );
}
