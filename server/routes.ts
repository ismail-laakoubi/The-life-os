import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication first
  setupAuth(app);

  // Seed demo data in development
  if (app.get("env") !== "production") {
    const existingUser = await storage.getUserByUsername("demo");
    if (!existingUser) {
      console.log("Seeding database...");
      const hashedPassword = await hashPassword("password123");
      const user = await storage.createUser({
        username: "demo",
        password: hashedPassword,
        name: "Demo User",
        email: "demo@example.com",
        avatarUrl: "https://ui.shadcn.com/avatars/01.png"
      });

      // Tasks
      await storage.createTask(user.id, {
        title: "Complete project setup",
        status: "done",
        priority: "high",
        layer: "day"
      });
      await storage.createTask(user.id, {
        title: "Review frontend designs",
        status: "todo",
        priority: "medium",
        layer: "week"
      });

      // Habits
      const habit = await storage.createHabit(user.id, {
        title: "Drink Water",
        type: "boolean",
        category: "health"
      });
      await storage.logHabit(habit.id, {
        date: new Date().toISOString().split("T")[0],
        value: 1
      });

      // Goals
      await storage.createGoal(user.id, {
        title: "Launch Life OS",
        description: "Complete the full-stack application",
        status: "active",
        progress: 75
      });

      console.log("Seeding complete. Login with demo/password123");
    }
  }

  // ========== TASKS ==========
  app.get(api.tasks.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const tasks = await storage.getTasks(req.user!.id);
    res.json(tasks);
  });

  app.post(api.tasks.create.path, async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.tasks.create.input.parse(req.body);
      const task = await storage.createTask(req.user!.id, input);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/tasks/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.tasks.update.input.parse({
        ...req.body,
        id: parseInt(req.params.id)
      });
      const { id, ...updates } = input;
      const task = await storage.updateTask(id, updates);
      res.json(task);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteTask(Number(req.params.id));
    res.sendStatus(204);
  });

  // ========== HABITS ==========
  app.get(api.habits.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const habits = await storage.getHabits(req.user!.id);
    res.json(habits);
  });

  app.post(api.habits.create.path, async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.habits.create.input.parse(req.body);
      const habit = await storage.createHabit(req.user!.id, input);
      res.status(201).json(habit);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/habits/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteHabit(Number(req.params.id));
    res.sendStatus(204);
  });

  app.post("/api/habits/:id/log", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.habits.log.input.parse(req.body);
      const log = await storage.logHabit(Number(req.params.id), input);
      res.status(201).json(log);
    } catch (error) {
      next(error);
    }
  });

  // ========== GOALS ==========
  app.get(api.goals.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const goals = await storage.getGoals(req.user!.id);
    res.json(goals);
  });

  app.post(api.goals.create.path, async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.goals.create.input.parse(req.body);
      const goal = await storage.createGoal(req.user!.id, input);
      res.status(201).json(goal);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/goals/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.goals.update.input.parse({
        ...req.body,
        id: parseInt(req.params.id)
      });
      const { id, ...updates } = input;
      const goal = await storage.updateGoal(id, updates);
      res.json(goal);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteGoal(Number(req.params.id));
    res.sendStatus(204);
  });

  // ========== FINANCE ==========
  app.get(api.finance.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const entries = await storage.getFinanceEntries(req.user!.id);
    res.json(entries);
  });

  app.post(api.finance.create.path, async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.finance.create.input.parse(req.body);
      const entry = await storage.createFinanceEntry(req.user!.id, input);
      res.status(201).json(entry);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/finance/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteFinanceEntry(Number(req.params.id));
    res.sendStatus(204);
  });

  // ========== WELLNESS ==========
  app.get(api.wellness.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const logs = await storage.getWellnessLogs(req.user!.id);
    res.json(logs);
  });

  app.post(api.wellness.create.path, async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.wellness.create.input.parse(req.body);
      const log = await storage.createWellnessLog(req.user!.id, input);
      res.status(201).json(log);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/wellness/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.wellness.update.input.parse({
        ...req.body,
        id: parseInt(req.params.id)
      });
      const { id, ...updates } = input;
      const log = await storage.updateWellnessLog(id, updates);
      res.json(log);
    } catch (error) {
      next(error);
    }
  });

  // ========== NUTRITION ==========
  app.get(api.nutrition.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const logs = await storage.getNutritionLogs(req.user!.id);
    res.json(logs);
  });

  app.post(api.nutrition.create.path, async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.nutrition.create.input.parse(req.body);
      const log = await storage.createNutritionLog(req.user!.id, input);
      res.status(201).json(log);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/nutrition/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteNutritionLog(Number(req.params.id));
    res.sendStatus(204);
  });

  // ========== READING LIST ==========
  app.get(api.reading.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const items = await storage.getReadingList(req.user!.id);
    res.json(items);
  });

  app.post(api.reading.create.path, async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.reading.create.input.parse(req.body);
      const item = await storage.createReadingItem(req.user!.id, input);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/reading/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.reading.update.input.parse({
        ...req.body,
        id: parseInt(req.params.id)
      });
      const { id, ...updates } = input;
      const item = await storage.updateReadingItem(id, updates);
      res.json(item);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/reading/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteReadingItem(Number(req.params.id));
    res.sendStatus(204);
  });

  // ============================
  // ✅ NEW: READING SESSIONS
  // ============================
  app.get("/api/reading/sessions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const itemIdRaw = req.query.itemId;
    const readingItemId = itemIdRaw ? Number(itemIdRaw) : undefined;

    const sessions = await storage.getReadingSessions(req.user!.id, readingItemId);
    res.json(sessions);
  });

  app.post("/api/reading/sessions", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const input = z.object({
        readingItemId: z.number().int(),
        sessionDate: z.string().min(10).max(10), // YYYY-MM-DD
        durationMinutes: z.number().int().min(0).default(0),
        pagesRead: z.number().int().min(0).default(0),
        note: z.string().optional(),
      }).parse(req.body);

      const session = await storage.createReadingSession(req.user!.id, input);
      res.status(201).json(session);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/reading/sessions/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      await storage.deleteReadingSession(req.user!.id, Number(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  // ============================
  // ✅ NEW: READING NOTES
  // ============================
  app.get("/api/reading/notes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const itemIdRaw = req.query.itemId;
    const readingItemId = itemIdRaw ? Number(itemIdRaw) : undefined;

    const notes = await storage.getReadingNotes(req.user!.id, readingItemId);
    res.json(notes);
  });

  app.post("/api/reading/notes", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const input = z.object({
        readingItemId: z.number().int().optional(),
        sessionId: z.number().int().optional(),
        kind: z.enum(["note", "highlight"]).default("note"),
        content: z.string().min(1),
        pageOrTime: z.string().optional(),
      }).parse(req.body);

      const note = await storage.createReadingNote(req.user!.id, input);
      res.status(201).json(note);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/reading/notes/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      await storage.deleteReadingNote(req.user!.id, Number(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  // ============================
  // ✅ NEW: WEEKLY STATS + STREAK
  // ============================
  app.get("/api/reading/stats/weekly", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const q = z.object({
        start: z.string().min(10).max(10), // YYYY-MM-DD
        end: z.string().min(10).max(10),   // YYYY-MM-DD
      }).parse(req.query);

      const stats = await storage.getReadingWeeklyStats(req.user!.id, q.start, q.end);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  });

  // ========== TIMELINE ==========
  app.get(api.timeline.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const events = await storage.getTimelineEvents(req.user!.id);
    res.json(events);
  });

  app.post(api.timeline.create.path, async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.timeline.create.input.parse(req.body);
      const event = await storage.createTimelineEvent(req.user!.id, input);
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  });

  // ========== HABIT REDUCTION ==========
  app.get(api.habitReduction.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const trackers = await storage.getHabitReductions(req.user!.id);
    res.json(trackers);
  });

  app.post(api.habitReduction.create.path, async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.habitReduction.create.input.parse(req.body);
      const tracker = await storage.createHabitReduction(req.user!.id, input);
      res.status(201).json(tracker);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/habit-reduction/:id/log", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.habitReduction.log.input.parse(req.body);
      const log = await storage.logHabitReduction(Number(req.params.id), input);
      res.status(201).json(log);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/habit-reduction/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteHabitReduction(Number(req.params.id));
    res.sendStatus(204);
  });

  // ========== POMODORO ==========
  app.get("/api/pomodoro", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const sessions = await storage.getPomodoroSessions(req.user!.id);
    res.json(sessions);
  });

  app.post("/api/pomodoro", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const session = await storage.createPomodoroSession(req.user!.id, req.body);
      res.status(201).json(session);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/pomodoro/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const session = await storage.updatePomodoroSession(Number(req.params.id), req.body);
      res.json(session);
    } catch (error) {
      next(error);
    }
  });

  // ========== SECOND BRAIN / NOTES ==========
  app.get("/api/notes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const notes = await storage.getNotes(req.user!.id);
    res.json(notes);
  });

  app.post("/api/notes", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const note = await storage.createNote(req.user!.id, req.body);
      res.status(201).json(note);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/notes/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const note = await storage.updateNote(Number(req.params.id), req.body);
      res.json(note);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/notes/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      await storage.deleteNote(Number(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  // ========== RECOVERY ==========
  app.get("/api/recovery/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const profile = await storage.getRecoveryProfile(req.user!.id);
    res.json(profile || null);
  });

  app.post("/api/recovery/profile", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const profile = await storage.createRecoveryProfile(req.user!.id, req.body);
      res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/recovery/profile/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const profile = await storage.updateRecoveryProfile(Number(req.params.id), req.body);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/recovery/check-ins/:profileId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const checkIns = await storage.getRecoveryCheckIns(Number(req.params.profileId));
    res.json(checkIns);
  });

  app.post("/api/recovery/check-ins/:profileId", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const checkIn = await storage.createRecoveryCheckIn(Number(req.params.profileId), req.body);
      res.status(201).json(checkIn);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/recovery/milestones/:profileId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const milestones = await storage.getRecoveryMilestones(Number(req.params.profileId));
    res.json(milestones);
  });

  app.post("/api/recovery/milestones/:profileId", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const milestone = await storage.createRecoveryMilestone(Number(req.params.profileId), req.body);
      res.status(201).json(milestone);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/recovery/milestones/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const milestone = await storage.updateRecoveryMilestone(Number(req.params.id), req.body);
      res.json(milestone);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/recovery/coping-strategies/:profileId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const strategies = await storage.getCopingStrategies(Number(req.params.profileId));
    res.json(strategies);
  });

  app.post("/api/recovery/coping-strategies/:profileId", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const strategy = await storage.createCopingStrategy(Number(req.params.profileId), req.body);
      res.status(201).json(strategy);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/recovery/coping-strategies/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const strategy = await storage.updateCopingStrategy(Number(req.params.id), req.body);
      res.json(strategy);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/recovery/coping-strategies/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      await storage.deleteCopingStrategy(Number(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/recovery/journal/:profileId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const entries = await storage.getRecoveryJournalEntries(Number(req.params.profileId));
    res.json(entries);
  });

  app.post("/api/recovery/journal/:profileId", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const entry = await storage.createRecoveryJournalEntry(Number(req.params.profileId), req.body);
      res.status(201).json(entry);
    } catch (error) {
      next(error);
    }
  });

  return httpServer;
}
