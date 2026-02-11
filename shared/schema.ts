import { pgTable, text, serial, integer, boolean, timestamp, date, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// ===== USERS =====
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== TASKS =====
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("todo"), // 'todo' | 'done'
  priority: text("priority").default("medium"), // 'low' | 'medium' | 'high'
  dueDate: timestamp("due_date"),
  layer: text("layer").default("day"), // 'day' | 'week' | 'year'
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== HABITS =====
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  category: text("category"),
  type: text("type").notNull().default("boolean"), // 'boolean' | 'number'
  createdAt: timestamp("created_at").defaultNow(),
});

export const habitLogs = pgTable("habit_logs", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").notNull().references(() => habits.id),
  date: text("date").notNull(), // YYYY-MM-DD
  value: integer("value").notNull(), // 1 for true, 0 for false, or actual number
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== GOALS =====
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  targetDate: date("target_date"),
  status: text("status").notNull().default("active"), // 'active' | 'paused' | 'completed'
  progress: integer("progress").default(0), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== FINANCE =====
export const financeEntries = pgTable("finance_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'income' | 'expense'
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  date: date("date").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== WELLNESS =====
export const wellnessLogs = pgTable("wellness_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: date("date").notNull(),
  mood: integer("mood"), // 1-5 scale
  energy: integer("energy"), // 1-5 scale
  sleepHours: numeric("sleep_hours", { precision: 3, scale: 1 }),
  waterIntake: integer("water_intake"), // glasses or ml
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== NUTRITION =====
export const nutritionLogs = pgTable("nutrition_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: date("date").notNull(),
  mealType: text("meal_type").notNull(), // 'breakfast' | 'lunch' | 'dinner' | 'snack'
  description: text("description").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== READING LIST / WATCH LIST =====
export const readingList = pgTable("reading_list", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  type: text("type").notNull().default("book"), // 'book' | 'movie' | 'show' | 'article'
  status: text("status").notNull().default("planned"), // 'planned' | 'in-progress' | 'completed'
  rating: integer("rating"), // 1-5
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== TIMELINE =====
export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  dateTime: timestamp("date_time").notNull(),
  type: text("type").notNull(), // 'task' | 'habit' | 'goal' | 'wellness' | 'finance' | 'note'
  title: text("title").notNull(),
  details: text("details"), // JSON string
  sourceId: integer("source_id"), // reference to original record
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== HABIT REDUCTION (Break the Loop) =====
export const habitReduction = pgTable("habit_reduction", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  goalType: text("goal_type").notNull().default("reduce"), // 'reduce' | 'quit'
  startDate: date("start_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const habitReductionLogs = pgTable("habit_reduction_logs", {
  id: serial("id").primaryKey(),
  trackerId: integer("tracker_id").notNull().references(() => habitReduction.id),
  date: date("date").notNull(),
  occurred: boolean("occurred").notNull(),
  intensity: integer("intensity"), // 1-5 scale
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pomodoroSessions = pgTable("pomodoro_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'work' | 'short-break' | 'long-break'
  duration: integer("duration").notNull(), // in minutes
  completed: boolean("completed").notNull().default(false),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== RELATIONS =====
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  habits: many(habits),
  goals: many(goals),
  financeEntries: many(financeEntries),
  wellnessLogs: many(wellnessLogs),
  nutritionLogs: many(nutritionLogs),
  readingList: many(readingList),
  timelineEvents: many(timelineEvents),
  habitReductions: many(habitReduction),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
}));

export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(users, { fields: [habits.userId], references: [users.id] }),
  logs: many(habitLogs),
}));

export const habitLogsRelations = relations(habitLogs, ({ one }) => ({
  habit: one(habits, { fields: [habitLogs.habitId], references: [habits.id] }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, { fields: [goals.userId], references: [users.id] }),
}));

export const financeEntriesRelations = relations(financeEntries, ({ one }) => ({
  user: one(users, { fields: [financeEntries.userId], references: [users.id] }),
}));

export const wellnessLogsRelations = relations(wellnessLogs, ({ one }) => ({
  user: one(users, { fields: [wellnessLogs.userId], references: [users.id] }),
}));

export const nutritionLogsRelations = relations(nutritionLogs, ({ one }) => ({
  user: one(users, { fields: [nutritionLogs.userId], references: [users.id] }),
}));

export const readingListRelations = relations(readingList, ({ one }) => ({
  user: one(users, { fields: [readingList.userId], references: [users.id] }),
}));

export const timelineEventsRelations = relations(timelineEvents, ({ one }) => ({
  user: one(users, { fields: [timelineEvents.userId], references: [users.id] }),
}));

export const habitReductionRelations = relations(habitReduction, ({ one, many }) => ({
  user: one(users, { fields: [habitReduction.userId], references: [users.id] }),
  logs: many(habitReductionLogs),
}));

export const habitReductionLogsRelations = relations(habitReductionLogs, ({ one }) => ({
  tracker: one(habitReduction, { fields: [habitReductionLogs.trackerId], references: [habitReduction.id] }),
}));

export const pomodoroSessionsRelations = relations(pomodoroSessions, ({ one }) => ({
  user: one(users, { fields: [pomodoroSessions.userId], references: [users.id] }),
}));
// ===== SCHEMAS =====
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true });
export const insertHabitSchema = createInsertSchema(habits).omit({ id: true, createdAt: true });
export const insertHabitLogSchema = createInsertSchema(habitLogs).omit({ id: true, createdAt: true });
export const insertGoalSchema = createInsertSchema(goals).omit({ id: true, createdAt: true });
export const insertFinanceEntrySchema = createInsertSchema(financeEntries).omit({ id: true, createdAt: true });
export const insertWellnessLogSchema = createInsertSchema(wellnessLogs).omit({ id: true, createdAt: true });
export const insertNutritionLogSchema = createInsertSchema(nutritionLogs).omit({ id: true, createdAt: true });
export const insertReadingItemSchema = createInsertSchema(readingList).omit({ id: true, createdAt: true });
export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({ id: true, createdAt: true });
export const insertHabitReductionSchema = createInsertSchema(habitReduction).omit({ id: true, createdAt: true });
export const insertHabitReductionLogSchema = createInsertSchema(habitReductionLogs).omit({ id: true, createdAt: true });

// ===== TYPES =====
export type User = typeof users.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Habit = typeof habits.$inferSelect;
export type HabitLog = typeof habitLogs.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type FinanceEntry = typeof financeEntries.$inferSelect;
export type WellnessLog = typeof wellnessLogs.$inferSelect;
export type NutritionLog = typeof nutritionLogs.$inferSelect;
export type ReadingItem = typeof readingList.$inferSelect;
export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type HabitReduction = typeof habitReduction.$inferSelect;
export type HabitReductionLog = typeof habitReductionLogs.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type InsertHabitLog = z.infer<typeof insertHabitLogSchema>;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type InsertFinanceEntry = z.infer<typeof insertFinanceEntrySchema>;
export type InsertWellnessLog = z.infer<typeof insertWellnessLogSchema>;
export type InsertNutritionLog = z.infer<typeof insertNutritionLogSchema>;
export type InsertReadingItem = z.infer<typeof insertReadingItemSchema>;
export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;
export type InsertHabitReduction = z.infer<typeof insertHabitReductionSchema>;
export type InsertHabitReductionLog = z.infer<typeof insertHabitReductionLogSchema>;
export type PomodoroSession = typeof pomodoroSessions.$inferSelect;
export const insertPomodoroSessionSchema = createInsertSchema(pomodoroSessions).omit({ id: true, createdAt: true });
export type InsertPomodoroSession = z.infer<typeof insertPomodoroSessionSchema>;