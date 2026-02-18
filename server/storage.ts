import { db } from "./db";
import {
  users,
  tasks,
  habits,
  habitLogs,
  goals,
  financeEntries,
  wellnessLogs,
  nutritionLogs,
  timelineEvents,
  habitReduction,
  habitReductionLogs,
  readingList,
  pomodoroSessions,
  notes,
  recoveryProfiles,
  recoveryCheckIns,
  recoveryMilestones,
  recoveryCopingStrategies,
  recoveryJournal,

  // ✅ NEW (Reading sessions + notes)
  readingSessions,
  readingNotes,

  type User,
  type Task,
  type Habit,
  type HabitLog,
  type Goal,
  type FinanceEntry,
  type WellnessLog,
  type NutritionLog,
  type TimelineEvent,
  type HabitReduction,
  type HabitReductionLog,
  type ReadingItem,
  type PomodoroSession,
  type Note,

  // ✅ NEW types
  type ReadingSession,
  type ReadingNote,

  // ✅ Insert types
  type InsertTask,
  type InsertHabit,
  type InsertGoal,
  type InsertFinanceEntry,
  type InsertWellnessLog,
  type InsertNutritionLog,
  type InsertReadingItem,
  type InsertTimelineEvent,
  type InsertHabitReduction,
  type InsertHabitReductionLog,
  type InsertPomodoroSession,
  type InsertNote,
  type InsertRecoveryProfile,
  type InsertRecoveryCheckIn,
  type InsertRecoveryMilestone,
  type InsertRecoveryCopingStrategy,
  type InsertRecoveryJournalEntry,

  // ✅ NEW Insert types
  type InsertReadingSession,
  type InsertReadingNote,
} from "@shared/schema";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";

// ===== USERS =====
export async function createUser(data: {
  username: string;
  password: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}): Promise<User> {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.username, username));
  return user;
}

export async function getUserById(id: number): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return user;
}

// ===== TASKS =====
export async function getTasks(userId: number): Promise<Task[]> {
  return db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.createdAt));
}

export async function createTask(userId: number, data: Omit<InsertTask, "userId">): Promise<Task> {
  const [task] = await db.insert(tasks).values({ ...data, userId }).returning();
  return task;
}

export async function updateTask(id: number, data: Partial<Task>): Promise<Task> {
  const [task] = await db.update(tasks).set(data).where(eq(tasks.id, id)).returning();
  return task;
}

export async function deleteTask(id: number): Promise<void> {
  await db.delete(tasks).where(eq(tasks.id, id));
}

// ===== HABITS =====
export async function getHabits(userId: number): Promise<(Habit & { logs: HabitLog[] })[]> {
  const userHabits = await db.select().from(habits).where(eq(habits.userId, userId));

  const habitsWithLogs = await Promise.all(
    userHabits.map(async (habit) => {
      const logs = await db.select().from(habitLogs).where(eq(habitLogs.habitId, habit.id));
      return { ...habit, logs };
    })
  );

  return habitsWithLogs;
}

export async function createHabit(userId: number, data: Omit<InsertHabit, "userId">): Promise<Habit> {
  const [habit] = await db.insert(habits).values({ ...data, userId }).returning();
  return habit;
}

export async function deleteHabit(id: number): Promise<void> {
  await db.delete(habitLogs).where(eq(habitLogs.habitId, id));
  await db.delete(habits).where(eq(habits.id, id));
}

export async function logHabit(habitId: number, data: { date: string; value: number }): Promise<HabitLog> {
  const existing = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, data.date)));

  if (existing.length > 0) {
    const [updated] = await db
      .update(habitLogs)
      .set({ value: data.value })
      .where(eq(habitLogs.id, existing[0].id))
      .returning();
    return updated;
  }

  const [log] = await db.insert(habitLogs).values({ habitId, ...data }).returning();
  return log;
}

// ===== GOALS =====
export async function getGoals(userId: number): Promise<Goal[]> {
  return db.select().from(goals).where(eq(goals.userId, userId)).orderBy(desc(goals.createdAt));
}

export async function createGoal(userId: number, data: Omit<InsertGoal, "userId">): Promise<Goal> {
  const [goal] = await db.insert(goals).values({ ...data, userId }).returning();
  return goal;
}

export async function updateGoal(id: number, data: Partial<Goal>): Promise<Goal> {
  const [goal] = await db.update(goals).set(data).where(eq(goals.id, id)).returning();
  return goal;
}

export async function deleteGoal(id: number): Promise<void> {
  await db.delete(goals).where(eq(goals.id, id));
}

// ===== FINANCE =====
export async function getFinanceEntries(userId: number): Promise<FinanceEntry[]> {
  return db
    .select()
    .from(financeEntries)
    .where(eq(financeEntries.userId, userId))
    .orderBy(desc(financeEntries.date));
}

export async function createFinanceEntry(userId: number, data: Omit<InsertFinanceEntry, "userId">): Promise<FinanceEntry> {
  const [entry] = await db.insert(financeEntries).values({ ...data, userId }).returning();
  return entry;
}

export async function deleteFinanceEntry(id: number): Promise<void> {
  await db.delete(financeEntries).where(eq(financeEntries.id, id));
}

// ===== WELLNESS =====
export async function getWellnessLogs(userId: number): Promise<WellnessLog[]> {
  return db.select().from(wellnessLogs).where(eq(wellnessLogs.userId, userId)).orderBy(desc(wellnessLogs.date));
}

export async function createWellnessLog(userId: number, data: Omit<InsertWellnessLog, "userId">): Promise<WellnessLog> {
  const [log] = await db.insert(wellnessLogs).values({ ...data, userId }).returning();
  return log;
}

export async function updateWellnessLog(id: number, data: Partial<WellnessLog>): Promise<WellnessLog> {
  const [log] = await db.update(wellnessLogs).set(data).where(eq(wellnessLogs.id, id)).returning();
  return log;
}

// ===== NUTRITION =====
export async function getNutritionLogs(userId: number): Promise<NutritionLog[]> {
  return db.select().from(nutritionLogs).where(eq(nutritionLogs.userId, userId)).orderBy(desc(nutritionLogs.date));
}

export async function createNutritionLog(userId: number, data: Omit<InsertNutritionLog, "userId">): Promise<NutritionLog> {
  const [log] = await db.insert(nutritionLogs).values({ ...data, userId }).returning();
  return log;
}

export async function deleteNutritionLog(id: number): Promise<void> {
  await db.delete(nutritionLogs).where(eq(nutritionLogs.id, id));
}

// ===== READING LIST =====
export async function getReadingList(userId: number): Promise<ReadingItem[]> {
  return db.select().from(readingList).where(eq(readingList.userId, userId)).orderBy(desc(readingList.createdAt));
}

export async function createReadingItem(userId: number, data: Omit<InsertReadingItem, "userId">): Promise<ReadingItem> {
  const [item] = await db.insert(readingList).values({ ...data, userId }).returning();
  return item;
}

export async function updateReadingItem(id: number, data: Partial<ReadingItem>): Promise<ReadingItem> {
  const [item] = await db.update(readingList).set(data).where(eq(readingList.id, id)).returning();
  return item;
}

export async function deleteReadingItem(id: number): Promise<void> {
  await db.delete(readingList).where(eq(readingList.id, id));
}

/**
 * ✅ NEW: Reading Sessions
 */
export async function getReadingSessions(userId: number, readingItemId?: number): Promise<ReadingSession[]> {
  if (readingItemId) {
    return db
      .select()
      .from(readingSessions)
      .where(and(eq(readingSessions.userId, userId), eq(readingSessions.readingItemId, readingItemId)))
      .orderBy(desc(readingSessions.createdAt));
  }
  return db
    .select()
    .from(readingSessions)
    .where(eq(readingSessions.userId, userId))
    .orderBy(desc(readingSessions.createdAt));
}

export async function createReadingSession(
  userId: number,
  data: Omit<InsertReadingSession, "userId">
): Promise<ReadingSession> {
  const [session] = await db.insert(readingSessions).values({ ...data, userId }).returning();

  // ✨ Bonus: إذا كان item planned نخليه in-progress أوتوماتيكياً
  await db
    .update(readingList)
    .set({
      status: sql`CASE WHEN ${readingList.status} = 'planned' THEN 'in-progress' ELSE ${readingList.status} END`,
    })
    .where(eq(readingList.id, data.readingItemId));

  return session;
}

export async function deleteReadingSession(userId: number, id: number): Promise<void> {
  // delete notes attached to session first
  await db.delete(readingNotes).where(and(eq(readingNotes.sessionId, id), eq(readingNotes.userId, userId)));
  await db.delete(readingSessions).where(and(eq(readingSessions.id, id), eq(readingSessions.userId, userId)));
}

/**
 * ✅ NEW: Reading Notes / Highlights
 */
export async function getReadingNotes(userId: number, readingItemId?: number): Promise<ReadingNote[]> {
  if (readingItemId) {
    return db
      .select()
      .from(readingNotes)
      .where(and(eq(readingNotes.userId, userId), eq(readingNotes.readingItemId, readingItemId)))
      .orderBy(desc(readingNotes.createdAt));
  }

  return db
    .select()
    .from(readingNotes)
    .where(eq(readingNotes.userId, userId))
    .orderBy(desc(readingNotes.createdAt));
}

export async function createReadingNote(
  userId: number,
  data: Omit<InsertReadingNote, "userId">
): Promise<ReadingNote> {
  const [note] = await db.insert(readingNotes).values({ ...data, userId }).returning();
  return note;
}

export async function deleteReadingNote(userId: number, id: number): Promise<void> {
  await db.delete(readingNotes).where(and(eq(readingNotes.id, id), eq(readingNotes.userId, userId)));
}

/**
 * ✅ NEW: Weekly stats + streak
 * start/end: YYYY-MM-DD (date)
 */
export async function getReadingWeeklyStats(userId: number, start: string, end: string) {
  const [agg] = await db
    .select({
      minutes: sql<number>`COALESCE(SUM(${readingSessions.durationMinutes}), 0)`,
      pages: sql<number>`COALESCE(SUM(${readingSessions.pagesRead}), 0)`,
      sessions: sql<number>`COUNT(*)`,
    })
    .from(readingSessions)
    .where(and(eq(readingSessions.userId, userId), gte(readingSessions.sessionDate, start), lte(readingSessions.sessionDate, end)));

  // streak days: list unique dates DESC
  const days = await db
    .select({ d: readingSessions.sessionDate })
    .from(readingSessions)
    .where(eq(readingSessions.userId, userId))
    .groupBy(readingSessions.sessionDate)
    .orderBy(desc(readingSessions.sessionDate));

  const streakDays = calcStreakDays(days.map((x) => x.d as unknown as string));

  return { ...agg, streakDays };
}

function calcStreakDays(datesDesc: string[]) {
  if (!datesDesc || datesDesc.length === 0) return 0;

  const toDay = (s: string) => {
    // date column => usually comes as string "YYYY-MM-DD"
    const t = new Date(`${s}T00:00:00Z`).getTime();
    return Math.floor(t / (1000 * 60 * 60 * 24));
  };

  let streak = 1;
  for (let i = 0; i < datesDesc.length - 1; i++) {
    const a = toDay(datesDesc[i]);
    const b = toDay(datesDesc[i + 1]);
    if (a - b === 1) streak++;
    else break;
  }
  return streak;
}

// ===== TIMELINE =====
export async function getTimelineEvents(userId: number): Promise<TimelineEvent[]> {
  return db.select().from(timelineEvents).where(eq(timelineEvents.userId, userId)).orderBy(desc(timelineEvents.dateTime));
}

export async function createTimelineEvent(userId: number, data: Omit<InsertTimelineEvent, "userId">): Promise<TimelineEvent> {
  const [event] = await db.insert(timelineEvents).values({ ...data, userId }).returning();
  return event;
}

// ===== HABIT REDUCTION =====
export async function getHabitReductions(userId: number): Promise<(HabitReduction & { logs: HabitReductionLog[] })[]> {
  const reductions = await db.select().from(habitReduction).where(eq(habitReduction.userId, userId));

  const reductionsWithLogs = await Promise.all(
    reductions.map(async (reduction) => {
      const logs = await db.select().from(habitReductionLogs).where(eq(habitReductionLogs.trackerId, reduction.id));
      return { ...reduction, logs };
    })
  );

  return reductionsWithLogs;
}

export async function createHabitReduction(userId: number, data: Omit<InsertHabitReduction, "userId">): Promise<HabitReduction> {
  const [reduction] = await db.insert(habitReduction).values({ ...data, userId }).returning();
  return reduction;
}

export async function logHabitReduction(trackerId: number, data: Omit<InsertHabitReductionLog, "trackerId">): Promise<HabitReductionLog> {
  const [log] = await db.insert(habitReductionLogs).values({ trackerId, ...data }).returning();
  return log;
}

export async function deleteHabitReduction(id: number): Promise<void> {
  await db.delete(habitReductionLogs).where(eq(habitReductionLogs.trackerId, id));
  await db.delete(habitReduction).where(eq(habitReduction.id, id));
}

// ===== POMODORO =====
export async function getPomodoroSessions(userId: number): Promise<PomodoroSession[]> {
  return db.select().from(pomodoroSessions).where(eq(pomodoroSessions.userId, userId)).orderBy(desc(pomodoroSessions.startedAt));
}

export async function createPomodoroSession(userId: number, data: Omit<InsertPomodoroSession, "userId">): Promise<PomodoroSession> {
  const [session] = await db.insert(pomodoroSessions).values({ ...data, userId }).returning();
  return session;
}

export async function updatePomodoroSession(id: number, data: Partial<InsertPomodoroSession>): Promise<PomodoroSession> {
  const [session] = await db.update(pomodoroSessions).set(data).where(eq(pomodoroSessions.id, id)).returning();
  return session;
}

// ===== NOTES =====
export async function getNotes(userId: number): Promise<Note[]> {
  return db.select().from(notes).where(eq(notes.userId, userId)).orderBy(desc(notes.updatedAt));
}

export async function createNote(userId: number, data: Omit<InsertNote, "userId">): Promise<Note> {
  const [note] = await db.insert(notes).values({ ...data, userId }).returning();
  return note;
}

export async function updateNote(id: number, data: Partial<InsertNote>): Promise<Note> {
  const [note] = await db
    .update(notes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(notes.id, id))
    .returning();
  return note;
}

export async function deleteNote(id: number): Promise<void> {
  await db.delete(notes).where(eq(notes.id, id));
}

export async function searchNotes(userId: number, query: string): Promise<Note[]> {
  // placeholder بسيط (تقدر تطوره بعد)
  return db.select().from(notes).where(and(eq(notes.userId, userId))).orderBy(desc(notes.updatedAt));
}

// ===== RECOVERY =====
export async function getRecoveryProfile(userId: number) {
  const [profile] = await db.select().from(recoveryProfiles).where(eq(recoveryProfiles.userId, userId));
  return profile;
}

export async function createRecoveryProfile(userId: number, data: Omit<InsertRecoveryProfile, "userId">) {
  const [profile] = await db.insert(recoveryProfiles).values({ ...data, userId }).returning();
  return profile;
}

export async function updateRecoveryProfile(id: number, data: Partial<InsertRecoveryProfile>) {
  const [profile] = await db
    .update(recoveryProfiles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(recoveryProfiles.id, id))
    .returning();
  return profile;
}

export async function getRecoveryCheckIns(profileId: number) {
  return db.select().from(recoveryCheckIns).where(eq(recoveryCheckIns.profileId, profileId)).orderBy(desc(recoveryCheckIns.date));
}

export async function createRecoveryCheckIn(profileId: number, data: Omit<InsertRecoveryCheckIn, "profileId">) {
  const [checkIn] = await db.insert(recoveryCheckIns).values({ ...data, profileId }).returning();
  return checkIn;
}

export async function getRecoveryMilestones(profileId: number) {
  return db.select().from(recoveryMilestones).where(eq(recoveryMilestones.profileId, profileId)).orderBy(recoveryMilestones.days);
}

export async function createRecoveryMilestone(profileId: number, data: Omit<InsertRecoveryMilestone, "profileId">) {
  const [milestone] = await db.insert(recoveryMilestones).values({ ...data, profileId }).returning();
  return milestone;
}

export async function updateRecoveryMilestone(id: number, data: Partial<InsertRecoveryMilestone>) {
  const [milestone] = await db.update(recoveryMilestones).set(data).where(eq(recoveryMilestones.id, id)).returning();
  return milestone;
}

export async function getCopingStrategies(profileId: number) {
  return db
    .select()
    .from(recoveryCopingStrategies)
    .where(eq(recoveryCopingStrategies.profileId, profileId))
    .orderBy(desc(recoveryCopingStrategies.effectiveness));
}

export async function createCopingStrategy(profileId: number, data: Omit<InsertRecoveryCopingStrategy, "profileId">) {
  const [strategy] = await db.insert(recoveryCopingStrategies).values({ ...data, profileId }).returning();
  return strategy;
}

export async function updateCopingStrategy(id: number, data: Partial<InsertRecoveryCopingStrategy>) {
  const [strategy] = await db.update(recoveryCopingStrategies).set(data).where(eq(recoveryCopingStrategies.id, id)).returning();
  return strategy;
}

export async function deleteCopingStrategy(id: number) {
  await db.delete(recoveryCopingStrategies).where(eq(recoveryCopingStrategies.id, id));
}

export async function getRecoveryJournalEntries(profileId: number) {
  return db.select().from(recoveryJournal).where(eq(recoveryJournal.profileId, profileId)).orderBy(desc(recoveryJournal.date));
}

export async function createRecoveryJournalEntry(profileId: number, data: Omit<InsertRecoveryJournalEntry, "profileId">) {
  const [entry] = await db.insert(recoveryJournal).values({ ...data, profileId }).returning();
  return entry;
}

// ===== STORAGE EXPORT =====
export const storage = {
  // Users
  createUser,
  getUserByUsername,
  getUserById,
  updateUser,

  // Tasks
  getTasks,
  createTask,
  updateTask,
  deleteTask,

  // Habits
  getHabits,
  createHabit,
  deleteHabit,
  logHabit,

  // Goals
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,

  // Finance
  getFinanceEntries,
  createFinanceEntry,
  deleteFinanceEntry,

  // Wellness
  getWellnessLogs,
  createWellnessLog,
  updateWellnessLog,

  // Nutrition
  getNutritionLogs,
  createNutritionLog,
  deleteNutritionLog,

  // Reading List
  getReadingList,
  createReadingItem,
  updateReadingItem,
  deleteReadingItem,

  // ✅ NEW Reading (Sessions + Notes + Stats)
  getReadingSessions,
  createReadingSession,
  deleteReadingSession,
  getReadingNotes,
  createReadingNote,
  deleteReadingNote,
  getReadingWeeklyStats,

  // Timeline
  getTimelineEvents,
  createTimelineEvent,

  // Habit Reduction
  getHabitReductions,
  createHabitReduction,
  logHabitReduction,
  deleteHabitReduction,

  // Pomodoro
  getPomodoroSessions,
  createPomodoroSession,
  updatePomodoroSession,

  // Notes
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,

  // Recovery
  getRecoveryProfile,
  createRecoveryProfile,
  updateRecoveryProfile,
  getRecoveryCheckIns,
  createRecoveryCheckIn,
  getRecoveryMilestones,
  createRecoveryMilestone,
  updateRecoveryMilestone,
  getCopingStrategies,
  createCopingStrategy,
  updateCopingStrategy,
  deleteCopingStrategy,
  getRecoveryJournalEntries,
  createRecoveryJournalEntry,
};
