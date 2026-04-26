import { Text, View } from 'react-native';

import { SecondaryButton } from '../components/Buttons';
import { Section } from '../components/Section';
import { styles } from '../styles/styles';

export function HistoryDetailScreen({ historyItem, onBack }) {
  if (!historyItem) {
    return (
      <View style={styles.sectionStack}>
        <View style={styles.summaryPanel}>
          <Text style={styles.summaryTitle}>Report not found</Text>
          <Text style={styles.cardMeta}>Return home and choose a history item again.</Text>
        </View>
        <SecondaryButton label="Back Home" onPress={onBack} />
      </View>
    );
  }

  const report = historyItem.report ?? [];

  return (
    <View style={styles.sectionStack}>
      <View style={styles.formIntro}>
        <Text style={styles.formTitle}>{historyItem.title}</Text>
        <Text style={styles.cardMeta}>
          Result: {historyItem.result} • Duration: {historyItem.duration}
        </Text>
      </View>

      <Section title="Report">
        {report.length > 0 ? (
          report.map((entry) => (
            <View key={entry.id} style={styles.reportItem}>
              <Text style={styles.reportTime}>{entry.timestamp}</Text>
              <Text style={styles.taskText}>{entry.text}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No detailed report was saved for this mock session.</Text>
        )}
      </Section>

      <SecondaryButton label="Back Home" onPress={onBack} />
    </View>
  );
}
