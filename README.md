# Life OS - Complete Full-Stack Application

A comprehensive personal operating system for managing tasks, habits, goals, wellness, finance, and more.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone or extract this project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Copy `.env.example` to `.env` and update with your settings:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/lifeos
   SESSION_SECRET=your-secret-key-here
   NODE_ENV=development
   PORT=5000
   ```

4. **Setup database:**
   ```bash
   npm run db:push
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open browser:**
   Navigate to `http://localhost:5000`

**Demo Account:** 
- Username: `demo`
- Password: `password123`

## 📦 Scripts

- `npm run dev` - Start development server (auto-reload)
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push schema changes to database

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Express 5, Node.js, Passport.js
- **Database:** PostgreSQL with Drizzle ORM
- **State Management:** React Query
- **Routing:** Wouter (client-side)

### Project Structure
```
life-os/
├── server/           # Backend Express server
│   ├── index.ts      # Entry point
│   ├── auth.ts       # Authentication (Passport)
│   ├── db.ts         # Database connection
│   ├── storage.ts    # Data access layer
│   └── routes.ts     # API routes
├── client/           # Frontend React app
│   └── src/
│       ├── components/  # Reusable components
│       ├── hooks/       # Custom React hooks
│       ├── pages/       # Page components
│       └── lib/         # Utilities
├── shared/           # Shared between frontend/backend
│   ├── schema.ts     # Database schema (Drizzle)
│   └── routes.ts     # API route definitions
└── package.json
```

## 🎯 Features

### ✅ Implemented Modules
1. **Dashboard** - Overview of all activities
2. **Tasks** - Todo management with layers (day/week/year)
3. **Habits** - Daily habit tracking with streaks
4. **Goals** - Progress tracking (0-100%)

### 🚧 Ready to Implement (Backend Complete)
5. **Calendar** - Task scheduling view
6. **Wellness** - Mood, sleep, energy tracking
7. **Nutrition** - Meal logging
8. **Finance** - Income/expense management
9. **Reading List** - Books, movies, shows tracking
10. **Timeline** - Life progress visualization
11. **Break the Loop** - Habit reduction tracker

All backend APIs and database tables are ready. Only frontend UI needs to be built for modules 5-11.

## 🔐 Security Features

- ✅ Passwords hashed with scrypt
- ✅ Session-based authentication
- ✅ Protected API routes
- ✅ Per-user data isolation
- ✅ SQL injection protection (ORM)
- ✅ CORS configuration
- ✅ XSS protection

## 🚀 Deployment

### Production Build
```bash
npm run build
NODE_ENV=production npm start
```

### Environment Variables for Production
```env
DATABASE_URL=<your-production-database-url>
SESSION_SECRET=<strong-random-secret>
NODE_ENV=production
PORT=5000
```

### Deployment Platforms

**Replit** - Already configured, just fork and run

**Railway** - 
1. Connect GitHub repo
2. Add PostgreSQL plugin
3. Deploy

**Heroku** -
1. Add Heroku Postgres
2. Set environment variables
3. Deploy

**DigitalOcean App Platform** -
1. Connect repo
2. Add managed database
3. Configure build command: `npm run build`
4. Configure run command: `npm start`

**VPS (DigitalOcean, AWS EC2, etc.)** -
1. Install Node.js 18+
2. Install PostgreSQL
3. Clone repo and configure .env
4. Use PM2 for process management
5. Configure nginx as reverse proxy

## 📚 API Documentation

All endpoints require authentication except `/api/register` and `/api/login`.

### Authentication
- `POST /api/register` - Create account
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/user` - Get current user
- `PATCH /api/user` - Update profile

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Habits
- `GET /api/habits` - List all habits
- `POST /api/habits` - Create habit
- `POST /api/habits/:id/log` - Log habit completion
- `DELETE /api/habits/:id` - Delete habit

### Goals
- `GET /api/goals` - List all goals
- `POST /api/goals` - Create goal
- `PATCH /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

...and more! See `shared/routes.ts` for complete API definitions.

## 🛠️ Development

### Adding a New Module

1. **Define schema** in `shared/schema.ts`
2. **Add storage functions** in `server/storage.ts`
3. **Create API routes** in `server/routes.ts` and `shared/routes.ts`
4. **Create React hooks** in `client/src/hooks/`
5. **Build page component** in `client/src/pages/`
6. **Add route** to `client/src/App.tsx`
7. **Add nav link** to `client/src/components/layout-shell.tsx`

### Database Migrations

When changing the schema:
```bash
npm run db:push
```

For production, consider using Drizzle migrations:
```bash
npx drizzle-kit generate:pg
npx drizzle-kit migrate
```

## 🐛 Troubleshooting

**Database connection fails:**
- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Check database permissions

**Port 5000 already in use:**
- Change `PORT` in `.env`
- Or kill process: `lsof -ti:5000 | xargs kill`

**Frontend not loading:**
- Clear browser cache
- Check console for errors
- Verify Vite is running (dev mode)

**Session/login issues:**
- Check `SESSION_SECRET` is set
- Clear browser cookies
- Restart server

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🙏 Credits

Built with modern web technologies:
- [React](https://react.dev)
- [Express](https://expressjs.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Happy building! 🎉**
