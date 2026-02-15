import { useState } from "react";
import { useLogin, useRegister } from "../hooks/use-auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { 
  Sparkles, 
  ArrowRight, 
  User, 
  Lock, 
  Mail,
  CheckCircle2,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "../lib/utils";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");

  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { mutate: register, isPending: isRegistering } = useRegister();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username: loginUsername, password: loginPassword });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      username: registerUsername,
      password: registerPassword,
      name: registerName,
      email: registerEmail,
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Floating shapes background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-black via-gray-800 to-gray-700 mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Life OS
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your personal operating system for life
          </p>
        </div>

        {/* Main Card */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 shadow-2xl animate-in fade-in slide-in-from-bottom duration-700">
          <CardContent className="p-8">
            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-8 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <button
                onClick={() => setIsLogin(true)}
                className={cn(
                  "flex-1 py-2.5 rounded-md font-medium transition-all duration-300",
                  isLogin
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={cn(
                  "flex-1 py-2.5 rounded-md font-medium transition-all duration-300",
                  !isLogin
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                Sign Up
              </button>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-800 dark:text-gray-200 transition-colors" />
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="pl-11 h-12 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white dark:focus:border-black dark:focus:border-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-800 dark:text-gray-200 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-11 pr-11 h-12 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white dark:focus:border-black dark:focus:border-white transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full h-12 bg-gradient-to-r from-black via-gray-800 to-gray-700 hover:from-gray-800 hover:to-gray-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {isLoggingIn ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  
                </div>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label htmlFor="reg-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-800 dark:text-gray-200 transition-colors" />
                    <Input
                      id="reg-name"
                      placeholder="Your full name"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="pl-11 h-12 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white dark:focus:border-black dark:focus:border-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email <span className="text-gray-400 text-xs">(optional)</span>
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-800 dark:text-gray-200 transition-colors" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="pl-11 h-12 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white dark:focus:border-black dark:focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-800 dark:text-gray-200 transition-colors" />
                    <Input
                      id="reg-username"
                      placeholder="Choose a username"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      className="pl-11 h-12 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white dark:focus:border-black dark:focus:border-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-800 dark:text-gray-200 transition-colors" />
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="pl-11 pr-11 h-12 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white dark:focus:border-black dark:focus:border-white transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full h-12 bg-gradient-to-r from-black via-gray-800 to-gray-700 hover:from-gray-800 hover:to-gray-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {isRegistering ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Create Account
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Secure</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <CheckCircle2 className="h-6 w-6 text-blue-500" />
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Free</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <CheckCircle2 className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Private</p>
          </div>
        </div>
      </div>

      <style>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}