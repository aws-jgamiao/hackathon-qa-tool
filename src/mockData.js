export const mockTickets = [
  {
    id: 'FLOWDEL-2686',
    name: 'Fix selected shift scrolling after reopening app',
    type: 'Bug',
    platform: 'iOS',
    status: 'In Progress',
    testCaseCount: 3,
    testRunCount: 2,
    qaFailedCount: 1,
    updatedAt: '2024-01-18T10:30:00Z',
    jiraLink: 'https://jira.company.com/browse/FLOWDEL-2686'
  },
  {
    id: 'FLOWDEL-2929',
    name: 'Data persistence issue on offline mode',
    type: 'Bug',
    platform: 'Android',
    status: 'In Review',
    testCaseCount: 4,
    testRunCount: 3,
    qaFailedCount: 2,
    updatedAt: '2024-01-17T14:15:00Z',
    jiraLink: 'https://jira.company.com/browse/FLOWDEL-2929'
  },
  {
    id: 'FLOWDEL-3010',
    name: 'Push notification improvements',
    type: 'Feature',
    platform: 'iOS, Android',
    status: 'Testing',
    testCaseCount: 5,
    testRunCount: 1,
    qaFailedCount: 0,
    updatedAt: '2024-01-19T09:45:00Z',
    jiraLink: 'https://jira.company.com/browse/FLOWDEL-3010'
  }
];

export const mockTestCases = {
  'FLOWDEL-2686': [
    {
      id: 'TC-001',
      title: 'Verify shift list scrolls correctly',
      component: 'Shift View',
      platform: 'iOS',
      status: 'Approved',
      createdBy: 'John Doe',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-16T14:30:00Z',
      approvedBy: 'Jane Smith',
      approvedAt: '2024-01-17T09:00:00Z',
      description: 'User should be able to scroll through the shift list smoothly without the view jumping',
      preConditions: 'App is open, Shift screen is visible',
      testSteps: [
        'Open the Shift View',
        'Scroll down through the shift list',
        'Note the current scroll position',
        'Close and reopen the app',
        'Verify scroll position is maintained'
      ],
      expectedResult: 'Scroll position is preserved after reopening the app',
      customTables: []
    },
    {
      id: 'TC-002',
      title: 'Test scrolling with multiple shifts',
      component: 'Shift View',
      platform: 'iOS',
      status: 'Approved',
      createdBy: 'John Doe',
      createdAt: '2024-01-15T11:00:00Z',
      updatedAt: '2024-01-16T15:00:00Z',
      approvedBy: 'Jane Smith',
      approvedAt: '2024-01-17T10:00:00Z',
      description: 'Verify scrolling works with large number of shifts',
      preConditions: 'App has multiple shifts loaded',
      testSteps: [
        'Open app with 50+ shifts',
        'Scroll to middle of list',
        'Close and reopen app',
        'Check if scroll position is preserved'
      ],
      expectedResult: 'Scroll position is maintained even with many shifts',
      customTables: []
    },
    {
      id: 'TC-003',
      title: 'Verify shift selection after reopening',
      component: 'Shift View',
      platform: 'iOS',
      status: 'Draft',
      createdBy: 'John Doe',
      createdAt: '2024-01-18T09:00:00Z',
      updatedAt: '2024-01-18T09:00:00Z',
      approvedBy: null,
      approvedAt: null,
      description: 'Test that selected shift remains selected after app restart',
      preConditions: 'A shift is selected in the list',
      testSteps: [
        'Select a shift from the list',
        'Close the app',
        'Reopen the app',
        'Verify selected shift is still highlighted'
      ],
      expectedResult: 'Selected shift remains highlighted',
      customTables: []
    }
  ],
  'FLOWDEL-2929': [
    {
      id: 'TC-004',
      title: 'Verify data saves in offline mode',
      component: 'Data Persistence',
      platform: 'Android',
      status: 'Approved',
      createdBy: 'Jane Smith',
      createdAt: '2024-01-14T10:00:00Z',
      updatedAt: '2024-01-16T11:00:00Z',
      approvedBy: 'Mike Johnson',
      approvedAt: '2024-01-17T08:00:00Z',
      description: 'User input should be saved locally when device is offline',
      preConditions: 'Device is in airplane mode, app is installed',
      testSteps: [
        'Enable airplane mode',
        'Open the app',
        'Enter some data',
        'Close the app',
        'Reopen the app',
        'Verify data is still present'
      ],
      expectedResult: 'Data is persisted offline',
      customTables: []
    },
    {
      id: 'TC-005',
      title: 'Sync data when coming back online',
      component: 'Data Persistence',
      platform: 'Android',
      status: 'Approved',
      createdBy: 'Jane Smith',
      createdAt: '2024-01-14T11:00:00Z',
      updatedAt: '2024-01-16T12:00:00Z',
      approvedBy: 'Mike Johnson',
      approvedAt: '2024-01-17T09:00:00Z',
      description: 'Offline data should sync to server when connection is restored',
      preConditions: 'Data was saved offline, device now has internet',
      testSteps: [
        'Open app after being offline',
        'Verify sync status indicator',
        'Check data on server matches local data'
      ],
      expectedResult: 'Data is synced successfully to server',
      customTables: []
    },
    {
      id: 'TC-006',
      title: 'Handle conflict resolution',
      component: 'Data Persistence',
      platform: 'Android',
      status: 'Pending Approval',
      createdBy: 'Jane Smith',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-18T10:00:00Z',
      approvedBy: null,
      approvedAt: null,
      description: 'App should handle data conflicts during sync',
      preConditions: 'Data was modified both offline and on server',
      testSteps: [
        'Create conflicting data changes',
        'Sync the app',
        'Verify conflict resolution'
      ],
      expectedResult: 'Conflict is resolved with clear user feedback',
      customTables: []
    },
    {
      id: 'TC-007',
      title: 'Test offline mode with network switch',
      component: 'Data Persistence',
      platform: 'Android',
      status: 'Draft',
      createdBy: 'Jane Smith',
      createdAt: '2024-01-16T10:00:00Z',
      updatedAt: '2024-01-16T10:00:00Z',
      approvedBy: null,
      approvedAt: null,
      description: 'Test data persistence when switching between networks',
      preConditions: 'Device can switch between WiFi and cellular',
      testSteps: [
        'Start on WiFi',
        'Switch to cellular',
        'Make changes',
        'Switch back to WiFi',
        'Verify sync'
      ],
      expectedResult: 'Data is correctly synced across network changes',
      customTables: []
    }
  ],
  'FLOWDEL-3010': [
    {
      id: 'TC-008',
      title: 'Receive push notification',
      component: 'Push Notifications',
      platform: 'iOS',
      status: 'Approved',
      createdBy: 'Mike Johnson',
      createdAt: '2024-01-16T10:00:00Z',
      updatedAt: '2024-01-17T11:00:00Z',
      approvedBy: 'Jane Smith',
      approvedAt: '2024-01-18T08:00:00Z',
      description: 'User should receive push notification when event occurs',
      preConditions: 'Push notifications are enabled, device is online',
      testSteps: [
        'Enable push notifications',
        'Trigger an event that sends notification',
        'Verify notification appears on device'
      ],
      expectedResult: 'Notification is displayed on lock screen and notification center',
      customTables: []
    },
    {
      id: 'TC-009',
      title: 'Tap notification to open app',
      component: 'Push Notifications',
      platform: 'iOS',
      status: 'Approved',
      createdBy: 'Mike Johnson',
      createdAt: '2024-01-16T11:00:00Z',
      updatedAt: '2024-01-17T12:00:00Z',
      approvedBy: 'Jane Smith',
      approvedAt: '2024-01-18T09:00:00Z',
      description: 'Tapping notification should open app to relevant section',
      preConditions: 'Push notification is on device',
      testSteps: [
        'Receive push notification',
        'Tap the notification',
        'Verify app opens to correct section'
      ],
      expectedResult: 'App opens and navigates to the relevant content',
      customTables: []
    },
    {
      id: 'TC-010',
      title: 'Disable push notifications',
      component: 'Push Notifications',
      platform: 'iOS',
      status: 'Approved',
      createdBy: 'Mike Johnson',
      createdAt: '2024-01-16T12:00:00Z',
      updatedAt: '2024-01-17T13:00:00Z',
      approvedBy: 'Jane Smith',
      approvedAt: '2024-01-18T10:00:00Z',
      description: 'User should be able to disable push notifications',
      preConditions: 'Push notifications are currently enabled',
      testSteps: [
        'Open settings',
        'Toggle off push notifications',
        'Trigger an event',
        'Verify no notification is received'
      ],
      expectedResult: 'Notifications are not received',
      customTables: []
    },
    {
      id: 'TC-011',
      title: 'Handle notification with app in foreground',
      component: 'Push Notifications',
      platform: 'iOS',
      status: 'Approved',
      createdBy: 'Mike Johnson',
      createdAt: '2024-01-17T10:00:00Z',
      updatedAt: '2024-01-18T11:00:00Z',
      approvedBy: 'Jane Smith',
      approvedAt: '2024-01-19T08:00:00Z',
      description: 'App should handle notification when already in foreground',
      preConditions: 'App is open and in foreground',
      testSteps: [
        'Keep app in foreground',
        'Trigger event that sends notification',
        'Verify in-app notification is shown'
      ],
      expectedResult: 'In-app banner or alert is displayed',
      customTables: []
    },
    {
      id: 'TC-012',
      title: 'Test notification batching',
      component: 'Push Notifications',
      platform: 'iOS',
      status: 'Draft',
      createdBy: 'Mike Johnson',
      createdAt: '2024-01-17T11:00:00Z',
      updatedAt: '2024-01-17T11:00:00Z',
      approvedBy: null,
      approvedAt: null,
      description: 'Multiple notifications should be properly batched',
      preConditions: 'App can receive multiple notifications',
      testSteps: [
        'Trigger multiple events quickly',
        'Check how notifications are displayed',
        'Verify they are grouped appropriately'
      ],
      expectedResult: 'Notifications are batched and displayed clearly',
      customTables: []
    }
  ]
};

export const mockTestRuns = {
  'FLOWDEL-2686': [
    {
      id: 'RUN-001',
      testCaseId: 'TC-001',
      testCaseTitle: 'Verify shift list scrolls correctly',
      platform: 'iOS',
      version: 'V1',
      status: 'Passed',
      qaFailedCount: 0,
      executedBy: 'John Doe',
      executedAt: '2024-01-18T09:00:00Z',
      actualResults: [
        'Scroll position was preserved after app restart',
        'No jumping or glitching observed',
        'Performance was smooth'
      ],
      steps: []
    },
    {
      id: 'RUN-002',
      testCaseId: 'TC-001',
      testCaseTitle: 'Verify shift list scrolls correctly',
      platform: 'iOS',
      version: 'V2',
      status: 'QA Failed',
      qaFailedCount: 1,
      executedBy: 'John Doe',
      executedAt: '2024-01-18T14:00:00Z',
      actualResults: [
        'Scroll position not maintained',
        'App reset to top of list after restart'
      ],
      steps: []
    }
  ],
  'FLOWDEL-2929': [
    {
      id: 'RUN-003',
      testCaseId: 'TC-004',
      testCaseTitle: 'Verify data saves in offline mode',
      platform: 'Android',
      version: 'V1',
      status: 'Passed',
      qaFailedCount: 0,
      executedBy: 'Jane Smith',
      executedAt: '2024-01-17T10:00:00Z',
      actualResults: [
        'Data saved locally when offline',
        'Retrieved successfully after app restart'
      ],
      steps: []
    },
    {
      id: 'RUN-004',
      testCaseId: 'TC-005',
      testCaseTitle: 'Sync data when coming back online',
      platform: 'Android',
      version: 'V1',
      status: 'Passed',
      qaFailedCount: 0,
      executedBy: 'Jane Smith',
      executedAt: '2024-01-17T11:00:00Z',
      actualResults: [
        'Sync initiated when connection restored',
        'Data synced successfully to server'
      ],
      steps: []
    },
    {
      id: 'RUN-005',
      testCaseId: 'TC-004',
      testCaseTitle: 'Verify data saves in offline mode',
      platform: 'Android',
      version: 'V2',
      status: 'QA Failed',
      qaFailedCount: 2,
      executedBy: 'Jane Smith',
      executedAt: '2024-01-18T10:00:00Z',
      actualResults: [
        'Data not persisting in some cases',
        'Intermittent sync failures'
      ],
      steps: []
    }
  ],
  'FLOWDEL-3010': [
    {
      id: 'RUN-006',
      testCaseId: 'TC-008',
      testCaseTitle: 'Receive push notification',
      platform: 'iOS',
      version: 'V1',
      status: 'In Progress',
      qaFailedCount: 0,
      executedBy: 'Mike Johnson',
      executedAt: '2024-01-19T10:00:00Z',
      actualResults: [],
      steps: []
    }
  ]
};

export const getTicketById = (id) => mockTickets.find(t => t.id === id);
export const getTestCasesByTicketId = (ticketId) => mockTestCases[ticketId] || [];
export const getTestRunsByTicketId = (ticketId) => mockTestRuns[ticketId] || [];
export const getTestCaseById = (ticketId, id) => {
  const cases = mockTestCases[ticketId] || [];
  return cases.find(tc => tc.id === id);
};
export const getTestRunById = (ticketId, id) => {
  const runs = mockTestRuns[ticketId] || [];
  return runs.find(tr => tr.id === id);
};
