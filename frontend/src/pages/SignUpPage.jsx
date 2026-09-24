import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User, Phone, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signupMethod, setSignupMethod] = useState("email"); // "email" or "phone"
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: ""
  });

  const { signup, verifyEmail, sendOtp, verifyOtp, isSigningUp } = useAuthStore();
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: "", color: "bg-base-300" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, text: "Weak", color: "bg-error" };
    if (score === 2) return { score: 2, text: "Fair", color: "bg-warning" };
    if (score >= 3) return { score: 3, text: "Strong", color: "bg-success" };
    return { score: 0, text: "", color: "bg-base-300" };
  };

  const strength = getPasswordStrength(formData.password);

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }

    if (signupMethod === "email") {
      if (!formData.email.trim()) {
        toast.error("Please enter your email");
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return false;
      }
      if (!formData.password) {
        toast.error("Please enter a password");
        return false;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }
    } else {
      if (!formData.phone.trim()) {
        toast.error("Please enter your phone number");
        return false;
      }
      if (formData.phone.length < 10) {
        toast.error("Phone number must be at least 10 digits");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    if (signupMethod === "email") {
      const success = await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      if (success) {
        setShowOtp(true);
        setTimer(300);
      }
    } else {
      const success = await sendOtp({
        fullName: formData.fullName,
        phone: formData.phone
      });
      if (success) {
        setShowOtp(true);
        setTimer(300);
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return toast.error("Please enter the verification code");

    if (signupMethod === "email") {
      await verifyEmail({ email: formData.email, otp });
    } else {
      await verifyOtp({ phone: formData.phone, otp });
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;

    const promise = signupMethod === "email"
      ? sendOtp({ email: formData.email, fullName: formData.fullName })
      : sendOtp({ phone: formData.phone, fullName: formData.fullName });

    const success = await promise;
    if (success) {
      setTimer(300);
      toast.success("Verification code resent successfully");
    }
  };

  useEffect(() => {
    let interval;
    if (showOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtp, timer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] mt-16 grid lg:grid-cols-2 bg-gradient-to-br from-base-100 via-base-100 to-base-200/50 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left Column - Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col justify-center items-center px-4 py-3 sm:px-8 z-10 h-full overflow-y-auto lg:overflow-visible"
      >
        <div className="w-full max-w-[380px] my-auto">
          {/* Header */}
          <div className="text-center mb-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex size-11 rounded-xl bg-gradient-to-tr from-primary to-primary-focus items-center justify-center text-primary-content shadow-md shadow-primary/20 mb-2"
            >
              <MessageSquare className="size-5" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Create your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Chitty</span> account
            </h1>
            <p className="text-xs text-base-content/60 mt-0.5">
              {showOtp ? "Enter the verification code to activate" : "Join thousands chatting in real-time"}
            </p>
          </div>

          <div className="bg-base-100/90 backdrop-blur-xl border border-base-content/10 shadow-lg rounded-2xl p-4 sm:p-5">
            <AnimatePresence mode="wait">
              {showOtp ? (
                /* OTP Verification View */
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3.5"
                >
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center flex flex-col items-center">
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-1">
                      <ShieldCheck className="size-5" />
                    </div>
                    <p className="text-xs font-semibold">Verification Code Sent</p>
                    <p className="text-[11px] text-base-content/70 mt-0.5">
                      To{" "}
                      <span className="font-semibold text-primary">
                        {signupMethod === "email" ? formData.email : formData.phone}
                      </span>
                    </p>
                  </div>

                  <form onSubmit={handleVerify} className="space-y-3">
                    <div className="form-control">
                      <div className="flex items-center justify-between py-0.5">
                        <label className="label-text font-semibold text-xs">Enter 6-Digit OTP</label>
                        {timer > 0 ? (
                          <span className="text-[11px] font-semibold text-primary">{formatTimer(timer)} remaining</span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            className="text-[11px] font-semibold text-primary hover:underline"
                          >
                            Resend code
                          </button>
                        )}
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                          <Lock className="size-4" />
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          className="input input-bordered h-10 min-h-10 w-full pl-9 rounded-xl bg-base-200/40 focus:bg-base-100 focus:border-primary transition-all text-center tracking-widest font-mono text-base font-bold"
                          placeholder="••••••"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      className="btn btn-primary h-10 min-h-10 w-full rounded-xl shadow-md shadow-primary/20 gap-1.5 font-semibold text-xs sm:text-sm"
                      disabled={isSigningUp}
                    >
                      {isSigningUp ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Complete Sign Up</span>
                          <CheckCircle2 className="size-3.5" />
                        </>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => setShowOtp(false)}
                      className="btn btn-ghost btn-xs w-full gap-1 text-[11px] text-base-content/60"
                    >
                      <ArrowLeft className="size-3" /> Back to Edit Details
                    </button>
                  </form>
                </motion.div>
              ) : (
                /* Sign Up Form View */
                <motion.div
                  key="signup-step"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Method Toggle Pills */}
                  <div className="bg-base-200/80 p-1 rounded-xl border border-base-content/10 flex gap-1 mb-3 relative">
                    <button
                      type="button"
                      onClick={() => setSignupMethod("email")}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all relative z-10 flex items-center justify-center gap-1.5 ${
                        signupMethod === "email" ? "text-primary-content" : "text-base-content/70 hover:text-base-content"
                      }`}
                    >
                      {signupMethod === "email" && (
                        <motion.div
                          layoutId="activeSignupPill"
                          className="absolute inset-0 bg-primary rounded-lg shadow-sm -z-10"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <Mail className="size-3.5" />
                      <span>With Email</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignupMethod("phone")}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all relative z-10 flex items-center justify-center gap-1.5 ${
                        signupMethod === "phone" ? "text-primary-content" : "text-base-content/70 hover:text-base-content"
                      }`}
                    >
                      {signupMethod === "phone" && (
                        <motion.div
                          layoutId="activeSignupPill"
                          className="absolute inset-0 bg-primary rounded-lg shadow-sm -z-10"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <Phone className="size-3.5" />
                      <span>With Phone</span>
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-2.5">
                    {/* Full Name */}
                    <div className="form-control">
                      <label className="label py-0.5">
                        <span className="label-text font-semibold text-xs">Full Name</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                          <User className="size-4" />
                        </div>
                        <input
                          type="text"
                          className="input input-bordered h-10 min-h-10 w-full pl-9 rounded-xl bg-base-200/40 focus:bg-base-100 focus:border-primary transition-all text-xs sm:text-sm"
                          placeholder="e.g. Vinayak Choubey"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {signupMethod === "email" ? (
                      <>
                        {/* Email */}
                        <div className="form-control">
                          <label className="label py-0.5">
                            <span className="label-text font-semibold text-xs">Email Address</span>
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                              <Mail className="size-4" />
                            </div>
                            <input
                              type="email"
                              className="input input-bordered h-10 min-h-10 w-full pl-9 rounded-xl bg-base-200/40 focus:bg-base-100 focus:border-primary transition-all text-xs sm:text-sm"
                              placeholder="name@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        {/* Password */}
                        <div className="form-control">
                          <label className="label py-0.5">
                            <span className="label-text font-semibold text-xs">Password</span>
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                              <Lock className="size-4" />
                            </div>
                            <input
                              type={showPassword ? "text" : "password"}
                              className="input input-bordered h-10 min-h-10 w-full pl-9 pr-9 rounded-xl bg-base-200/40 focus:bg-base-100 focus:border-primary transition-all text-xs sm:text-sm"
                              placeholder="Min. 6 characters"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content transition-colors"
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                          </div>

                          {/* Dynamic Password Strength Indicator */}
                          {formData.password && (
                            <div className="mt-1.5 space-y-0.5">
                              <div className="flex gap-1 h-1 w-full bg-base-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    strength.score >= 1 ? strength.color : "bg-transparent"
                                  } w-1/3`}
                                />
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    strength.score >= 2 ? strength.color : "bg-transparent"
                                  } w-1/3`}
                                />
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    strength.score >= 3 ? strength.color : "bg-transparent"
                                  } w-1/3`}
                                />
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-base-content/60">
                                <span>Strength: <strong className="font-medium text-base-content">{strength.text}</strong></span>
                                <span>{formData.password.length}/6+ chars</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      /* Phone Number */
                      <div className="form-control">
                        <label className="label py-0.5">
                          <span className="label-text font-semibold text-xs">Phone Number</span>
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                            <Phone className="size-4" />
                          </div>
                          <input
                            type="tel"
                            className="input input-bordered h-10 min-h-10 w-full pl-9 rounded-xl bg-base-200/40 focus:bg-base-100 focus:border-primary transition-all text-xs sm:text-sm"
                            placeholder="+91 9876543210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>
                        <p className="text-[10px] text-base-content/50 mt-0.5">Verification code sent via SMS.</p>
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      className="btn btn-primary h-10 min-h-10 w-full rounded-xl shadow-md shadow-primary/20 gap-1.5 mt-1 font-semibold text-xs sm:text-sm"
                      disabled={isSigningUp}
                    >
                      {isSigningUp ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>{signupMethod === "email" ? "Create Account" : "Send Verification Code"}</span>
                          <ArrowRight className="size-3.5" />
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-base-content/10" />
                    </div>
                    <div className="relative flex justify-center text-[10px]">
                      <span className="bg-base-100 px-2.5 text-base-content/50 font-medium">Or sign up with</span>
                    </div>
                  </div>

                  {/* Google OAuth Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    className="btn btn-outline h-9.5 min-h-9.5 w-full rounded-xl gap-2.5 font-semibold border-base-content/15 hover:bg-base-200/70 transition-all text-xs"
                    onClick={() => {
                      window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
                    }}
                  >
                    <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign up with Google
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="text-center mt-2.5">
            <p className="text-xs text-base-content/65">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline transition-all">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right Column - Premium Showcase Component */}
      <AuthImagePattern
        title="Join the Community"
        subtitle="Experience encrypted messaging, rich media sharing, and instant communication."
      />
    </div>
  );
};

export default SignUpPage;
