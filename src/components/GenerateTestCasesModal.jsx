import { useState } from 'react';
import { X, Lightbulb, Loader } from 'lucide-react';
import { generateTestCases } from '../lib/claudeService';

export default function GenerateTestCasesModal({ ticket, onClose, onAddTestCases, onShowToast }) {
  const [loading, setLoading] = useState(false);
  const [generatedCases, setGeneratedCases] = useState([]);
  const [selectedCases, setSelectedCases] = useState(new Set());
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const cases = await generateTestCases(ticket);
      setGeneratedCases(cases);
      setSelectedCases(new Set(cases.map(c => c.id)));
    } catch (err) {
      setError(err.message);
      onShowToast?.('Failed to generate test cases: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSelected = () => {
    const toAdd = generatedCases.filter(tc => selectedCases.has(tc.id));
    if (toAdd.length > 0) {
      onAddTestCases?.(toAdd);
      onShowToast?.(`Added ${toAdd.length} test cases`, 'success');
      onClose();
    }
  };

  const toggleCase = (id) => {
    const newSelected = new Set(selectedCases);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedCases(newSelected);
  };

  if (generatedCases.length > 0) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '80vh', overflow: 'auto' }}>
          <div className="modal-header">
            <h2>✅ Generated Test Cases</h2>
            <button className="btn-icon" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#666', marginBottom: '16px' }}>
              Claude generated {generatedCases.length} test cases. Select which ones to add:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflow: 'auto' }}>
              {generatedCases.map((tc) => (
                <div
                  key={tc.id}
                  className="card"
                  style={{
                    background: selectedCases.has(tc.id) ? 'var(--badge-bg)' : 'var(--bg-tertiary)',
                    cursor: 'pointer',
                    borderColor: selectedCases.has(tc.id) ? 'var(--accent-color)' : 'var(--border-color)'
                  }}
                  onClick={() => toggleCase(tc.id)}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="checkbox"
                      checked={selectedCases.has(tc.id)}
                      onChange={() => toggleCase(tc.id)}
                      style={{ marginTop: '4px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 6px 0', color: '#333' }}>{tc.title}</h4>
                      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>
                        <strong>Component:</strong> {tc.component} | <strong>Priority:</strong> {tc.priority}
                      </p>
                      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666', whiteSpace: 'pre-wrap' }}>
                        {tc.steps}
                      </p>
                      <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>
                        <strong>Expected:</strong> {tc.expectedResult}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAddSelected}
              disabled={selectedCases.size === 0}
              style={{ opacity: selectedCases.size === 0 ? 0.5 : 1 }}
            >
              Add {selectedCases.size} Test Cases
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>Generate Test Cases with AI</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="card" style={{ background: 'var(--bg-tertiary)', borderColor: '#c62828', borderLeft: '4px solid #c62828', marginBottom: '16px' }}>
            <p style={{ color: '#c62828', margin: 0 }}>{error}</p>
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '12px', color: '#0066cc' }}>
            <Lightbulb size={18} style={{ display: 'inline', marginRight: '8px' }} />
            AI-Powered Test Case Generation
          </h3>

          <div className="card" style={{ background: 'var(--badge-bg)', borderColor: 'var(--accent-color)' }}>
            <p style={{ marginBottom: '12px', fontSize: '14px' }}>
              Claude will analyze your ticket and generate comprehensive test cases covering:
            </p>

            <ul style={{ fontSize: '14px', lineHeight: '1.8', marginLeft: '20px', color: 'var(--text-primary)' }}>
              <li>Happy path scenarios</li>
              <li>Edge cases and error handling</li>
              <li>User role-based scenarios</li>
              <li>Compliance requirements</li>
              <li>Best practices for mobile QA</li>
            </ul>

            <p style={{ fontSize: '13px', color: '#666', marginTop: '12px', marginBottom: 0 }}>
              The generated test cases will be in Draft status and can be edited before approval.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {loading && <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Generating...' : 'Generate Test Cases'}
          </button>
        </div>
      </div>
    </div>
  );
}
