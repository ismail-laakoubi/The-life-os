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

  // ✅ أنواع الإدخال (Insert) لحل أخطاء TypeScript مع Drizzle insert()
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
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

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

// ✅ بدل Partial<Task> -> InsertTask بدون userId (لأننا نضيفه هنا)
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

// ✅ بدل Partial<Habit> -> InsertHabit بدون userId
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

// ✅ بدل Partial<Goal> -> InsertGoal بدون userId
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

// ✅ بدل Partial<FinanceEntry> -> InsertFinanceEntry بدون userId
export async function createFinanceEntry(
  userId: number,
  data: Omit<InsertFinanceEntry, "userId">
): Promise<FinanceEntry> {
  const [entry] = await db.insert(financeEntries).values({ ...data, userId }).returning();
  return entry;
}

export async function deleteFinanceEntry(id: number): Promise<void> {
  await db.delete(financeEntries).where(eq(financeEntries.id, id));
}

// ===== WELLNESS =====
export async function getWellnessLogs(userId: number): Promise<WellnessLog[]> {
  return db
    .select()
    .from(wellnessLogs)
    .where(eq(wellnessLogs.userId, userId))
    .orderBy(desc(wellnessLogs.date));
}

// ✅ بدل Partial<WellnessLog> -> InsertWellnessLog بدون userId
export async function createWellnessLog(
  userId: number,
  data: Omit<InsertWellnessLog, "userId">
): Promise<WellnessLog> {
  const [log] = await db.insert(wellnessLogs).values({ ...data, userId }).returning();
  return log;
}

export async function updateWellnessLog(id: number, data: Partial<WellnessLog>): Promise<WellnessLog> {
  const [log] = await db.update(wellnessLogs).set(data).where(eq(wellnessLogs.id, id)).returning();
  return log;
}

// ===== NUTRITION =====
export async function getNutritionLogs(userId: number): Promise<NutritionLog[]> {
  return db
    .select()
    .from(nutritionLogs)
    .where(eq(nutritionLogs.userId, userId))
    .orderBy(desc(nutritionLogs.date));
}

// ✅ بدل Partial<NutritionLog> -> InsertNutritionLog بدون userId
export async function createNutritionLog(
  userId: number,
  data: Omit<InsertNutritionLog, "userId">
): Promise<NutritionLog> {
  const [log] = await db.insert(nutritionLogs).values({ ...data, userId }).returning();
  return log;
}

export async function deleteNutritionLog(id: number): Promise<void> {
  await db.delete(nutritionLogs).where(eq(nutritionLogs.id, id));
}

// ===== READING LIST =====
export async function getReadingList(userId: number): Promise<ReadingItem[]> {
  return db
    .select()
    .from(readingList)
    .where(eq(readingList.userId, userId))
    .orderBy(desc(readingList.createdAt));
}

// ✅ بدل Partial<ReadingItem> -> InsertReadingItem بدون userId
export async function createReadingItem(
  userId: number,
  data: Omit<InsertReadingItem, "userId">
): Promise<ReadingItem> {
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

// ===== TIMELINE =====
export async function getTimelineEvents(userId: number): Promise<TimelineEvent[]> {
  return db
    .select()
    .from(timelineEvents)
    .where(eq(timelineEvents.userId, userId))
    .orderBy(desc(timelineEvents.dateTime));
}

// ✅ بدل Partial<TimelineEvent> -> InsertTimelineEvent بدون userId
export async function createTimelineEvent(
  userId: number,
  data: Omit<InsertTimelineEvent, "userId">
): Promise<TimelineEvent> {
  const [event] = await db.insert(timelineEvents).values({ ...data, userId }).returning();
  return event;
}

// ===== HABIT REDUCTION =====
export async function getHabitReductions(
  userId: number
): Promise<(HabitReduction & { logs: HabitReductionLog[] })[]> {
  const reductions = await db.select().from(habitReduction).where(eq(habitReduction.userId, userId));

  const reductionsWithLogs = await Promise.all(
    reductions.map(async (reduction) => {
      const logs = await db.select().from(habitReductionLogs).where(eq(habitReductionLogs.trackerId, reduction.id));
      return { ...reduction, logs };
    })
  );

  return reductionsWithLogs;
}

// ✅ بدل Partial<HabitReduction> -> InsertHabitReduction بدون userId
export async function createHabitReduction(
  userId: number,
  data: Omit<InsertHabitReduction, "userId">
): Promise<HabitReduction> {
  const [reduction] = await db.insert(habitReduction).values({ ...data, userId }).returning();
  return reduction;
}

// ✅ بدل Partial<HabitReductionLog> -> InsertHabitReductionLog بدون trackerId
export async function logHabitReduction(
  trackerId: number,
  data: Omit<InsertHabitReductionLog, "trackerId">
): Promise<HabitReductionLog> {
  const [log] = await db.insert(habitReductionLogs).values({ trackerId, ...data }).returning();
  return log;
}

export async function deleteHabitReduction(id: number): Promise<void> {
  await db.delete(habitReductionLogs).where(eq(habitReductionLogs.trackerId, id));
  await db.delete(habitReduction).where(eq(habitReduction.id, id));
}

// ===== POMODORO =====
export async function getPomodoroSessions(userId: number) {
  return db
    .select()
    .from(pomodoroSessions)
    .where(eq(pomodoroSessions.userId, userId))
    .orderBy(desc(pomodoroSessions.startedAt));
}

// ✅ بدل Partial<$inferInsert> -> InsertPomodoroSession بدون userId
export async function createPomodoroSession(
  userId: number,
  data: Omit<InsertPomodoroSession, "userId">
) {
  const [session] = await db.insert(pomodoroSessions).values({ ...data, userId }).returning();
  return session;
}

export async function updatePomodoroSession(id: number, data: Partial<InsertPomodoroSession>) {
  const [session] = await db.update(pomodoroSessions).set(data).where(eq(pomodoroSessions.id, id)).returning();
  return session;
}

// ===== NOTES =====
export async function getNotes(userId: number) {
  return db.select().from(notes).where(eq(notes.userId, userId)).orderBy(desc(notes.updatedAt));
}

// ✅ بدل Partial<$inferInsert> -> InsertNote بدون userId
export async function createNote(userId: number, data: Omit<InsertNote, "userId">) {
  const [note] = await db.insert(notes).values({ ...data, userId }).returning();
  return note;
}

export async function updateNote(id: number, data: Partial<InsertNote>) {
  const [note] = await db
    .update(notes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(notes.id, id))
    .returning();
  return note;
}

export async function deleteNote(id: number) {
  await db.delete(notes).where(eq(notes.id, id));
}

export async function searchNotes(userId: number, query: string) {
  // (ملاحظة: أنت تركتها بدون شرط بحث، هذا مجرد placeholder)
  return db
    .select()
    .from(notes)
    .where(and(eq(notes.userId, userId)))
    .orderBy(desc(notes.updatedAt));
}

// ===== RECOVERY =====
export async function getRecoveryProfile(userId: number) {
  const [profile] = await db.select().from(recoveryProfiles).where(eq(recoveryProfiles.userId, userId));
  return profile;
}

// ✅ InsertRecoveryProfile بدون userId
export async function createRecoveryProfile(
  userId: number,
  data: Omit<InsertRecoveryProfile, "userId">
) {
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

// ✅ InsertRecoveryCheckIn بدون profileId
export async function createRecoveryCheckIn(
  profileId: number,
  data: Omit<InsertRecoveryCheckIn, "profileId">
) {
  const [checkIn] = await db.insert(recoveryCheckIns).values({ ...data, profileId }).returning();
  return checkIn;
}

export async function getRecoveryMilestones(profileId: number) {
  return db.select().from(recoveryMilestones).where(eq(recoveryMilestones.profileId, profileId)).orderBy(recoveryMilestones.days);
}

// ✅ InsertRecoveryMilestone بدون profileId
export async function createRecoveryMilestone(
  profileId: number,
  data: Omit<InsertRecoveryMilestone, "profileId">
) {
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

// ✅ InsertRecoveryCopingStrategy بدون profileId
export async function createCopingStrategy(
  profileId: number,
  data: Omit<InsertRecoveryCopingStrategy, "profileId">
) {
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

// ✅ InsertRecoveryJournalEntry بدون profileId
export async function createRecoveryJournalEntry(
  profileId: number,
  data: Omit<InsertRecoveryJournalEntry, "profileId">
) {
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
