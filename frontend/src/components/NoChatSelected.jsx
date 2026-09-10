import { MessageSquare, ShieldCheck, Zap, Image as ImageIcon } from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { motion } from "framer-motion";
import AiChatBackground from "./AiChatBackground";

const NoChatSelected = () => {
  const { t } = useLanguageStore();

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-8 sm:p-16 relative overflow-hidden select-none">
      {/* Animated AI Generated Neural Wallpaper */}
      <AiChatBackground />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md text-center space-y-6 relative z-10"
      >
        {/* Animated Brand Icon with Glowing Ambient Rings */}
        <div className="flex justify-center mb-2">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-lg opacity-25 animate-pulse" />
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/10">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
            {t("welcomeTitle") || "Welcome to Chitty"}
          </h2>
          <p className="text-sm text-base-content/60 leading-relaxed max-w-sm mx-auto">
            {t("welcomeSubtitle") || "Select a contact from the sidebar to begin conversations, share media, and connect in real time."}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-base-200/80 border border-base-300 text-base-content/70">
            <Zap className="w-3.5 h-3.5 text-primary" /> Instant Messaging
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-base-200/80 border border-base-300 text-base-content/70">
            <ShieldCheck className="w-3.5 h-3.5 text-success" /> End-to-End Secure
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-base-200/80 border border-base-300 text-base-content/70">
            <ImageIcon className="w-3.5 h-3.5 text-accent" /> Media Attachments
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default NoChatSelected;