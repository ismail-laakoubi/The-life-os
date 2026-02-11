import { z } from "zod";

const createRouteDefinition = <TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny = z.ZodTypeAny>(
  path: string,
  input?: TInput,
  output?: TOutput
) => ({ path, input: input || z.any(), output: output || z.any() });

export const api = {
  // Tasks
  tasks: {
    list: createRouteDefinition("/api/tasks"),
    create: createRouteDefinition(
      "/api/tasks",
      z.object({
        title: z.string(),
        description: z.string().optional(),
        status: z.enum(["todo", "done"]).default("todo"),
        priority: z.enum(["low", "medium", "high"]).optional(),
        dueDate: z.string().optional(),
        layer: z.enum(["day", "week", "year"]).optional(),
      })
    ),
    update: createRouteDefinition(
      "/api/tasks/:id",
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["todo", "done"]).optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
        dueDate: z.string().optional(),
        layer: z.enum(["day", "week", "year"]).optional(),
      })
    ),
    delete: createRouteDefinition("/api/tasks/:id"),
  },

  // Habits
  habits: {
    list: createRouteDefinition("/api/habits"),
    create: createRouteDefinition(
      "/api/habits",
      z.object({
        title: z.string(),
        category: z.string().optional(),
        type: z.enum(["boolean", "number"]).default("boolean"),
      })
    ),
    delete: createRouteDefinition("/api/habits/:id"),
    log: createRouteDefinition(
      "/api/habits/:id/log",
      z.object({
        date: z.string(), // YYYY-MM-DD
        value: z.number(),
      })
    ),
  },

  // Goals
  goals: {
    list: createRouteDefinition("/api/goals"),
    create: createRouteDefinition(
      "/api/goals",
      z.object({
        title: z.string(),
        description: z.string().optional(),
        targetDate: z.string().optional(),
        status: z.enum(["active", "paused", "completed"]).default("active"),
        progress: z.number().min(0).max(100).default(0),
      })
    ),
    update: createRouteDefinition(
      "/api/goals/:id",
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        targetDate: z.string().optional(),
        status: z.enum(["active", "paused", "completed"]).optional(),
        progress: z.number().min(0).max(100).optional(),
      })
    ),
    delete: createRouteDefinition("/api/goals/:id"),
  },

  // Finance
  finance: {
    list: createRouteDefinition("/api/finance"),
    create: createRouteDefinition(
      "/api/finance",
      z.object({
        type: z.enum(["income", "expense"]),
        amount: z.string(),
        category: z.string(),
        date: z.string(),
        note: z.string().optional(),
      })
    ),
    delete: createRouteDefinition("/api/finance/:id"),
  },

  // Wellness
  wellness: {
    list: createRouteDefinition("/api/wellness"),
    create: createRouteDefinition(
      "/api/wellness",
      z.object({
        date: z.string(),
        mood: z.number().min(1).max(5).optional(),
        energy: z.number().min(1).max(5).optional(),
        sleepHours: z.string().optional(),
        waterIntake: z.number().optional(),
        notes: z.string().optional(),
      })
    ),
    update: createRouteDefinition(
      "/api/wellness/:id",
      z.object({
        id: z.number(),
        mood: z.number().min(1).max(5).optional(),
        energy: z.number().min(1).max(5).optional(),
        sleepHours: z.string().optional(),
        waterIntake: z.number().optional(),
        notes: z.string().optional(),
      })
    ),
  },

  // Nutrition
  nutrition: {
    list: createRouteDefinition("/api/nutrition"),
    create: createRouteDefinition(
      "/api/nutrition",
      z.object({
        date: z.string(),
        mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
        description: z.string(),
        notes: z.string().optional(),
      })
    ),
    delete: createRouteDefinition("/api/nutrition/:id"),
  },

  // Reading List
  reading: {
    list: createRouteDefinition("/api/reading"),
    create: createRouteDefinition(
      "/api/reading",
      z.object({
        title: z.string(),
        type: z.enum(["book", "movie", "show", "article"]).default("book"),
        status: z.enum(["planned", "in-progress", "completed"]).default("planned"),
        rating: z.number().min(1).max(5).optional(),
        notes: z.string().optional(),
      })
    ),
    update: createRouteDefinition(
      "/api/reading/:id",
      z.object({
        id: z.number(),
        status: z.enum(["planned", "in-progress", "completed"]).optional(),
        rating: z.number().min(1).max(5).optional(),
        notes: z.string().optional(),
      })
    ),
    delete: createRouteDefinition("/api/reading/:id"),
  },

  // Timeline
  timeline: {
    list: createRouteDefinition("/api/timeline"),
    create: createRouteDefinition(
      "/api/timeline",
      z.object({
        dateTime: z.string(),
        type: z.enum(["task", "habit", "goal", "wellness", "finance", "note"]),
        title: z.string(),
        details: z.string().optional(),
        sourceId: z.number().optional(),
      })
    ),
  },

  // Habit Reduction
  habitReduction: {
    list: createRouteDefinition("/api/habit-reduction"),
    create: createRouteDefinition(
      "/api/habit-reduction",
      z.object({
        title: z.string(),
        goalType: z.enum(["reduce", "quit"]).default("reduce"),
        startDate: z.string(),
        notes: z.string().optional(),
      })
    ),
    log: createRouteDefinition(
      "/api/habit-reduction/:id/log",
      z.object({
        date: z.string(),
        occurred: z.boolean(),
        intensity: z.number().min(1).max(5).optional(),
        notes: z.string().optional(),
      })
    ),
    delete: createRouteDefinition("/api/habit-reduction/:id"),
  },
};
