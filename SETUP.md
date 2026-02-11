# Life OS - Complete Setup Guide

## What's Included

This package contains a **complete, production-ready** Life OS application with:

### Backend (✅ Complete)
- Express server with Passport.js authentication
- PostgreSQL database with Drizzle ORM
- All 11 modules fully implemented:
  * Tasks (Day/Week/Year planning)
  * Habits (Daily tracking with streaks)
  * Goals (Progress tracking)
  * Finance (Income/Expense management)
  * Wellness (Mood, Sleep, Energy, Water)
  * Nutrition (Meal logging)
  * Reading List (Books/Movies/Shows/Articles)
  * Calendar (Notion-style task calendar)
  * Timeline (Life story of progress)
  * Habit Reduction (Break the Loop tracker)

### Frontend (✅ Complete)
- React + TypeScript + Tailwind CSS
- Shadcn UI components
- Wouter routing
- React Query for data fetching
- Full authentication flows
- Responsive design

### Database
- Comprehensive schema with all tables
- User isolation and security
- Relations properly configured

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or hosted)

## Quick Start

### 1. Environment Setup

Create `.env` file in the root directory:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lifeos

# Session Secret (change in production!)
SESSION_SECRET=your-super-secret-key-change-this-in-production

# Environment
NODE_ENV=development
PORT=5000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

```bash
# Push schema to database
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5000`

**Demo Account**: 
- Username: `demo`
- Password: `password123`

### 5. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
life-os/
├── server/               # Backend
│   ├── index.ts         # Entry point
│   ├── auth.ts          # Authentication
│   ├── db.ts            # Database connection
│   ├── storage.ts       # Database operations
│   ├── routes.ts        # API routes
│   ├── vite.ts          # Dev server
│   └── static.ts        # Production serving
├── client/              # Frontend
│   └── src/
│       ├── components/  # React components
│       ├── hooks/       # React hooks
│       ├── lib/         # Utilities
│       ├── pages/       # Page components
│       └── App.tsx      # Main app
├── shared/              # Shared code
│   ├── schema.ts        # Database schema
│   └── routes.ts        # API definitions
├── migrations/          # Database migrations
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run check` - Type check
- `npm run db:push` - Push schema to database

## Features by Module

### Dashboard
- Overview of all modules
- Habit tracker grid (7-day view)
- Quick tasks list
- Category navigation

### Tasks
- Create/edit/delete tasks
- Filter by status (todo/done)
- Assign to planning layers (day/week/year)
- Set due dates and priorities

### Calendar
- Monthly task view
- Click day to see/add tasks
- Reschedule tasks
- Overdue tasks section

### Habits
- Boolean or numeric trackers
- Daily logging
- Streak tracking
- Completion rate visualization

### Goals
- Create goals with target dates
- Track progress (0-100%)
- Status management (active/paused/completed)
- Link to tasks and habits

### Finance
- Income/expense tracking
- Category breakdown
- Monthly summaries
- Date-based filtering

### Wellness
- Daily mood rating (1-5)
- Energy level tracking
- Sleep hours logging
- Water intake
- Notes and reflections

### Nutrition
- Meal logging (breakfast/lunch/dinner/snack)
- Daily meal overview
- Weekly consistency tracking

### Reading List
- Books, movies, shows, articles
- Status tracking (planned/in-progress/completed)
- Ratings and notes

### Timeline
- Auto-generated life story
- Filter by event type
- Chronological progress view

### Break the Loop
- Habit reduction tracking
- Daily occurrence logging
- Intensity tracking
- Streak visualization

## Database Schema

All tables include:
- User isolation (per-user data)
- Proper foreign keys and relations
- Created timestamps
- Optimized indexes

## Security Features

- Passwords hashed with scrypt
- Session-based authentication
- Protected routes (middleware)
- Per-user data isolation
- CORS configured
- SQL injection protection (Drizzle ORM)

## Deployment Options

### Local Development
Already configured! Just run `npm run dev`

### Production (VPS/Cloud)
1. Set `NODE_ENV=production`
2. Configure real `SESSION_SECRET`
3. Use production PostgreSQL database
4. Run `npm run build && npm start`
5. Use PM2 or similar for process management
6. Configure nginx/Apache as reverse proxy

### Platform-Specific
- **Replit**: Works out of the box
- **Railway**: Add DATABASE_URL environment variable
- **Heroku**: Configure Postgres addon
- **Vercel**: Split frontend/backend or use serverless
- **DigitalOcean**: Use App Platform or Droplet

## Customization

### Adding a New Module

1. Add table to `shared/schema.ts`
2. Add CRUD functions to `server/storage.ts`
3. Add API routes to `server/routes.ts` and `shared/routes.ts`
4. Create React hooks in `client/src/hooks/`
5. Create page component in `client/src/pages/`
6. Add route to `client/src/App.tsx`
7. Add navigation link to `components/layout-shell.tsx`

### Styling

All styling uses Tailwind CSS + Shadcn UI. Modify:
- `tailwind.config.ts` for theme
- `client/src/index.css` for global styles
- Component files for local styles

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in `.env`
- Check PostgreSQL is running
- Ensure database exists

### Port Already in Use
- Change `PORT` in `.env`
- Kill existing process on port 5000

### Build Errors
- Clear `node_modules` and reinstall
- Check Node.js version (18+)
- Run `npm run check` for type errors

## Support & Documentation

- TypeScript types are fully defined
- All code is well-commented
- React Query handles caching
- Drizzle ORM documentation: https://orm.drizzle.team
- Shadcn UI docs: https://ui.shadcn.com

## What's Next?

This is a complete, working application. Suggested enhancements:
- Add drag-and-drop for task rescheduling
- Implement goal milestones
- Add data export/import
- Create mobile-responsive sidebar
- Add dark/light theme toggle
- Implement notifications
- Add charts and analytics
- Build desktop app (Electron)
- Create mobile apps (React Native)

---

**Note**: This is a fully functional application ready for both development and production use!
