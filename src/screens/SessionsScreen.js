import { Pressable, Text, View } from 'react-native';

import { Section } from '../components/Section';
import { styles } from '../styles/styles';

export function SessionsScreen({ activeSessions, appHistory, onOpenHistory, onOpenSession, userOneNotice }) {
  return (
    <View style={styles.sectionStack}>
      {userOneNotice ? (
        <View style={userOneNotice.tone === 'danger' ? styles.noticePanelDanger : styles.noticePanel}>
          <Text style={styles.noticeTitle}>{userOneNotice.title}</Text>
        </View>
      ) : null}

      <View style={styles.formIntro}>
        <Text style={styles.formTitle}>Active Lock In Sessions</Text>
        <Text style={styles.cardMeta}>Track accepted requests, task progress, and accountability updates.</Text>
      </View>

      <Section title="Active Now">
        {activeSessions.length > 0 ? (
          activeSessions.map((session) => {
            const completedTasks = session.tasks.filter((task) => task.isCompleted).length;

            return (
              <Pressable key={session.id} onPress={() => onOpenSession(session.id)} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{session.lockedInUser} is locked in</Text>
                  <Text style={styles.cardMeta}>
                    {completedTasks}/{session.tasks.length} tasks completed • {session.apps.length} apps watched
                  </Text>
                  <Text style={styles.cardMeta}>Tap to view statistics and progress.</Text>
                </View>
                <Text style={styles.infoPill}>{session.duration}</Text>
              </Pressable>
            );
          })
        ) : (
          <Text style={styles.emptyText}>No active Lock In sessions yet.</Text>
        )}
      </Section>

      <Section title="App History">
        {appHistory.map((session) => (
          <Pressable key={session.id} onPress={() => onOpenHistory(session.id)} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{session.title}</Text>
              <Text style={styles.cardMeta}>Duration: {session.duration}</Text>
              <Text style={styles.cardMeta}>Tap to view report.</Text>
            </View>
            <Text style={isStoppedResult(session.result) ? styles.dangerPill : styles.pill}>{session.result}</Text>
          </Pressable>
        ))}
      </Section>
    </View>
  );
}

function isStoppedResult(result) {
  return result === 'Declined' || result === 'Cancelled';
}
