import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { api } from "@shared/routes";

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
        date: new Date().toISOString().split('T')[0],
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

  return httpServer;
}
