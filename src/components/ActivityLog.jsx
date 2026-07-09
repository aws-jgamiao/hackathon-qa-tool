import { formatDate } from '../utils/dateUtils';

export default function ActivityLog({ activityLogs = [] }) {
  // Transform activity logs to display format
  const activities = activityLogs.map((log) => {
    const actionType = log.action_type;
    let action = 'Updated';
    let type = 'Activity';

    if (actionType === 'test_case_created') {
      action = 'Created';
      type = 'Test Case';
    } else if (actionType === 'test_case_deleted') {
      action = 'Deleted';
      type = 'Test Case';
    } else if (actionType === 'test_case_approved') {
      action = 'Approved';
      type = 'Test Case';
    } else if (actionType === 'test_run_created') {
      action = 'Created';
      type = 'Test Run';
    } else if (actionType === 'test_run_deleted') {
      action = 'Deleted';
      type = 'Test Run';
    }

    return {
      type,
      action,
      title: log.description,
      date: log.created_at,
      status: action
    };
  });

  const getActivityColor = (type, status) => {
    if (type === 'Test Case') {
      return status === 'Approved' ? '#2e7d32' : '#f57c00';
    }
    if (status === 'Passed' || status === 'Approved') return '#2e7d32';
    if (status === 'QA Failed' || status === 'Failed') return '#c62828';
    if (status === 'Not Run') return '#666';
    return '#0066cc';
  };

  if (activities.length === 0) {
    return (
      <div className="card">
        <h3>Activity Log</h3>
        <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
          No activities yet
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Activity Log</h3>
      <div style={{ marginTop: '16px' }}>
        {activities.map((activity, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              gap: '16px',
              paddingBottom: '16px',
              borderBottom: index < activities.length - 1 ? '1px solid #e5e5e5' : 'none',
              marginBottom: index < activities.length - 1 ? '16px' : 0
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: getActivityColor(activity.type, activity.status),
                marginTop: '4px',
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>
                    {activity.type} {activity.action}
                  </div>
                  <div style={{ color: '#666', fontSize: '13px', marginTop: '2px' }}>
                    {activity.title}
                  </div>
                </div>
                <div
                  style={{
                    color: '#999',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    marginLeft: '12px'
                  }}
                >
                  {formatDate(activity.date)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
