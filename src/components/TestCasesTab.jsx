import { useState, useRef } from 'react';
import { formatDate } from '../utils/dateUtils';
import { testCaseService } from '../lib/supabase';
import ActionMenu from './ActionMenu';
import { exportTestCaseToPDF, exportTestCaseToExcel } from '../utils/exportUtils';

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
      case 'Pending':
        return 'badge-warning';
      default:
        return 'badge-gray';
    }
  };

  const handleAction = async (action, testCase) => {
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
        try {
          const duplicated = {
            ...testCase,
            id: `TC-${Math.floor(Math.random() * 10000)}`,
            status: 'Pending',
            approved_by: null,
            approved_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const saved = await testCaseService.create(duplicated);
          setTestCases([...testCases, saved]);
          onShowToast('Test case duplicated', 'success');
        } catch (err) {
          console.error('Failed to duplicate test case:', err);
          onShowToast('Failed to duplicate test case: ' + err.message, 'error');
        }
        break;
      case 'Export to PDF':
        try {
          exportTestCaseToPDF(ticket, testCase);
          onShowToast('Test case exported to PDF', 'success');
        } catch (err) {
          console.error('Failed to export test case to PDF:', err);
          onShowToast('Failed to export test case to PDF', 'error');
        }
        break;
      case 'Export to Excel':
        try {
          exportTestCaseToExcel(ticket, testCase);
          onShowToast('Test case exported to Excel', 'success');
        } catch (err) {
          console.error('Failed to export test case to Excel:', err);
          onShowToast('Failed to export test case to Excel', 'error');
        }
        break;
      case 'Delete Test Case':
        if (confirm('Are you sure you want to delete this test case?')) {
          try {
            await testCaseService.delete(testCase.id);
            const newCases = testCases.filter(tc => tc.id !== testCase.id);
            setTestCases(newCases);
            onShowToast('Test case deleted', 'success');
          } catch (err) {
            console.error('Failed to delete test case:', err);
            onShowToast('Failed to delete test case: ' + err.message, 'error');
          }
        }
        break;
    }
    setOpenMenuId(null);
  };

  const actions = [
    { label: 'View Test Case', icon: '👁️' },
    { label: 'Edit Test Case', icon: '✏️' },
    { label: 'Duplicate Test Case', icon: '📋' },
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
                      ⋯
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
