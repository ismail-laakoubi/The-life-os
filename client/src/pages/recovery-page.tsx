import { useState, useEffect } from "react";
import {
  useRecoveryProfile,
  useCreateRecoveryProfile,
  useUpdateRecoveryProfile,
  useRecoveryCheckIns,
  useCreateCheckIn,
  useCopingStrategies,
  useCreateCopingStrategy,
  useUpdateCopingStrategy,
  useDeleteCopingStrategy,
} from "../hooks/use-recovery";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Label } from "../components/ui/label";
import {
  Heart,
  Calendar,
  TrendingUp,
  Shield,
  Sparkles,
  Plus,
  Phone,
  BookOpen,
  Award,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  CheckCircle2,
  Target,
  Zap,
  Leaf,
  Brain,
  Users,
  Star,
  Trophy,
  Flame,
  Edit2,
  Trash2,
  Clock,
} from "lucide-react";
import { cn } from "../lib/utils";
import { format, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";

const MOTIVATIONAL_QUOTES = [
  "One day at a time. You've got this! 💪",
  "Every moment of sobriety is a victory. 🏆",
  "You are stronger than your urges. 💎",
  "Recovery is not a race. You don't have to feel guilty for taking it one day at a time. 🌱",
  "Fall seven times, stand up eight. You're doing amazing! 🌟",
  "The pain you feel today is the strength you feel tomorrow. 💪",
  "Your journey matters. Your recovery matters. You matter. ❤️",
  "Sobriety delivers everything that addiction promised. 🌈",
];

const COPING_CATEGORIES = [
  { value: 'physical', label: 'Physical', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { value: 'mental', label: 'Mental', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { value: 'social', label: 'Social', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { value: 'spiritual', label: 'Spiritual', icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-500/10' },
];

export default function RecoveryPage() {
  const { data: profile, isLoading: profileLoading } = useRecoveryProfile();
  const { mutate: createProfile } = useCreateRecoveryProfile();
  const { mutate: updateProfile } = useUpdateRecoveryProfile();
  const { data: checkIns } = useRecoveryCheckIns(profile?.id);
  const { mutate: createCheckIn } = useCreateCheckIn();
  const { data: copingStrategies } = useCopingStrategies(profile?.id);
  const { mutate: createStrategy } = useCreateCopingStrategy();
  const { mutate: updateStrategy } = useUpdateCopingStrategy();
  const { mutate: deleteStrategy } = useDeleteCopingStrategy();

  // Setup dialog
  const [showSetup, setShowSetup] = useState(false);
  const [addictionType, setAddictionType] = useState("");
  const [sobrietyStartDate, setSobrietyStartDate] = useState("");
  const [motivation, setMotivation] = useState("");
  const [dailyGoal, setDailyGoal] = useState("");

  // Check-in dialog
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [isClean, setIsClean] = useState(true);
  const [mood, setMood] = useState(7);
  const [urgeIntensity, setUrgeIntensity] = useState(0);
  const [gratitude, setGratitude] = useState("");
  const [checkInNotes, setCheckInNotes] = useState("");

  // Coping strategy dialog
  const [showStrategyDialog, setShowStrategyDialog] = useState(false);
  const [strategyTitle, setStrategyTitle] = useState("");
  const [strategyDescription, setStrategyDescription] = useState("");
  const [strategyCategory, setStrategyCategory] = useState("physical");

  // Random motivational quote
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    if (!profile && !profileLoading) {
      setShowSetup(true);
    }
  }, [profile, profileLoading]);

  useEffect(() => {
    // Change quote every 30 seconds
    const interval = setInterval(() => {
      setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate sobriety time
  const getSobrietyTime = () => {
    if (!profile?.sobrietyStartDate) return { days: 0, hours: 0, minutes: 0 };
    const start = new Date(profile.sobrietyStartDate);
    const now = new Date();
    return {
      days: differenceInDays(now, start),
      hours: differenceInHours(now, start) % 24,
      minutes: differenceInMinutes(now, start) % 60,
    };
  };

  const sobrietyTime = getSobrietyTime();

  // Get streak
  const currentStreak = checkIns?.reduce((streak, checkIn, index, arr) => {
    if (!checkIn.isClean) return 0;
    if (index === 0) return 1;
    const prevDate = new Date(arr[index - 1].date);
    const currDate = new Date(checkIn.date);
    const dayDiff = differenceInDays(prevDate, currDate);
    if (dayDiff === 1) return streak + 1;
    return streak;
  }, 0) || 0;

  // Today's check-in
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayCheckIn = checkIns?.find(c => c.date === today);

  // Stats
  const stats = {
    totalCheckIns: checkIns?.length || 0,
    cleanDays: checkIns?.filter(c => c.isClean).length || 0,
    avgMood: checkIns?.length ? Math.round(checkIns.reduce((sum, c) => sum + c.mood, 0) / checkIns.length) : 0,
    strategiesUsed: copingStrategies?.reduce((sum, s) => sum + s.timesUsed, 0) || 0,
  };

  // Milestones
  const milestones = [
    { days: 1, label: 'First Day', icon: Star, achieved: sobrietyTime.days >= 1 },
    { days: 7, label: 'One Week', icon: Award, achieved: sobrietyTime.days >= 7 },
    { days: 30, label: 'One Month', icon: Trophy, achieved: sobrietyTime.days >= 30 },
    { days: 90, label: 'Three Months', icon: Flame, achieved: sobrietyTime.days >= 90 },
    { days: 180, label: 'Six Months', icon: Target, achieved: sobrietyTime.days >= 180 },
    { days: 365, label: 'One Year', icon: Heart, achieved: sobrietyTime.days >= 365 },
  ];

  const handleSetup = () => {
    if (!addictionType || !sobrietyStartDate) {
      alert("Please fill in required fields");
      return;
    }
    createProfile({
      addictionType,
      sobrietyStartDate,
      motivation,
      dailyGoal,
    }, {
      onSuccess: () => {
        setShowSetup(false);
        setAddictionType("");
        setSobrietyStartDate("");
        setMotivation("");
        setDailyGoal("");
      }
    });
  };

  const handleCheckIn = () => {
    if (!profile) return;
    createCheckIn({
      profileId: profile.id,
      date: today,
      isClean,
      mood,
      urgeIntensity,
      gratitude,
      notes: checkInNotes,
    }, {
      onSuccess: () => {
        setShowCheckIn(false);
        setIsClean(true);
        setMood(7);
        setUrgeIntensity(0);
        setGratitude("");
        setCheckInNotes("");
      }
    });
  };

  const handleAddStrategy = () => {
    if (!profile || !strategyTitle) return;
    createStrategy({
      profileId: profile.id,
      title: strategyTitle,
      description: strategyDescription,
      category: strategyCategory,
      effectiveness: 3,
    }, {
      onSuccess: () => {
        setShowStrategyDialog(false);
        setStrategyTitle("");
        setStrategyDescription("");
        setStrategyCategory("physical");
      }
    });
  };

  const getMoodIcon = (moodValue: number) => {
    if (moodValue >= 8) return <Smile className="h-6 w-6 text-green-500" />;
    if (moodValue >= 5) return <Meh className="h-6 w-6 text-yellow-500" />;
    return <Frown className="h-6 w-6 text-red-500" />;
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Heart className="h-8 w-8 animate-pulse text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Setup Dialog */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Heart className="h-6 w-6 text-pink-500" />
              Welcome to Your Recovery Journey
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              Taking this step shows incredible courage. Let's set up your recovery profile together. 💪
            </p>
            <div className="space-y-2">
              <Label>What are you recovering from? *</Label>
              <Input
                placeholder="e.g., Alcohol, Nicotine, Gambling, etc."
                value={addictionType}
                onChange={(e) => setAddictionType(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sobriety Start Date *</Label>
              <Input
                type="date"
                value={sobrietyStartDate}
                onChange={(e) => setSobrietyStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Why do you want to recover?</Label>
              <textarea
                placeholder="Your motivation will keep you strong..."
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Daily Goal</Label>
              <Input
                placeholder="e.g., Stay sober today, Exercise, Meditate"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSetup} className="w-full">
              Start My Journey 🌟
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Heart className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Recovery Journey</h1>
                <p className="text-white/90 mt-1">One day at a time, you're doing amazing! 💪</p>
              </div>
            </div>
            {profile && (
              <Button
                onClick={() => setShowCheckIn(true)}
                disabled={!!todayCheckIn}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {todayCheckIn ? "✓ Checked In" : "Daily Check-In"}
              </Button>
            )}
          </div>

          {/* Sobriety Counter */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-6xl font-bold mb-2">{sobrietyTime.days}</div>
              <div className="text-white/90">Days Sober</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-6xl font-bold mb-2">{sobrietyTime.hours}</div>
              <div className="text-white/90">Hours</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-6xl font-bold mb-2">{sobrietyTime.minutes}</div>
              <div className="text-white/90">Minutes</div>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-lg text-center font-medium">{quote}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Current Streak
            </div>
            <div className="text-3xl font-bold">{currentStreak} days</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Check-Ins
            </div>
            <div className="text-3xl font-bold">{stats.totalCheckIns}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Smile className="h-4 w-4 text-yellow-500" />
              Avg Mood
            </div>
            <div className="text-3xl font-bold">{stats.avgMood}/10</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Shield className="h-4 w-4 text-blue-500" />
              Strategies Used
            </div>
            <div className="text-3xl font-bold">{stats.strategiesUsed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Milestones */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {milestones.map((milestone, i) => {
              const Icon = milestone.icon;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                    milestone.achieved
                      ? "border-green-500 bg-green-500/10"
                      : "border-border bg-muted/50"
                  )}
                >
                  <Icon className={cn("h-8 w-8", milestone.achieved ? "text-green-500" : "text-muted-foreground")} />
                  <div className="text-center">
                    <div className="font-bold">{milestone.days} Days</div>
                    <div className="text-xs text-muted-foreground mt-1">{milestone.label}</div>
                  </div>
                  {milestone.achieved && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="coping">Coping Tools</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        {/* Today Tab */}
        <TabsContent value="today" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Today's Focus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile?.dailyGoal && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">Daily Goal</span>
                  </div>
                  <p className="text-lg">{profile.dailyGoal}</p>
                </div>
              )}

              {todayCheckIn ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    <div>
                      <h3 className="font-bold text-lg">Check-In Complete! ✓</h3>
                      <p className="text-sm text-muted-foreground">You're doing great today!</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Status</div>
                      <div className="font-semibold">{todayCheckIn.isClean ? "Clean ✓" : "Relapse"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Mood</div>
                      <div className="flex items-center gap-2">
                        {getMoodIcon(todayCheckIn.mood)}
                        <span className="font-semibold">{todayCheckIn.mood}/10</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Urge Level</div>
                      <div className="font-semibold">{todayCheckIn.urgeIntensity || 0}/10</div>
                    </div>
                  </div>
                  {todayCheckIn.gratitude && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm text-muted-foreground mb-1">Grateful For</div>
                      <p className="italic">"{todayCheckIn.gratitude}"</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                  <h3 className="font-bold text-lg mb-2">Haven't Checked In Today</h3>
                  <p className="text-muted-foreground mb-4">Take a moment to reflect on how you're doing</p>
                  <Button onClick={() => setShowCheckIn(true)}>
                    Check In Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coping Tools Tab */}
        <TabsContent value="coping" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Your Coping Strategies</h3>
            <Button onClick={() => setShowStrategyDialog(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Strategy
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {copingStrategies?.map((strategy) => {
              const category = COPING_CATEGORIES.find(c => c.value === strategy.category) || COPING_CATEGORIES[0];
              const Icon = category.icon;
              return (
                <Card key={strategy.id} className="border-border/50 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={cn("p-2 rounded-lg", category.bg)}>
                          <Icon className={cn("h-5 w-5", category.color)} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{strategy.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{strategy.description}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100"
                        onClick={() => deleteStrategy({ id: strategy.id, profileId: profile!.id })}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Used {strategy.timesUsed} times</span>
                      <Button
                        size="sm"
                        onClick={() => updateStrategy({
                          id: strategy.id,
                          profileId: profile!.id,
                          timesUsed: strategy.timesUsed + 1
                        })}
                      >
                        Use Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {copingStrategies?.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-12">
                <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Coping Strategies Yet</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Add strategies that help you stay strong during difficult moments
                </p>
                <Button onClick={() => setShowStrategyDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Strategy
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Recovery Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checkIns?.slice(0, 7).map((checkIn, i) => (
                  <div key={checkIn.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="text-center">
                      <div className="font-bold">{format(new Date(checkIn.date), 'd')}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(checkIn.date), 'MMM')}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {checkIn.isClean ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-semibold">
                          {checkIn.isClean ? "Clean Day" : "Relapse"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Mood: {getMoodIcon(checkIn.mood)} {checkIn.mood}/10</span>
                        {checkIn.urgeIntensity !== null && (
                          <span>Urge: {checkIn.urgeIntensity}/10</span>
                        )}
                      </div>
                      {checkIn.notes && (
                        <p className="text-sm mt-2 italic">"{checkIn.notes}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Tab */}
        <TabsContent value="emergency" className="space-y-4">
          <Card className="border-red-500/50 bg-red-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-5 w-5" />
                Crisis Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-background rounded-lg p-4 border">
                <h4 className="font-semibold mb-2">National Helplines (USA)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span>SAMHSA National Helpline: <strong>1-800-662-4357</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span>Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong></span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Quick Coping Techniques
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• Take 10 deep breaths</li>
                  <li>• Call a trusted friend or sponsor</li>
                  <li>• Go for a walk outside</li>
                  <li>• Drink a glass of water</li>
                  <li>• Write down how you're feeling</li>
                  <li>• Use your coping strategies</li>
                </ul>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Remember:</h4>
                <p className="text-sm">
                  This feeling will pass. You've overcome urges before, and you can do it again. 
                  Every moment you resist is a victory. You are stronger than you think. 💪
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Check-In Dialog */}
      <Dialog open={showCheckIn} onOpenChange={setShowCheckIn}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Daily Check-In</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>How are you doing today?</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={isClean ? "default" : "outline"}
                  onClick={() => setIsClean(true)}
                  className="flex-1"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Staying Strong
                </Button>
                <Button
                  type="button"
                  variant={!isClean ? "default" : "outline"}
                  onClick={() => setIsClean(false)}
                  className="flex-1"
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Had a Slip
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mood (1-10): {mood}</Label>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Very Low</span>
                <span>Excellent</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Urge Intensity (0-10): {urgeIntensity}</Label>
              <input
                type="range"
                min="0"
                max="10"
                value={urgeIntensity}
                onChange={(e) => setUrgeIntensity(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>None</span>
                <span>Very Strong</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>What are you grateful for today?</Label>
              <Input
                placeholder="Something positive..."
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <textarea
                placeholder="Any thoughts, feelings, or experiences..."
                value={checkInNotes}
                onChange={(e) => setCheckInNotes(e.target.value)}
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCheckIn(false)}>
              Cancel
            </Button>
            <Button onClick={handleCheckIn}>
              Complete Check-In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Coping Strategy Dialog */}
      <Dialog open={showStrategyDialog} onOpenChange={setShowStrategyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Coping Strategy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Strategy Name *</Label>
              <Input
                placeholder="e.g., Deep breathing, Call a friend"
                value={strategyTitle}
                onChange={(e) => setStrategyTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                placeholder="How does this help you?"
                value={strategyDescription}
                onChange={(e) => setStrategyDescription(e.target.value)}
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid grid-cols-2 gap-2">
                {COPING_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setStrategyCategory(cat.value)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border-2",
                      strategyCategory === cat.value ? "border-primary bg-primary/10" : "border-border"
                    )}
                  >
                    <cat.icon className={cn("h-4 w-4", cat.color)} />
                    <span className="text-sm">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStrategyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStrategy}>
              Add Strategy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}