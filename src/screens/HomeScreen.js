import { Pressable, Text, View } from 'react-native';

import { Section } from '../components/Section';
import { styles } from '../styles/styles';

export function HomeScreen({
  activeSessions,
  appHistory,
  flashMessage,
  onOpenHistory,
  onOpenRequest,
  onOpenSession,
  pendingRequests,
  userOneNotice,
}) {
  const incomingRequests = pendingRequests.filter((request) => request.direction === 'incoming');
  const outgoingRequests = pendingRequests.filter((request) => request.direction === 'outgoing');

  return (
    <View style={styles.sectionStack}>
      {flashMessage ? (
        <View style={styles.flashPanel}>
          <Text style={styles.flashText}>{flashMessage}</Text>
        </View>
      ) : null}

      {userOneNotice ? (
        <View style={userOneNotice.tone === 'danger' ? styles.noticePanelDanger : styles.noticePanel}>
          <Text style={styles.noticeTitle}>{userOneNotice.title}</Text>
        </View>
      ) : null}

      <Section title="Requests For You To Review">
        {incomingRequests.length > 0 ? (
          incomingRequests.map((request) => (
            <Pressable
              key={request.id}
              onPress={() => onOpenRequest(request.id)}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{getRequestTitle(request)}</Text>
                <Text style={styles.cardMeta}>
                  {request.tasks.length} tasks • {request.apps.length} apps selected
                </Text>
                <Text style={styles.cardMeta}>{getRequestHint(request)}</Text>
                {request.note ? <Text style={styles.cardMeta}>Note: {request.note}</Text> : null}
              </View>
              <View style={styles.pillStack}>
                <Text style={styles.pill}>pending</Text>
                <Text style={styles.pill}>{request.duration}</Text>
              </View>
            </Pressable>
          ))
        ) : (
          <Text style={styles.emptyText}>No incoming requests need your action.</Text>
        )}
      </Section>

      <Section title="Requests Waiting For Friends">
        {outgoingRequests.length > 0 ? (
          outgoingRequests.map((request) => (
            <View key={request.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{getRequestTitle(request)}</Text>
                <Text style={styles.cardMeta}>
                  {request.tasks.length} tasks • {request.apps.length} apps selected
                </Text>
                <Text style={styles.cardMeta}>{getRequestHint(request)}</Text>
                {request.note ? <Text style={styles.cardMeta}>Note: {request.note}</Text> : null}
              </View>
              <View style={styles.pillStack}>
                <Text style={styles.infoPill}>waiting</Text>
                <Text style={styles.pill}>{request.duration}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No outgoing requests waiting for a friend.</Text>
        )}
      </Section>

      <Section title="Active Lock In Sessions">
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
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${getProgressPercent(completedTasks, session.tasks.length)}%` },
                      ]}
                    />
                  </View>
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

function getProgressPercent(completedTasks, totalTasks) {
  if (totalTasks === 0) {
    return 0;
  }

  return Math.round((completedTasks / totalTasks) * 100);
}

function getRequestTitle(request) {
  if (request.direction === 'outgoing') {
    return `To ${request.to}`;
  }

  return `From ${request.from}`;
}

function getRequestHint(request) {
  if (request.direction === 'incoming' && request.status === 'pending') {
    return 'Tap to review as accountability friend.';
  }

  if (request.status === 'declined') {
    return 'Declined requests stay visible for now.';
  }

  if (request.status === 'accepted') {
    return 'Accepted request has started a mock session.';
  }

  return 'Waiting for friend response.';
}
