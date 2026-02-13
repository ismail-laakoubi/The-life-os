import PomodoroPage from "./pages/pomodoro-page";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { useUser } from "./hooks/use-auth";
import { LayoutShell } from "./components/layout-shell";
import { Loader2 } from "lucide-react";
import BrainPage from "./pages/brain-page";
import RecoveryPage from "./pages/recovery-page";

// Pages
import NotFound from "./pages/not-found";
import AuthPage from "./pages/auth-page";
import Dashboard from "./pages/dashboard";
import HomePage from "./pages/home-page";
import TasksPage from "./pages/tasks-page";
import HabitsPage from "./pages/habits-page";
import GoalsPage from "./pages/goals-page";
import CalendarPage from "./pages/calendar-page";
import WellnessPage from "./pages/wellness-page";
import NutritionPage from "./pages/nutrition-page";
import FinancePage from "./pages/finance-page";
import ReadingPage from "./pages/reading-page";
import TimelinePage from "./pages/timeline-page";
import BreakLoopPage from "./pages/break-loop-page";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  return (
    <LayoutShell>
      <Component />
    </LayoutShell>
  );
}

function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/"><PublicRoute component={HomePage} /></Route>
      <Route path="/auth" component={AuthPage} />
      <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
      <Route path="/tasks"><ProtectedRoute component={TasksPage} /></Route>
      <Route path="/habits"><ProtectedRoute component={HabitsPage} /></Route>
      <Route path="/goals"><ProtectedRoute component={GoalsPage} /></Route>
      <Route path="/pomodoro"><ProtectedRoute component={PomodoroPage} /></Route>
      <Route path="/calendar"><ProtectedRoute component={CalendarPage} /></Route>
      <Route path="/wellness"><ProtectedRoute component={WellnessPage} /></Route>
      <Route path="/nutrition"><ProtectedRoute component={NutritionPage} /></Route>
      <Route path="/finance"><ProtectedRoute component={FinancePage} /></Route>
      <Route path="/reading"><ProtectedRoute component={ReadingPage} /></Route>
      <Route path="/timeline"><ProtectedRoute component={TimelinePage} /></Route>
      <Route path="/recovery"><ProtectedRoute component={RecoveryPage} /></Route>

      <Route path="/brain"><ProtectedRoute component={BrainPage} /></Route>

      <Route path="/break-loop"><ProtectedRoute component={BreakLoopPage} /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;