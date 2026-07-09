import { Edit, AlertCircle, Check, FileText, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { exportTestRunToPDF, exportTestRunToExcel } from '../utils/exportUtils';

export default function ViewTestRun({
  ticket,
  testRun,
  testCase,
  onBack,
  onEdit,
  onExecute,
  onCreateRetest,
  onMarkQAFailed,
  onApprove,
  onDelete,
  onShowToast,
  allTestRuns = []
}) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this test run?')) {
      onDelete();
    }
  };
  // Check if a later version of this test run has passed
  const hasPassedRetest = allTestRuns?.some(tr =>
    tr.test_case_id === testRun.test_case_id &&
    parseInt(tr.version.substring(1)) > parseInt(testRun.version.substring(1)) &&
    tr.status === 'Passed'
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Passed':
      case 'Approved':
        return 'badge-success';
      case 'Failed':
      case 'QA Failed':
        return 'badge-error';
      case 'In Progress':
        return 'badge-info';
      case 'Blocked':
      case 'Retest':
        return 'badge-warning';
      default:
        return 'badge-gray';
    }
  };

  const handleCreateRetest = () => {
    const currentVersion = parseInt(testRun.version.substring(1));
    const nextVersion = `V${currentVersion + 1}`;

    const runNumber = allTestRuns.length + 1;
    const retest = {
      id: `TR-${String(runNumber).padStart(3, '0')}`,
      ticket_id: testRun.ticket_id,
      test_case_id: testRun.test_case_id,
      platform: testRun.platform,
      version: nextVersion,
      status: 'Not Run',
      qa_failed_count: 0,
      executed_by: 'Current User',
      executed_at: new Date().toISOString()
    };
    onCreateRetest(retest);
  };

  const handleMarkQAFailed = () => {
    const failed = {
      ...testRun,
      status: 'QA Failed',
      qa_failed_count: (testRun.qa_failed_count || 0) + 1,
      updated_at: new Date().toISOString()
    };
    onMarkQAFailed(failed);
  };

  const handleMarkPassed = () => {
    const approved = {
      ...testRun,
      status: 'Passed',
      updated_at: new Date().toISOString()
    };
    onApprove(approved);
  };

  return (
    <div>
      <div className="card">
        <div className="action-row">
          <div>
            <h2>
              {testRun.id} - {testRun.testCaseTitle}
            </h2>
            <div style={{ marginTop: '8px' }}>
              <span className={`badge ${getStatusBadgeClass(testRun.status)}`}>
                {testRun.status}
              </span>
            </div>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <div className="detail-label">Run ID</div>
            <div className="detail-value">{testRun.id}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Version / Cycle</div>
            <div className="detail-value">{testRun.version}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Test Case</div>
            <div className="detail-value">{testCase?.id}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Platform</div>
            <div className="detail-value">{testRun.platform}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Executed By</div>
            <div className="detail-value">{testRun.executedBy}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Executed At</div>
            <div className="detail-value">{formatDate(testRun.executedAt)}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">QA Failed Count</div>
            <div className="detail-value">
              {testRun.qaFailedCount > 0 && (
                <span className="badge badge-error">{testRun.qaFailedCount}</span>
              )}
              {testRun.qaFailedCount === 0 && <span>0</span>}
            </div>
          </div>
          {testRun.status === 'QA Failed' && !hasPassedRetest && (
            <div className="detail-item">
              <div className="detail-label">Next Retest</div>
              <div className="detail-value">
                <button className="btn btn-sm btn-primary" onClick={handleCreateRetest}>
                  Create Retest
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Test Execution Results</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600' }}>
              Test Case
            </h4>
            <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-primary)' }}>
              {testCase?.id} - {testCase?.title}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {testCase?.component}
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600' }}>
              Status
            </h4>
            <span className={`badge ${getStatusBadgeClass(testRun.status)}`}>
              {testRun.status}
            </span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600' }}>
            Description
          </h4>
          <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {testCase?.description}
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600' }}>
            Pre-Conditions
          </h4>
          <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {testCase?.pre_conditions || '-'}
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600' }}>
            Test Steps
          </h4>
          <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {testCase?.test_steps || '-'}
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600' }}>
            Expected Result
          </h4>
          <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {testCase?.expected_result || '-'}
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600' }}>
            Actual Result <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}></span>
          </h4>
          <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {testRun.actual_result || '-'}
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600' }}>
            Test Notes <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>(Optional)</span>
          </h4>
          <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {testRun.test_notes || '-'}
          </p>
        </div>

        {testCase?.custom_tables && testCase.custom_tables.length > 0 && (
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            <h4>Custom Tables</h4>
            {testCase.custom_tables.map((table) => (
              <div key={table.id} style={{ marginBottom: '20px' }}>
                <h5 style={{ marginBottom: '12px' }}>{table.name}</h5>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        {table.columns.map((col, index) => (
                          <th
                            key={index}
                            style={{
                              textAlign: 'left',
                              padding: '8px',
                              background: 'var(--bg-tertiary)',
                              border: '1px solid var(--border-color)'
                            }}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, colIndex) => (
                            <td
                              key={colIndex}
                              style={{
                                padding: '8px',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)'
                              }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {testRun.status === 'QA Failed' && (
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            <h4>QA Failed Cycle Tracking</h4>
            <div style={{ padding: '16px', background: '#fff3e0', borderRadius: '6px', color: 'var(--text-primary)' }}>
              <p style={{ marginBottom: '8px' }}>
                <strong>Current Cycle:</strong> {testRun.version} - QA Failed
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                This run has been marked as QA Failed. Create a retest run to continue testing.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onEdit}>
            <Edit size={16} />
            Edit Test Run
          </button>

          {testRun.status === 'Passed' && (
            <div style={{ padding: '12px', background: '#e8f5e9', borderRadius: '6px', border: '1px solid #2e7d32', color: '#2e7d32' }}>
              <strong>✓ Marked as Passed</strong>
            </div>
          )}
          {testRun.status === 'QA Failed' && (
            <div style={{ padding: '12px', background: '#ffebee', borderRadius: '6px', border: '1px solid #c62828', color: '#c62828' }}>
              <strong>✕ Marked as QA Failed</strong>
            </div>
          )}

          {testRun.status !== 'Passed' && testRun.status !== 'QA Failed' && (
            <>
              <button className="btn btn-secondary" onClick={handleMarkQAFailed} style={{ borderColor: '#c62828', color: '#c62828' }}>
                <AlertCircle size={16} />
                Mark as QA Failed
              </button>
              <button className="btn btn-secondary" onClick={handleMarkPassed} style={{ borderColor: '#2e7d32', color: '#2e7d32' }}>
                <Check size={16} />
                Mark as Passed
              </button>
            </>
          )}

          <button
            className="btn btn-secondary"
            onClick={() => {
              try {
                exportTestRunToPDF(ticket, testRun, testCase);
                onShowToast('Test run exported to PDF', 'success');
              } catch (err) {
                console.error('Failed to export test run to PDF:', err);
                onShowToast('Failed to export test run to PDF', 'error');
              }
            }}
          >
            <FileText size={16} />
            Export to PDF
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              try {
                exportTestRunToExcel(ticket, testRun, testCase);
                onShowToast('Test run exported to Excel', 'success');
              } catch (err) {
                console.error('Failed to export test run to Excel:', err);
                onShowToast('Failed to export test run to Excel', 'error');
              }
            }}
          >
            📊
            Export to Excel
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleDelete}
            style={{ borderColor: '#c62828', color: '#c62828' }}
          >
            <Trash2 size={16} />
            Delete Test Run
          </button>
        </div>
      </div>
    </div>
  );
}
