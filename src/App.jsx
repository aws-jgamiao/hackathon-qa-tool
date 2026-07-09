import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import TicketWorkspace from './views/TicketWorkspace';
import Toast from './components/Toast';
import './index.css';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [selectedTestRun, setSelectedTestRun] = useState(null);
  const [toast, setToast] = useState(null);
  const [appState, setAppState] = useState({
    tickets: [],
    testCases: {},
    testRuns: {}
  });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setSelectedTestCase(null);
    setSelectedTestRun(null);
    setCurrentView('ticket-workspace');
  };

  const handleSelectTestCase = (testCase) => {
    setSelectedTestCase(testCase);
    setCurrentView('view-test-case');
  };

  const handleSelectTestRun = (testRun) => {
    setSelectedTestRun(testRun);
    setCurrentView('view-test-run');
  };

  const navigateToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTicket(null);
    setSelectedTestCase(null);
    setSelectedTestRun(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            onSelectTicket={handleSelectTicket}
            onShowToast={showToast}
          />
        );
      case 'ticket-workspace':
      case 'add-test-case':
      case 'edit-test-case':
      case 'view-test-case':
      case 'execute-test-run':
      case 'view-test-run':
        return (
          <TicketWorkspace
            ticket={selectedTicket}
            currentView={currentView}
            setCurrentView={setCurrentView}
            selectedTestCase={selectedTestCase}
            setSelectedTestCase={setSelectedTestCase}
            selectedTestRun={selectedTestRun}
            setSelectedTestRun={setSelectedTestRun}
            onSelectTestCase={handleSelectTestCase}
            onSelectTestRun={handleSelectTestRun}
            onNavigateToDashboard={navigateToDashboard}
            onShowToast={showToast}
            appState={appState}
            setAppState={setAppState}
          />
        );
      default:
        return <Dashboard onSelectTicket={handleSelectTicket} onShowToast={showToast} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <div className="main-content">
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
