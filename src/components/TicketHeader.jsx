import { ExternalLink } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

export default function TicketHeader({ ticket }) {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'In Progress':
        return 'badge-info';
      case 'In Review':
        return 'badge-warning';
      case 'Testing':
        return 'badge-info';
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
        {ticket.jiraLink ? (
          <a
            href={ticket.jiraLink}
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
          <div>
            <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Assignee</div>
          <div className="detail-value">Team QA</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Test Cases</div>
          <div className="detail-value">{ticket.testCaseCount}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Test Runs</div>
          <div className="detail-value">{ticket.testRunCount}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">QA Failed Count</div>
          <div className="detail-value">{ticket.qaFailedCount}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Updated At</div>
          <div className="detail-value">{formatDate(ticket.updatedAt)}</div>
        </div>
      </div>
    </div>
  );
}
