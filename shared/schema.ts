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

/**
 * ✅ NEW: READING SESSIONS (لجلسات القراءة: minutes/pages/date)
 * - كتخدم مع الكتب والمقالات (وحتى أي type فـ readingList)
 */
export const readingSessions = pgTable("reading_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  readingItemId: integer("reading_item_id").notNull().references(() => readingList.id),

  sessionDate: date("session_date").notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(0),
  pagesRead: integer("pages_read").notNull().default(0),

  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * ✅ NEW: READING NOTES / HIGHLIGHTS
 */
export const readingNotes = pgTable("reading_notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),

  readingItemId: integer("reading_item_id").references(() => readingList.id),
  sessionId: integer("session_id").references(() => readingSessions.id),

  kind: text("kind").notNull().default("note"), // 'note' | 'highlight'
  content: text("content").notNull(),
  pageOrTime: text("page_or_time"), // "p.34" أو "12:10"
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

  // ✅ NEW
  readingSessions: many(readingSessions),
  readingNotes: many(readingNotes),
}));

// ===== SECOND BRAIN / NOTES =====
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags"), // Comma-separated tags
  category: text("category"), // 'idea' | 'thought' | 'learning' | 'goal' | 'reflection' | 'misc'
  isPinned: boolean("is_pinned").notNull().default(false),
  isFavorite: boolean("is_favorite").notNull().default(false),
  color: text("color"), // For visual organization
  linkedNoteIds: text("linked_note_ids"), // Comma-separated IDs of connected notes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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

export const readingListRelations = relations(readingList, ({ one, many }) => ({
  user: one(users, { fields: [readingList.userId], references: [users.id] }),

  // ✅ NEW
  sessions: many(readingSessions),
  readingNotes: many(readingNotes),
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

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, { fields: [notes.userId], references: [users.id] }),
}));

// ✅ NEW: relations for reading sessions / notes
export const readingSessionsRelations = relations(readingSessions, ({ one, many }) => ({
  user: one(users, { fields: [readingSessions.userId], references: [users.id] }),
  item: one(readingList, { fields: [readingSessions.readingItemId], references: [readingList.id] }),
  notes: many(readingNotes),
}));

export const readingNotesRelations = relations(readingNotes, ({ one }) => ({
  user: one(users, { fields: [readingNotes.userId], references: [users.id] }),
  item: one(readingList, { fields: [readingNotes.readingItemId], references: [readingList.id] }),
  session: one(readingSessions, { fields: [readingNotes.sessionId], references: [readingSessions.id] }),
}));

// ===== RECOVERY =====
export const recoveryProfiles = pgTable("recovery_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  addictionType: text("addiction_type").notNull(), // substance, behavior, etc.
  sobrietyStartDate: date("sobriety_start_date").notNull(),
  motivation: text("motivation"), // Why they want to recover
  triggers: text("triggers"), // Known triggers (JSON array)
  supportContacts: text("support_contacts"), // Emergency contacts (JSON array)
  dailyGoal: text("daily_goal"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const recoveryCheckIns = pgTable("recovery_check_ins", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => recoveryProfiles.id),
  date: date("date").notNull(),
  isClean: boolean("is_clean").notNull(),
  mood: integer("mood").notNull(), // 1-10 scale
  urgeIntensity: integer("urge_intensity"), // 0-10 scale
  triggersEncountered: text("triggers_encountered"), // Comma-separated
  copingStrategiesUsed: text("coping_strategies_used"), // Comma-separated
  gratitude: text("gratitude"), // What they're grateful for
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recoveryMilestones = pgTable("recovery_milestones", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => recoveryProfiles.id),
  days: integer("days").notNull(), // 1, 7, 30, 90, 180, 365, etc.
  achievedAt: timestamp("achieved_at").notNull(),
  celebrated: boolean("celebrated").notNull().default(false),
  note: text("note"),
});

export const recoveryCopingStrategies = pgTable("recovery_coping_strategies", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => recoveryProfiles.id),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"), // 'physical', 'mental', 'social', 'spiritual'
  effectiveness: integer("effectiveness"), // 1-5 rating
  timesUsed: integer("times_used").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recoveryJournal = pgTable("recovery_journal", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => recoveryProfiles.id),
  date: timestamp("date").notNull(),
  entry: text("entry").notNull(),
  mood: integer("mood"), // 1-10
  createdAt: timestamp("created_at").defaultNow(),
});

export const recoveryProfilesRelations = relations(recoveryProfiles, ({ one, many }) => ({
  user: one(users, { fields: [recoveryProfiles.userId], references: [users.id] }),
  checkIns: many(recoveryCheckIns),
  milestones: many(recoveryMilestones),
  copingStrategies: many(recoveryCopingStrategies),
  journal: many(recoveryJournal),
}));

export const recoveryCheckInsRelations = relations(recoveryCheckIns, ({ one }) => ({
  profile: one(recoveryProfiles, { fields: [recoveryCheckIns.profileId], references: [recoveryProfiles.id] }),
}));

export const recoveryMilestonesRelations = relations(recoveryMilestones, ({ one }) => ({
  profile: one(recoveryProfiles, { fields: [recoveryMilestones.profileId], references: [recoveryProfiles.id] }),
}));

export const recoveryCopingStrategiesRelations = relations(recoveryCopingStrategies, ({ one }) => ({
  profile: one(recoveryProfiles, { fields: [recoveryCopingStrategies.profileId], references: [recoveryProfiles.id] }),
}));

export const recoveryJournalRelations = relations(recoveryJournal, ({ one }) => ({
  profile: one(recoveryProfiles, { fields: [recoveryJournal.profileId], references: [recoveryProfiles.id] }),
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

export const insertPomodoroSessionSchema = createInsertSchema(pomodoroSessions).omit({ id: true, createdAt: true });
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true, createdAt: true, updatedAt: true });

export const insertRecoveryProfileSchema = createInsertSchema(recoveryProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRecoveryCheckInSchema = createInsertSchema(recoveryCheckIns).omit({ id: true, createdAt: true });
export const insertRecoveryMilestoneSchema = createInsertSchema(recoveryMilestones).omit({ id: true });
export const insertRecoveryCopingStrategySchema = createInsertSchema(recoveryCopingStrategies).omit({ id: true, createdAt: true });
export const insertRecoveryJournalSchema = createInsertSchema(recoveryJournal).omit({ id: true, createdAt: true });

// ✅ NEW: Reading schemas
export const insertReadingSessionSchema = createInsertSchema(readingSessions).omit({ id: true, createdAt: true });
export const insertReadingNoteSchema = createInsertSchema(readingNotes).omit({ id: true, createdAt: true });

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

export type PomodoroSession = typeof pomodoroSessions.$inferSelect;
export type Note = typeof notes.$inferSelect;

export type RecoveryProfile = typeof recoveryProfiles.$inferSelect;
export type RecoveryCheckIn = typeof recoveryCheckIns.$inferSelect;
export type RecoveryMilestone = typeof recoveryMilestones.$inferSelect;
export type RecoveryCopingStrategy = typeof recoveryCopingStrategies.$inferSelect;
export type RecoveryJournalEntry = typeof recoveryJournal.$inferSelect;

// ✅ NEW: Reading types
export type ReadingSession = typeof readingSessions.$inferSelect;
export type ReadingNote = typeof readingNotes.$inferSelect;

// ===== INSERT TYPES =====
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

export type InsertPomodoroSession = z.infer<typeof insertPomodoroSessionSchema>;
export type InsertNote = z.infer<typeof insertNoteSchema>;

export type InsertRecoveryProfile = z.infer<typeof insertRecoveryProfileSchema>;
export type InsertRecoveryCheckIn = z.infer<typeof insertRecoveryCheckInSchema>;
export type InsertRecoveryMilestone = z.infer<typeof insertRecoveryMilestoneSchema>;
export type InsertRecoveryCopingStrategy = z.infer<typeof insertRecoveryCopingStrategySchema>;
export type InsertRecoveryJournalEntry = z.infer<typeof insertRecoveryJournalSchema>;

// ✅ NEW: Reading insert types
export type InsertReadingSession = z.infer<typeof insertReadingSessionSchema>;
export type InsertReadingNote = z.infer<typeof insertReadingNoteSchema>;
