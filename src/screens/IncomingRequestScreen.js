import { Text, View } from 'react-native';

import { OptionButton, PrimaryButton, SecondaryButton } from '../components/Buttons';
import { Section } from '../components/Section';
import { styles } from '../styles/styles';

export function IncomingRequestScreen({
  currentUser,
  onAccept,
  onBack,
  onDecline,
  onViewRoleChange,
  request,
  viewRole,
}) {
  if (!request) {
    return (
      <View style={styles.sectionStack}>
        <View style={styles.summaryPanel}>
          <Text style={styles.summaryTitle}>Request not found</Text>
          <Text style={styles.cardMeta}>Return home and choose an incoming request again.</Text>
        </View>
        <SecondaryButton label="Back Home" onPress={onBack} />
      </View>
    );
  }

  const isPending = request.status === 'pending';
  const userSend = request.from;
  const userDeal = request.direction === 'outgoing' ? request.to : currentUser;
  const userSendViewRole = request.direction === 'outgoing' ? 'currentUser' : 'friend';
  const userDealViewRole = request.direction === 'outgoing' ? 'friend' : 'currentUser';
  const isViewingAsUserDeal = viewRole === userDealViewRole;
  const viewerName = viewRole === userSendViewRole ? userSend : userDeal;

  return (
    <View style={styles.sectionStack}>
      <View style={styles.formIntro}>
        <Text style={styles.formTitle}>
          {request.direction === 'outgoing' ? 'Outgoing Lock In Request' : 'Incoming Lock In Request'}
        </Text>
        <Text style={styles.cardMeta}>Viewing as {viewerName}</Text>
      </View>

      <Section title="Simulation View">
        <View style={styles.optionGrid}>
          <OptionButton
            active={viewRole === userSendViewRole}
            label={`userSend: ${userSend}`}
            onPress={() => onViewRoleChange(userSendViewRole)}
          />
          <OptionButton
            active={viewRole === userDealViewRole}
            label={`userDeal: ${userDeal}`}
            onPress={() => onViewRoleChange(userDealViewRole)}
          />
        </View>
      </Section>

      <View style={styles.summaryPanel}>
        <Text style={styles.summaryTitle}>From {userSend}</Text>
        <Text style={styles.cardMeta}>userSend: {userSend}</Text>
        <Text style={styles.cardMeta}>userDeal: {userDeal}</Text>
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

      {isPending && isViewingAsUserDeal ? (
        <View style={styles.actionRow}>
          <SecondaryButton label="Decline" onPress={() => onDecline(request.id)} />
          <PrimaryButton label="Accept" onPress={() => onAccept(request)} />
        </View>
      ) : isPending ? (
        <View style={styles.summaryPanel}>
          <Text style={styles.summaryTitle}>Waiting for userDeal</Text>
          <Text style={styles.cardMeta}>Switch to userDeal to simulate accepting or declining.</Text>
        </View>
      ) : (
        <SecondaryButton label="Back Home" onPress={onBack} />
      )}
    </View>
  );
}
