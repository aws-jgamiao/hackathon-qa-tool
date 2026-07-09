import { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { ticketService, testCaseService } from '../lib/supabase';
import { generateTestCases } from '../lib/claudeService';

export default function AddTicketModal({ onClose, onAdd, onShowToast }) {
  const [form, setForm] = useState({
    id: '',
    name: '',
    type: 'Bug',
    platform: 'iOS',
    status: 'Testing',
    jira_link: '',
    test_case_count: 0,
    test_run_count: 0,
    qa_failed_count: 0
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.id.trim()) newErrors.id = 'Jira Key is required';
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
        setErrors({ id: 'Ticket with this Jira Key already exists' });
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

      // Generate and save test cases
      onShowToast('Generating test cases with AI...', 'info');
      console.log('📋 Starting test case generation for ticket:', newTicket.id);
      try {
        const generatedCases = await generateTestCases(newTicket);
        console.log(`💾 Saving ${generatedCases.length} test cases to database...`);

        // Save test cases to database
        for (let i = 0; i < generatedCases.length; i++) {
          const testCase = generatedCases[i];
          console.log(`[${i + 1}/${generatedCases.length}] Saving: ${testCase.title}`);
          await testCaseService.create({
            ticket_id: newTicket.id,
            title: testCase.title,
            component: testCase.component,
            platform: testCase.platform,
            steps: testCase.steps,
            expected_result: testCase.expectedResult,
            preconditions: testCase.preconditions || '',
            priority: testCase.priority || 'Medium',
            status: 'Draft',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }

        console.log(`✅ All ${generatedCases.length} test cases saved successfully!`);
        onShowToast(`Ticket created with ${generatedCases.length} test cases`, 'success');
      } catch (genErr) {
        console.error('⚠️ Test case generation error:', genErr);
        onShowToast(`Ticket created, but test case generation failed: ${genErr.message}`, 'warning');
      }

      onAdd(newTicket);
    } catch (err) {
      onShowToast('Error adding ticket: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Jira Ticket</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="form-group">
          <label>Jira Key * {errors.id && <span style={{ color: '#c62828' }}>({errors.id})</span>}</label>
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
              <option>In Review</option>
              <option>Testing</option>
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
