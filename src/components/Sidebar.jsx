import { BarChart3, Home } from 'lucide-react';

export default function Sidebar({ currentView, onNavigate }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Flowlogic QA</h1>
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
      </nav>
    </div>
  );
}
