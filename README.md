# Flowlogic QA Assistant

A comprehensive mobile QA testing workspace for managing test cases, test runs, and QA activities for iOS and Android applications. Built with React, Vite, Supabase, and Claude AI.

## Features

✨ **Smart Test Case Generation**
- AI-powered test case generation using Claude
- One-click test case creation from ticket acceptance criteria
- Support for custom test tables and complex scenarios

🧪 **Complete Test Management**
- Create, edit, and approve test cases
- Execute test runs with detailed reporting
- Track test results (Passed, Failed, QA Failed, Blocked)
- Version control for retesting cycles
- PDF and Excel export functionality

📱 **Platform Support**
- iOS and Android platform-specific testing
- Platform selection per test case and run
- Separate test execution paths

📊 **Activity Logging & Tracking**
- Global activity log across all tickets
- Real-time activity tracking for team visibility
- Filterable by ticket and action type
- Pagination support for large datasets

🎨 **Dark Mode**
- Full dark mode support with persistent preferences
- Smooth theme switching
- Optimized for extended testing sessions

🔗 **Jira Integration**
- Link test cases to Jira tickets
- Direct access to Jira ticket details
- Centralized ticket management

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: CSS3 with CSS Variables (supports light/dark modes)
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude API (claude-haiku-4-5)
- **Backend**: Express.js (Vercel Serverless)
- **Export**: jsPDF, XLSX

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account
- Anthropic Claude API key

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/hackathon.git
cd hackathon
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ANTHROPIC_API_KEY=your_claude_api_key
```

4. **Start local development**
```bash
npm run dev
```

The app will run at `http://localhost:5173` and the backend at `http://localhost:3001`

## Deployment

### Backend (Vercel)
1. Create a Vercel account at https://vercel.com
2. Connect your GitHub repository
3. Add environment variable: `VITE_ANTHROPIC_API_KEY`
4. Deploy automatically from main branch

### Frontend (GitHub Pages)
1. Update `vite.config.js` base path to your repo name
2. Run `npm run build`
3. Run `npm run deploy`
4. Access at `https://YOUR_USERNAME.github.io/hackathon`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Project Structure

```
hackathon/
├── src/
│   ├── components/        # React components
│   ├── views/            # Page views
│   ├── lib/              # Services (Supabase, Claude)
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   └── index.css         # Global styles with CSS variables
├── api/                  # Vercel serverless functions
├── backend/              # Express.js backend (local dev only)
├── public/               # Static assets
├── vercel.json          # Vercel configuration
└── vite.config.js       # Vite configuration
```

## Key Features Explained

### Test Case Generation
- Create a ticket with acceptance criteria
- AI automatically generates detailed test cases
- One test case per acceptance criterion
- Includes pre-conditions, steps, and expected results

### Test Execution
- Execute test cases on specific platforms
- Track actual results vs expected results
- Mark tests as Passed, Failed, or QA Failed
- Create retest cycles for failed tests

### Activity Tracking
- Every action is logged (ticket creation, status changes, test approvals, etc.)
- Filter logs by ticket or action type
- Pagination for easy navigation
- Real-time team visibility

## Database Schema

Key tables:
- **tickets** - Main test tickets linked to Jira
- **test_cases** - Test cases with status (Pending/Approved)
- **test_runs** - Execution records for test cases
- **test_run_results** - Detailed step results
- **activity_logs** - Event tracking for all actions

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `VITE_ANTHROPIC_API_KEY` | Your Claude API key |

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Create a pull request

## Troubleshooting

**Issue: Test case generation fails**
- Verify Claude API key is valid
- Check Supabase connection
- Review browser console for error details

**Issue: Dark mode not working**
- Clear browser localStorage
- Check CSS variables are defined in index.css

**Issue: Vercel deployment errors**
- Check build logs at vercel.com/dashboard
- Verify environment variables are set
- Ensure vite.config.js base path matches repo name

## License

Private project for Flowlogic

## Support

For issues and questions, check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide or review the codebase documentation.

---

**Built with ❤️ for mobile QA teams**
