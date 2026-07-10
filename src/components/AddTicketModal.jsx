import { useState } from 'react';
import { X, Loader, Plus, Trash2 } from 'lucide-react';
import { ticketService, testCaseService, activityLogService } from '../lib/supabase';
import { generateTestCases } from '../lib/claudeService';

export default function AddTicketModal({ onClose, onAdd, onShowToast }) {
  const [form, setForm] = useState({
    id: '',
    name: '',
    description: '',
    type: 'Bug',
    platform: 'iOS',
    status: 'Open',
    jira_link: '',
    test_case_count: 0,
    test_run_count: 0,
    qa_failed_count: 0
  });

  const [acceptanceCriteria, setAcceptanceCriteria] = useState(['']);
  const [acInputMode, setAcInputMode] = useState('fields'); // 'fields', 'textbox', or 'paste'
  const [pasteAcText, setPasteAcText] = useState('');
  const [singleBoxText, setSingleBoxText] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleAddCriteria = () => {
    const newCriteria = `AC${acceptanceCriteria.length + 1}: `;
    setAcceptanceCriteria([...acceptanceCriteria, newCriteria]);
  };

  const handleRemoveCriteria = (index) => {
    setAcceptanceCriteria(acceptanceCriteria.filter((_, i) => i !== index));
  };

  const handleCriteriaChange = (index, value) => {
    const updated = [...acceptanceCriteria];
    updated[index] = value;
    setAcceptanceCriteria(updated);
  };

  const parseText = (inputText, mode) => {
    const text = inputText.trim();
    if (!text) {
      onShowToast('Please enter acceptance criteria text', 'error');
      return;
    }

    let criteria = [];

    // Try splitting by "Scenario:"
    if (text.includes('Scenario:')) {
      const parts = text.split(/Scenario:/i).filter(p => p.trim());
      criteria = parts.map(p => `Scenario: ${p.trim()}`);
    } else if (/^\d+\./m.test(text)) {
      // Split by numbered lines
      criteria = text.split(/\n(?=\d+\.)/).filter(p => p.trim());
    } else {
      // Split by double line breaks
      criteria = text.split(/\n\n+/).filter(p => p.trim());
    }

    if (criteria.length === 0) {
      criteria = [text];
    }

    // Always add auto-numbering
    criteria = criteria.map((c, i) => {
      const isAlreadyNumbered = /^AC\s?\d+:/i.test(c.trim());
      return isAlreadyNumbered ? c : `AC${i + 1}: ${c}`;
    });

    setAcceptanceCriteria(criteria);

    if (mode === 'paste') {
      setPasteAcText('');
    } else {
      setSingleBoxText('');
    }

    setAcInputMode('fields');
    onShowToast(`Parsed ${criteria.length} acceptance criteria`, 'success');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.id.trim()) newErrors.id = 'Jira Ticket is required';
    if (!form.name.trim()) newErrors.name = 'Ticket Name is required';
    if (!form.jira_link.trim()) newErrors.jira_link = 'Jira Link is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      onShowToast('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      // Check for duplicate ticket ID
      const existing = await ticketService.getById(form.id);
      if (existing) {
        setErrors({ id: 'Ticket with this Jira Ticket already exists' });
        onShowToast('Ticket already exists', 'error');
        setLoading(false);
        return;
      }

      // Create ticket
      const newTicket = await ticketService.create({
        ...form,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Create activity log for ticket creation
      await activityLogService.create(
        newTicket.id,
        'ticket_created',
        `Ticket created: ${newTicket.name}`,
        newTicket.id,
        'ticket'
      );

      // Generate and save test cases
      onShowToast('Generating test cases with AI...', 'info');
      console.log('📋 Starting test case generation for ticket:', newTicket.id);
      try {
        const criteria = acceptanceCriteria.filter(c => c.trim());
        const generatedCases = await generateTestCases(newTicket, criteria);
        console.log(`💾 Saving ${generatedCases.length} test cases to database...`);

        // Save test cases to database with unique IDs
        for (let i = 0; i < generatedCases.length; i++) {
          const testCase = generatedCases[i];
          const sequentialId = `TC-${Date.now()}-${i + 1}`;
          console.log(`[${i + 1}/${generatedCases.length}] Saving: ${testCase.title}`);
          console.log('Test case object:', testCase);
          const testCaseToSave = {
            id: sequentialId,
            ticket_id: newTicket.id,
            title: testCase.title,
            description: testCase.description || '',
            component: testCase.component || '',
            platform: testCase.platform || 'iOS, Android',
            pre_conditions: testCase.preconditions || testCase.pre_conditions || '',
            expected_result: testCase.expectedResult || testCase.expected_result || '',
            test_steps: testCase.steps || testCase.test_steps || '',
            status: 'Pending',
            custom_tables: testCase.custom_tables || [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: 'Current User',
            approved_by: null,
            approved_at: null
          };
          console.log('Prepared test case to save:', testCaseToSave);
          try {
            await testCaseService.create(testCaseToSave);
          } catch (saveErr) {
            console.error('Failed to save test case:', saveErr);
            throw saveErr;
          }
        }

        console.log(`✅ All ${generatedCases.length} test cases saved successfully!`);

        // Update ticket with test case count
        const updatedTicket = await ticketService.update(newTicket.id, {
          test_case_count: generatedCases.length,
          updated_at: new Date().toISOString()
        });

        onShowToast(`Ticket created with ${generatedCases.length} test cases`, 'success');
        onAdd(updatedTicket);
      } catch (genErr) {
        console.error('⚠️ Test case generation error:', genErr);
        onShowToast(`Ticket created, but test case generation failed: ${genErr.message}`, 'warning');
        onAdd(newTicket);
      }
    } catch (err) {
      onShowToast('Error adding ticket: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Jira Ticket</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="form-group">
          <label>Jira Ticket * {errors.id && <span style={{ color: '#c62828' }}>({errors.id})</span>}</label>
          <input
            type="text"
            value={form.id}
            onChange={(e) => handleChange('id', e.target.value.toUpperCase())}
            placeholder="e.g., FLOWDEL-3050"
            style={errors.id ? { borderColor: '#c62828' } : {}}
          />
        </div>

        <div className="form-group">
          <label>Ticket Name * {errors.name && <span style={{ color: '#c62828' }}>({errors.name})</span>}</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Fix database connection timeout"
            style={errors.name ? { borderColor: '#c62828' } : {}}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the issue, feature, or task in detail..."
            style={{ minHeight: '100px' }}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select value={form.type} onChange={(e) => handleChange('type', e.target.value)}>
              <option>Bug</option>
              <option>Feature</option>
              <option>Task</option>
              <option>Epic</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
              <option>Open</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Platform</label>
            <select value={form.platform} onChange={(e) => handleChange('platform', e.target.value)}>
              <option>iOS</option>
              <option>Android</option>
              <option>iOS, Android</option>
              <option>Web</option>
            </select>
          </div>
          <div className="form-group">
            <label>Jira Link * {errors.jira_link && <span style={{ color: '#c62828' }}>({errors.jira_link})</span>}</label>
            <input
              type="url"
              value={form.jira_link}
              onChange={(e) => handleChange('jira_link', e.target.value)}
              placeholder="https://jira.company.com/browse/FLOWDEL-3050"
              style={errors.jira_link ? { borderColor: '#c62828' } : {}}
            />
          </div>
        </div>

        <div className="form-group">
          <div style={{ marginBottom: '12px' }}>
            <label style={{ marginBottom: '12px' }}>Acceptance Criteria</label>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => setAcInputMode('fields')}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  background: acInputMode === 'fields' ? 'var(--accent-color)' : 'var(--bg-hover)',
                  color: acInputMode === 'fields' ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Separate Fields
              </button>
              <button
                type="button"
                onClick={() => setAcInputMode('textbox')}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  background: acInputMode === 'textbox' ? 'var(--accent-color)' : 'var(--bg-hover)',
                  color: acInputMode === 'textbox' ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Single TextBox
              </button>
              <button
                type="button"
                onClick={() => setAcInputMode('paste')}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  background: acInputMode === 'paste' ? 'var(--accent-color)' : 'var(--bg-hover)',
                  color: acInputMode === 'paste' ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Paste & Parse
              </button>
            </div>
          </div>

          {acInputMode === 'fields' ? (
            <div style={{ marginBottom: '12px' }}>
              <table style={{ width: '100%' }}>
                <tbody>
                  {acceptanceCriteria.map((criteria, index) => (
                    <tr key={index} style={{ marginBottom: '8px' }}>
                      <td style={{ padding: '8px 0', paddingRight: '8px' }}>
                        <input
                          type="text"
                          value={criteria}
                          onChange={(e) => handleCriteriaChange(index, e.target.value)}
                          placeholder={`AC ${index + 1}: e.g., User can log in with valid credentials`}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)'
                          }}
                        />
                      </td>
                      <td style={{ padding: '8px 0', width: '40px', textAlign: 'right' }}>
                        {acceptanceCriteria.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCriteria(index)}
                            style={{
                              background: 'var(--bg-tertiary)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '4px',
                              padding: '6px 8px',
                              cursor: 'pointer',
                              color: '#c62828',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : acInputMode === 'textbox' ? (
            <div style={{ marginBottom: '12px' }}>
              <textarea
                value={singleBoxText}
                onChange={(e) => setSingleBoxText(e.target.value)}
                placeholder={`Enter all acceptance criteria here, separated by blank lines:

First criterion text...

Second criterion text...

Third criterion text...`}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  minHeight: '150px',
                  resize: 'vertical'
                }}
              />
              <button
                type="button"
                onClick={() => parseText(singleBoxText, 'textbox')}
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  background: 'var(--accent-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Parse & Add Criteria
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: '12px' }}>
              <textarea
                value={pasteAcText}
                onChange={(e) => setPasteAcText(e.target.value)}
                placeholder={`Paste your acceptance criteria here. It will auto-parse scenarios like:

7. Scenario: Navigate to Clients
 Given I am on the menu,
When I tap the Clients Menu Item,
Then I am taken to the Clients destination...

Or numbered items:
1. First criteria...
2. Second criteria...

Or separated by blank lines...`}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  minHeight: '150px',
                  resize: 'vertical'
                }}
              />
              <button
                type="button"
                onClick={() => parseText(pasteAcText, 'paste')}
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  background: 'var(--accent-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Parse & Add Criteria
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={handleAddCriteria}
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            <Plus size={16} />
            Add Acceptance Criteria
          </button>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading && <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Adding...' : 'Add Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
}
