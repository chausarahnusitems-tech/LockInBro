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
    duration: '45 min',
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
    note: 'Need a quick sprint.',
    status: 'pending',
  },
];

export const mockSessions = [
  { id: 's1', title: 'Study sprint', result: 'Completed', duration: '35 min' },
  { id: 's2', title: 'Coding focus', result: 'Expired', duration: '60 min' },
];

export const distractionAppOptions = ['Instagram', 'TikTok', 'YouTube', 'Discord'];

export const durationOptions = ['25 min', '45 min', '60 min', '90 min'];
