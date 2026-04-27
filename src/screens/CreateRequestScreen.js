import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { OptionButton, PrimaryButton, SecondaryButton } from '../components/Buttons';
import { Section } from '../components/Section';
import { distractionAppOptions, durationOptions } from '../data/mockData';
import { styles } from '../styles/styles';

export function CreateRequestScreen({ currentUser, friends, onCancel, onSendRequest }) {
  const [selectedFriendId, setSelectedFriendId] = useState(friends[0]?.id ?? '');
  const [selectedApps, setSelectedApps] = useState(['Instagram']);
  const [duration, setDuration] = useState(durationOptions[1]);
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState([]);
  const [note, setNote] = useState('');

  const selectedFriend = useMemo(
    () => friends.find((friend) => friend.id === selectedFriendId),
    [friends, selectedFriendId]
  );

  const canSend = Boolean(selectedFriend && tasks.length > 0 && selectedApps.length > 0);

  function handleAddTask() {
    const cleanTask = taskInput.trim();

    if (!cleanTask) {
      return;
    }

    setTasks((currentTasks) => [...currentTasks, { id: `task-${Date.now()}`, text: cleanTask }]);
    setTaskInput('');
  }

  function handleRemoveTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }

  function handleToggleApp(appName) {
    setSelectedApps((currentApps) => {
      if (currentApps.includes(appName)) {
        return currentApps.filter((app) => app !== appName);
      }

      return [...currentApps, appName];
    });
  }

  function handleSubmit() {
    if (!canSend) {
      return;
    }

    onSendRequest({
      id: `request-${Date.now()}`,
      direction: 'outgoing',
      from: currentUser,
      to: selectedFriend.displayName,
      friendId: selectedFriend.id,
      tasks: tasks.map((task) => task.text),
      apps: selectedApps,
      duration: duration.label,
      durationSeconds: duration.seconds,
      note: note.trim(),
      status: 'pending',
    });
  }

  return (
    <View style={styles.sectionStack}>
      <View style={styles.formIntro}>
        <Text style={styles.formTitle}>Create Lock In Request</Text>
        <Text style={styles.cardMeta}>Pick a friend, list your tasks, and choose what to avoid.</Text>
      </View>

      <Section title="Select Friend">
        <View style={styles.optionGrid}>
          {friends.map((friend) => (
            <OptionButton
              active={friend.id === selectedFriendId}
              key={friend.id}
              label={friend.displayName}
              onPress={() => setSelectedFriendId(friend.id)}
            />
          ))}
        </View>
      </Section>

      <Section title="To-Do List">
        <View style={styles.inputRow}>
          <TextInput
            onChangeText={setTaskInput}
            onSubmitEditing={handleAddTask}
            placeholder="e.g. Finish math worksheet"
            placeholderTextColor="#7b8494"
            returnKeyType="done"
            style={[styles.input, styles.inputRowField]}
            value={taskInput}
          />
          <Pressable onPress={handleAddTask} style={styles.smallButton}>
            <Text style={styles.smallButtonLabel}>Add</Text>
          </Pressable>
        </View>

        {tasks.length > 0 ? (
          <View style={styles.taskList}>
            {tasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <Text style={styles.taskText}>{task.text}</Text>
                <Pressable onPress={() => handleRemoveTask(task.id)} style={styles.removeButton}>
                  <Text style={styles.removeButtonLabel}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>Add at least one task before sending.</Text>
        )}
      </Section>

      <Section title="Distraction Apps">
        <View style={styles.optionGrid}>
          {distractionAppOptions.map((appName) => (
            <OptionButton
              active={selectedApps.includes(appName)}
              key={appName}
              label={appName}
              onPress={() => handleToggleApp(appName)}
            />
          ))}
        </View>
      </Section>

      <Section title="Max Duration">
        <View style={styles.optionGrid}>
          {durationOptions.map((option) => (
            <OptionButton
              active={option.label === duration.label}
              key={option.label}
              label={option.label}
              onPress={() => setDuration(option)}
            />
          ))}
        </View>
      </Section>

      <Section title="Optional Note">
        <TextInput
          multiline
          onChangeText={setNote}
          placeholder="Anything your friend should know?"
          placeholderTextColor="#7b8494"
          style={[styles.input, styles.textArea]}
          value={note}
        />
      </Section>

      <View style={styles.summaryPanel}>
        <Text style={styles.summaryTitle}>Preview</Text>
        <Text style={styles.cardMeta}>Friend: {selectedFriend?.displayName ?? 'None selected'}</Text>
        <Text style={styles.cardMeta}>Tasks: {tasks.length}</Text>
        <Text style={styles.cardMeta}>Apps: {selectedApps.join(', ') || 'None selected'}</Text>
        <Text style={styles.cardMeta}>Duration: {duration.label}</Text>
      </View>

      <View style={styles.actionRow}>
        <SecondaryButton label="Cancel" onPress={onCancel} />
        <PrimaryButton disabled={!canSend} label="Send Request" onPress={handleSubmit} />
      </View>
    </View>
  );
}
