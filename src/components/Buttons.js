import { Pressable, Text } from 'react-native';

import { styles } from '../styles/styles';

export function PrimaryButton({ disabled = false, label, onPress }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressedButton,
      ]}
    >
      <Text style={styles.primaryButtonLabel}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.secondaryButton}>
      <Text style={styles.secondaryButtonLabel}>{label}</Text>
    </Pressable>
  );
}

export function SmallButton({ label, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.smallButton}>
      <Text style={styles.smallButtonLabel}>{label}</Text>
    </Pressable>
  );
}

export function TabButton({ active, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.tabButton, active && styles.activeTabButton]}>
      <Text style={[styles.tabButtonLabel, active && styles.activeTabButtonLabel]}>{label}</Text>
    </Pressable>
  );
}

export function OptionButton({ active, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.optionButton, active && styles.activeOptionButton]}>
      <Text style={[styles.optionButtonLabel, active && styles.activeOptionButtonLabel]}>{label}</Text>
    </Pressable>
  );
}
