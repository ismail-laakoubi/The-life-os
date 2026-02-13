import { useHabits, useLogHabit } from "../hooks/use-habits";
import { useTasks, useUpdateTask } from "../hooks/use-tasks";
import { useGoals } from "../hooks/use-goals";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Activity,
  CheckCircle2,
  Calendar as CalendarIcon,
  Award,
  Flame,
  BarChart3,
  ArrowUpRight,
  Circle,
  Brain,
  Heart,
  Dumbbell,
  Coffee,
  Book,
  DollarSign,
  Star,
  Trophy
} from "lucide-react";
import { format, subDays, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from "date-fns";
import { cn } from "../lib/utils";

export default function Dashboard() {
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { mutate: logHabit } = useLogHabit();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { mutate: updateTask } = useUpdateTask();
  const { data: goals } = useGoals();

  // Calculate life metrics
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'done').length || 0;
  const pendingTasks = tasks?.filter(t => t.status === 'todo').length || 0;
  const todayTasksCompleted = completedTasks;
  
  const totalGoals = goals?.length || 0;
  const activeGoals = goals?.filter(g => g.status === 'active').length || 0;
  const completedGoals = goals?.filter(g => g.status === 'completed').length || 0;
  const avgGoalProgress = goals?.length ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0;

  const totalHabits = habits?.length || 0;
  const todayHabitsCompleted = habits?.filter(h => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return h.logs.some(log => log.date === today && log.value > 0);
  }).length || 0;

  // Calculate streak
  const calculateStreak = () => {
    if (!habits?.length) return 0;
    let streak = 0;
    let currentDate = new Date();
    
    while (streak < 365) {
      const dateStr = format(subDays(currentDate, streak), 'yyyy-MM-dd');
      const hasActivity = habits.some(h => 
        h.logs.some(log => log.date === dateStr && log.value > 0)
      );
      if (!hasActivity && streak > 0) break;
      if (hasActivity) streak++;
      else break;
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Calculate life score (0-100)
  const calculateLifeScore = () => {
    const taskScore = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const habitScore = totalHabits > 0 ? (todayHabitsCompleted / totalHabits) * 100 : 0;
    const goalScore = avgGoalProgress;
    return Math.round((taskScore * 0.3 + habitScore * 0.4 + goalScore * 0.3));
  };

  const lifeScore = calculateLifeScore();

  // Get greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Last 30 days for heatmap
  const last30Days = Array.from({ length: 30 }).map((_, i) => subDays(new Date(), 29 - i));

  const handleHabitToggle = (habitId: number, date: Date, currentValue: number) => {
    const newValue = currentValue > 0 ? 0 : 1;
    logHabit({ 
      habitId, 
      date: format(date, "yyyy-MM-dd"), 
      value: newValue 
    });
  };

  // Get activity level for heatmap
  const getActivityLevel = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = habits?.reduce((total, habit) => {
      return total + (habit.logs.some(log => log.date === dateStr && log.value > 0) ? 1 : 0);
    }, 0) || 0;
    
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    return 3;
  };

  // This week's days
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const topTasks = tasks?.filter(t => t.status === 'todo').slice(0, 5) || [];
  const recentGoals = goals?.slice(0, 3) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">{getGreeting()}</h1>
          <p className="text-white/90 text-lg mb-6">Here's your life at a glance</p>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5" />
                <span className="text-sm font-medium">Current Streak</span>
              </div>
              <div className="text-3xl font-bold">{currentStreak} days</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Tasks Today</span>
              </div>
              <div className="text-3xl font-bold">{todayTasksCompleted}/{totalTasks}</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5" />
                <span className="text-sm font-medium">Habits Today</span>
              </div>
              <div className="text-3xl font-bold">{todayHabitsCompleted}/{totalHabits}</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5" />
                <span className="text-sm font-medium">Life Score</span>
              </div>
              <div className="text-3xl font-bold">{lifeScore}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Life Overview Stats */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold mb-1">{completedTasks}</div>
            <div className="text-xs text-muted-foreground">Completed Tasks</div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Target className="h-5 w-5 text-blue-500" />
              <span className="text-xs text-blue-500 font-medium">{avgGoalProgress}%</span>
            </div>
            <div className="text-2xl font-bold mb-1">{activeGoals}</div>
            <div className="text-xs text-muted-foreground">Active Goals</div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <Star className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold mb-1">{totalHabits}</div>
            <div className="text-xs text-muted-foreground">Daily Habits</div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Flame className="h-5 w-5 text-orange-500" />
              <Award className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold mb-1">{currentStreak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <CheckCircle2 className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold mb-1">{completedGoals}</div>
            <div className="text-xs text-muted-foreground">Goals Achieved</div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="h-5 w-5 text-cyan-500" />
              <span className="text-xs text-cyan-500 font-medium">{lifeScore}%</span>
            </div>
            <div className="text-2xl font-bold mb-1">Life Score</div>
            <div className="text-xs text-muted-foreground">Overall Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Heatmap */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Activity Heatmap - Last 30 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 flex-wrap">
            {last30Days.map((day, i) => {
              const level = getActivityLevel(day);
              return (
                <div
                  key={i}
                  className={cn(
                    "w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-all hover:scale-110",
                    level === 0 && "bg-muted text-muted-foreground",
                    level === 1 && "bg-green-200 text-green-800",
                    level === 2 && "bg-green-400 text-green-900",
                    level === 3 && "bg-green-600 text-white",
                    isToday(day) && "ring-2 ring-primary ring-offset-2"
                  )}
                  title={format(day, 'MMM d')}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-muted"></div>
              <div className="w-4 h-4 rounded bg-green-200"></div>
              <div className="w-4 h-4 rounded bg-green-400"></div>
              <div className="w-4 h-4 rounded bg-green-600"></div>
            </div>
            <span>More</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* This Week Habit Tracker */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              This Week's Habits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium w-[100px]">Habit</th>
                    {weekDays.map((day) => (
                      <th key={day.toISOString()} className="p-2 font-medium text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] uppercase text-muted-foreground">{format(day, "EEE")}</span>
                          <span className={cn(
                            "w-6 h-6 flex items-center justify-center rounded-full text-xs mt-1",
                            isToday(day) ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground"
                          )}>
                            {format(day, 'd')}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {habitsLoading ? (
                    <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                  ) : habits && habits.length > 0 ? (
                    habits.slice(0, 5).map((habit) => (
                      <tr key={habit.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-2 font-medium text-xs">{habit.title}</td>
                        {weekDays.map((day) => {
                          const dateStr = format(day, "yyyy-MM-dd");
                          const log = habit.logs.find(l => l.date === dateStr);
                          const isCompleted = (log?.value || 0) > 0;
                          
                          return (
                            <td key={dateStr} className="p-2 text-center">
                              <button
                                onClick={() => handleHabitToggle(habit.id, day, log?.value || 0)}
                                className={cn(
                                  "w-7 h-7 rounded-md flex items-center justify-center transition-all hover:scale-110",
                                  isCompleted 
                                    ? "bg-green-500 text-white shadow-md" 
                                    : "bg-muted hover:bg-muted/80"
                                )}
                              >
                                {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No habits yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Priority Tasks & Goals */}
        <div className="space-y-6">
          {/* Top Tasks */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Priority Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="p-4 text-center text-muted-foreground">Loading...</div>
              ) : topTasks.length > 0 ? (
                <div className="space-y-2">
                  {topTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <Checkbox 
                        checked={task.status === 'done'} 
                        onCheckedChange={(checked) => updateTask({ id: task.id, status: checked ? 'done' : 'todo' })}
                      />
                      <span className="flex-1 text-sm font-medium">{task.title}</span>
                      {task.priority && (
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          task.priority === 'high' && "bg-red-100 text-red-700",
                          task.priority === 'medium' && "bg-yellow-100 text-yellow-700",
                          task.priority === 'low' && "bg-green-100 text-green-700"
                        )}>
                          {task.priority}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">No pending tasks!</div>
              )}
            </CardContent>
          </Card>

          {/* Active Goals */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Active Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentGoals.length > 0 ? (
                <div className="space-y-4">
                  {recentGoals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{goal.title}</span>
                        <span className="text-sm font-bold text-primary">{goal.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">No active goals</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Life Categories Quick View */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle>Life Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { icon: Brain, label: 'Productivity', color: 'text-blue-500', value: Math.round((completedTasks / (totalTasks || 1)) * 100) },
              { icon: Heart, label: 'Wellness', color: 'text-red-500', value: Math.round((todayHabitsCompleted / (totalHabits || 1)) * 100) },
              { icon: Target, label: 'Goals', color: 'text-purple-500', value: avgGoalProgress },
              { icon: Dumbbell, label: 'Fitness', color: 'text-green-500', value: 0 },
              { icon: Coffee, label: 'Habits', color: 'text-orange-500', value: Math.round((todayHabitsCompleted / (totalHabits || 1)) * 100) },
              { icon: Book, label: 'Learning', color: 'text-indigo-500', value: 0 },
              { icon: DollarSign, label: 'Finance', color: 'text-emerald-500', value: 0 },
            ].map((category, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                <div className={cn("p-3 rounded-full bg-muted", category.color)}>
                  <category.icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{category.value}%</div>
                  <div className="text-xs text-muted-foreground mt-1">{category.label}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}