import { useState } from 'react';
import { Save, AlertCircle, Check, FileText } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

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
  const [actualResults, setActualResults] = useState(testRun?.actualResults || []);
  const [stepStatuses, setStepStatuses] = useState(
    testCase?.testSteps?.map(() => 'Not Run') || []
  );

  const handleStepStatusChange = (index, status) => {
    const updated = [...stepStatuses];
    updated[index] = status;
    setStepStatuses(updated);
  };

  const handleActualResultChange = (index, value) => {
    const updated = [...actualResults];
    updated[index] = value;
    setActualResults(updated);
  };

  const handleSave = () => {
    const updated = {
      ...testRun,
      actualResults,
      steps: testCase.testSteps.map((step, index) => ({
        step,
        status: stepStatuses[index],
        actualResult: actualResults[index]
      })),
      updatedAt: new Date().toISOString()
    };
    onSave(updated);
  };

  const handleMarkQAFailed = () => {
    const failed = {
      ...testRun,
      status: 'QA Failed',
      qaFailedCount: (testRun.qaFailedCount || 0) + 1,
      updatedAt: new Date().toISOString()
    };
    onMarkQAFailed(failed);
  };

  const handleMarkPassed = () => {
    const approved = {
      ...testRun,
      status: 'Passed',
      updatedAt: new Date().toISOString()
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
            <div className="detail-value">{testRun.executedBy}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Test Execution Table</h3>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Test Case #</th>
                <th>Component</th>
                <th>Title</th>
                <th>Description</th>
                <th>Pre-Conditions</th>
                <th>Test Steps</th>
                <th>Expected Result</th>
                <th>Actual Result</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{testCase?.id}</td>
                <td>{testCase?.component}</td>
                <td>{testCase?.title}</td>
                <td>{testCase?.description}</td>
                <td>{testCase?.preConditions}</td>
                <td>
                  {testCase?.testSteps?.length || 0} steps
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => onShowToast('View detailed steps below')}
                  >
                    View
                  </button>
                </td>
                <td>{testCase?.expectedResult}</td>
                <td>
                  <textarea
                    value={actualResults[0] || ''}
                    onChange={(e) => handleActualResultChange(0, e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '60px',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #e5e5e5',
                      fontFamily: 'inherit'
                    }}
                    placeholder="Enter actual result..."
                  />
                </td>
                <td>
                  <select
                    value={stepStatuses[0] || 'Not Run'}
                    onChange={(e) => handleStepStatusChange(0, e.target.value)}
                  >
                    <option>Not Run</option>
                    <option>Passed</option>
                    <option>Failed</option>
                    <option>Blocked</option>
                    <option>Retest</option>
                    <option>QA Failed</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {testCase?.testSteps && testCase.testSteps.length > 0 && (
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e5e5e5' }}>
            <h4>Test Steps Detail</h4>
            {testCase.testSteps.map((step, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '20px',
                  padding: '16px',
                  background: '#f9f9f9',
                  borderRadius: '6px'
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <strong>Step {index + 1}:</strong> {step}
                </div>
                <textarea
                  value={actualResults[index] || ''}
                  onChange={(e) => handleActualResultChange(index, e.target.value)}
                  placeholder="Actual result for this step..."
                  style={{
                    width: '100%',
                    minHeight: '60px',
                    marginBottom: '12px'
                  }}
                />
                <select
                  value={stepStatuses[index] || 'Not Run'}
                  onChange={(e) => handleStepStatusChange(index, e.target.value)}
                >
                  <option>Not Run</option>
                  <option>Passed</option>
                  <option>Failed</option>
                  <option>Blocked</option>
                  <option>Retest</option>
                  <option>QA Failed</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {testCase?.customTables && testCase.customTables.length > 0 && (
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e5e5e5' }}>
            <h4>Custom Tables</h4>
            {testCase.customTables.map((table) => (
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
                              background: '#f9f9f9',
                              border: '1px solid #e5e5e5'
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
                                border: '1px solid #e5e5e5'
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
                                  border: '1px solid #e5e5e5',
                                  padding: '4px',
                                  borderRadius: '3px'
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
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            Save Progress
          </button>
          <button className="btn btn-secondary" onClick={handleMarkQAFailed}>
            <AlertCircle size={16} />
            Mark as QA Failed
          </button>
          <button className="btn btn-primary" onClick={handleMarkPassed}>
            <Check size={16} />
            Mark as Approved / Passed
          </button>
          <button className="btn btn-secondary" onClick={() => onShowToast('Exporting to PDF...')}>
            <FileText size={16} />
            Export to PDF
          </button>
          <button className="btn btn-secondary" onClick={() => onShowToast('Exporting to Excel...')}>
            📊
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
}
