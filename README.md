# Flowlogic AI Mobile QA Workspace

A standalone web application for managing mobile QA testing workflows, including Jira ticket management, test case creation, and test run execution.

## Features

- **Jira Ticket Dashboard** - View and manage Jira tickets
- **Test Case Management** - Create, edit, and approve test cases
- **Test Run Execution** - Execute and track test runs with custom tables
- **Cycle Tracking** - Track test cycles and retest runs
- **QA Failed Tracking** - Mark runs as QA failed and create retest runs
- **Custom Tables** - Add custom data tables to test cases
- **Export** - Export test cases and runs to PDF/Excel (mock)

## Tech Stack

- React 18
- Vite
- Lucide Icons
- Vitest

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Testing

```bash
npm test
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/           # Reusable UI components
├── views/               # Main page views
├── utils/               # Utility functions
├── test/                # Test files
├── App.jsx              # Root component
├── main.jsx             # Entry point
├── index.css            # Global styles
└── mockData.js          # Mock data
```

## Mock Data

The application uses mock data for:
- 3 Jira tickets (FLOWDEL-2686, FLOWDEL-2929, FLOWDEL-3010)
- Multiple test cases with different statuses
- Test runs with cycle tracking

## Features Implemented

- ✅ Jira ticket dashboard with search and filtering
- ✅ Ticket workspace with test cases and test runs tabs
- ✅ Add/edit test cases with custom tables
- ✅ View test case details
- ✅ Test case approval workflow
- ✅ Automatic test run creation on approval
- ✅ Execute and manage test runs
- ✅ View test run details with cycle tracking
- ✅ QA Failed tracking and retest creation
- ✅ Cycle tracking (V1, V2, V3, etc.)
- ✅ Custom table support in test cases
- ✅ Three-dot action menus
- ✅ Status badges
- ✅ Empty states
- ✅ Toast notifications
- ✅ Mock export to PDF/Excel
- ✅ Comprehensive test suite

## Future Enhancements

- Integration with Jira API
- Real PDF/Excel export
- User authentication
- Test data persistence
- Advanced filtering and search
- Bulk operations
