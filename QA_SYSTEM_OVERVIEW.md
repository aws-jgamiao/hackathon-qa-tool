# Flowlogic Mobile QA Workspace - System Overview

## 📋 Project Summary

**Flowlogic Mobile QA Workspace** is a comprehensive mobile QA testing management platform designed to streamline test case creation, execution, and tracking for iOS and Android applications. The system leverages Claude AI for intelligent test case generation and integrates with Jira for ticket management.

---

## 🏗️ Architecture

### Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite, React Hooks |
| **Backend** | Vercel Serverless Functions, Express.js (local dev) |
| **Database** | Supabase (PostgreSQL) |
| **AI Integration** | Claude Haiku 4.5 API |
| **Export** | jsPDF, XLSX |
| **Deployment** | Vercel (Frontend + Backend) |
| **Version Control** | GitHub |

### Deployment URLs
- **Live App**: https://hackathon-qa-tool.vercel.app
- **Backend API**: Vercel Serverless Functions (`/api/generate-test-cases`)
- **Database**: Supabase Cloud

---

## ✨ Core Features

### 1. **Ticket Management**
- Create, edit, and delete mobile QA tickets
- Link tickets to Jira for cross-system tracking
- Support for iOS and Android platforms
- Ticket status tracking: Open, In Progress, Done
- QA Failed count tracking for retry cycles
- Activity logging for all ticket changes

### 2. **Test Case Management**
- ✅ Manual test case creation
- 🤖 AI-powered test case generation using Claude
- Support for multiple platforms (iOS, Android, Web)
- Test case statuses: Pending, Approved
- Custom table support for test data scenarios
- Test case edits with real-time persistence to Supabase
- Acceptance criteria-based test generation

### 3. **Test Run Execution**
- Execute test cases for iOS and Android separately
- Test run status tracking: Not Run, Passed, QA Failed
- Version/Cycle tracking for retry attempts
- QA Failed count per test run (retry tracking)
- Test notes and actual results documentation
- View execution history with timestamps

### 4. **Activity Logging & Dashboard**
- Global activity log with pagination
- Action types: ticket_created, status_changed, test_case_created/approved/deleted, test_run_created/passed/failed/deleted
- Filter by ticket and action type
- Real-time activity tracking with timestamps
- Dashboard with comprehensive ticket overview
- Test case and test run counts per ticket
- QA Failed count visualization

### 5. **Export Functionality**
- Export tickets to PDF with test cases and runs
- Export to Excel for data analysis
- Complete run history and details included

### 6. **User Interface**
- Dark mode support with CSS variables
- Responsive design
- Modal dialogs for non-disruptive workflows
- Tab-based navigation (Test Cases, Test Runs, Activity)
- Sidebar navigation
- Dropdown menus with action options
- Status badges with color coding

---

## 📊 Database Schema

### Core Tables

#### `tickets`
```
- id: UUID (Primary Key)
- name: Text
- description: Text
- type: Text (Bug, Feature, etc.)
- platform: Text (iOS, Android, iOS/Android)
- status: Text (Open, In Progress, Done)
- jira_link: URL (Optional)
- test_case_count: Integer
- test_run_count: Integer
- qa_failed_count: Integer (retry tracking)
- created_at: Timestamp
- updated_at: Timestamp
```

#### `test_cases`
```
- id: UUID (Primary Key)
- ticket_id: UUID (FK → tickets)
- title: Text
- description: Text
- component: Text
- platform: Text (iOS, Android, Web, iOS/Android)
- pre_conditions: Text
- test_steps: Text (newline-separated)
- expected_result: Text
- custom_tables: JSON (array of table objects)
- status: Text (Pending, Approved)
- created_by: Text
- created_at: Timestamp
- updated_at: Timestamp
- approved_by: Text (Optional)
- approved_at: Timestamp (Optional)
```

#### `test_runs`
```
- id: UUID (Primary Key)
- ticket_id: UUID (FK → tickets)
- test_case_id: UUID (FK → test_cases)
- platform: Text (iOS, Android, Web)
- version: Text (V1, V2, etc.)
- status: Text (Not Run, Passed, QA Failed)
- actual_result: Text
- test_notes: Text
- qa_failed_count: Integer (retry count)
- executed_by: Text
- executed_at: Timestamp
- created_at: Timestamp
- updated_at: Timestamp
```

#### `activity_logs`
```
- id: UUID (Primary Key)
- ticket_id: UUID (FK → tickets)
- action_type: Text
- description: Text
- related_id: UUID (test_case_id or test_run_id)
- entity_type: Text (test_case, test_run, ticket)
- created_at: Timestamp
```

---

## 🔌 API Endpoints

### Test Case Generation
**POST** `/api/generate-test-cases`
- **Purpose**: Generate test cases using Claude AI
- **Input**: Ticket object with acceptance criteria
- **Output**: Array of generated test cases
- **Model**: Claude Haiku 4.5 (lowest cost)
- **Features**: 
  - Markdown JSON handling
  - Automatic test case count matching acceptance criteria
  - Platform-aware generation

### Backend Routes (Local Development)
- `POST /api/generate-test-cases` - Generate test cases with AI

---

## 🎯 Key Workflows

### Workflow 1: Create and Test a Ticket
1. **Dashboard** → Click "Add Ticket"
2. Enter ticket details:
   - Name, Type (Bug, etc.)
   - Platform (iOS, Android, iOS/Android)
   - Description, Acceptance Criteria
   - Jira link (optional)
3. System auto-generates test cases using Claude AI
4. Review and approve generated test cases
5. Manually add additional test cases if needed
6. Create test runs and execute
7. Mark as Passed or QA Failed
8. Track in Activity Log

### Workflow 2: Manual Test Case Creation
1. Open ticket → Test Cases tab
2. Click "Add Test Case"
3. Enter test case details
4. Add test steps (one per line)
5. Create custom tables for test data (optional)
6. Save as Pending
7. View → Edit → Approve test case
8. Status updates to Approved

### Workflow 3: Execute Test Run
1. Open ticket → Test Runs tab
2. Click "Execute Test Run"
3. Select test case and platform (iOS/Android separate)
4. Enter actual results and test notes
5. Click "Mark as Passed" or "Mark as QA Failed"
6. Retry creates new version (V1, V2, V3...)
7. QA Failed Count tracks retry attempts
8. View history in Test Runs tab

### Workflow 4: Track QA Activities
1. Click "Activity Log" in sidebar
2. Filter by:
   - Ticket ID
   - Action type (Created, Approved, Passed, Failed, etc.)
3. View creation dates, updates, approvals
4. Pagination support (20 items per page)

---

## 🚀 Deployment

### Frontend Deployment (Vercel)
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`
- **Node Version**: 18.x

### Backend Deployment (Vercel Serverless)
- **Function Location**: `/api/generate-test-cases.js`
- **Memory**: 1024 MB
- **Timeout**: 60 seconds
- **Environment Variables Required**:
  - `VITE_ANTHROPIC_API_KEY`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### Database (Supabase)
- **Type**: PostgreSQL
- **Backup**: Automated daily
- **Region**: Based on setup

---

## 🔐 Environment Variables

Create `.env.local` file with:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ANTHROPIC_API_KEY=your-claude-api-key
```

For Vercel, set via:
**Settings → Environment Variables**

---

## 🧪 Testing Checklist for QA

### Functional Tests
- [ ] Create ticket with all fields
- [ ] Generate AI test cases from acceptance criteria
- [ ] Create manual test case
- [ ] Edit test case and save persistence
- [ ] Create custom tables with multiple columns/rows
- [ ] Delete test case
- [ ] Create test run for iOS
- [ ] Create test run for Android
- [ ] Mark test run as Passed
- [ ] Mark test run as QA Failed (verify retry count increases)
- [ ] View QA Failed count in dashboard
- [ ] Export ticket to PDF
- [ ] Export ticket to Excel
- [ ] Change ticket status (Open → In Progress → Done)
- [ ] Filter activity log by ticket and action type
- [ ] Delete ticket (with confirmation)
- [ ] Delete test run

### UI/UX Tests
- [ ] Dark mode toggle works
- [ ] All colors visible in dark mode
- [ ] Warning boxes readable in dark mode
- [ ] Custom table Actions column aligned
- [ ] Modals close on Escape key
- [ ] Modals don't close on outside click
- [ ] Toast notifications appear correctly
- [ ] Dashboard loads without errors
- [ ] Responsive layout on different screen sizes

### Database Tests
- [ ] New ticket appears in dashboard
- [ ] Test case edits persist to database
- [ ] QA Failed count updates in database
- [ ] Activity log entries created
- [ ] Deleted records removed from database
- [ ] Timestamps accurate

### Integration Tests
- [ ] Claude API generates valid JSON
- [ ] Jira links open correctly
- [ ] PDF export includes all test cases
- [ ] Excel export shows correct data
- [ ] Database relationships intact
- [ ] Real-time date/time correct

### Performance Tests
- [ ] App loads within 3 seconds
- [ ] Dashboard loads with 10+ tickets
- [ ] Activity log pagination works smoothly
- [ ] Large custom tables (10+ columns, 20+ rows) render
- [ ] PDF export completes in reasonable time
- [ ] API response time < 5 seconds

---

## 📈 Data Features

### Test Case Generation
- **Input**: Ticket acceptance criteria
- **Output**: Detailed test cases with:
  - Title (Verify/Test pattern)
  - Description
  - Pre-conditions
  - Step-by-step instructions
  - Expected results
- **Accuracy**: Matches acceptance criteria 1:1
- **Platform**: iOS, Android, Web, Cross-platform

### Custom Tables
- Dynamic column creation
- Dynamic row creation
- Edit cell values in-place
- Delete rows
- Delete columns
- Proper alignment and persistence

### Activity Logging
- All changes tracked
- Timestamps on every action
- User attribution (created_by, approved_by)
- Searchable and filterable
- Pagination (20 items/page)

---

## ⚠️ Known Limitations

1. **AI Generation**: Requires valid acceptance criteria for optimal results
2. **Real-time Sync**: Database updates reflect within 1-2 seconds
3. **Concurrent Edits**: Last write wins (no conflict resolution)
4. **Export**: Large datasets (100+ items) may take 10+ seconds
5. **File Upload**: Not supported (future feature)

---

## 🔄 Retry/Cycle Tracking

- **Version Field**: V1, V2, V3 (auto-incremented)
- **QA Failed Count**: Tracks retry attempts per test run
- **Ticket QA Failed Count**: Sum of all failed test runs
- **Purpose**: Identify high-risk areas needing extra testing

---

## 🎨 Design Notes

- **Color Scheme**: Light/Dark mode with CSS variables
- **Typography**: System fonts for performance
- **Spacing**: 8px base unit
- **Icons**: Lucide React (minimal, clean)
- **Modals**: Centered overlay with backdrop
- **Tables**: Striped rows with hover effects
- **Forms**: Clear labels and validation

---

## 📝 Code Organization

```
/src
  /components
    - AddEditTestCase.jsx (create/edit test cases)
    - AddTicketModal.jsx (create tickets)
    - ExecuteTestRun.jsx (run tests)
    - ViewTestCase.jsx (view test case details)
    - ViewTestRun.jsx (view test run results)
    - TicketHeader.jsx (ticket metadata)
    - TestCasesTab.jsx (test case list)
    - TestRunsTab.jsx (test run list)
    - ActivityLog.jsx (activity list)
    - Sidebar.jsx (navigation)
  /views
    - Dashboard.jsx (main view)
    - TicketWorkspace.jsx (ticket details)
    - ActivityLogView.jsx (global activity)
  /lib
    - supabase.js (database services)
    - claudeService.js (AI integration)
  /utils
    - dateUtils.js (date formatting)
    - exportUtils.js (PDF/Excel export)
  /hooks
    - useDarkMode.js (theme management)
```

---

## 🚀 Getting Started for QA Testing

1. **Access App**: https://hackathon-qa-tool.vercel.app
2. **Create Test Ticket**:
   - Add ticket with acceptance criteria
   - Review auto-generated test cases
3. **Execute Tests**:
   - Create test runs for iOS/Android
   - Record actual results
   - Mark pass/fail
4. **Review Results**:
   - Check dashboard counts
   - View activity log
   - Export for reporting

---

## 📞 Support & Debugging

### Common Issues

**Issue**: Test cases don't generate
- **Solution**: Verify acceptance criteria format, check API key

**Issue**: QA Failed count not updating
- **Solution**: Refresh dashboard, check network tab for errors

**Issue**: Custom tables misaligned
- **Solution**: Verify column/row count, refresh page

**Issue**: Export fails
- **Solution**: Check browser console, verify test data exists

### Debug Mode
- Open browser DevTools (F12)
- Check Console tab for error messages
- Check Network tab for API calls
- Verify Supabase connection

---

## 🎯 Testing Priorities

### High Priority
1. Test case creation and persistence
2. QA Failed count tracking
3. Jira link functionality
4. Export functionality

### Medium Priority
1. Custom table functionality
2. Activity log filtering
3. Dark mode appearance
4. Platform separation (iOS/Android)

### Low Priority
1. Animation smoothness
2. Loading spinners
3. Tooltip text
4. Font sizes

---

## 📊 Success Metrics

- ✅ All features working as documented
- ✅ No console errors on key workflows
- ✅ Database persistence verified
- ✅ AI test case generation accurate
- ✅ Export files complete and readable
- ✅ QA Failed count matches test runs
- ✅ Activity log comprehensive
- ✅ Dark mode readable
- ✅ Performance acceptable (< 3s load time)
- ✅ No security vulnerabilities

---

**Last Updated**: July 10, 2026  
**Version**: 1.0  
**Status**: ✅ Production Ready
