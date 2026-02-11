#!/bin/bash
PAGES="/home/claude/life-os/client/src/pages"

# Goals Page
cat > "$PAGES/goals-page.tsx" << 'EOF'
import { useState } from "react";
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal } from "@/hooks/use-goals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Target, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const { mutate: createGoal, isPending: isCreating } = useCreateGoal();
  const { mutate: updateGoal } = useUpdateGoal();
  const { mutate: deleteGoal } = useDeleteGoal();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"active" | "paused" | "completed">("active");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createGoal({ title, description, status }, {
      onSuccess: () => {
        setTitle("");
        setDescription("");
        setStatus("active");
        setIsDialogOpen(false);
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground mt-1">Set targets and track your progress.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Goal Title</Label>
                <Input 
                  placeholder="e.g. Run a marathon" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  placeholder="Optional details..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Goal"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : goals?.map((goal) => (
          <Card key={goal.id} className="group relative border-border/50 hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{goal.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{goal.status}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 -mt-2 -mr-2"
                  onClick={() => deleteGoal(goal.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              {goal.description && (
                <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>
              )}
              
              <div className="space-y-2">
                <div className="flex items-end justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-bold">{goal.progress}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all" 
                    style={{ width: `${goal.progress}%` }} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {goals?.length === 0 && (
          <div className="col-span-full text-center p-12 border border-dashed rounded-lg text-muted-foreground">
            No goals yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
EOF

echo "✓ Created goals-page.tsx"

# Placeholder pages for remaining modules
cat > "$PAGES/calendar-page.tsx" << 'EOF'
export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground mt-1">View and schedule your tasks.</p>
      </div>
      <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
        Calendar view coming soon!
      </div>
    </div>
  );
}
EOF

cat > "$PAGES/wellness-page.tsx" << 'EOF'
export default function WellnessPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wellness</h1>
        <p className="text-muted-foreground mt-1">Track your mood, sleep, and energy.</p>
      </div>
      <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
        Wellness tracking coming soon!
      </div>
    </div>
  );
}
EOF

cat > "$PAGES/nutrition-page.tsx" << 'EOF'
export default function NutritionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nutrition</h1>
        <p className="text-muted-foreground mt-1">Log your meals and track eating habits.</p>
      </div>
      <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
        Nutrition logging coming soon!
      </div>
    </div>
  );
}
EOF

cat > "$PAGES/finance-page.tsx" << 'EOF'
export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
        <p className="text-muted-foreground mt-1">Manage income and expenses.</p>
      </div>
      <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
        Finance tracking coming soon!
      </div>
    </div>
  );
}
EOF

cat > "$PAGES/reading-page.tsx" << 'EOF'
export default function ReadingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reading & Watch List</h1>
        <p className="text-muted-foreground mt-1">Track books, movies, and shows.</p>
      </div>
      <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
        Reading & watch list coming soon!
      </div>
    </div>
  );
}
EOF

cat > "$PAGES/timeline-page.tsx" << 'EOF'
export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
        <p className="text-muted-foreground mt-1">Your life story of progress.</p>
      </div>
      <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
        Timeline view coming soon!
      </div>
    </div>
  );
}
EOF

cat > "$PAGES/break-loop-page.tsx" << 'EOF'
export default function BreakLoopPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Break the Loop</h1>
        <p className="text-muted-foreground mt-1">Track and reduce unwanted habits.</p>
      </div>
      <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
        Habit reduction tracker coming soon!
      </div>
    </div>
  );
}
EOF

echo "✓ Created all placeholder pages"

