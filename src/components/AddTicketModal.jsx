import { useState } from 'react';
import { X } from 'lucide-react';

export default function AddTicketModal({ onClose, onAdd, onShowToast }) {
  const [form, setForm] = useState({
    id: '',
    name: '',
    type: 'Bug',
    platform: 'iOS',
    status: 'Testing',
    jiraLink: '',
    testCaseCount: 0,
    testRunCount: 0,
    qaFailedCount: 0,
    updatedAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState({});

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
    if (!form.jiraLink.trim()) newErrors.jiraLink = 'Jira Link is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAdd(form);
    } else {
      onShowToast('Please fill in all required fields', 'error');
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
          <label>Jira Key *</label>
          <input
            type="text"
            value={form.id}
            onChange={(e) => handleChange('id', e.target.value)}
            placeholder="e.g., FLOWDEL-3050"
            style={errors.id ? { borderColor: '#c62828' } : {}}
          />
          {errors.id && <div style={{ color: '#c62828', fontSize: '12px', marginTop: '4px' }}>{errors.id}</div>}
        </div>

        <div className="form-group">
          <label>Ticket Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Fix database connection timeout"
            style={errors.name ? { borderColor: '#c62828' } : {}}
          />
          {errors.name && <div style={{ color: '#c62828', fontSize: '12px', marginTop: '4px' }}>{errors.name}</div>}
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
            <label>Jira Link *</label>
            <input
              type="url"
              value={form.jiraLink}
              onChange={(e) => handleChange('jiraLink', e.target.value)}
              placeholder="https://jira.company.com/browse/FLOWDEL-3050"
              style={errors.jiraLink ? { borderColor: '#c62828' } : {}}
            />
            {errors.jiraLink && <div style={{ color: '#c62828', fontSize: '12px', marginTop: '4px' }}>{errors.jiraLink}</div>}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Add Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
