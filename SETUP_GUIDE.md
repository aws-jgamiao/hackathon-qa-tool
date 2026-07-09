# Flowlogic AI Mobile QA Workspace - Setup Guide

## Quick Start

### 1. Create Supabase Project

1. Go to https://supabase.com and sign up for a free account
2. Create a new project (choose a region close to you)
3. Wait for the project to initialize

### 2. Set Up Database

1. Go to your Supabase dashboard
2. Click on the "SQL Editor" in the left sidebar
3. Create a new query and run all the SQL from `DATABASE_SETUP.md`
4. This will create all necessary tables

### 3. Configure Environment

1. Copy your project credentials:
   - Open Project Settings → API
   - Copy the "URL" (VITE_SUPABASE_URL)
   - Copy the "anon public" key (VITE_SUPABASE_ANON_KEY)

2. Create `.env` file in the project root:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Restart the development server:
   ```bash
   npm run dev
   ```

### 4. Install Dependencies

```bash
npm install
```

This will install Supabase client library.

## Features

### Add Tickets
- Click "Add Ticket" button
- Fill in Jira Key, Name, Platform, Status, and Jira Link
- System validates:
  - Jira Key is unique
  - Jira Link is unique
  - All required fields are filled
- Click "Add Ticket" to create

### Manage Test Cases
- Select a ticket to open workspace
- Click "Test Cases" tab
- Create test cases with:
  - Title, Component, Description
  - Pre-Conditions and Test Steps
  - Expected Result
  - Optional custom tables

### Create Test Runs
- Approve a test case
- System automatically creates test run(s):
  - One per platform (iOS, Android, Web, etc.)
  - Each run is independent with version tracking (V1, V2, etc.)

### Execute Test Runs
- Open test run
- Click "Execute / Manage Test Run"
- Simple interface:
  - Actual Result textarea
  - Status dropdown
  - Save, Pass, or Mark as QA Failed buttons
- Data is automatically saved to database

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file is in the project root
- Make sure you have `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after creating `.env`

### "Failed to load tickets"
- Check database is created (run DATABASE_SETUP.md SQL)
- Check Row Level Security policies are set correctly
- Check your Supabase URL and key are correct

### No data appears
- Make sure you added a ticket
- Check Supabase dashboard to see if data is in the database
- Check browser console for errors

## Development

### File Structure
```
src/
├── lib/
│   └── supabase.js          # Supabase client and services
├── components/              # Reusable components
├── views/                   # Main pages
├── utils/                   # Utility functions
└── test/                    # Tests
```

### Adding New Features

1. Add database table in Supabase
2. Create service in `lib/supabase.js`
3. Create component or view
4. Use service to fetch/update data

### Testing

```bash
npm test
```

## Database Schema

See `DATABASE_SETUP.md` for complete schema.

Key tables:
- `tickets` - Jira tickets
- `test_cases` - Test cases for tickets
- `test_runs` - Test run execution records
- `test_run_results` - Individual step results

## Limitations

- No user authentication (all data is public)
- No real-time collaboration
- No audit logging

These can be added later by:
- Adding Supabase Auth
- Using Supabase realtime subscriptions
- Adding audit logging tables

## Support

For issues:
1. Check DATABASE_SETUP.md
2. Check browser console for errors
3. Check Supabase dashboard for data
4. Verify .env configuration
