import { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';

export default function AddEditTestCase({
  ticket,
  testCase,
  onSave,
  onCancel,
  onShowToast
}) {
  const [form, setForm] = useState(
    testCase ? {
      id: testCase.id,
      title: testCase.title || '',
      component: testCase.component || '',
      description: testCase.description || '',
      preConditions: testCase.pre_conditions || '',
      testSteps: typeof testCase.test_steps === 'string' ? testCase.test_steps.split('\n') : (testCase.testSteps || []),
      expectedResult: testCase.expected_result || '',
      platform: testCase.platform || ticket.platform,
      status: testCase.status === 'Approved' ? 'Approved' : 'Pending',
      customTables: testCase.custom_tables || [],
      createdBy: testCase.created_by || 'Current User',
      createdAt: testCase.created_at || new Date().toISOString(),
      updatedAt: testCase.updated_at || new Date().toISOString(),
      approvedBy: testCase.approved_by || null,
      approvedAt: testCase.approved_at || null
    } : {
      id: `TC-${Math.floor(Math.random() * 10000)}`,
      title: '',
      component: '',
      description: '',
      preConditions: '',
      testSteps: [],
      expectedResult: '',
      platform: ticket.platform,
      status: 'Pending',
      customTables: [],
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvedBy: null,
      approvedAt: null
    }
  );

  const [stepInput, setStepInput] = useState('');
  const [customTableName, setCustomTableName] = useState('');

  const handleFormChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const addStep = () => {
    if (stepInput.trim()) {
      setForm({
        ...form,
        testSteps: [...form.testSteps, stepInput]
      });
      setStepInput('');
    }
  };

  const removeStep = (index) => {
    setForm({
      ...form,
      testSteps: form.testSteps.filter((_, i) => i !== index)
    });
  };

  const addCustomTable = () => {
    if (customTableName.trim()) {
      const newTable = {
        id: `TABLE-${Math.floor(Math.random() * 10000)}`,
        name: customTableName,
        columns: [],
        rows: []
      };
      setForm({
        ...form,
        customTables: [...form.customTables, newTable]
      });
      setCustomTableName('');
    }
  };

  const addTableColumn = (tableIndex) => {
    const table = form.customTables[tableIndex];
    table.columns.push(`Column ${table.columns.length + 1}`);
    const updated = [...form.customTables];
    updated[tableIndex] = table;
    setForm({ ...form, customTables: updated });
  };

  const addTableRow = (tableIndex) => {
    const table = form.customTables[tableIndex];
    const newRow = table.columns.map(() => '');
    table.rows.push(newRow);
    const updated = [...form.customTables];
    updated[tableIndex] = table;
    setForm({ ...form, customTables: updated });
  };

  const deleteTableRow = (tableIndex, rowIndex) => {
    const table = form.customTables[tableIndex];
    table.rows.splice(rowIndex, 1);
    const updated = [...form.customTables];
    updated[tableIndex] = table;
    setForm({ ...form, customTables: updated });
  };

  const deleteTableColumn = (tableIndex, colIndex) => {
    const table = form.customTables[tableIndex];
    table.columns.splice(colIndex, 1);
    table.rows = table.rows.map(row => {
      row.splice(colIndex, 1);
      return row;
    });
    const updated = [...form.customTables];
    updated[tableIndex] = table;
    setForm({ ...form, customTables: updated });
  };

  const updateTableCell = (tableIndex, rowIndex, colIndex, value) => {
    const table = form.customTables[tableIndex];
    table.rows[rowIndex][colIndex] = value;
    const updated = [...form.customTables];
    updated[tableIndex] = table;
    setForm({ ...form, customTables: updated });
  };

  const renameTableColumn = (tableIndex, colIndex, newName) => {
    const table = form.customTables[tableIndex];
    table.columns[colIndex] = newName;
    const updated = [...form.customTables];
    updated[tableIndex] = table;
    setForm({ ...form, customTables: updated });
  };

  const handleSave = (status) => {
    if (!form.title.trim()) {
      onShowToast('Title is required', 'error');
      return;
    }

    const updated = {
      id: form.id,
      title: form.title,
      component: form.component,
      description: form.description,
      pre_conditions: form.preConditions,
      test_steps: form.testSteps.join('\n'),
      expected_result: form.expectedResult,
      platform: form.platform,
      status: status,
      custom_tables: form.customTables,
      created_by: form.createdBy,
      created_at: form.createdAt,
      updated_at: new Date().toISOString(),
      approved_by: form.approvedBy,
      approved_at: form.approvedAt
    };

    onSave(updated);
  };

  const handleApprove = () => {
    if (!form.title.trim()) {
      onShowToast('Title is required', 'error');
      return;
    }

    const approved = {
      id: form.id,
      title: form.title,
      component: form.component,
      description: form.description,
      pre_conditions: form.preConditions,
      test_steps: form.testSteps.join('\n'),
      expected_result: form.expectedResult,
      platform: form.platform,
      status: 'Approved',
      custom_tables: form.customTables,
      created_by: form.createdBy,
      created_at: form.createdAt,
      updated_at: new Date().toISOString(),
      approved_by: 'Current User',
      approved_at: new Date().toISOString()
    };

    onSave(approved);
  };

  return (
    <div className="card">
      <h2>{testCase ? 'Edit Test Case' : 'Add Test Case'}</h2>

      <div className="form-row">
        <div className="form-group">
          <label>Jira Ticket</label>
          <input
            type="text"
            value={ticket.id}
            readOnly
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          />
        </div>
        <div className="form-group">
          <label>Ticket Name</label>
          <input
            type="text"
            value={ticket.name}
            readOnly
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Test Case #</label>
          <input type="text" value={form.id} readOnly style={{ backgroundColor: 'var(--bg-tertiary)' }} />
        </div>
        <div className="form-group">
          <label>Component</label>
          <input
            type="text"
            value={form.component}
            onChange={(e) => handleFormChange('component', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleFormChange('title', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => handleFormChange('description', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Pre-Conditions</label>
        <textarea
          value={form.preConditions}
          onChange={(e) => handleFormChange('preConditions', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Test Steps</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            type="text"
            value={stepInput}
            onChange={(e) => setStepInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addStep();
              }
            }}
            placeholder="Enter a test step..."
          />
          <button className="btn btn-secondary" onClick={addStep}>
            <Plus size={16} />
            Add
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {form.testSteps.map((step, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: 'var(--bg-tertiary)',
                borderRadius: '4px',
                fontSize: '14px',
                color: 'var(--text-primary)'
              }}
            >
              <span>
                {index + 1}. {step}
              </span>
              <button
                className="btn-icon"
                onClick={() => removeStep(index)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Expected Result</label>
        <textarea
          value={form.expectedResult}
          onChange={(e) => handleFormChange('expectedResult', e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Platform</label>
          <select
            value={form.platform}
            onChange={(e) => handleFormChange('platform', e.target.value)}
          >
            <option value="iOS">iOS</option>
            <option value="Android">Android</option>
            <option value="iOS, Android">iOS, Android</option>
            <option value="Web">Web</option>
          </select>
        </div>
        {testCase && (
          <div className="form-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => handleFormChange('status', e.target.value)}
            >
              <option>Pending</option>
              <option>Approved</option>
            </select>
          </div>
        )}
      </div>

      {/* Custom Tables */}
      <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
        <h3>Custom Tables</h3>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Custom table name..."
            value={customTableName}
            onChange={(e) => setCustomTableName(e.target.value)}
          />
          <button className="btn btn-secondary" onClick={addCustomTable}>
            <Plus size={16} />
            Add Table
          </button>
        </div>

        {form.customTables.map((table, tableIndex) => (
          <div
            key={table.id}
            style={{
              marginBottom: '24px',
              padding: '16px',
              background: 'var(--bg-tertiary)',
              borderRadius: '6px'
            }}
          >
            <h4 style={{ marginBottom: '12px' }}>{table.name}</h4>

            {table.columns.length > 0 && (
              <div style={{ marginBottom: '16px', display: 'flex', gap: '0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 'fit-content' }}>
                    <colgroup>
                      {table.columns.map((_, i) => (
                        <col key={`col-${i}`} style={{ width: '150px' }} />
                      ))}
                    </colgroup>
                    <thead>
                      <tr>
                        {table.columns.map((col, colIndex) => (
                          <th
                            key={colIndex}
                            style={{
                              textAlign: 'left',
                              padding: '8px',
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              position: 'relative',
                              width: '150px',
                              height: '40px',
                              verticalAlign: 'middle'
                            }}
                          >
                            <input
                              type="text"
                              value={col}
                              onChange={(e) =>
                                renameTableColumn(tableIndex, colIndex, e.target.value)
                              }
                              style={{
                                border: 'none',
                                background: 'transparent',
                                width: 'calc(100% - 20px)',
                                fontSize: '14px',
                                color: 'var(--text-primary)'
                              }}
                            />
                            <button
                              className="btn-icon"
                              onClick={() => deleteTableColumn(tableIndex, colIndex)}
                              style={{ position: 'absolute', top: '2px', right: '2px' }}
                            >
                              <X size={14} />
                            </button>
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
                              style={{ padding: '8px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', width: '150px', height: '40px', verticalAlign: 'top' }}
                            >
                              <input
                                type="text"
                                value={cell}
                                onChange={(e) =>
                                  updateTableCell(tableIndex, rowIndex, colIndex, e.target.value)
                                }
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  width: '100%',
                                  fontSize: '14px'
                                }}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '80px' }}>
                  <div
                    style={{
                      padding: '8px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      height: '40px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    Actions
                  </div>
                  {table.rows.map((_, rowIndex) => (
                    <div
                      key={rowIndex}
                      style={{
                        padding: '8px',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'var(--text-primary)',
                        height: '40px',
                        borderTop: 'none'
                      }}
                    >
                      <button
                        className="btn-icon"
                        onClick={() => deleteTableRow(tableIndex, rowIndex)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => addTableColumn(tableIndex)}
              >
                Add Column
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => addTableRow(tableIndex)}
              >
                Add Row
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        {testCase ? (
          <>
            {form.status !== 'Approved' && (
              <button
                className="btn btn-secondary"
                onClick={() => handleSave('Pending')}
              >
                Save as Pending
              </button>
            )}
            <button className="btn btn-primary" onClick={handleApprove}>
              {form.status === 'Approved' ? 'Update' : 'Approve Test Case'}
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={() => handleSave('Pending')}>
            Add Test Case
          </button>
        )}
      </div>
    </div>
  );
}
