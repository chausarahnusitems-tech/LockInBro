import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { OptionButton, PrimaryButton, SecondaryButton } from '../components/Buttons';
import { Section } from '../components/Section';
import { styles } from '../styles/styles';

export function ActiveSessionScreen({
  now,
  onBackHome,
  onEndSession,
  onEmergencyCancel,
  onRoleChange,
  onToggleTask,
  role,
  session,
}) {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

  if (!session) {
    return (
      <View style={styles.sectionStack}>
        <View style={styles.summaryPanel}>
          <Text style={styles.summaryTitle}>No active session</Text>
          <Text style={styles.cardMeta}>Accept an incoming request to start a mock session.</Text>
        </View>
        <SecondaryButton label="Back Home" onPress={onBackHome} />
      </View>
    );
  }

  const completedTasks = session.tasks.filter((task) => task.isCompleted).length;
  const progressPercent = getProgressPercent(completedTasks, session.tasks.length);
  const isLockedInUser = role === 'lockedInUser';
  const isFinished = session.tasks.length > 0 && completedTasks === session.tasks.length;
  const secondsRemaining = Math.max(0, Math.ceil((session.expiresAtMs - now) / 1000));

  return (
    <View style={styles.sectionStack}>
      <View style={styles.activeSessionPanel}>
        <Text style={styles.statusLabel}>Active session</Text>
        <Text style={styles.statusTitle}>{session.lockedInUser} is locked in</Text>
        <Text style={styles.statusCopy}>Time left: {formatTimeLeft(secondsRemaining)}</Text>
        <Text style={styles.statusCopy}>
          Progress: {completedTasks}/{session.tasks.length} tasks completed
        </Text>
        <View style={styles.progressTrackOnDark}>
          <View style={[styles.progressFillOnDark, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      <Section title="Viewing As">
        <View style={styles.optionGrid}>
          <OptionButton
            active={role === 'lockedInUser'}
            label={session.lockedInUser}
            onPress={() => onRoleChange('lockedInUser')}
          />
          <OptionButton
            active={role === 'friend'}
            label={session.accountabilityFriend}
            onPress={() => onRoleChange('friend')}
          />
        </View>
      </Section>

      <Section title={isLockedInUser ? 'Your Tasks' : 'Task Progress'}>
        {session.tasks.map((task) => (
          <Pressable
            disabled={!isLockedInUser}
            key={task.id}
            onPress={() => onToggleTask(task.id)}
            style={[styles.taskItem, task.isCompleted && styles.completedTaskItem]}
          >
            <Text style={[styles.taskText, task.isCompleted && styles.completedTaskText]}>{task.text}</Text>
            <Text style={task.isCompleted ? styles.infoPill : styles.warningPill}>
              {task.isCompleted ? 'done' : 'todo'}
            </Text>
          </Pressable>
        ))}
      </Section>

      <Section title="Apps Being Watched">
        <View style={styles.optionGrid}>
          {session.apps.map((appName) => (
            <View key={appName} style={styles.readOnlyChip}>
              <Text style={styles.readOnlyChipText}>{appName}</Text>
            </View>
          ))}
        </View>
      </Section>

      {isLockedInUser ? (
        <View style={styles.dangerPanel}>
          <Text style={styles.dangerTitle}>Emergency stop</Text>
          <Text style={styles.cardMeta}>This ends the session immediately and tells your friend it was cancelled.</Text>
          {isConfirmingCancel ? (
            <View style={styles.actionRow}>
              <SecondaryButton label="Keep Going" onPress={() => setIsConfirmingCancel(false)} />
              <PrimaryButton label="Confirm Stop" onPress={() => onEmergencyCancel(session.id)} />
            </View>
          ) : (
            <SecondaryButton label="Emergency Stop" onPress={() => setIsConfirmingCancel(true)} />
          )}
        </View>
      ) : null}

      {!isLockedInUser ? (
        <View style={styles.summaryPanel}>
          <Text style={styles.summaryTitle}>Unlock apps</Text>
          <Text style={styles.cardMeta}>
            {isFinished
              ? 'All tasks are done. You can unlock apps and end this session.'
              : 'Waiting for all tasks to be marked done before ending.'}
          </Text>
          <PrimaryButton
            disabled={!isFinished}
            label="Unlock Apps & End Session"
            onPress={() => onEndSession(session.id)}
          />
        </View>
      ) : null}

      <SecondaryButton label="Back Home" onPress={onBackHome} />
    </View>
  );
}

function getProgressPercent(completedTasks, totalTasks) {
  if (totalTasks === 0) {
    return 0;
  }

  return Math.round((completedTasks / totalTasks) * 100);
}

function formatTimeLeft(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
