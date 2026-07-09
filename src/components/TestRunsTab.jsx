import { useState, useRef } from 'react';
import { formatDate } from '../utils/dateUtils';
import ActionMenu from './ActionMenu';

export default function TestRunsTab({
  ticket,
  testRuns,
  onSelectTestRun,
  onShowToast,
  setCurrentView,
  onDelete
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Passed':
        return 'badge-success';
      case 'Failed':
      case 'QA Failed':
        return 'badge-error';
      case 'In Progress':
        return 'badge-info';
      case 'Blocked':
        return 'badge-warning';
      case 'Retest':
        return 'badge-warning';
      case 'Approved':
        return 'badge-success';
      default:
        return 'badge-gray';
    }
  };

  const handleAction = (action, testRun) => {
    switch (action.label) {
      case 'View Test Run':
        onSelectTestRun(testRun);
        setCurrentView('view-test-run');
        break;
      case 'Edit Test Run':
        onSelectTestRun(testRun);
        setCurrentView('execute-test-run');
        break;
      case 'Delete Test Run':
        if (confirm('Are you sure you want to delete this test run?')) {
          onDelete(testRun.id);
        }
        break;
    }
    setOpenMenuId(null);
  };

  const actions = [
    { label: 'View Test Run', icon: '👁️' },
    { label: 'Edit Test Run', icon: '✏️' },
    { label: 'Delete Test Run', icon: '🗑️', danger: true }
  ];

  if (!testRuns || testRuns.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3 className="empty-state-title">No test runs yet</h3>
          <p className="empty-state-text">
            Test runs are created automatically when test cases are approved
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Run ID</th>
            <th>Test Case ID</th>
            <th>Platform</th>
            <th>Version / Cycle</th>
            <th>Status</th>
            <th>QA Failed Count</th>
            <th>Executed At</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {testRuns.map((testRun) => (
            <tr
              key={testRun.id}
              onClick={() => {
                onSelectTestRun(testRun);
                setCurrentView('view-test-run');
              }}
              style={{ cursor: 'pointer' }}
            >
              <td style={{ fontWeight: '500', color: '#0066cc' }}>
                {testRun.id}
              </td>
              <td>{testRun.test_case_id}</td>
              <td>{testRun.platform}</td>
              <td>{testRun.version}</td>
              <td>
                <span className={`badge ${getStatusBadgeClass(testRun.status)}`}>
                  {testRun.status}
                </span>
              </td>
              <td>
                {testRun.qa_failed_count > 0 ? (
                  <span className="badge badge-error">{testRun.qa_failed_count}</span>
                ) : (
                  <span>0</span>
                )}
              </td>
              <td>{formatDate(testRun.executed_at)}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <button
                    ref={(el) => { menuRefs.current[testRun.id] = el; }}
                    className="btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === testRun.id ? null : testRun.id);
                    }}
                  >
                    ⋯
                  </button>
                  {openMenuId === testRun.id && (
                    <ActionMenu
                      actions={actions}
                      onAction={(action) => handleAction(action, testRun)}
                      triggerRef={menuRefs.current[testRun.id]}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
