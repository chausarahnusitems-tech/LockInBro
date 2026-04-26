import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../components/Buttons';
import { styles } from '../styles/styles';

export function LoginScreen({ canContinue, onLogin, setUsername, username }) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.loginShell}>
        <View style={styles.brandBlock}>
          <Text style={styles.appName}>LockInBro</Text>
          <Text style={styles.tagline}>
            Send a focus request to someone you trust, then stay accountable.
          </Text>
        </View>

        <View style={styles.loginPanel}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setUsername}
            onSubmitEditing={onLogin}
            placeholder="e.g. sarah"
            placeholderTextColor="#7b8494"
            returnKeyType="done"
            style={styles.input}
            value={username}
          />
          <PrimaryButton disabled={!canContinue} label="Continue" onPress={onLogin} />
        </View>
      </View>
    </SafeAreaView>
  );
}
