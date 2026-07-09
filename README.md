# Flowlogic AI Mobile QA Workspace

A professional web application for managing mobile QA testing workflows with Supabase database integration. Includes Jira ticket management, test case creation, test run execution, and comprehensive cycle tracking.

## Features

### Core Functionality
- **Jira Ticket Management** - Add, view, and manage Jira tickets with validation
- **Test Case Management** - Create, edit, approve test cases with version control
- **Test Run Execution** - Simple, clean interface for executing test runs
- **Platform Separation** - Automatically creates separate test runs for iOS/Android
- **Cycle Tracking** - Version tracking (V1, V2, V3) with QA Failed retest creation
- **Data Persistence** - Supabase database integration

### UI/UX
- Clean, minimal design with light theme
- Three-dot action menus with portal-based positioning
- Status badges with semantic colors
- Loading and error states
- Toast notifications

## Tech Stack

- **Frontend**: React 18 with Hooks
- **Bundler**: Vite
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Lucide Icons
- **Testing**: Vitest + Testing Library

## Quick Start

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Supabase

1. Create a free account at https://supabase.com
2. Create a new project
3. Copy your URL and anon key
4. Create `.env` file:
   ```
   VITE_SUPABASE_URL=your-url
   VITE_SUPABASE_ANON_KEY=your-key
   ```

### 3. Set Up Database

1. Go to Supabase SQL Editor
2. Run all SQL from `DATABASE_SETUP.md`
3. This creates all required tables

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Step-by-step setup instructions
- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Complete database schema

## Project Structure

```
src/
├── lib/
│   └── supabase.js           # Database client and services
├── components/               # Reusable UI components
├── views/                    # Main page views
├── utils/                    # Utility functions
├── test/                     # Test suite
├── App.jsx                   # Root component
├── main.jsx                  # Entry point
└── index.css                 # Global styles
```

## Key Features Implemented

### Data Management
- ✅ Supabase integration with PostgreSQL
- ✅ Duplicate validation (Jira Key and Link)
- ✅ Real data persistence
- ✅ Removed all mock data

### Test Execution
- ✅ Simple, focused test run interface
- ✅ Clean table with essential columns only
- ✅ Actual Result textarea
- ✅ Status dropdown (Not Run, Passed, Failed, etc.)
- ✅ Save, Mark Passed, Mark QA Failed buttons

### Platform Management
- ✅ iOS/Android separate test runs
- ✅ Each platform has independent version tracking
- ✅ Automatic test run creation per platform on approval

### Validation & Safety
- ✅ Duplicate Jira Key prevention
- ✅ Duplicate Jira Link prevention
- ✅ Required field validation
- ✅ Loading and error states
- ✅ Environment variable checks

## Database Schema

Four main tables:
- **tickets** - Jira tickets with status and links
- **test_cases** - Test cases per ticket
- **test_runs** - Test execution records with version tracking
- **test_run_results** - Individual step results

See `DATABASE_SETUP.md` for complete schema.

## Testing

```bash
npm test
```

## Build for Production

```bash
npm run build
```

Output goes to `dist/` directory.

## Environment Variables

Required:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

Never commit `.env` file - it's in `.gitignore`

## Troubleshooting

**"Missing Supabase environment variables"**
- Create `.env` file with your credentials
- Restart dev server

**"Failed to load tickets"**
- Check database tables exist
- Check Supabase URL and key are correct
- See DATABASE_SETUP.md

**No data appears**
- Add a ticket first
- Check Supabase dashboard for data
- Check browser console for errors

## License

MIT
