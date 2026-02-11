import { useHabits, useLogHabit } from "../hooks/use-habits";
import { useTasks, useUpdateTask } from "../hooks/use-tasks";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { 
  CreditCard, 
  Tv, 
  Plane, 
  Activity, 
  Utensils, 
  Library, 
  Dumbbell, 
  Plus, 
  Check,
  MoreHorizontal
} from "lucide-react";
import { format, subDays, isSameDay } from "date-fns";
import { cn } from "../lib/utils";

// Static categories configuration
const categories = [
  { label: "Money", icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Watch List", icon: Tv, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Travel", icon: Plane, color: "text-sky-500", bg: "bg-sky-500/10" },
  { label: "Health", icon: Activity, color: "text-rose-500", bg: "bg-rose-500/10" },
  { label: "Food", icon: Utensils, color: "text-orange-500", bg: "bg-orange-500/10" },
  { label: "Library", icon: Library, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Sport", icon: Dumbbell, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Add New", icon: Plus, color: "text-muted-foreground", bg: "bg-muted" },
];

export default function Dashboard() {
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { mutate: logHabit } = useLogHabit();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { mutate: updateTask } = useUpdateTask();

  // Generate last 7 days for habit tracker
  const days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), i)).reverse();

  const handleHabitToggle = (habitId: number, date: Date, currentValue: number) => {
    const newValue = currentValue > 0 ? 0 : 1;
    logHabit({ 
      habitId, 
      date: format(date, "yyyy-MM-dd"), 
      value: newValue 
    });
  };

  const pendingTasks = tasks?.filter(t => t.status === 'todo').slice(0, 5) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Good morning</h1>
        <p className="text-muted-foreground">Here is what's happening in your life today.</p>
      </div>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer border-border/50 group">
              <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
                <div className={cn("p-3 rounded-full transition-transform group-hover:scale-110", cat.bg, cat.color)}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <span className="font-medium text-sm">{cat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Habit Tracker */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Habit Tracker</h2>
          </div>
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-4 font-medium text-muted-foreground w-[150px]">Habit</th>
                    {days.map((day) => (
                      <th key={day.toISOString()} className="p-2 font-medium text-muted-foreground text-center w-10">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] uppercase">{format(day, "EEE")}</span>
                          <span className={cn(
                            "w-6 h-6 flex items-center justify-center rounded-full mt-1",
                            isSameDay(day, new Date()) ? "bg-primary text-primary-foreground" : ""
                          )}>
                            {format(day, "d")}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {habitsLoading ? (
                    <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Loading habits...</td></tr>
                  ) : habits?.map((habit) => (
                    <tr key={habit.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-medium">{habit.title}</td>
                      {days.map((day) => {
                        const dateStr = format(day, "yyyy-MM-dd");
                        const log = habit.logs.find(l => l.date === dateStr);
                        const isCompleted = (log?.value || 0) > 0;
                        
                        return (
                          <td key={dateStr} className="p-2 text-center">
                            <button
                              onClick={() => handleHabitToggle(habit.id, day, log?.value || 0)}
                              className={cn(
                                "w-6 h-6 rounded flex items-center justify-center transition-all mx-auto",
                                isCompleted 
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                                  : "bg-muted hover:bg-muted/80"
                              )}
                            >
                              {isCompleted && <Check className="h-3 w-3" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {habits?.length === 0 && (
                    <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No habits tracked yet. Start today!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Quick Tasks */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Priority Tasks</h2>
            <Button variant="ghost" size="sm" asChild>
              <a href="/tasks">View All</a>
            </Button>
          </div>
          <Card className="border-border/50 shadow-sm h-full max-h-[400px] overflow-y-auto">
            <CardContent className="p-0">
              {tasksLoading ? (
                 <div className="p-8 text-center text-muted-foreground">Loading tasks...</div>
              ) : (
                <div className="divide-y">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="p-4 flex items-center gap-3 hover:bg-muted/10 transition-colors group">
                      <Checkbox 
                        checked={task.status === 'done'} 
                        onCheckedChange={(checked) => updateTask({ id: task.id, status: checked ? 'done' : 'todo' })}
                      />
                      <span className="flex-1 font-medium">{task.title}</span>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8 text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {pendingTasks.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">No pending tasks. You're all caught up!</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
