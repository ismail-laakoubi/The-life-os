import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Play, Pause, RotateCcw, Timer, Coffee, Brain } from "lucide-react";
import { cn } from "../lib/utils";

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const TIMER_SETTINGS = {
  work: { minutes: 25, label: 'Focus Time', icon: Brain, color: 'text-blue-500' },
  shortBreak: { minutes: 5, label: 'Short Break', icon: Coffee, color: 'text-green-500' },
  longBreak: { minutes: 15, label: 'Long Break', icon: Coffee, color: 'text-purple-500' },
};

export default function PomodoroPage() {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.work.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const currentSetting = TIMER_SETTINGS[mode];
  const progress = (timeLeft / (currentSetting.minutes * 60)) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            playNotificationSound();
            if (mode === 'work') {
              setSessionsCompleted(prev => prev + 1);
              // Auto-switch to break
              const nextMode = (sessionsCompleted + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
              setTimeout(() => switchMode(nextMode), 1000);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, mode, sessionsCompleted]);

  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,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');
    audio.play().catch(() => {});
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_SETTINGS[newMode].minutes * 60);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentSetting.minutes * 60);
  };

  const Icon = currentSetting.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pomodoro Timer</h1>
        <p className="text-muted-foreground mt-1">Stay focused with the Pomodoro Technique.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Timer */}
        <Card className="lg:col-span-2 border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon className={cn("h-6 w-6", currentSetting.color)} />
              {currentSetting.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Circular Progress */}
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                <svg className="transform -rotate-90 w-64 h-64">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                    className={cn("transition-all duration-1000", currentSetting.color)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold tabular-nums">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {isRunning ? 'In Progress' : 'Ready to Start'}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={toggleTimer}
                className="w-32"
              >
                {isRunning ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" /> Start
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={resetTimer}
              >
                <RotateCcw className="mr-2 h-5 w-5" /> Reset
              </Button>
            </div>

            {/* Mode Switcher */}
            <div className="flex justify-center gap-2">
              <Button
                variant={mode === 'work' ? 'default' : 'outline'}
                onClick={() => switchMode('work')}
                disabled={isRunning}
              >
                <Brain className="mr-2 h-4 w-4" /> Focus
              </Button>
              <Button
                variant={mode === 'shortBreak' ? 'default' : 'outline'}
                onClick={() => switchMode('shortBreak')}
                disabled={isRunning}
              >
                <Coffee className="mr-2 h-4 w-4" /> Short Break
              </Button>
              <Button
                variant={mode === 'longBreak' ? 'default' : 'outline'}
                onClick={() => switchMode('longBreak')}
                disabled={isRunning}
              >
                <Coffee className="mr-2 h-4 w-4" /> Long Break
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Sessions Completed</span>
                  <span className="text-2xl font-bold">{sessionsCompleted}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${Math.min((sessionsCompleted / 8) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Goal: 8 sessions/day</p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Focus Time</span>
                  <span className="font-semibold">{sessionsCompleted * 25} min</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>1. Choose a task to focus on</p>
              <p>2. Work for 25 minutes</p>
              <p>3. Take a 5-minute break</p>
              <p>4. After 4 sessions, take a 15-minute break</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}