import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  CheckSquare,
  Target,
  TrendingUp,
  Heart,
  Utensils,
  DollarSign,
  BookOpen,
  Clock,
  Zap,
  ArrowRight,
  Star,
  Rocket,
  BarChart3,
  Brain,
  Sparkles,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
  hover: {
    y: -10,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 },
  },
};

const features = [
  {
    icon: CheckSquare,
    title: "Smart Task Management",
    description: "Organize your daily tasks, set priorities, and track your progress with intelligent automation.",
  },
  {
    icon: TrendingUp,
    title: "Habit Tracking",
    description: "Build positive habits and maintain them with visual progress tracking and insights.",
  },
  {
    icon: Target,
    title: "Goal Setting & Planning",
    description: "Set meaningful goals and break them down into actionable milestones.",
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Monitor your physical and mental well-being with comprehensive health tools.",
  },
  {
    icon: Utensils,
    title: "Nutrition Tracking",
    description: "Plan your meals and maintain healthy eating habits with ease.",
  },
  {
    icon: DollarSign,
    title: "Finance Management",
    description: "Take control of your budget, expenses, and financial goals.",
  },
];

const benefits = [
  {
    icon: Brain,
    title: "Intelligent Organization",
    description: "AI-powered insights help you understand your patterns and optimize your lifestyle.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track your progress with beautiful visualizations and actionable metrics.",
  },
  {
    icon: Sparkles,
    title: "Personalized Experience",
    description: "Customize every aspect to match your unique lifestyle and goals.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Sign up in seconds and get instant access to all features.",
  },
  {
    number: "02",
    title: "Set Your Goals",
    description: "Define what matters most to you and start tracking.",
  },
  {
    number: "03",
    title: "Build Your Routine",
    description: "Create habits and tasks that align with your vision.",
  },
  {
    number: "04",
    title: "Achieve & Grow",
    description: "Monitor progress and celebrate your wins along the way.",
  },
];

export default function HomePage() {
  const [_, setLocation] = useLocation();
  const [activeStep, setActiveStep] = useState(0);

  const handleGetStarted = () => {
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      {/* Navigation Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-black to-gray-800 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Lifqora</h1>
          </div>
          <Button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
          >
            Get Started
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 right-10 w-72 h-72 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute bottom-20 left-10 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 bg-gray-500/10 dark:bg-gray-500/10 text-black dark:text-white dark:text-gray-900 dark:text-gray-100 rounded-full text-sm font-semibold">
              ✨ Master Your Life, One Goal at a Time
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Your Personal Life Operating System
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Life OS brings together everything you need to manage your tasks, habits, goals, and well-being in one intelligent platform. Take control of your life today.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="px-8 py-4 rounded-lg text-lg font-semibold border-2 hover:bg-slate-100 dark:hover:bg-gray-800"
            >
              Explore Features
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Comprehensive tools designed to help you achieve your goals and live your best life
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={featureCardVariants}
                  whileHover="hover"
                  className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-14 h-14 rounded-lg bg-gradient-to-br from-black/20 to-gray-700/20 flex items-center justify-center mb-6 group-hover:from-black/30 group-hover:to-gray-700/30 transition-all"
                  >
                    <Icon className="w-7 h-7 text-black dark:text-white dark:text-gray-900 dark:text-gray-100" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Life OS?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Designed with intelligence and simplicity at its core
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  variants={featureCardVariants}
                  whileHover="hover"
                  className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-black/20 to-gray-700/20 flex items-center justify-center mb-6"
                  >
                    <Icon className="w-8 h-8 text-black dark:text-white dark:text-gray-900 dark:text-gray-100" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get Started in 4 Steps
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Simple, straightforward, and designed for your success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                onClick={() => setActiveStep(index)}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeStep === index
                    ? "bg-gradient-to-br from-black to-gray-800 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:border-gray-100"
                }`}
              >
                <div className="text-3xl font-bold mb-3 opacity-70">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p
                  className={`text-sm leading-relaxed ${
                    activeStep === index
                      ? "text-white/90"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-black via-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 right-10 w-40 h-40 border border-white/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 left-10 w-32 h-32 border border-white/20 rounded-full"
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
          >
            Ready to Transform Your Life?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          >
            Join thousands who are already achieving their goals with Life OS. Start your journey today.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button
              onClick={handleGetStarted}
              className="bg-white text-black dark:text-white hover:bg-slate-100 font-bold px-10 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              Start Free Today
              <Rocket className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-slate-900 dark:bg-black text-slate-400 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                <span className="font-bold text-white">Life OS</span>
              </div>
              <p className="text-sm">Your personal life operating system</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Life OS. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}