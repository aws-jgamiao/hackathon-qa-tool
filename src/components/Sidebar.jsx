import { BarChart3, Home, Clock } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

export default function Sidebar({ currentView, onNavigate }) {
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Flowlogic QA Assistant</h1>
      </div>
      <nav className="sidebar-nav">
        <div
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <Home size={18} />
          <span>Dashboard</span>
        </div>
        <div
          className={`nav-item ${currentView === 'ticket-workspace' ? 'active' : ''}`}
          onClick={() => onNavigate('ticket-workspace')}
        >
          <BarChart3 size={18} />
          <span>Workspace</span>
        </div>
        <div
          className={`nav-item ${currentView === 'activity-log' ? 'active' : ''}`}
          onClick={() => onNavigate('activity-log')}
        >
          <Clock size={18} />
          <span>Activity Log</span>
        </div>
      </nav>
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={toggle}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-hover)',
            color: 'var(--text-primary)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--bg-tertiary)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--bg-hover)';
          }}
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </div>
  );
}
