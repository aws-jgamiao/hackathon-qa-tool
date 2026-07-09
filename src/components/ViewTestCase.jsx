import { useState } from 'react';
import { Copy, Edit, Check, FileText, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

export default function ViewTestCase({
  ticket,
  testCase,
  onBack,
  onEdit,
  onDuplicate,
  onApprove,
  onDelete,
  onShowToast
}) {
  const [showActions, setShowActions] = useState(false);

  const handleDuplicate = () => {
    const duplicated = {
      ...testCase,
      id: `TC-${Math.floor(Math.random() * 10000)}`,
      status: 'Draft',
      approvedBy: null,
      approvedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onDuplicate(duplicated);
  };

  const handleApprove = () => {
    if (testCase.status !== 'Approved') {
      const approved = {
        ...testCase,
        status: 'Approved',
        approvedBy: 'Current User',
        approvedAt: new Date().toISOString()
      };
      // The ticket platform handling is done in the parent component
      onApprove(approved);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this test case?')) {
      onDelete();
    }
  };

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

  return (
    <div>
      <div className="card">
        <div className="action-row">
          <div>
            <h2>
              {ticket.id} - {testCase.title}
            </h2>
            <div style={{ marginTop: '8px' }}>
              <span className={`badge ${getStatusBadgeClass(testCase.status)}`}>
                {testCase.status}
              </span>
            </div>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <div className="detail-label">Test Case #</div>
            <div className="detail-value">{testCase.id}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Component</div>
            <div className="detail-value">{testCase.component}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Platform</div>
            <div className="detail-value">{testCase.platform}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Created By</div>
            <div className="detail-value">{testCase.createdBy}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Created At</div>
            <div className="detail-value">{formatDate(testCase.created_at)}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Updated At</div>
            <div className="detail-value">{formatDate(testCase.updated_at)}</div>
          </div>
          {testCase.approvedBy && (
            <>
              <div className="detail-item">
                <div className="detail-label">Approved By</div>
                <div className="detail-value">{testCase.approvedBy}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Approved At</div>
                <div className="detail-value">{formatDate(testCase.approved_at)}</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Test Case Details</h3>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '8px', color: '#666', fontSize: '12px', fontWeight: '600' }}>
            Description
          </h4>
          <p style={{ color: '#1a1a1a', whiteSpace: 'pre-wrap' }}>
            {testCase.description}
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '8px', color: '#666', fontSize: '12px', fontWeight: '600' }}>
            Pre-Conditions
          </h4>
          <p style={{ color: '#1a1a1a', whiteSpace: 'pre-wrap' }}>
            {testCase.preConditions}
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '8px', color: '#666', fontSize: '12px', fontWeight: '600' }}>
            Test Steps
          </h4>
          <ol style={{ marginLeft: '20px', color: '#1a1a1a' }}>
            {testCase.testSteps.map((step, index) => (
              <li key={index} style={{ marginBottom: '6px' }}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '8px', color: '#666', fontSize: '12px', fontWeight: '600' }}>
            Expected Result
          </h4>
          <p style={{ color: '#1a1a1a', whiteSpace: 'pre-wrap' }}>
            {testCase.expectedResult}
          </p>
        </div>

        {testCase.customTables && testCase.customTables.length > 0 && (
          <div style={{ marginTop: '24px', borderTop: '1px solid #e5e5e5', paddingTop: '20px' }}>
            <h3>Custom Tables</h3>
            {testCase.customTables.map((table) => (
              <div key={table.id} style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '12px' }}>{table.name}</h4>
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
      </div>

      <div className="card">
        <h3>Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onEdit}>
            <Edit size={16} />
            Edit Test Case
          </button>
          <button className="btn btn-secondary" onClick={handleDuplicate}>
            <Copy size={16} />
            Duplicate Test Case
          </button>
          {testCase.status !== 'Approved' && (
            <button className="btn btn-primary" onClick={handleApprove}>
              <Check size={16} />
              Approve Test Case
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
          <button
            className="btn btn-secondary"
            onClick={handleDelete}
            style={{ color: '#c62828' }}
          >
            <Trash2 size={16} />
            Delete Test Case
          </button>
        </div>
      </div>
    </div>
  );
}
