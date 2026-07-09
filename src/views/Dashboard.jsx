import { useState, useRef } from 'react';
import { Search, Plus, MoreVertical } from 'lucide-react';
import { mockTickets } from '../mockData';
import ActionMenu from '../components/ActionMenu';
import AddTicketModal from '../components/AddTicketModal';
import { formatDate } from '../utils/dateUtils';

export default function Dashboard({ onSelectTicket, onShowToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showAddTicket, setShowAddTicket] = useState(false);
  const menuRefs = useRef({});

  const filteredTickets = mockTickets.filter(ticket =>
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const ticketActions = [
    { label: 'View Ticket', icon: '👁️' },
    { label: 'Edit Ticket', icon: '✏️' },
    { label: 'Export', icon: '📥' }
  ];

  const handleAction = (action, ticket) => {
    switch (action.label) {
      case 'View Ticket':
        onSelectTicket(ticket);
        break;
      case 'Edit Ticket':
        onShowToast('Edit ticket feature coming soon', 'info');
        break;
      case 'Export':
        onShowToast('Exporting ticket...', 'success');
        break;
    }
    setOpenMenuId(null);
  };

  return (
    <div>
      <div className="action-row">
        <h1>Jira Ticket Dashboard</h1>
        <button className="btn btn-primary" onClick={() => setShowAddTicket(true)}>
          <Plus size={18} />
          Add Ticket
        </button>
      </div>

      {showAddTicket && (
        <AddTicketModal
          onClose={() => setShowAddTicket(false)}
          onAdd={(ticket) => {
            onShowToast('Ticket added successfully', 'success');
            setShowAddTicket(false);
          }}
          onShowToast={onShowToast}
        />
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tickets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search size={18} style={{ color: '#999', marginTop: '6px' }} />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Jira Key</th>
              <th>Ticket Name</th>
              <th>Type</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Test Cases</th>
              <th>Test Runs</th>
              <th>QA Failed</th>
              <th>Updated At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                style={{ cursor: 'pointer' }}
              >
                <td style={{ fontWeight: '500', color: '#0066cc' }}>{ticket.id}</td>
                <td>{ticket.name}</td>
                <td>{ticket.type}</td>
                <td>{ticket.platform}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>{ticket.testCaseCount}</td>
                <td>{ticket.testRunCount}</td>
                <td>
                  {ticket.qaFailedCount > 0 ? (
                    <span className="badge badge-error">{ticket.qaFailedCount}</span>
                  ) : (
                    <span>0</span>
                  )}
                </td>
                <td>{formatDate(ticket.updatedAt)}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <button
                      ref={(el) => { menuRefs.current[ticket.id] = el; }}
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === ticket.id ? null : ticket.id);
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === ticket.id && (
                      <ActionMenu
                        actions={ticketActions}
                        onAction={(action) => handleAction(action, ticket)}
                        triggerRef={menuRefs.current[ticket.id]}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
