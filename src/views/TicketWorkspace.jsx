import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { testCaseService, testRunService, ticketService, activityLogService } from '../lib/supabase';
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
  const [currentTicket, setCurrentTicket] = useState(ticket);
  const [activeTab, setActiveTab] = useState('test-cases');
  const [testCases, setTestCases] = useState([]);
  const [testRuns, setTestRuns] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentTicket(ticket);
  }, [ticket]);

  useEffect(() => {
    if (currentTicket) {
      loadTestCases();
      loadTestRuns();
      loadActivityLogs();
    }
  }, [currentTicket]);

  const loadTestCases = async () => {
    try {
      setLoading(true);
      const data = await testCaseService.getByTicketId(currentTicket.id);
      console.log('📥 Loaded test cases:', data);
      setTestCases(data || []);
    } catch (err) {
      console.error('Failed to load test cases:', err);
      setTestCases([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTestRuns = async () => {
    try {
      const data = await testRunService.getByTicketId(currentTicket.id);
      console.log('📥 Loaded test runs:', data);
      setTestRuns(data || []);
    } catch (err) {
      console.error('Failed to load test runs:', err);
      setTestRuns([]);
    }
  };

  const loadActivityLogs = async () => {
    try {
      const data = await activityLogService.getByTicketId(currentTicket.id);
      setActivityLogs(data || []);
    } catch (err) {
      console.error('Failed to load activity logs:', err);
      setActivityLogs([]);
    }
  };

  if (!ticket) {
    return <div>Select a ticket first</div>;
  }

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedTicket = await ticketService.update(currentTicket.id, {
        status: newStatus,
        updated_at: new Date().toISOString()
      });

      // Create activity log for status change
      await activityLogService.create(
        ticket.id,
        'ticket_status_changed',
        `Ticket status changed to: ${newStatus}`,
        ticket.id,
        'ticket'
      );

      onShowToast(`Ticket status updated to ${newStatus}`, 'success');

      // Navigate back to dashboard to see the updated status
      setTimeout(() => onNavigateToDashboard(), 500);
    } catch (err) {
      console.error('Failed to update ticket status:', err);
      onShowToast('Failed to update ticket status: ' + err.message, 'error');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'ticket-workspace':
        return (
          <>
            <TicketHeader ticket={currentTicket} onStatusChange={handleStatusChange} />
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
                onDelete={async (testRunId) => {
                  try {
                    await testRunService.delete(testRunId);
                    const newRuns = testRuns.filter(tr => tr.id !== testRunId);
                    setTestRuns(newRuns);

                    // Update ticket test run count
                    await ticketService.update(currentTicket.id, {
                      test_run_count: newRuns.length,
                      updated_at: new Date().toISOString()
                    });

                    onShowToast('Test run deleted', 'success');
                  } catch (err) {
                    console.error('Failed to delete test run:', err);
                    onShowToast('Failed to delete test run: ' + err.message, 'error');
                  }
                }}
              />
            )}
          </>
        );
      case 'add-test-case':
        return (
          <AddEditTestCase
            ticket={ticket}
            testCase={null}
            onSave={async (testCase) => {
              try {
                // Generate sequential ID based on existing test cases
                const nextId = testCases.length + 1;
                const sequentialId = `TC-${String(nextId).padStart(3, '0')}`;

                // Add ticket_id and generate sequential ID
                const caseWithTicket = {
                  ...testCase,
                  id: sequentialId,
                  ticket_id: ticket.id
                };
                // Save to database
                const saved = await testCaseService.create(caseWithTicket);
                // Update local state
                const updated = [...testCases, saved];
                setTestCases(updated);

                // Update ticket test case count
                await ticketService.update(currentTicket.id, {
                  test_case_count: updated.length,
                  updated_at: new Date().toISOString()
                });

                // Create activity log
                await activityLogService.create(
                  currentTicket.id,
                  'test_case_created',
                  `Test case created: ${testCase.title}`,
                  sequentialId,
                  'test_case'
                );
                const newLogs = await activityLogService.getByTicketId(ticket.id);
                setActivityLogs(newLogs);

                setCurrentView('ticket-workspace');
                onShowToast('Test case added successfully', 'success');
              } catch (err) {
                console.error('Failed to add test case:', err);
                onShowToast('Failed to add test case: ' + err.message, 'error');
              }
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
            onSave={async (updated) => {
              try {
                // Save to database
                await testCaseService.update(updated.id, updated);

                // Update local state
                const idx = testCases.findIndex(tc => tc.id === updated.id);
                if (idx >= 0) {
                  const newCases = [...testCases];
                  newCases[idx] = updated;
                  setTestCases(newCases);
                }
                setCurrentView('view-test-case');
                onShowToast('Test case updated successfully', 'success');
              } catch (err) {
                console.error('Failed to update test case:', err);
                onShowToast('Failed to update test case: ' + err.message, 'error');
              }
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
            onDuplicate={async (duplicated) => {
              try {
                const saved = await testCaseService.create(duplicated);
                const newCases = [...testCases, saved];
                setTestCases(newCases);
                onShowToast('Test case duplicated successfully', 'success');
              } catch (err) {
                console.error('Failed to duplicate test case:', err);
                onShowToast('Failed to duplicate test case: ' + err.message, 'error');
              }
            }}
            onApprove={async (approved) => {
              try {
                // Save approved test case to database
                await testCaseService.update(approved.id, approved);

                const idx = testCases.findIndex(tc => tc.id === approved.id);
                if (idx >= 0) {
                  const newCases = [...testCases];
                  newCases[idx] = approved;
                  setTestCases(newCases);

                  // Create test runs for each platform
                  const platforms = currentTicket.platform.split(',').map(p => p.trim());
                  const newRuns = [...testRuns];

                  for (let idx = 0; idx < platforms.length; idx++) {
                    const platform = platforms[idx];
                    // Generate unique ID using timestamp to avoid duplicates
                    const newRun = {
                      id: `TR-${Date.now()}-${idx + 1}`,
                      ticket_id: currentTicket.id,
                      test_case_id: approved.id,
                      platform: platform,
                      version: 'V1',
                      status: 'Not Run',
                      qa_failed_count: 0,
                      executed_by: 'Current User',
                      executed_at: new Date().toISOString()
                    };
                    // Save test run to database
                    const saved = await testRunService.create(newRun);
                    newRuns.push(saved);
                  }

                  setTestRuns(newRuns);

                  // Update ticket test run count
                  await ticketService.update(currentTicket.id, {
                    test_run_count: newRuns.length,
                    updated_at: new Date().toISOString()
                  });

                  // Create activity log for test case approval
                  await activityLogService.create(
                    ticket.id,
                    'test_case_approved',
                    `Test case approved: ${approved.title} - Created ${newRuns.length} test runs`,
                    approved.id,
                    'test_case'
                  );
                }
                setSelectedTestCase(approved);

                // Reload activity logs
                const newLogs = await activityLogService.getByTicketId(ticket.id);
                setActivityLogs(newLogs);

                onShowToast('Test case approved and test runs created', 'success');
              } catch (err) {
                console.error('Failed to approve test case:', err);
                onShowToast('Failed to approve test case: ' + err.message, 'error');
              }
            }}
            onDelete={async () => {
              try {
                const deletedCaseTitle = selectedTestCase.title;
                await testCaseService.delete(selectedTestCase.id);
                const newCases = testCases.filter(tc => tc.id !== selectedTestCase.id);
                setTestCases(newCases);

                // Update ticket test case count
                await ticketService.update(currentTicket.id, {
                  test_case_count: newCases.length,
                  updated_at: new Date().toISOString()
                });

                // Create activity log
                await activityLogService.create(
                  currentTicket.id,
                  'test_case_deleted',
                  `Test case deleted: ${deletedCaseTitle}`,
                  selectedTestCase.id,
                  'test_case'
                );
                const newLogs = await activityLogService.getByTicketId(ticket.id);
                setActivityLogs(newLogs);

                setCurrentView('ticket-workspace');
                onShowToast('Test case deleted', 'success');
              } catch (err) {
                console.error('Failed to delete test case:', err);
                onShowToast('Failed to delete test case: ' + err.message, 'error');
              }
            }}
            onShowToast={onShowToast}
          />
        );
      case 'execute-test-run':
        return (
          <ExecuteTestRun
            ticket={ticket}
            testRun={selectedTestRun}
            testCase={testCases.find(tc => tc.id === selectedTestRun?.test_case_id)}
            onBack={() => setCurrentView('view-test-run')}
            onSave={async (updated) => {
              try {
                await testRunService.update(updated.id, updated);
                const idx = testRuns.findIndex(tr => tr.id === updated.id);
                if (idx >= 0) {
                  const newRuns = [...testRuns];
                  newRuns[idx] = updated;
                  setTestRuns(newRuns);
                }
                setSelectedTestRun(updated);
                onShowToast('Test run saved', 'success');
                setCurrentView('view-test-run');
              } catch (err) {
                console.error('Failed to save test run:', err);
                onShowToast('Failed to save test run: ' + err.message, 'error');
              }
            }}
            onMarkQAFailed={async (failed) => {
              try {
                await testRunService.update(failed.id, failed);
                const idx = testRuns.findIndex(tr => tr.id === failed.id);
                if (idx >= 0) {
                  const newRuns = [...testRuns];
                  newRuns[idx] = failed;
                  setTestRuns(newRuns);
                  // Update ticket's QA failed count
                  const qaFailedCount = newRuns.filter(tr => tr.status === 'QA Failed').length;
                  const updated = { ...currentTicket, qa_failed_count: qaFailedCount };
                  await ticketService.update(currentTicket.id, updated);
                  setCurrentTicket(updated);
                }
                setSelectedTestRun(failed);
                // Log activity
                await activityLogService.create(
                  currentTicket.id,
                  'test_run_failed',
                  `Test run ${failed.id} marked as QA Failed (Attempt ${failed.qa_failed_count})`,
                  failed.id,
                  'test_run'
                );

                onShowToast('Test run marked as QA Failed', 'success');
                setCurrentView('view-test-run');
              } catch (err) {
                console.error('Failed to mark as QA Failed:', err);
                onShowToast('Failed to mark as QA Failed: ' + err.message, 'error');
              }
            }}
            onApprove={async (approved) => {
              try {
                await testRunService.update(approved.id, approved);
                const idx = testRuns.findIndex(tr => tr.id === approved.id);
                if (idx >= 0) {
                  const newRuns = [...testRuns];
                  newRuns[idx] = approved;
                  setTestRuns(newRuns);
                }
                setSelectedTestRun(approved);
                // Log activity
                await activityLogService.create(
                  currentTicket.id,
                  'test_run_passed',
                  `Test run ${approved.id} marked as Passed`,
                  approved.id,
                  'test_run'
                );

                onShowToast('Test run approved', 'success');
                setCurrentView('view-test-run');
              } catch (err) {
                console.error('Failed to approve:', err);
                onShowToast('Failed to approve: ' + err.message, 'error');
              }
            }}
            onShowToast={onShowToast}
          />
        );
      case 'view-test-run':
        return (
          <ViewTestRun
            ticket={ticket}
            testRun={selectedTestRun}
            testCase={testCases.find(tc => tc.id === selectedTestRun?.test_case_id)}
            allTestRuns={testRuns}
            onBack={() => {
              setCurrentView('ticket-workspace');
              setActiveTab('test-runs');
              setSelectedTestRun(null);
            }}
            onEdit={() => setCurrentView('execute-test-run')}
            onCreateRetest={async (retest) => {
              try {
                const saved = await testRunService.create(retest);
                const newRuns = [...testRuns, saved];
                setTestRuns(newRuns);

                // Update ticket test run count
                await ticketService.update(currentTicket.id, {
                  test_run_count: newRuns.length,
                  updated_at: new Date().toISOString()
                });

                // Log activity
                await activityLogService.create(
                  currentTicket.id,
                  'test_run_created',
                  `Retest run ${saved.id} created (${saved.version})`,
                  saved.id,
                  'test_run'
                );

                onShowToast('Retest run created', 'success');
                setSelectedTestRun(saved);
                setCurrentView('view-test-run');
              } catch (err) {
                console.error('Failed to create retest:', err);
                onShowToast('Failed to create retest: ' + err.message, 'error');
              }
            }}
            onMarkQAFailed={async (failed) => {
              try {
                await testRunService.update(failed.id, failed);
                const idx = testRuns.findIndex(tr => tr.id === failed.id);
                if (idx >= 0) {
                  const newRuns = [...testRuns];
                  newRuns[idx] = failed;
                  setTestRuns(newRuns);
                  // Update ticket's QA failed count
                  const qaFailedCount = newRuns.filter(tr => tr.status === 'QA Failed').length;
                  const updated = { ...currentTicket, qa_failed_count: qaFailedCount };
                  await ticketService.update(currentTicket.id, updated);
                  setCurrentTicket(updated);
                }
                setSelectedTestRun(failed);
                // Log activity
                await activityLogService.create(
                  currentTicket.id,
                  'test_run_failed',
                  `Test run ${failed.id} marked as QA Failed (Attempt ${failed.qa_failed_count})`,
                  failed.id,
                  'test_run'
                );

                onShowToast('Test run marked as QA Failed', 'success');
                setCurrentView('view-test-run');
              } catch (err) {
                console.error('Failed to mark as QA Failed:', err);
                onShowToast('Failed to mark as QA Failed: ' + err.message, 'error');
              }
            }}
            onApprove={async (approved) => {
              try {
                await testRunService.update(approved.id, approved);
                const idx = testRuns.findIndex(tr => tr.id === approved.id);
                if (idx >= 0) {
                  const newRuns = [...testRuns];
                  newRuns[idx] = approved;
                  setTestRuns(newRuns);

                  // If this is a retest (V2+) that passed, update previous version
                  const currentVersion = parseInt(approved.version.substring(1));
                  if (currentVersion > 1 && approved.status === 'Passed') {
                    const previousVersion = `V${currentVersion - 1}`;
                    const prevIdx = newRuns.findIndex(
                      tr => tr.test_case_id === approved.test_case_id && tr.version === previousVersion
                    );
                    if (prevIdx >= 0) {
                      const updated = {
                        ...newRuns[prevIdx],
                        test_notes: (newRuns[prevIdx].test_notes || '') +
                          `\n[Resolved in ${approved.version} - Marked as Passed]`,
                        updated_at: new Date().toISOString()
                      };
                      await testRunService.update(newRuns[prevIdx].id, updated);
                      newRuns[prevIdx] = updated;
                    }
                  }
                  setTestRuns(newRuns);
                }
                setSelectedTestRun(approved);
                // Log activity
                await activityLogService.create(
                  currentTicket.id,
                  'test_run_passed',
                  `Test run ${approved.id} marked as Passed`,
                  approved.id,
                  'test_run'
                );

                onShowToast('Test run approved', 'success');
                setCurrentView('view-test-run');
              } catch (err) {
                console.error('Failed to approve:', err);
                onShowToast('Failed to approve: ' + err.message, 'error');
              }
            }}
            onDelete={async () => {
              try {
                await testRunService.delete(selectedTestRun.id);
                const newRuns = testRuns.filter(tr => tr.id !== selectedTestRun.id);
                setTestRuns(newRuns);

                // Update ticket test run count
                await ticketService.update(currentTicket.id, {
                  test_run_count: newRuns.length,
                  updated_at: new Date().toISOString()
                });

                // Log activity
                await activityLogService.create(
                  currentTicket.id,
                  'test_run_deleted',
                  `Test run deleted: ${selectedTestRun.id}`,
                  selectedTestRun.id,
                  'test_run'
                );

                setCurrentView('ticket-workspace');
                setActiveTab('test-runs');
                setSelectedTestRun(null);
                onShowToast('Test run deleted', 'success');
              } catch (err) {
                console.error('Failed to delete test run:', err);
                onShowToast('Failed to delete test run: ' + err.message, 'error');
              }
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
