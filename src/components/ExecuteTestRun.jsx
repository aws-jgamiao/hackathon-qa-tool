import { useState } from 'react';
import { Save, AlertCircle, Check, FileText } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { exportTestRunToPDF, exportTestRunToExcel } from '../utils/exportUtils';

export default function ExecuteTestRun({
  ticket,
  testRun,
  testCase,
  onBack,
  onSave,
  onMarkQAFailed,
  onApprove,
  onShowToast
}) {
  const [actualResult, setActualResult] = useState(testRun?.actual_result || '');
  const [testNotes, setTestNotes] = useState(testRun?.test_notes || '');

  const handleSave = () => {
    const updated = {
      ...testRun,
      actual_result: actualResult,
      test_notes: testNotes,
      updated_at: new Date().toISOString()
    };
    onSave(updated);
  };

  const handleMarkQAFailed = () => {
    const failed = {
      ...testRun,
      actual_result: actualResult,
      test_notes: testNotes,
      status: 'QA Failed',
      qa_failed_count: (testRun.qa_failed_count || 0) + 1,
      updated_at: new Date().toISOString()
    };
    onMarkQAFailed(failed);
  };

  const handleMarkPassed = () => {
    const approved = {
      ...testRun,
      actual_result: actualResult,
      test_notes: testNotes,
      status: 'Passed',
      updated_at: new Date().toISOString()
    };
    onApprove(approved);
  };

  return (
    <div>
      <div className="card">
        <h2>Execute Test Run</h2>
        <div className="details-grid">
          <div className="detail-item">
            <div className="detail-label">Run ID</div>
            <div className="detail-value">{testRun.id}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Test Case</div>
            <div className="detail-value">{testCase?.title}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Version</div>
            <div className="detail-value">{testRun.version}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Platform</div>
            <div className="detail-value">{testRun.platform}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Status</div>
            <div className="detail-value">{testRun.status}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Executed By</div>
            <div className="detail-value">{testRun.executed_by}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Test Execution Details</h3>

        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600' }}>
            Description
          </h4>
          <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {testCase?.description}
          </p>
        </div>

        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600' }}>
            Pre-Conditions
          </h4>
          <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {testCase?.pre_conditions || '-'}
          </p>
        </div>

        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600' }}>
            Test Steps
          </h4>
          <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {testCase?.test_steps || '-'}
          </p>
        </div>

        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600' }}>
            Expected Result
          </h4>
          <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {testCase?.expected_result || '-'}
          </p>
        </div>

        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600' }}>
            Actual Result
          </h4>
          <textarea
            value={actualResult}
            onChange={(e) => setActualResult(e.target.value)}
            placeholder="Enter actual result from test execution..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              fontFamily: 'inherit',
              fontSize: '14px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <div>
          <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600' }}>
            Test Notes
          </h4>
          <textarea
            value={testNotes}
            onChange={(e) => setTestNotes(e.target.value)}
            placeholder="Add any additional notes about this test run..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              fontFamily: 'inherit',
              fontSize: '14px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)'
            }}
          />
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
                                border: '1px solid var(--border-color)'
                              }}
                            >
                              <input
                                type="text"
                                value={cell}
                                onChange={(e) => {
                                  // For now just show a toast
                                  onShowToast('Cells can be edited here');
                                }}
                                style={{
                                  width: '100%',
                                  border: '1px solid var(--border-color)',
                                  padding: '4px',
                                  borderRadius: '3px',
                                  backgroundColor: 'var(--bg-secondary)',
                                  color: 'var(--text-primary)'
                                }}
                              />
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
      </div>

      <div className="card">
        <h3>Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handleSave}>
            <Save size={16} />
            Save Progress
          </button>
          <button className="btn btn-secondary" onClick={handleMarkQAFailed} style={{ borderColor: '#c62828', color: '#c62828' }}>
            <AlertCircle size={16} />
            Mark as QA Failed
          </button>
          <button className="btn btn-secondary" onClick={handleMarkPassed} style={{ borderColor: '#2e7d32', color: '#2e7d32' }}>
            <Check size={16} />
            Mark as Approved / Passed
          </button>
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
        </div>
      </div>
    </div>
  );
}
