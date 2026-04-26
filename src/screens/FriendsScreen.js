import { Text, View } from 'react-native';

import { SmallButton } from '../components/Buttons';
import { Section } from '../components/Section';
import { styles } from '../styles/styles';

export function FriendsScreen({ friends }) {
  return (
    <View style={styles.sectionStack}>
      <View style={styles.inlinePanel}>
        <View style={styles.inlineText}>
          <Text style={styles.sectionTitle}>Add Friend</Text>
          <Text style={styles.cardMeta}>Username search will become interactive in a later phase.</Text>
        </View>
        <SmallButton label="Add" onPress={() => {}} />
      </View>

      <Section title="Current Friends">
        {friends.map((friend) => (
          <View key={friend.id} style={styles.card}>
            <View style={styles.friendAvatar}>
              <Text style={styles.friendAvatarText}>{friend.displayName.charAt(0)}</Text>
            </View>
            <View style={styles.friendDetails}>
              <Text style={styles.cardTitle}>{friend.displayName}</Text>
              <Text style={styles.cardMeta}>@{friend.username}</Text>
            </View>
            <Text style={styles.pill}>Friend</Text>
          </View>
        ))}
      </Section>
    </View>
  );
}
