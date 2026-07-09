import { ExternalLink } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

export default function TicketHeader({ ticket, onStatusChange }) {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Open':
        return 'badge-gray';
      case 'In Progress':
        return 'badge-info';
      case 'Done':
        return 'badge-success';
      default:
        return 'badge-gray';
    }
  };

  return (
    <div className="card">
      <div className="action-row">
        <div>
          <h2>{ticket.id}</h2>
          <p style={{ color: '#666', marginTop: '4px', fontSize: '16px' }}>
            {ticket.name}
          </p>
        </div>
        {ticket.jira_link ? (
          <a
            href={ticket.jira_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink size={16} />
            View in Jira
          </a>
        ) : (
          <button className="btn btn-secondary" disabled style={{ opacity: 0.5 }}>
            <ExternalLink size={16} />
            No Jira Link
          </button>
        )}
      </div>

      <div className="details-grid">
        <div className="detail-item">
          <div className="detail-label">Type</div>
          <div className="detail-value">{ticket.type}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Platform</div>
          <div className="detail-value">{ticket.platform}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Status</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
              {ticket.status}
            </span>
            {onStatusChange && (
              <div style={{ display: 'flex', gap: '4px' }}>
                {['Open', 'In Progress', 'Done'].map((status) => (
                  <button
                    key={status}
                    className="btn btn-secondary btn-sm"
                    onClick={() => onStatusChange(status)}
                    style={{
                      padding: '4px 12px',
                      fontSize: '12px',
                      opacity: ticket.status === status ? 1 : 0.6
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Assignee</div>
          <div className="detail-value">Team QA</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Test Cases</div>
          <div className="detail-value">{ticket.test_case_count || 0}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Test Runs</div>
          <div className="detail-value">{ticket.test_run_count || 0}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">QA Failed Count</div>
          <div className="detail-value">{ticket.qa_failed_count || 0}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Updated At</div>
          <div className="detail-value">{formatDate(ticket.updated_at)}</div>
        </div>
      </div>
    </div>
  );
}
