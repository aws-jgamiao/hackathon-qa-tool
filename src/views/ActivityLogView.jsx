import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { activityLogService, ticketService } from '../lib/supabase';
import { formatDate } from '../utils/dateUtils';

export default function ActivityLogView() {
  const [allActivityLogs, setAllActivityLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterTicketId, setFilterTicketId] = useState('all');
  const [filterActionType, setFilterActionType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    loadActivityLogs();
    loadTickets();
  }, [currentPage]);

  useEffect(() => {
    filterLogs();
  }, [allActivityLogs, filterTicketId, filterActionType]);

  const loadActivityLogs = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * itemsPerPage;
      const result = await activityLogService.getAll(itemsPerPage, offset);
      setAllActivityLogs(result.data || []);
      setTotalCount(result.count || 0);
    } catch (err) {
      console.error('Failed to load activity logs:', err);
      setAllActivityLogs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const loadTickets = async () => {
    try {
      const data = await ticketService.getAll();
      setTickets(data || []);
    } catch (err) {
      console.error('Failed to load tickets:', err);
      setTickets([]);
    }
  };

  const filterLogs = () => {
    let filtered = allActivityLogs;

    if (filterTicketId !== 'all') {
      filtered = filtered.filter(log => log.ticket_id === filterTicketId);
    }

    if (filterActionType !== 'all') {
      filtered = filtered.filter(log => log.action_type === filterActionType);
    }

    setFilteredLogs(filtered);
  };

  const getActionLabel = (actionType) => {
    const labels = {
      'ticket_created': 'Ticket Created',
      'ticket_status_changed': 'Status Changed',
      'test_case_created': 'Test Case Created',
      'test_case_deleted': 'Test Case Deleted',
      'test_case_approved': 'Test Case Approved',
      'test_run_created': 'Test Run Created',
      'test_run_passed': 'Test Run Passed',
      'test_run_failed': 'Test Run Failed',
      'test_run_deleted': 'Test Run Deleted'
    };
    return labels[actionType] || actionType.replace(/_/g, ' ').toUpperCase();
  };

  const getActionColor = (actionType) => {
    switch (actionType) {
      case 'ticket_created':
      case 'test_case_created':
      case 'test_run_created':
        return '#0066cc';
      case 'ticket_status_changed':
        return '#f57c00';
      case 'test_case_deleted':
      case 'test_run_deleted':
        return '#c62828';
      case 'test_case_approved':
      case 'test_run_passed':
        return '#2e7d32';
      case 'test_run_failed':
        return '#f57c00';
      default:
        return '#666';
    }
  };

  const getTicketName = (ticketId) => {
    const ticket = tickets.find(t => t.id === ticketId);
    return ticket ? `${ticket.id} - ${ticket.name}` : ticketId;
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div>
      <div className="card">
        <h2>Global Activity Log</h2>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '4px', marginBottom: '20px' }}>
          View all QA activities across all tickets
        </p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '6px', color: '#666' }}>
              Filter by Ticket
            </label>
            <select
              value={filterTicketId}
              onChange={(e) => {
                setFilterTicketId(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            >
              <option value="all">All Tickets</option>
              {tickets.map((ticket) => (
                <option key={ticket.id} value={ticket.id}>
                  {ticket.id} - {ticket.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '6px', color: '#666' }}>
              Filter by Action
            </label>
            <select
              value={filterActionType}
              onChange={(e) => {
                setFilterActionType(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            >
              <option value="all">All Actions</option>
              <option value="ticket_created">Ticket Created</option>
              <option value="ticket_status_changed">Status Changed</option>
              <option value="test_case_created">Test Case Created</option>
              <option value="test_case_approved">Test Case Approved</option>
              <option value="test_case_deleted">Test Case Deleted</option>
              <option value="test_run_created">Test Run Created</option>
              <option value="test_run_passed">Test Run Passed</option>
              <option value="test_run_failed">Test Run Failed</option>
              <option value="test_run_deleted">Test Run Deleted</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
          Showing {filteredLogs.length} of {totalCount} total activities • Page {currentPage} of {totalPages}
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666' }}>
            Loading activity logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666' }}>
            No activities found
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Action</th>
                <th>Description</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontWeight: '500', color: '#0066cc' }}>
                    {getTicketName(log.ticket_id)}
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: getActionColor(log.action_type) + '20',
                        color: getActionColor(log.action_type),
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {getActionLabel(log.action_type)}
                    </span>
                  </td>
                  <td>{log.description}</td>
                  <td style={{ color: '#666', fontSize: '14px', whiteSpace: 'nowrap' }}>
                    {formatDate(log.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="card" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  className={`btn ${currentPage === pageNum ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
