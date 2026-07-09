# Supabase Database Setup

This guide explains how to set up the Supabase database for the Flowlogic QA Workspace.

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Copy your project URL and anon key to `.env` file

## Database Schema

Run the following SQL in your Supabase SQL editor to create the tables:

### 1. Tickets Table

```sql
CREATE TABLE tickets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Bug', 'Feature', 'Task', 'Epic')),
  platform TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Open', 'In Progress', 'In Review', 'Testing', 'Done')),
  jira_link TEXT NOT NULL UNIQUE,
  test_case_count INTEGER DEFAULT 0,
  test_run_count INTEGER DEFAULT 0,
  qa_failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX tickets_id_idx ON tickets(id);
CREATE INDEX tickets_status_idx ON tickets(status);
```

### 2. Test Cases Table

```sql
CREATE TABLE test_cases (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  component TEXT NOT NULL,
  platform TEXT NOT NULL,
  description TEXT,
  pre_conditions TEXT,
  expected_result TEXT,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending Approval', 'Approved')),
  test_steps JSONB DEFAULT '[]',
  custom_tables JSONB DEFAULT '[]',
  created_by TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_by TEXT,
  approved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX test_cases_ticket_id_idx ON test_cases(ticket_id);
CREATE INDEX test_cases_status_idx ON test_cases(status);
```

### 3. Test Runs Table

```sql
CREATE TABLE test_runs (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  test_case_id TEXT NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Not Run' CHECK (status IN ('Not Run', 'In Progress', 'Passed', 'Failed', 'Blocked', 'Retest', 'QA Failed', 'Approved')),
  qa_failed_count INTEGER DEFAULT 0,
  executed_by TEXT,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  test_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX test_runs_ticket_id_idx ON test_runs(ticket_id);
CREATE INDEX test_runs_test_case_id_idx ON test_runs(test_case_id);
CREATE INDEX test_runs_status_idx ON test_runs(status);
CREATE INDEX test_runs_platform_idx ON test_runs(platform);
```

### 4. Test Run Results Table

```sql
CREATE TABLE test_run_results (
  id TEXT PRIMARY KEY,
  test_run_id TEXT NOT NULL REFERENCES test_runs(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_description TEXT NOT NULL,
  actual_result TEXT,
  status TEXT NOT NULL DEFAULT 'Not Run' CHECK (status IN ('Not Run', 'Passed', 'Failed', 'Blocked', 'Retest', 'QA Failed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(test_run_id, step_number)
);

CREATE INDEX test_run_results_test_run_id_idx ON test_run_results(test_run_id);
```

### 5. Enable Row Level Security (Optional but Recommended)

```sql
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_run_results ENABLE ROW LEVEL SECURITY;

-- Create a policy allowing anonymous read/write (for development)
CREATE POLICY "Allow all access for development" ON tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for development" ON test_cases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for development" ON test_runs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for development" ON test_run_results FOR ALL USING (true) WITH CHECK (true);
```

## Environment Setup

1. Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. Get your credentials from:
   - Supabase Dashboard → Project Settings → API
   - Copy the URL and `anon` key

## Validation

The app will validate:
- **Duplicate Jira Key**: Cannot create a ticket with the same ID
- **Duplicate Jira Link**: Cannot create a ticket with the same Jira link URL
- **Required Fields**: All required fields must be filled
- **Platform Separation**: When approving a test case, separate test runs are created for each platform

## Testing the Connection

The app will automatically test the connection on startup. Check browser console for any errors.

If you see "Missing Supabase environment variables", make sure your `.env` file is correctly configured.
