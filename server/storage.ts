import { db } from "./db";
import { 
  users, tasks, habits, habitLogs, goals, financeEntries, 
  wellnessLogs, nutritionLogs, timelineEvents, habitReduction, habitReductionLogs,
  readingList,
  pomodoroSessions, // ADD THIS LINE
  type User, type Task, type Habit, type HabitLog, type Goal, 
  type FinanceEntry, type WellnessLog, type NutritionLog,
  type TimelineEvent, type HabitReduction, type HabitReductionLog,
  type ReadingItem
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

export async function createTask(userId: number, data: Partial<Task>): Promise<Task> {
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

export async function createHabit(userId: number, data: Partial<Habit>): Promise<Habit> {
  const [habit] = await db.insert(habits).values({ ...data, userId }).returning();
  return habit;
}

export async function deleteHabit(id: number): Promise<void> {
  await db.delete(habitLogs).where(eq(habitLogs.habitId, id));
  await db.delete(habits).where(eq(habits.id, id));
}

export async function logHabit(habitId: number, data: { date: string; value: number }): Promise<HabitLog> {
  // Check if log exists for this date
  const existing = await db.select().from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, data.date)));
  
  if (existing.length > 0) {
    const [updated] = await db.update(habitLogs)
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

export async function createGoal(userId: number, data: Partial<Goal>): Promise<Goal> {
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
  return db.select().from(financeEntries)
    .where(eq(financeEntries.userId, userId))
    .orderBy(desc(financeEntries.date));
}

export async function createFinanceEntry(userId: number, data: Partial<FinanceEntry>): Promise<FinanceEntry> {
  const [entry] = await db.insert(financeEntries).values({ ...data, userId }).returning();
  return entry;
}

export async function deleteFinanceEntry(id: number): Promise<void> {
  await db.delete(financeEntries).where(eq(financeEntries.id, id));
}

// ===== WELLNESS =====
export async function getWellnessLogs(userId: number): Promise<WellnessLog[]> {
  return db.select().from(wellnessLogs)
    .where(eq(wellnessLogs.userId, userId))
    .orderBy(desc(wellnessLogs.date));
}

export async function createWellnessLog(userId: number, data: Partial<WellnessLog>): Promise<WellnessLog> {
  const [log] = await db.insert(wellnessLogs).values({ ...data, userId }).returning();
  return log;
}

export async function updateWellnessLog(id: number, data: Partial<WellnessLog>): Promise<WellnessLog> {
  const [log] = await db.update(wellnessLogs).set(data).where(eq(wellnessLogs.id, id)).returning();
  return log;
}

// ===== NUTRITION =====
export async function getNutritionLogs(userId: number): Promise<NutritionLog[]> {
  return db.select().from(nutritionLogs)
    .where(eq(nutritionLogs.userId, userId))
    .orderBy(desc(nutritionLogs.date));
}

export async function createNutritionLog(userId: number, data: Partial<NutritionLog>): Promise<NutritionLog> {
  const [log] = await db.insert(nutritionLogs).values({ ...data, userId }).returning();
  return log;
}

export async function deleteNutritionLog(id: number): Promise<void> {
  await db.delete(nutritionLogs).where(eq(nutritionLogs.id, id));
}

// ===== READING LIST =====
export async function getReadingList(userId: number): Promise<ReadingItem[]> {
  return db.select().from(readingList)
    .where(eq(readingList.userId, userId))
    .orderBy(desc(readingList.createdAt));
}

export async function createReadingItem(userId: number, data: Partial<ReadingItem>): Promise<ReadingItem> {
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
  return db.select().from(timelineEvents)
    .where(eq(timelineEvents.userId, userId))
    .orderBy(desc(timelineEvents.dateTime));
}

export async function createTimelineEvent(userId: number, data: Partial<TimelineEvent>): Promise<TimelineEvent> {
  const [event] = await db.insert(timelineEvents).values({ ...data, userId }).returning();
  return event;
}

// ===== HABIT REDUCTION =====
export async function getHabitReductions(userId: number): Promise<(HabitReduction & { logs: HabitReductionLog[] })[]> {
  const reductions = await db.select().from(habitReduction).where(eq(habitReduction.userId, userId));
  
  const reductionsWithLogs = await Promise.all(
    reductions.map(async (reduction) => {
      const logs = await db.select().from(habitReductionLogs)
        .where(eq(habitReductionLogs.trackerId, reduction.id));
      return { ...reduction, logs };
    })
  );
  
  return reductionsWithLogs;
}

export async function createHabitReduction(userId: number, data: Partial<HabitReduction>): Promise<HabitReduction> {
  const [reduction] = await db.insert(habitReduction).values({ ...data, userId }).returning();
  return reduction;
}

export async function logHabitReduction(trackerId: number, data: Partial<HabitReductionLog>): Promise<HabitReductionLog> {
  const [log] = await db.insert(habitReductionLogs).values({ trackerId, ...data }).returning();
  return log;
}

export async function deleteHabitReduction(id: number): Promise<void> {
  await db.delete(habitReductionLogs).where(eq(habitReductionLogs.trackerId, id));
  await db.delete(habitReduction).where(eq(habitReduction.id, id));
}
export async function getPomodoroSessions(userId: number) {
  return db.select().from(pomodoroSessions)
    .where(eq(pomodoroSessions.userId, userId))
    .orderBy(desc(pomodoroSessions.startedAt));
}

export async function createPomodoroSession(userId: number, data: Partial<typeof pomodoroSessions.$inferInsert>) {
  const [session] = await db.insert(pomodoroSessions).values({ ...data, userId }).returning();
  return session;
}

export async function updatePomodoroSession(id: number, data: Partial<typeof pomodoroSessions.$inferInsert>) {
  const [session] = await db.update(pomodoroSessions).set(data).where(eq(pomodoroSessions.id, id)).returning();
  return session;
}

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

  getPomodoroSessions,
  createPomodoroSession,
  updatePomodoroSession,
};
