import { useState, useRef, useEffect } from 'react';
import { Search, Plus, MoreVertical, Loader } from 'lucide-react';
import ActionMenu from '../components/ActionMenu';
import AddTicketModal from '../components/AddTicketModal';
import { formatDate } from '../utils/dateUtils';
import { ticketService } from '../lib/supabase';

export default function Dashboard({ onSelectTicket, onShowToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.getAll();
      setTickets(data);
    } catch (err) {
      setError(err.message);
      onShowToast('Failed to load tickets: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto', marginBottom: '16px' }} />
          <p>Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ background: '#ffebee', borderColor: '#c62828' }}>
        <h2 style={{ color: '#c62828' }}>Error Loading Tickets</h2>
        <p>{error}</p>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '12px' }}>
          Make sure you have set up your Supabase database. See DATABASE_SETUP.md for instructions.
        </p>
        <button className="btn btn-primary" onClick={loadTickets} style={{ marginTop: '12px' }}>
          Retry
        </button>
      </div>
    );
  }

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
            setTickets([ticket, ...tickets]);
            setShowAddTicket(false);
            loadTickets();
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
