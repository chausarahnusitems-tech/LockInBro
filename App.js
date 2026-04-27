import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { TabButton } from './src/components/Buttons';
import { mockFriends, mockPendingRequests, mockSessions } from './src/data/mockData';
import { CreateRequestScreen } from './src/screens/CreateRequestScreen';
import { FriendsScreen } from './src/screens/FriendsScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { IncomingRequestScreen } from './src/screens/IncomingRequestScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { ActiveSessionScreen } from './src/screens/ActiveSessionScreen';
import { HistoryDetailScreen } from './src/screens/HistoryDetailScreen';
import { SessionsScreen } from './src/screens/SessionsScreen';
import { styles } from './src/styles/styles';

export default function App() {
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [pendingRequests, setPendingRequests] = useState(mockPendingRequests);
  const [appHistory, setAppHistory] = useState(mockSessions);
  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [selectedHistoryId, setSelectedHistoryId] = useState('');
  const [requestViewRole, setRequestViewRole] = useState('currentUser');
  const [sessionViewRole, setSessionViewRole] = useState('friend');
  const [flashMessage, setFlashMessage] = useState('');
  const [userOneNotice, setUserOneNotice] = useState(null);
  const [centerPopup, setCenterPopup] = useState(null);
  const [now, setNow] = useState(Date.now());

  const cleanUsername = username.trim();
  const canContinue = cleanUsername.length >= 2;

  const greeting = useMemo(() => {
    if (!currentUser) {
      return 'Ready when you are.';
    }

    return `Locked in as ${currentUser}`;
  }, [currentUser]);

  useEffect(() => {
    if (!userOneNotice) {
      return undefined;
    }

    const timerId = setTimeout(() => {
      setUserOneNotice(null);
    }, 10000);

    return () => clearTimeout(timerId);
  }, [userOneNotice]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const expiredSession = activeSessions.find(
      (session) => session.expiresAtMs && session.expiresAtMs <= now
    );

    if (!expiredSession) {
      return;
    }

    handleExpireSession(expiredSession);
  }, [activeSessions, now]);

  function handleLogin() {
    if (!canContinue) {
      return;
    }

    setCurrentUser(cleanUsername);
  }

  function handleLogout() {
    setCurrentUser('');
    setUsername('');
    setActiveTab('home');
    setFlashMessage('');
    setSelectedRequestId('');
    setSelectedSessionId('');
    setSelectedHistoryId('');
    setRequestViewRole('currentUser');
    setSessionViewRole('friend');
    setUserOneNotice(null);
    setCenterPopup(null);
  }

  function handleStartRequest() {
    setFlashMessage('');
    setActiveTab('create');
  }

  function handleSendRequest(request) {
    setPendingRequests((currentRequests) => [request, ...currentRequests]);
    setFlashMessage('Request sent!');
    setUserOneNotice(null);
    setActiveTab('home');
  }

  function handleOpenRequest(requestId) {
    const request = pendingRequests.find((currentRequest) => currentRequest.id === requestId);

    setSelectedRequestId(requestId);
    setRequestViewRole(request?.direction === 'incoming' ? 'currentUser' : 'currentUser');
    setFlashMessage('');
    setActiveTab('incoming');
  }

  function handleOpenSession(sessionId) {
    setSelectedSessionId(sessionId);
    setSessionViewRole('friend');
    setFlashMessage('');
    setActiveTab('session');
  }

  function handleAcceptRequest(request) {
    const lockedInUser = request.direction === 'outgoing' ? request.from : request.from;
    const accountabilityFriend = request.direction === 'outgoing' ? request.to : currentUser;
    const session = {
      id: `session-${Date.now()}`,
      requestId: request.id,
      lockedInUser,
      accountabilityFriend,
      tasks: request.tasks.map((task, index) => ({
        id: `${request.id}-task-${index}`,
        text: task,
        isCompleted: false,
      })),
      apps: request.apps,
      duration: request.duration,
      durationSeconds: request.durationSeconds ?? getDurationSeconds(request.duration),
      note: request.note,
      startedAt: 'Just now',
      startedAtMs: Date.now(),
      expiresAtMs: Date.now() + (request.durationSeconds ?? getDurationSeconds(request.duration)) * 1000,
      report: [
        {
          id: `${request.id}-report-started`,
          timestamp: 'Just now',
          text: `${lockedInUser} started the session.`,
        },
      ],
    };

    setPendingRequests((currentRequests) =>
      currentRequests.filter((currentRequest) => currentRequest.id !== request.id)
    );
    setActiveSessions((currentSessions) => [session, ...currentSessions]);
    setSelectedSessionId(session.id);
    setSessionViewRole(request.direction === 'outgoing' ? 'lockedInUser' : 'friend');
    setUserOneNotice(null);
    setCenterPopup({ title: 'accepted' });
    setFlashMessage('');
    setActiveTab('session');
  }

  function handleToggleSessionTask(taskId) {
    setActiveSessions((currentSessions) =>
      currentSessions.map((session) => {
        if (session.id !== selectedSessionId) {
          return session;
        }

        const targetTask = session.tasks.find((task) => task.id === taskId);
        const willCompleteTask = targetTask && !targetTask.isCompleted;

        return {
          ...session,
          tasks: session.tasks.map((task) =>
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
          ),
          report: willCompleteTask
            ? [
                ...(session.report ?? []),
                {
                  id: `report-${Date.now()}`,
                  timestamp: getCurrentTimeLabel(),
                  text: `${targetTask.text} completed.`,
                },
              ]
            : session.report,
        };
      })
    );
  }

  function handleEmergencyCancel(sessionId) {
    const cancelledSession = activeSessions.find((session) => session.id === sessionId);

    if (!cancelledSession) {
      return;
    }

    setActiveSessions((currentSessions) => currentSessions.filter((session) => session.id !== sessionId));
    setAppHistory((currentHistory) => [
      {
        id: `history-${Date.now()}`,
        title: `Cancelled session with ${cancelledSession.accountabilityFriend}`,
        result: 'Cancelled',
        duration: cancelledSession.duration,
        report: [
          ...(cancelledSession.report ?? []),
          {
            id: `report-${Date.now()}`,
            timestamp: getCurrentTimeLabel(),
            text: 'Session cancelled with emergency stop.',
          },
        ],
      },
      ...currentHistory,
    ]);
    setSelectedSessionId('');
    setCenterPopup({ title: 'cancelled session' });
    setActiveTab('home');
  }

  function handleExpireSession(expiredSession) {
    setActiveSessions((currentSessions) =>
      currentSessions.filter((session) => session.id !== expiredSession.id)
    );
    setAppHistory((currentHistory) => [
      {
        id: `history-${Date.now()}`,
        title: `Expired session with ${expiredSession.lockedInUser}`,
        result: 'Expired',
        duration: expiredSession.duration,
        report: [
          ...(expiredSession.report ?? []),
          {
            id: `report-${Date.now()}`,
            timestamp: getCurrentTimeLabel(),
            text: 'Session expired automatically.',
          },
        ],
      },
      ...currentHistory,
    ]);
    setSelectedSessionId('');
    setCenterPopup({ title: 'session expired' });
    setActiveTab('home');
  }

  function handleEndSession(sessionId) {
    const completedSession = activeSessions.find((session) => session.id === sessionId);

    if (!completedSession) {
      return;
    }

    setActiveSessions((currentSessions) => currentSessions.filter((session) => session.id !== sessionId));
    setAppHistory((currentHistory) => [
      {
        id: `history-${Date.now()}`,
        title: `Completed session with ${completedSession.lockedInUser}`,
        result: 'Completed',
        duration: completedSession.duration,
        report: [
          ...(completedSession.report ?? []),
          {
            id: `report-${Date.now()}`,
            timestamp: getCurrentTimeLabel(),
            text: 'Apps unlocked and session ended by accountability friend.',
          },
        ],
      },
      ...currentHistory,
    ]);
    setSelectedSessionId('');
    setCenterPopup({ title: 'session completed' });
    setActiveTab('home');
  }

  function handleDeclineRequest(requestId) {
    const declinedRequest = pendingRequests.find((request) => request.id === requestId);

    setPendingRequests((currentRequests) => currentRequests.filter((request) => request.id !== requestId));
    if (declinedRequest) {
      setAppHistory((currentHistory) => [
        {
          id: `history-${Date.now()}`,
          title:
            declinedRequest.direction === 'outgoing'
              ? `Declined request to ${declinedRequest.to}`
              : `Declined request from ${declinedRequest.from}`,
          result: 'Declined',
          duration: declinedRequest.duration,
          report: [
            {
              id: `report-${Date.now()}`,
              timestamp: getCurrentTimeLabel(),
              text: 'Lock In Request declined.',
            },
          ],
        },
        ...currentHistory,
      ]);
      setUserOneNotice({
        title: 'declined',
        message: 'declined',
        tone: 'danger',
      });
    }
    setFlashMessage('');
    setActiveTab('home');
  }

  const selectedRequest = pendingRequests.find((request) => request.id === selectedRequestId);
  const selectedSession = activeSessions.find((session) => session.id === selectedSessionId);
  const selectedHistory = appHistory.find((historyItem) => historyItem.id === selectedHistoryId);

  function handleOpenHistory(historyId) {
    setSelectedHistoryId(historyId);
    setActiveTab('historyDetail');
  }

  if (!currentUser) {
    return (
      <LoginScreen
        canContinue={canContinue}
        onLogin={handleLogin}
        setUsername={setUsername}
        username={username}
      />
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.appShell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>{greeting}</Text>
            <Text style={styles.headerTitle}>LockInBro</Text>
          </View>
          <Pressable onPress={handleLogout} style={styles.textButton}>
            <Text style={styles.textButtonLabel}>Logout</Text>
          </Pressable>
        </View>

        <View style={styles.tabs}>
          <TabButton active={activeTab === 'home'} label="Home" onPress={() => setActiveTab('home')} />
          <TabButton
            active={activeTab === 'create'}
            label="Create"
            onPress={() => {
              setFlashMessage('');
              setActiveTab('create');
            }}
          />
          <TabButton
            active={activeTab === 'sessions'}
            label="Sessions"
            onPress={() => setActiveTab('sessions')}
          />
          <TabButton
            active={activeTab === 'friends'}
            label="Friends"
            onPress={() => setActiveTab('friends')}
          />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'home' && (
            <HomeScreen
              flashMessage={flashMessage}
              activeSessions={activeSessions}
              appHistory={appHistory}
              onOpenHistory={handleOpenHistory}
              onOpenSession={handleOpenSession}
              onStartRequest={handleStartRequest}
              onOpenRequest={handleOpenRequest}
              pendingRequests={pendingRequests}
              userOneNotice={userOneNotice}
            />
          )}

          {activeTab === 'create' && (
            <CreateRequestScreen
              currentUser={currentUser}
              friends={mockFriends}
              onCancel={() => setActiveTab('home')}
              onSendRequest={handleSendRequest}
            />
          )}

          {activeTab === 'incoming' && (
            <IncomingRequestScreen
              currentUser={currentUser}
              onAccept={handleAcceptRequest}
              onBack={() => setActiveTab('home')}
              onDecline={handleDeclineRequest}
              onViewRoleChange={setRequestViewRole}
              request={selectedRequest}
              viewRole={requestViewRole}
            />
          )}

          {activeTab === 'session' && (
            <ActiveSessionScreen
              onBackHome={() => setActiveTab('home')}
              onEndSession={handleEndSession}
              onEmergencyCancel={handleEmergencyCancel}
              onRoleChange={setSessionViewRole}
              onToggleTask={handleToggleSessionTask}
              now={now}
              role={sessionViewRole}
              session={selectedSession}
            />
          )}

          {activeTab === 'sessions' && (
            <SessionsScreen
              activeSessions={activeSessions}
              appHistory={appHistory}
              onOpenHistory={handleOpenHistory}
              onOpenSession={handleOpenSession}
              userOneNotice={userOneNotice}
            />
          )}

          {activeTab === 'historyDetail' && (
            <HistoryDetailScreen historyItem={selectedHistory} onBack={() => setActiveTab('home')} />
          )}

          {activeTab === 'friends' && <FriendsScreen friends={mockFriends} />}
        </ScrollView>

        {activeTab === 'home' ? (
          <Pressable onPress={handleStartRequest} style={styles.floatingActionButton}>
            <Text style={styles.floatingActionButtonText}>lockin now!</Text>
          </Pressable>
        ) : null}

        {centerPopup ? (
          <View style={styles.centerOverlay}>
            <View style={styles.centerPopup}>
              <Text style={styles.centerPopupTitle}>{centerPopup.title}</Text>
              <Pressable onPress={() => setCenterPopup(null)} style={styles.centerPopupButton}>
                <Text style={styles.centerPopupButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function getCurrentTimeLabel() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getDurationSeconds(durationLabel) {
  const minutes = Number.parseInt(durationLabel, 10);

  if (Number.isNaN(minutes)) {
    return 25 * 60;
  }

  return minutes * 60;
}
