import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Mail, Lock, KeyRound, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthImagePattern from "../components/AuthImagePattern";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { forgotPassword, resetPassword } = useAuthStore();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await forgotPassword({ email });
    setIsLoading(false);
    if (success) setStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await resetPassword({ email, otp, newPassword });
    setIsLoading(false);
    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] mt-16 grid lg:grid-cols-2 bg-gradient-to-br from-base-100 via-base-100 to-base-200/50 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

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
              <KeyRound className="size-5" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {step === 1 ? "Reset your password" : "Set new password"}
            </h1>
            <p className="text-xs text-base-content/60 mt-0.5">
              {step === 1
                ? "Enter your email to receive a recovery code"
                : `Enter the code sent to ${email} and set password`}
            </p>
          </div>

          <div className="bg-base-100/90 backdrop-blur-xl border border-base-content/10 shadow-lg rounded-2xl p-4 sm:p-5">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="step-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSendOtp}
                  className="space-y-3"
                >
                  <div className="form-control">
                    <label className="label py-0.5">
                      <span className="label-text font-semibold text-xs">Registered Email</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                        <Mail className="size-4" />
                      </div>
                      <input
                        type="email"
                        className="input input-bordered h-10 min-h-10 w-full pl-9 rounded-xl bg-base-200/40 focus:bg-base-100 focus:border-primary transition-all text-xs sm:text-sm"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="btn btn-primary h-10 min-h-10 w-full rounded-xl shadow-md shadow-primary/20 gap-1.5 mt-1 font-semibold text-xs sm:text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Recovery Code</span>
                        <ArrowRight className="size-3.5" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form
                  key="step-2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleResetPassword}
                  className="space-y-2.5"
                >
                  <div className="form-control">
                    <label className="label py-0.5">
                      <span className="label-text font-semibold text-xs">Verification Code</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                        <ShieldCheck className="size-4" />
                      </div>
                      <input
                        type="text"
                        className="input input-bordered h-10 min-h-10 w-full pl-9 rounded-xl bg-base-200/40 focus:bg-base-100 focus:border-primary transition-all text-center tracking-widest font-mono text-base font-bold"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label py-0.5">
                      <span className="label-text font-semibold text-xs">New Password</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                        <Lock className="size-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input input-bordered h-10 min-h-10 w-full pl-9 pr-9 rounded-xl bg-base-200/40 focus:bg-base-100 focus:border-primary transition-all text-xs sm:text-sm"
                        placeholder="Min. 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
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

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="btn btn-primary h-10 min-h-10 w-full rounded-xl shadow-md shadow-primary/20 gap-1.5 mt-1 font-semibold text-xs sm:text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Set Password</span>
                        <ArrowRight className="size-3.5" />
                      </>
                    )}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-ghost btn-xs w-full gap-1 text-[11px] text-base-content/60"
                  >
                    <ArrowLeft className="size-3" /> Change Email
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="text-center mt-2.5">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline transition-all"
            >
              <ArrowLeft className="size-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>

      <AuthImagePattern
        title="Secure Account Recovery"
        subtitle="Reset your password safely to regain access to your conversations."
      />
    </div>
  );
};

export default ForgotPasswordPage;
