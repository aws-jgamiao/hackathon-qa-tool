import { useState } from 'react';
import { Save, Check, AlertCircle, FileText } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

export default function SimpleTestRunExecution({
  ticket,
  testRun,
  testCase,
  results,
  onBack,
  onSave,
  onMarkPassed,
  onMarkQAFailed,
  onShowToast
}) {
  const [runResults, setRunResults] = useState(results || []);

  const handleResultChange = (stepNumber, field, value) => {
    const updated = [...runResults];
    const resultIdx = updated.findIndex(r => r.step_number === stepNumber);

    if (resultIdx >= 0) {
      updated[resultIdx] = { ...updated[resultIdx], [field]: value };
    } else {
      updated.push({
        id: `RESULT-${Date.now()}-${stepNumber}`,
        test_run_id: testRun.id,
        step_number: stepNumber,
        step_description: testCase?.test_steps?.[stepNumber - 1] || '',
        actual_result: field === 'actual_result' ? value : '',
        status: field === 'status' ? value : 'Not Run'
      });
    }

    setRunResults(updated);
  };

  const handleSave = () => {
    onSave(runResults);
    onShowToast('Test run saved', 'success');
  };

  return (
    <div>
      <div className="card">
        <h2>Test Run Execution</h2>
        <div className="details-grid">
          <div className="detail-item">
            <div className="detail-label">Ticket</div>
            <div className="detail-value">{ticket?.id} - {ticket?.name}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Test Case</div>
            <div className="detail-value">{testCase?.title}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Run ID</div>
            <div className="detail-value">{testRun?.id}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Platform</div>
            <div className="detail-value">{testRun?.platform}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Test Execution</h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ fontSize: '13px' }}>
            <thead>
              <tr>
                <th style={{ width: '8%' }}>Test Case #</th>
                <th style={{ width: '12%' }}>Component</th>
                <th style={{ width: '15%' }}>Title</th>
                <th style={{ width: '15%' }}>Description</th>
                <th style={{ width: '12%' }}>Pre-Conditions</th>
                <th style={{ width: '12%' }}>Test Steps</th>
                <th style={{ width: '12%' }}>Expected Result</th>
                <th style={{ width: '20%', minWidth: '250px' }}>Actual Result</th>
                <th style={{ width: '10%, minWidth: 100px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{testCase?.id}</td>
                <td>{testCase?.component}</td>
                <td>{testCase?.title}</td>
                <td>
                  <div style={{ maxHeight: '60px', overflow: 'auto', fontSize: '12px' }}>
                    {testCase?.description}
                  </div>
                </td>
                <td>
                  <div style={{ maxHeight: '60px', overflow: 'auto', fontSize: '12px' }}>
                    {testCase?.pre_conditions}
                  </div>
                </td>
                <td>
                  <div style={{ maxHeight: '60px', overflow: 'auto' }}>
                    <ol style={{ margin: '0', paddingLeft: '20px', fontSize: '12px' }}>
                      {testCase?.test_steps?.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </td>
                <td>
                  <div style={{ maxHeight: '60px', overflow: 'auto', fontSize: '12px' }}>
                    {testCase?.expected_result}
                  </div>
                </td>
                <td>
                  <textarea
                    value={runResults[0]?.actual_result || ''}
                    onChange={(e) => handleResultChange(1, 'actual_result', e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '6px',
                      fontSize: '12px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      fontFamily: 'monospace'
                    }}
                    placeholder="Enter actual result..."
                  />
                </td>
                <td>
                  <select
                    value={runResults[0]?.status || 'Not Run'}
                    onChange={(e) => handleResultChange(1, 'status', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px',
                      fontSize: '12px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px'
                    }}
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
      </div>

      <div className="card">
        <h3>Actions</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            Save
          </button>
          <button className="btn btn-secondary" onClick={onMarkPassed}>
            <Check size={16} />
            Mark as Passed
          </button>
          <button className="btn btn-secondary" onClick={onMarkQAFailed}>
            <AlertCircle size={16} />
            Mark as QA Failed
          </button>
          <button className="btn btn-secondary" onClick={() => onShowToast('Exporting...')}>
            <FileText size={16} />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
