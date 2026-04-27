export const mockFriends = [
  { id: 'f1', username: 'joel', displayName: 'Joel Tan', status: 'accepted' },
  { id: 'f2', username: 'maya', displayName: 'Maya Lee', status: 'accepted' },
];

export const mockPendingRequests = [
  {
    id: 'r1',
    direction: 'incoming',
    from: 'Nadia',
    tasks: ['Review lecture notes', 'Finish practice questions'],
    apps: ['Instagram', 'YouTube'],
    duration: '10 sec demo',
    durationSeconds: 10,
    note: 'Big exam energy.',
    status: 'pending',
  },
  {
    id: 'r2',
    direction: 'outgoing',
    from: 'You',
    to: 'Joel Tan',
    friendId: 'f1',
    tasks: ['Draft project outline', 'Clean up notes'],
    apps: ['TikTok', 'Discord'],
    duration: '25 min',
    durationSeconds: 25 * 60,
    note: 'Need a quick sprint.',
    status: 'pending',
  },
];

export const mockSessions = [
  { id: 's1', title: 'Study sprint', result: 'Completed', duration: '35 min' },
  { id: 's2', title: 'Coding focus', result: 'Expired', duration: '60 min' },
];

export const distractionAppOptions = ['Instagram', 'TikTok', 'YouTube', 'Discord'];

export const durationOptions = [
  { label: '10 sec demo', seconds: 10 },
  { label: '25 min', seconds: 25 * 60 },
  { label: '45 min', seconds: 45 * 60 },
  { label: '60 min', seconds: 60 * 60 },
  { label: '90 min', seconds: 90 * 60 },
];
