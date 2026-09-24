import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, Phone, ShieldCheck, ArrowRight, ArrowLeft, AlertCircle, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LoginPage = () => {
  const [loginMethod, setLoginMethod] = useState("password"); // "password" or "otp"
  const [showPassword, setShowPassword] = useState(false);
  const [otpType, setOtpType] = useState("email"); // "email" or "phone"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    otp: ""
  });
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(30);

  const { login, sendOtp, verifyOtp, isLoggingIn } = useAuthStore();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.email.trim()) {
      return setErrorMessage("Please enter your email address.");
    }
    if (!formData.password) {
      return setErrorMessage("Please enter your password.");
    }

    const success = await login({ email: formData.email, password: formData.password });
    if (!success) setErrorMessage("Invalid email or password. Please try again.");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (otpType === "email" && !formData.email.trim()) {
      return setErrorMessage("Please enter a valid email address.");
    }
    if (otpType === "phone" && !formData.phone.trim()) {
      return setErrorMessage("Please enter your phone number.");
    }

    const payload = otpType === "email" ? { email: formData.email } : { phone: formData.phone };
    const success = await sendOtp(payload);
    if (success) {
      setOtpSent(true);
      setTimer(30);
    } else {
      setErrorMessage("Failed to send OTP code. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.otp.trim()) {
      return setErrorMessage("Please enter the verification code.");
    }

    const success = await verifyOtp({
      email: otpType === "email" ? formData.email : undefined,
      phone: otpType === "phone" ? formData.phone : undefined,
      otp: formData.otp
    });
    if (!success) setErrorMessage("Invalid verification code. Please check and try again.");
  };

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

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
          {/* Header & Logo */}
          <div className="text-center mb-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex size-11 rounded-xl bg-gradient-to-tr from-primary to-primary-focus items-center justify-center text-primary-content shadow-md shadow-primary/20 mb-2"
            >
              <MessageSquare className="size-5" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Welcome back to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Chitty</span>
            </h1>
            <p className="text-xs text-base-content/60 mt-0.5">
              Sign in to catch up with your chats and friends
            </p>
          </div>

          {/* Login Method Toggle Pills */}
          <div className="bg-base-200/80 p-1 rounded-xl border border-base-content/10 flex gap-1 mb-3 relative">
            <button
              type="button"
              onClick={() => {
                setLoginMethod("password");
                setErrorMessage("");
                setOtpSent(false);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all relative z-10 flex items-center justify-center gap-1.5 ${
                loginMethod === "password" ? "text-primary-content" : "text-base-content/70 hover:text-base-content"
              }`}
            >
              {loginMethod === "password" && (
                <motion.div
                  layoutId="activeLoginPill"
                  className="absolute inset-0 bg-primary rounded-lg shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <KeyRound className="size-3.5" />
              <span>Password</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMethod("otp");
                setErrorMessage("");
                setOtpSent(false);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all relative z-10 flex items-center justify-center gap-1.5 ${
                loginMethod === "otp" ? "text-primary-content" : "text-base-content/70 hover:text-base-content"
              }`}
            >
              {loginMethod === "otp" && (
                <motion.div
                  layoutId="activeLoginPill"
                  className="absolute inset-0 bg-primary rounded-lg shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <ShieldCheck className="size-3.5" />
              <span>Instant OTP</span>
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-base-100/90 backdrop-blur-xl border border-base-content/10 shadow-lg rounded-2xl p-4 sm:p-5">
            <AnimatePresence mode="wait">
              {loginMethod === "password" ? (
                <motion.form
                  key="password-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handlePasswordLogin}
                  className="space-y-2.5"
                >
                  {/* Email Field */}
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

                  {/* Password Field */}
                  <div className="form-control">
                    <div className="flex items-center justify-between py-0.5">
                      <label className="label-text font-semibold text-xs">Password</label>
                      <Link
                        to="/forgot-password"
                        className="text-[11px] text-primary font-medium hover:underline transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                        <Lock className="size-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input input-bordered h-10 min-h-10 w-full pl-9 pr-9 rounded-xl bg-base-200/40 focus:bg-base-100 focus:border-primary transition-all text-xs sm:text-sm"
                        placeholder="••••••••"
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
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="btn btn-primary h-10 min-h-10 w-full rounded-xl shadow-md shadow-primary/20 gap-1.5 mt-1 font-semibold text-xs sm:text-sm"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="size-3.5" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form
                  key="otp-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
                  className="space-y-2.5"
                >
                  {!otpSent ? (
                    <>
                      {/* Sub-selector for OTP destination */}
                      <div className="flex gap-1.5 p-1 bg-base-200/50 rounded-lg mb-2 border border-base-content/5">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpType("email");
                            setErrorMessage("");
                          }}
                          className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${
                            otpType === "email" ? "bg-base-100 shadow-sm text-primary" : "text-base-content/60"
                          }`}
                        >
                          <Mail className="size-3" /> Email Code
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOtpType("phone");
                            setErrorMessage("");
                          }}
                          className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${
                            otpType === "phone" ? "bg-base-100 shadow-sm text-primary" : "text-base-content/60"
                          }`}
                        >
                          <Phone className="size-3" /> Phone SMS
                        </button>
                      </div>

                      {otpType === "email" ? (
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
                      ) : (
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
                              placeholder="+1234567890"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-2.5"
                    >
                      <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-center">
                        <p className="text-[11px] text-base-content/70">
                          Code sent to <span className="font-semibold text-primary">{otpType === "email" ? formData.email : formData.phone}</span>
                        </p>
                      </div>

                      <div className="form-control">
                        <div className="flex items-center justify-between py-0.5">
                          <label className="label-text font-semibold text-xs">Enter 6-Digit OTP</label>
                          {timer > 0 ? (
                            <span className="text-[11px] font-semibold text-primary">{timer}s remaining</span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="text-[11px] font-semibold text-primary hover:underline"
                            >
                              Resend code
                            </button>
                          )}
                        </div>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                            <ShieldCheck className="size-4" />
                          </div>
                          <input
                            type="text"
                            maxLength={6}
                            className="input input-bordered h-10 min-h-10 w-full pl-9 rounded-xl bg-base-200/40 focus:bg-base-100 focus:border-primary transition-all text-center tracking-widest font-mono text-base font-bold"
                            placeholder="••••••"
                            value={formData.otp}
                            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="btn btn-primary h-10 min-h-10 w-full rounded-xl shadow-md shadow-primary/20 gap-1.5 mt-1 font-semibold text-xs sm:text-sm"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>{otpSent ? "Verify & Continue" : "Send Verification Code"}</span>
                        <ArrowRight className="size-3.5" />
                      </>
                    )}
                  </motion.button>

                  {otpSent && (
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="btn btn-ghost btn-xs w-full gap-1 text-[11px] text-base-content/60"
                    >
                      <ArrowLeft className="size-3" /> Change {otpType === "email" ? "Email" : "Phone"}
                    </button>
                  )}
                </motion.form>
              )}
            </AnimatePresence>

            {/* Error Message Banner */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -4 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2.5 p-2 rounded-lg bg-error/10 border border-error/20 flex items-center gap-2 text-error text-[11px] font-medium"
                >
                  <AlertCircle className="size-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-content/10" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="bg-base-100 px-2.5 text-base-content/50 font-medium">Or continue with</span>
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
              Sign in with Google
            </motion.button>
          </div>

          {/* Footer Navigation */}
          <div className="text-center mt-2.5">
            <p className="text-xs text-base-content/65">
              Don&apos;t have an account yet?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline transition-all">
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right Column - Premium Showcase Component */}
      <AuthImagePattern
        title="Connect Seamlessly"
        subtitle="Chat in real-time, share files securely, and enjoy high-speed communication."
      />
    </div>
  );
};

export default LoginPage;
