import { useState, useRef } from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import ActionMenu from './ActionMenu';

export default function TestCasesTab({
  ticket,
  testCases,
  setTestCases,
  onSelectTestCase,
  onShowToast,
  setCurrentView
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const hasTestCases = testCases && testCases.length > 0;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'badge-success';
      case 'Pending Approval':
        return 'badge-warning';
      case 'Draft':
        return 'badge-gray';
      default:
        return 'badge-gray';
    }
  };

  const handleAction = (action, testCase) => {
    switch (action.label) {
      case 'View Test Case':
        onSelectTestCase(testCase);
        setCurrentView('view-test-case');
        break;
      case 'Edit Test Case':
        onSelectTestCase(testCase);
        setCurrentView('edit-test-case');
        break;
      case 'Duplicate Test Case':
        const duplicated = {
          ...testCase,
          id: `TC-${Math.floor(Math.random() * 10000)}`,
          status: 'Draft',
          approvedBy: null,
          approvedAt: null
        };
        setTestCases([...testCases, duplicated]);
        onShowToast('Test case duplicated', 'success');
        break;
      case 'Approve Test Case':
        // This is handled in the detail view, so just notify
        onShowToast('Please use the detail view to approve test cases', 'info');
        break;
      case 'Export to PDF':
        onShowToast('Exporting to PDF...', 'success');
        break;
      case 'Export to Excel':
        onShowToast('Exporting to Excel...', 'success');
        break;
      case 'Delete Test Case':
        if (confirm('Are you sure you want to delete this test case?')) {
          const newCases = testCases.filter(tc => tc.id !== testCase.id);
          setTestCases(newCases);
          onShowToast('Test case deleted', 'success');
        }
        break;
    }
    setOpenMenuId(null);
  };

  const actions = [
    { label: 'View Test Case', icon: '👁️' },
    { label: 'Edit Test Case', icon: '✏️' },
    { label: 'Duplicate Test Case', icon: '📋' },
    { label: 'Approve Test Case', icon: '✅' },
    { label: 'Export to PDF', icon: '📄' },
    { label: 'Export to Excel', icon: '📊' },
    { label: 'Delete Test Case', icon: '🗑️', danger: true }
  ];

  if (!hasTestCases) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">No test cases yet</h3>
          <p className="empty-state-text">
            Test cases were auto-generated when the ticket was created. They will appear here once loaded.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setCurrentView('add-test-case');
            }}
          >
            <Plus size={18} />
            Add Test Case
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="action-row">
        <div></div>
        <button
          className="btn btn-primary"
          onClick={() => setCurrentView('add-test-case')}
        >
          <Plus size={18} />
          Add Test Case
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>TC ID</th>
              <th>Title</th>
              <th>Component</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Updated At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((testCase) => (
              <tr
                key={testCase.id}
                onClick={() => {
                  onSelectTestCase(testCase);
                  setCurrentView('view-test-case');
                }}
                style={{ cursor: 'pointer' }}
              >
                <td style={{ fontWeight: '500', color: '#0066cc' }}>
                  {testCase.id}
                </td>
                <td>{testCase.title}</td>
                <td>{testCase.component}</td>
                <td>{testCase.platform}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(testCase.status)}`}>
                    {testCase.status}
                  </span>
                </td>
                <td>{formatDate(testCase.updated_at)}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                      ref={(el) => { menuRefs.current[testCase.id] = el; }}
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === testCase.id ? null : testCase.id);
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === testCase.id && (
                      <ActionMenu
                        actions={actions}
                        onAction={(action) => handleAction(action, testCase)}
                        triggerRef={menuRefs.current[testCase.id]}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
