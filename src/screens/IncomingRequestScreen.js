import { Text, View } from 'react-native';

import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { Section } from '../components/Section';
import { styles } from '../styles/styles';

export function IncomingRequestScreen({ onAccept, onBack, onDecline, request }) {
  if (!request) {
    return (
      <View style={styles.sectionStack}>
        <View style={styles.summaryPanel}>
          <Text style={styles.summaryTitle}>Request not found</Text>
          <Text style={styles.cardMeta}>Return home and choose an incoming request again. [to be deleted]</Text>
        </View>
        <SecondaryButton label="Back Home" onPress={onBack} />
      </View>
    );
  }

  const isPending = request.status === 'pending';

  return (
    <View style={styles.sectionStack}>
      <View style={styles.formIntro}>
        <Text style={styles.formTitle}>Incoming Lock In Request</Text>
        <Text style={styles.cardMeta}>You are viewing this as the accountability friend.</Text>
      </View>

      <View style={styles.summaryPanel}>
        <Text style={styles.summaryTitle}>From {request.from}</Text>
        <Text style={styles.cardMeta}>Duration: {request.duration}</Text>
        <Text style={styles.cardMeta}>Status: {request.status}</Text>
        {request.note ? <Text style={styles.cardMeta}>Note: {request.note}</Text> : null}
      </View>

      <Section title="Tasks To Watch">
        {request.tasks.map((task) => (
          <View key={task} style={styles.taskItem}>
            <Text style={styles.taskText}>{task}</Text>
          </View>
        ))}
      </Section>

      <Section title="Distraction Apps">
        <View style={styles.optionGrid}>
          {request.apps.map((appName) => (
            <View key={appName} style={styles.readOnlyChip}>
              <Text style={styles.readOnlyChipText}>{appName}</Text>
            </View>
          ))}
        </View>
      </Section>

      {isPending ? (
        <View style={styles.actionRow}>
          <SecondaryButton label="Decline" onPress={() => onDecline(request.id)} />
          <PrimaryButton label="Accept" onPress={() => onAccept(request)} />
        </View>
      ) : (
        <SecondaryButton label="Back Home" onPress={onBack} />
      )}
    </View>
  );
}
