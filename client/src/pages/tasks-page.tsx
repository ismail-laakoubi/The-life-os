import { useState } from "react";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "../hooks/use-tasks";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../components/ui/dialog";
import { Loader2, Plus, Trash2, Calendar as CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils";

export default function TasksPage() {
  const { data: tasks, isLoading } = useTasks();
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    createTask({ title: newTaskTitle, status: 'todo' }, {
      onSuccess: () => {
        setNewTaskTitle("");
        setIsDialogOpen(false);
      }
    });
  };

  const filteredTasks = tasks?.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your daily to-dos and projects.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <Input 
                placeholder="What needs to be done?" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                autoFocus
              />
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 pb-4 border-b border-border/40">
        <Button 
          variant={filter === 'all' ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button 
          variant={filter === 'todo' ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => setFilter('todo')}
        >
          Todo
        </Button>
        <Button 
          variant={filter === 'done' ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => setFilter('done')}
        >
          Done
        </Button>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredTasks?.length === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
            No tasks found. Create one to get started!
          </div>
        ) : (
          filteredTasks?.map((task) => (
            <div 
              key={task.id}
              className={cn(
                "group flex items-center justify-between p-4 bg-card rounded-xl border border-border/40 hover:border-border hover:shadow-sm transition-all duration-200",
                task.status === 'done' && "bg-muted/30 opacity-75"
              )}
            >
              <div className="flex items-center gap-4">
                <Checkbox 
                  checked={task.status === 'done'}
                  onCheckedChange={(checked) => updateTask({ id: task.id, status: checked ? 'done' : 'todo' })}
                  className="w-5 h-5 rounded-md border-2"
                />
                <div className="flex flex-col">
                  <span className={cn(
                    "font-medium transition-all",
                    task.status === 'done' && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <CalendarIcon className="h-3 w-3" />
                      {format(new Date(task.dueDate), "MMM d")}
                    </span>
                  )}
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
