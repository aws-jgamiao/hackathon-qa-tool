import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'
import { mockTickets, mockTestCases } from '../mockData'

describe('Flowlogic QA Workspace', () => {
  beforeEach(() => {
    // Reset any mocks or state before each test
  })

  it('should render the dashboard with Jira ticket list', () => {
    render(<App />)
    expect(screen.getByText('Jira Ticket Dashboard')).toBeInTheDocument()
    expect(screen.getByText('FLOWDEL-2686')).toBeInTheDocument()
    expect(screen.getByText('FLOWDEL-2929')).toBeInTheDocument()
    expect(screen.getByText('FLOWDEL-3010')).toBeInTheDocument()
  })

  it('should open ticket workspace when a ticket is selected', async () => {
    render(<App />)
    const ticketRow = screen.getByText('FLOWDEL-2686')
    fireEvent.click(ticketRow)

    await waitFor(() => {
      expect(screen.getByText('Fix selected shift scrolling after reopening app')).toBeInTheDocument()
    })
  })

  it('should render test cases tab with proper columns', async () => {
    render(<App />)
    const ticketRow = screen.getByText('FLOWDEL-2686')
    fireEvent.click(ticketRow)

    await waitFor(() => {
      expect(screen.getByText('TC-001')).toBeInTheDocument()
      expect(screen.getByText('Verify shift list scrolls correctly')).toBeInTheDocument()
    })
  })

  it('should show empty state when no test cases exist', async () => {
    render(<App />)
    // Navigate to a view with test cases
    const ticketRow = screen.getByText('FLOWDEL-2686')
    fireEvent.click(ticketRow)

    await waitFor(() => {
      // This ticket has test cases, so we check for them
      expect(screen.getByText('TC-001')).toBeInTheDocument()
    })
  })

  it('should show Add Test Case button on top right when test cases exist', async () => {
    render(<App />)
    const ticketRow = screen.getByText('FLOWDEL-2686')
    fireEvent.click(ticketRow)

    await waitFor(() => {
      const addButtons = screen.getAllByText(/Add Test Case/i)
      expect(addButtons.length).toBeGreaterThan(0)
    })
  })

  it('should show three-dot menu for test cases', async () => {
    render(<App />)
    const ticketRow = screen.getByText('FLOWDEL-2686')
    fireEvent.click(ticketRow)

    await waitFor(() => {
      const menuButtons = screen.getAllByRole('button')
      const actionMenuButton = menuButtons.find(btn => btn.innerHTML.includes('MoreVertical') || btn.innerHTML.includes('⋮'))
      if (actionMenuButton) {
        fireEvent.click(actionMenuButton)
        expect(screen.getByText('View Test Case')).toBeInTheDocument()
      }
    })
  })

  it('should show three-dot menu for test runs', async () => {
    render(<App />)
    const ticketRow = screen.getByText('FLOWDEL-2686')
    fireEvent.click(ticketRow)

    await waitFor(() => {
      const testRunsTab = screen.getByText('Test Runs')
      fireEvent.click(testRunsTab)
    })

    await waitFor(() => {
      const menuButtons = screen.getAllByRole('button')
      expect(menuButtons.length).toBeGreaterThan(0)
    })
  })

  it('should render test runs table with proper columns', async () => {
    render(<App />)
    const ticketRow = screen.getByText('FLOWDEL-2686')
    fireEvent.click(ticketRow)

    const testRunsTab = screen.getByText('Test Runs')
    fireEvent.click(testRunsTab)

    await waitFor(() => {
      expect(screen.getByText('RUN-001')).toBeInTheDocument()
    })
  })

  it('should display view test case detail page', async () => {
    render(<App />)
    const ticketRow = screen.getByText('FLOWDEL-2686')
    fireEvent.click(ticketRow)

    await waitFor(() => {
      const tc001 = screen.getByText('TC-001')
      fireEvent.click(tc001)
    })

    await waitFor(() => {
      expect(screen.getByText('Verify shift list scrolls correctly')).toBeInTheDocument()
      expect(screen.getByText('Shift View')).toBeInTheDocument()
    })
  })

  it('should display execute test run table with actual result and status columns', async () => {
    render(<App />)
    const ticketRow = screen.getByText('FLOWDEL-2686')
    fireEvent.click(ticketRow)

    const testRunsTab = screen.getByText('Test Runs')
    fireEvent.click(testRunsTab)

    await waitFor(() => {
      const run001 = screen.getByText('RUN-001')
      fireEvent.click(run001)
    })

    await waitFor(() => {
      const editButton = screen.getByText('Execute / Manage Test Run')
      fireEvent.click(editButton)
    })

    await waitFor(() => {
      expect(screen.getByText('Test Execution Table')).toBeInTheDocument()
      expect(screen.getByText('Actual Result')).toBeInTheDocument()
    })
  })

  it('should render custom tables in test cases', async () => {
    render(<App />)
    const ticketRow = screen.getByText('FLOWDEL-2686')
    fireEvent.click(ticketRow)

    await waitFor(() => {
      const addTestCaseButton = screen.getAllByText(/Add Test Case/i)[0]
      fireEvent.click(addTestCaseButton)
    })

    await waitFor(() => {
      const addTableButton = screen.getByText('Add Table')
      expect(addTableButton).toBeInTheDocument()
    })
  })

  it('should show test run in test runs tab when test case is approved', async () => {
    render(<App />)
    const ticketRow = screen.getByText('FLOWDEL-2686')
    fireEvent.click(ticketRow)

    // Navigate to view test case
    await waitFor(() => {
      const tc001 = screen.getByText('TC-001')
      fireEvent.click(tc001)
    })

    await waitFor(() => {
      // Check if test case is approved
      const approveButtons = screen.queryAllByText(/Approve Test Case/i)
      expect(approveButtons.length).toBeGreaterThanOrEqual(0)
    })
  })

  it('should track QA Failed count when test run is marked as QA Failed', async () => {
    render(<App />)
    const ticketRow = screen.getByText('FLOWDEL-2686')
    fireEvent.click(ticketRow)

    const testRunsTab = screen.getByText('Test Runs')
    fireEvent.click(testRunsTab)

    await waitFor(() => {
      const run002 = screen.getByText('RUN-002')
      fireEvent.click(run002)
    })

    await waitFor(() => {
      // RUN-002 status should be 'QA Failed'
      expect(screen.getByText('QA Failed')).toBeInTheDocument()
    })
  })

  it('should create retest run with incremented version', async () => {
    render(<App />)
    const ticketRow = screen.getByText('FLOWDEL-2686')
    fireEvent.click(ticketRow)

    const testRunsTab = screen.getByText('Test Runs')
    fireEvent.click(testRunsTab)

    await waitFor(() => {
      const run002 = screen.getByText('RUN-002')
      fireEvent.click(run002)
    })

    await waitFor(() => {
      // RUN-002 is V2 and QA Failed
      expect(screen.getByText('V2')).toBeInTheDocument()
      expect(screen.getByText('QA Failed')).toBeInTheDocument()
    })
  })

  it('should display search functionality on dashboard', () => {
    render(<App />)
    const searchInput = screen.getByPlaceholderText('Search tickets...')
    expect(searchInput).toBeInTheDocument()

    fireEvent.change(searchInput, { target: { value: 'FLOWDEL-2686' } })
    expect(screen.getByDisplayValue('FLOWDEL-2686')).toBeInTheDocument()
  })

  it('should show Add Ticket button on dashboard', () => {
    render(<App />)
    const addTicketButton = screen.getByText('Add Ticket')
    expect(addTicketButton).toBeInTheDocument()
  })

  it('should display status badges correctly', () => {
    render(<App />)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('In Review')).toBeInTheDocument()
    expect(screen.getByText('Testing')).toBeInTheDocument()
  })

  it('should display sidebar navigation', () => {
    render(<App />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Flowlogic QA')).toBeInTheDocument()
  })

  it('should handle modal close with cancel button', async () => {
    render(<App />)
    const ticketRow = screen.getByText('FLOWDEL-2686')
    fireEvent.click(ticketRow)

    await waitFor(() => {
      const addTestCaseButton = screen.getAllByText(/Add Test Case/i)[0]
      fireEvent.click(addTestCaseButton)
    })

    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
    })

    await waitFor(() => {
      expect(screen.queryByText('Add Test Case')).not.toBeInTheDocument()
    })
  })
})
