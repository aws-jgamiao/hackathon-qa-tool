import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { mockTestCases, mockTestRuns, getTestCaseById, getTestRunById } from '../mockData';
import { formatDate } from '../utils/dateUtils';
import TicketHeader from '../components/TicketHeader';
import TestCasesTab from '../components/TestCasesTab';
import TestRunsTab from '../components/TestRunsTab';
import AddEditTestCase from '../components/AddEditTestCase';
import ViewTestCase from '../components/ViewTestCase';
import ExecuteTestRun from '../components/ExecuteTestRun';
import ViewTestRun from '../components/ViewTestRun';

export default function TicketWorkspace({
  ticket,
  currentView,
  setCurrentView,
  selectedTestCase,
  setSelectedTestCase,
  selectedTestRun,
  setSelectedTestRun,
  onSelectTestCase,
  onSelectTestRun,
  onNavigateToDashboard,
  onShowToast,
  appState,
  setAppState
}) {
  const [activeTab, setActiveTab] = useState('test-cases');
  const [testCases, setTestCases] = useState([]);
  const [testRuns, setTestRuns] = useState([]);

  useEffect(() => {
    if (ticket) {
      setTestCases(mockTestCases[ticket.id] || []);
      setTestRuns(mockTestRuns[ticket.id] || []);
    }
  }, [ticket]);

  if (!ticket) {
    return <div>Select a ticket first</div>;
  }

  const renderView = () => {
    switch (currentView) {
      case 'ticket-workspace':
        return (
          <>
            <TicketHeader ticket={ticket} />
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'test-cases' ? 'active' : ''}`}
                onClick={() => setActiveTab('test-cases')}
              >
                Test Cases
              </button>
              <button
                className={`tab ${activeTab === 'test-runs' ? 'active' : ''}`}
                onClick={() => setActiveTab('test-runs')}
              >
                Test Runs
              </button>
            </div>
            {activeTab === 'test-cases' && (
              <TestCasesTab
                ticket={ticket}
                testCases={testCases}
                setTestCases={setTestCases}
                onSelectTestCase={onSelectTestCase}
                onShowToast={onShowToast}
                setCurrentView={setCurrentView}
              />
            )}
            {activeTab === 'test-runs' && (
              <TestRunsTab
                ticket={ticket}
                testRuns={testRuns}
                onSelectTestRun={onSelectTestRun}
                onShowToast={onShowToast}
                setCurrentView={setCurrentView}
              />
            )}
          </>
        );
      case 'add-test-case':
        return (
          <AddEditTestCase
            ticket={ticket}
            testCase={null}
            onSave={(testCase) => {
              const updated = [...testCases];
              if (!updated.find(tc => tc.id === testCase.id)) {
                updated.push(testCase);
                setTestCases(updated);
              }
              setCurrentView('ticket-workspace');
              onShowToast('Test case added successfully', 'success');
            }}
            onCancel={() => setCurrentView('ticket-workspace')}
            onShowToast={onShowToast}
          />
        );
      case 'edit-test-case':
        return (
          <AddEditTestCase
            ticket={ticket}
            testCase={selectedTestCase}
            onSave={(updated) => {
              const idx = testCases.findIndex(tc => tc.id === updated.id);
              if (idx >= 0) {
                const newCases = [...testCases];
                newCases[idx] = updated;
                setTestCases(newCases);
              }
              setCurrentView('view-test-case');
              onShowToast('Test case updated successfully', 'success');
            }}
            onCancel={() => setCurrentView('view-test-case')}
            onShowToast={onShowToast}
          />
        );
      case 'view-test-case':
        return (
          <ViewTestCase
            ticket={ticket}
            testCase={selectedTestCase}
            onBack={() => {
              setCurrentView('ticket-workspace');
              setSelectedTestCase(null);
            }}
            onEdit={() => setCurrentView('edit-test-case')}
            onDuplicate={(duplicated) => {
              const newCases = [...testCases, duplicated];
              setTestCases(newCases);
              onShowToast('Test case duplicated successfully', 'success');
            }}
            onApprove={(approved) => {
              const idx = testCases.findIndex(tc => tc.id === approved.id);
              if (idx >= 0) {
                const newCases = [...testCases];
                newCases[idx] = approved;
                setTestCases(newCases);

                // Create test run automatically
                const newRun = {
                  id: `RUN-${Math.floor(Math.random() * 10000)}`,
                  testCaseId: approved.id,
                  testCaseTitle: approved.title,
                  platform: ticket.platform,
                  version: 'V1',
                  status: 'Not Run',
                  qaFailedCount: 0,
                  executedBy: 'Current User',
                  executedAt: new Date().toISOString(),
                  actualResults: [],
                  steps: []
                };
                const newRuns = [...testRuns, newRun];
                setTestRuns(newRuns);
              }
              setSelectedTestCase(approved);
              onShowToast('Test case approved and test run created', 'success');
            }}
            onDelete={() => {
              const newCases = testCases.filter(tc => tc.id !== selectedTestCase.id);
              setTestCases(newCases);
              setCurrentView('ticket-workspace');
              onShowToast('Test case deleted', 'success');
            }}
            onShowToast={onShowToast}
          />
        );
      case 'execute-test-run':
        return (
          <ExecuteTestRun
            ticket={ticket}
            testRun={selectedTestRun}
            testCase={testCases.find(tc => tc.id === selectedTestRun?.testCaseId)}
            onBack={() => setCurrentView('view-test-run')}
            onSave={(updated) => {
              const idx = testRuns.findIndex(tr => tr.id === updated.id);
              if (idx >= 0) {
                const newRuns = [...testRuns];
                newRuns[idx] = updated;
                setTestRuns(newRuns);
              }
              setSelectedTestRun(updated);
              onShowToast('Test run saved', 'success');
            }}
            onMarkQAFailed={(failed) => {
              const idx = testRuns.findIndex(tr => tr.id === failed.id);
              if (idx >= 0) {
                const newRuns = [...testRuns];
                newRuns[idx] = failed;
                setTestRuns(newRuns);
              }
              setSelectedTestRun(failed);
              onShowToast('Test run marked as QA Failed', 'success');
            }}
            onApprove={(approved) => {
              const idx = testRuns.findIndex(tr => tr.id === approved.id);
              if (idx >= 0) {
                const newRuns = [...testRuns];
                newRuns[idx] = approved;
                setTestRuns(newRuns);
              }
              setSelectedTestRun(approved);
              onShowToast('Test run approved', 'success');
            }}
            onShowToast={onShowToast}
          />
        );
      case 'view-test-run':
        return (
          <ViewTestRun
            ticket={ticket}
            testRun={selectedTestRun}
            testCase={testCases.find(tc => tc.id === selectedTestRun?.testCaseId)}
            onBack={() => {
              setCurrentView('ticket-workspace');
              setActiveTab('test-runs');
              setSelectedTestRun(null);
            }}
            onEdit={() => setCurrentView('execute-test-run')}
            onExecute={() => setCurrentView('execute-test-run')}
            onCreateRetest={(retest) => {
              const newRuns = [...testRuns, retest];
              setTestRuns(newRuns);
              onShowToast('Retest run created', 'success');
              setSelectedTestRun(retest);
              setCurrentView('view-test-run');
            }}
            onMarkQAFailed={(failed) => {
              const idx = testRuns.findIndex(tr => tr.id === failed.id);
              if (idx >= 0) {
                const newRuns = [...testRuns];
                newRuns[idx] = failed;
                setTestRuns(newRuns);
              }
              setSelectedTestRun(failed);
              onShowToast('Test run marked as QA Failed', 'success');
            }}
            onApprove={(approved) => {
              const idx = testRuns.findIndex(tr => tr.id === approved.id);
              if (idx >= 0) {
                const newRuns = [...testRuns];
                newRuns[idx] = approved;
                setTestRuns(newRuns);
              }
              setSelectedTestRun(approved);
              onShowToast('Test run approved', 'success');
            }}
            onShowToast={onShowToast}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {(currentView === 'add-test-case' ||
        currentView === 'edit-test-case' ||
        currentView === 'view-test-case' ||
        currentView === 'execute-test-run' ||
        currentView === 'view-test-run') && (
        <button className="back-button" onClick={() => {
          if (currentView === 'edit-test-case' || currentView === 'view-test-case') {
            if (currentView === 'edit-test-case') {
              setCurrentView('view-test-case');
            } else {
              setCurrentView('ticket-workspace');
              setSelectedTestCase(null);
            }
          } else if (currentView === 'execute-test-run' || currentView === 'view-test-run') {
            if (currentView === 'view-test-run') {
              setCurrentView('ticket-workspace');
              setActiveTab('test-runs');
              setSelectedTestRun(null);
            } else {
              setCurrentView('view-test-run');
            }
          } else {
            setCurrentView('ticket-workspace');
            setSelectedTestCase(null);
          }
        }}>
          <ArrowLeft size={18} />
          Back
        </button>
      )}
      {renderView()}
    </div>
  );
}
