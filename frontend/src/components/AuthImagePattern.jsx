import { motion } from "framer-motion";
import { MessageSquare, ShieldCheck, Zap, Sparkles, CheckCheck, Users } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center relative h-full w-full p-6 xl:p-8 overflow-hidden bg-gradient-to-br from-base-200/50 via-base-200/80 to-base-300/50 border-l border-base-content/5">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#8882_1px,transparent_1px)] [background-size:18px_18px] opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm xl:max-w-md flex flex-col items-center">
        {/* Animated Interactive Mockup Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-base-100/80 backdrop-blur-xl border border-base-content/10 shadow-xl rounded-2xl p-4 sm:p-5 relative mb-4 xl:mb-5 overflow-hidden"
        >
          {/* Card Top Header */}
          <div className="flex items-center justify-between border-b border-base-content/10 pb-3 mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="size-8 rounded-xl bg-gradient-to-tr from-primary to-primary-focus flex items-center justify-center text-primary-content shadow-md shadow-primary/30">
                  <MessageSquare className="size-4" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 rounded-full ring-2 ring-base-100" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-xs sm:text-sm">Chitty Live Room</h3>
                  <span className="text-[9px] font-medium px-1.5 py-0.2 rounded-full bg-primary/10 text-primary">v2.0</span>
                </div>
                <p className="text-[10px] text-base-content/60 flex items-center gap-1">
                  <Users className="size-2.5" /> Active community
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <ShieldCheck className="size-3" /> Encrypted
              </span>
            </div>
          </div>

          {/* Simulated Chat Messages */}
          <div className="space-y-2.5 py-0.5">
            {/* Incoming Message */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="flex items-end gap-2"
            >
              <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                A
              </div>
              <div className="bg-base-200/90 rounded-2xl rounded-bl-sm px-3.5 py-2 max-w-[82%] shadow-sm border border-base-content/5">
                <p className="text-xs font-normal">Hey! Did you see the new Chitty real-time update? ⚡</p>
                <span className="text-[9px] text-base-content/40 mt-0.5 block">10:42 AM</span>
              </div>
            </motion.div>

            {/* Outgoing Message */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="flex items-end justify-end gap-1.5"
            >
              <div className="bg-primary text-primary-content rounded-2xl rounded-br-sm px-3.5 py-2 max-w-[82%] shadow-sm shadow-primary/20">
                <p className="text-xs">Yes! Ultra-low latency and instant delivery! 🚀</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="text-[9px] text-primary-content/75">10:43 AM</span>
                  <CheckCheck className="size-2.5 text-primary-content" />
                </div>
              </div>
            </motion.div>

            {/* Typing Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.35 }}
              className="flex items-center gap-1.5 text-xs text-base-content/50 pt-0.5 pl-8"
            >
              <div className="flex gap-1 items-center px-2.5 py-1 rounded-full bg-base-200/60 border border-base-content/5">
                <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="size-1.5 rounded-full bg-primary animate-bounce" />
                <span className="text-[10px] font-medium ml-1 text-base-content/70">Vinayak is typing...</span>
              </div>
            </motion.div>
          </div>

          {/* Floating Pill Badges */}
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-2.5 -right-1 bg-base-100/90 backdrop-blur-md border border-base-content/10 shadow-md px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px] font-semibold text-primary"
          >
            <Sparkles className="size-3" />
            <span>AI Ready</span>
          </motion.div>

          <motion.div
            animate={{ y: [3, -3, 3] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-2.5 left-4 bg-base-100/90 backdrop-blur-md border border-base-content/10 shadow-md px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
          >
            <Zap className="size-3 fill-current" />
            <span>Lightning Fast</span>
          </motion.div>
        </motion.div>

        {/* Text Details */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-center px-2"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium mb-1.5">
            <Sparkles className="size-3" /> Modern Messaging Experience
          </div>
          <h2 className="text-lg xl:text-xl font-bold tracking-tight mb-1">
            {title}
          </h2>
          <p className="text-xs text-base-content/65 max-w-xs leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Bottom Feature Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid grid-cols-3 gap-2 w-full mt-3.5 pt-3.5 border-t border-base-content/10 text-center"
        >
          <div className="p-2 rounded-xl bg-base-100/40 backdrop-blur-sm border border-base-content/5">
            <p className="text-[10px] text-base-content/50">Uptime</p>
            <p className="text-xs font-bold text-base-content mt-0.5">99.9%</p>
          </div>
          <div className="p-2 rounded-xl bg-base-100/40 backdrop-blur-sm border border-base-content/5">
            <p className="text-[10px] text-base-content/50">Security</p>
            <p className="text-xs font-bold text-base-content mt-0.5">End-to-End</p>
          </div>
          <div className="p-2 rounded-xl bg-base-100/40 backdrop-blur-sm border border-base-content/5">
            <p className="text-[10px] text-base-content/50">Latency</p>
            <p className="text-xs font-bold text-base-content mt-0.5">&lt; 20ms</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthImagePattern;