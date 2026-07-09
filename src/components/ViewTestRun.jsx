import { useState } from 'react';
import { Edit, Play, AlertCircle, Check, FileText } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

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
  onShowToast
}) {
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
    const versions = ['V1', 'V2', 'V3', 'V4', 'V5'];
    const currentVersion = parseInt(testRun.version.substring(1));
    const nextVersion = `V${currentVersion + 1}`;

    const retest = {
      id: `RUN-${Math.floor(Math.random() * 10000)}`,
      testCaseId: testRun.testCaseId,
      testCaseTitle: testRun.testCaseTitle,
      platform: testRun.platform,
      version: nextVersion,
      status: 'Not Run',
      qaFailedCount: 0,
      executedBy: 'Current User',
      executedAt: new Date().toISOString(),
      actualResults: [],
      steps: []
    };
    onCreateRetest(retest);
  };

  const handleMarkQAFailed = () => {
    const failed = {
      ...testRun,
      status: 'QA Failed',
      qaFailedCount: (testRun.qaFailedCount || 0) + 1
    };
    onMarkQAFailed(failed);
  };

  const handleMarkPassed = () => {
    const approved = {
      ...testRun,
      status: 'Passed'
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
          {testRun.status === 'QA Failed' && (
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
                <td>{testCase?.testSteps?.length || 0} steps</td>
                <td>{testCase?.expectedResult}</td>
                <td>
                  <div style={{ whiteSpace: 'pre-wrap', maxWidth: '300px' }}>
                    {testRun.actualResults?.[0] || '-'}
                  </div>
                </td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(testRun.status)}`}>
                    {testRun.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e5e5e5' }}>
            <h4>QA Failed Cycle Tracking</h4>
            <div style={{ padding: '16px', background: '#fff3e0', borderRadius: '6px' }}>
              <p style={{ marginBottom: '8px' }}>
                <strong>Current Cycle:</strong> {testRun.version} - QA Failed
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
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
          <button className="btn btn-primary" onClick={onExecute}>
            <Play size={16} />
            Execute / Manage Test Run
          </button>
          {testRun.status !== 'QA Failed' && (
            <button className="btn btn-secondary" onClick={handleMarkQAFailed}>
              <AlertCircle size={16} />
              Mark as QA Failed
            </button>
          )}
          {testRun.status !== 'Passed' && (
            <button className="btn btn-primary" onClick={handleMarkPassed}>
              <Check size={16} />
              Mark as Approved / Passed
            </button>
          )}
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
