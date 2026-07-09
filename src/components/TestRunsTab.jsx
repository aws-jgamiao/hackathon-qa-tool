import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import ActionMenu from './ActionMenu';

export default function TestRunsTab({
  ticket,
  testRuns,
  onSelectTestRun,
  onShowToast,
  setCurrentView
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

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
      case 'Execute / Manage Test Run':
        onSelectTestRun(testRun);
        setCurrentView('execute-test-run');
        break;
      case 'Mark as QA Failed':
        onShowToast('Test run marked as QA Failed', 'success');
        break;
      case 'Mark as Approved / Passed':
        onShowToast('Test run marked as approved', 'success');
        break;
      case 'Export to PDF':
        onShowToast('Exporting to PDF...', 'success');
        break;
      case 'Export to Excel':
        onShowToast('Exporting to Excel...', 'success');
        break;
    }
    setOpenMenuId(null);
  };

  const actions = [
    { label: 'View Test Run', icon: '👁️' },
    { label: 'Edit Test Run', icon: '✏️' },
    { label: 'Execute / Manage Test Run', icon: '▶️' },
    { label: 'Mark as QA Failed', icon: '❌' },
    { label: 'Mark as Approved / Passed', icon: '✅' },
    { label: 'Export to PDF', icon: '📄' },
    { label: 'Export to Excel', icon: '📊' }
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
            <th>Test Case</th>
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
              <td>{testRun.testCaseTitle}</td>
              <td>{testRun.platform}</td>
              <td>{testRun.version}</td>
              <td>
                <span className={`badge ${getStatusBadgeClass(testRun.status)}`}>
                  {testRun.status}
                </span>
              </td>
              <td>
                {testRun.qaFailedCount > 0 ? (
                  <span className="badge badge-error">{testRun.qaFailedCount}</span>
                ) : (
                  <span>0</span>
                )}
              </td>
              <td>{formatDate(testRun.executedAt)}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <div className="relative">
                  <button
                    className="btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === testRun.id ? null : testRun.id);
                    }}
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openMenuId === testRun.id && (
                    <ActionMenu
                      actions={actions}
                      onAction={(action) => handleAction(action, testRun)}
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
