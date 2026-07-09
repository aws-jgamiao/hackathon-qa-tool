import { X, Lightbulb, Copy } from 'lucide-react';

export default function GenerateTestCasesModal({ ticket, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2>Generate Test Cases with AI</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '12px', color: '#0066cc' }}>
            <Lightbulb size={18} style={{ display: 'inline', marginRight: '8px' }} />
            Using Your NDIS Test Case Skill
          </h3>

          <div className="card" style={{ background: '#f0f7ff', borderColor: '#0066cc' }}>
            <p style={{ marginBottom: '12px', fontSize: '14px' }}>
              Your NDIS QA skill will ask clarifying questions, then generate structured test cases in Excel format.
            </p>

            <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Here's how:</h4>

            <ol style={{ fontSize: '14px', lineHeight: '1.8', marginLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Copy ticket details:</strong>
                <pre style={{
                  background: 'white',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  marginTop: '6px',
                  fontSize: '12px',
                  overflow: 'auto',
                  border: '1px solid #e5e5e5'
                }}>
Ticket: {ticket.id}
Name: {ticket.name}
Type: {ticket.type}
Platform: {ticket.platform}
Description: [Add ticket description]
                </pre>
              </li>

              <li style={{ marginBottom: '8px' }}>
                <strong>Open Claude Code</strong> and paste:
                <pre style={{
                  background: 'white',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  marginTop: '6px',
                  fontSize: '12px',
                  overflow: 'auto',
                  border: '1px solid #e5e5e5'
                }}>
Create test cases for this NDIS/Flowlogic ticket:

[Paste ticket details above]
                </pre>
              </li>

              <li style={{ marginBottom: '8px' }}>
                <strong>The skill will:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '6px' }}>
                  <li>Ask clarifying questions (component, user roles, edge cases)</li>
                  <li>Generate structured test cases</li>
                  <li>Output Excel file (.xlsx)</li>
                </ul>
              </li>

              <li style={{ marginBottom: '8px' }}>
                <strong>Copy the test cases</strong> from Excel
              </li>

              <li>
                <strong>Paste into the app</strong> - Create each test case manually in the "Add Test Case" form
              </li>
            </ol>
          </div>
        </div>

        <div className="card" style={{ background: '#f9f9f9' }}>
          <h4 style={{ marginBottom: '12px' }}>💡 Tips</h4>
          <ul style={{ fontSize: '14px', lineHeight: '1.6', marginLeft: '20px', color: '#666' }}>
            <li>The skill is NDIS-specific — it asks about compliance, user roles, edge cases</li>
            <li>Answer all clarifying questions for better test cases</li>
            <li>You can generate multiple variations (happy path, negative, edge cases)</li>
            <li>Edit generated test cases in the app before approving them</li>
          </ul>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              const text = `Create test cases for this NDIS/Flowlogic ticket:\n\nTicket: ${ticket.id}\nName: ${ticket.name}\nType: ${ticket.type}\nPlatform: ${ticket.platform}\n\n[Please ask clarifying questions about:\n- Component/module\n- User roles involved\n- Edge cases\n- Regression scenarios]`;
              navigator.clipboard.writeText(text);
              // Show copied toast
              alert('Ticket details copied! Paste in Claude Code to start');
            }}
          >
            <Copy size={16} />
            Copy Ticket Details
          </button>
        </div>
      </div>
    </div>
  );
}
