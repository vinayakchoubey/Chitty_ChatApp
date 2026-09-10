import { THEMES } from "../constants";
import { TRANSLATIONS } from "../constants/translations";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { 
  Send, Eye, EyeOff, User, Lock, Palette, Globe, Camera, LogOut, 
  Languages, Check, Search, Sparkles, ShieldCheck, ChevronDown,
  Moon, Sun, Wand2, RotateCcw, CheckCheck, Phone, Video, MoreVertical,
  Mail, KeyRound, Calendar, Save
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useState, useMemo, useEffect } from "react";

// Crisp SVG Flags (Resolves Windows OS emoji rendering issues completely)
const IndianFlag = ({ className = "w-5 h-3.5" }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[2px] shadow-sm inline-block shrink-0 overflow-hidden`}>
    <path fill="#FF9933" d="M0 0h640v160H0z"/>
    <path fill="#FFFFFF" d="M0 160h640v160H0z"/>
    <path fill="#128807" d="M0 320h640v160H0z"/>
    <g transform="translate(320 240)">
      <circle r="70" fill="none" stroke="#000088" strokeWidth="6"/>
      <circle r="16" fill="#000088"/>
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="0"
          y1="0"
          x2="0"
          y2="-68"
          stroke="#000088"
          strokeWidth="3.5"
          transform={`rotate(${i * 15})`}
        />
      ))}
    </g>
  </svg>
);

const UsUkFlag = ({ className = "w-5 h-3.5" }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[2px] shadow-sm inline-block shrink-0 overflow-hidden`}>
    <path fill="#012169" d="M0 0h640v480H0z"/>
    <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/>
    <path fill="#C8102E" d="m424 288 216 159v33h-25L383 313l41-25zM640 22v7L422 173l27-42L615 0h25v22zM0 458v-7l218-151-27 42L25 480H0v-22zM216 192 0 33V0h25l232 167-41 25z"/>
    <path fill="#FFF" d="M240 0h160v480H240zM0 160h640v160H0z"/>
    <path fill="#C8102E" d="M267 0h106v480H267zM0 187h640v106H0z"/>
  </svg>
);

const SpainFlag = ({ className = "w-5 h-3.5" }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[2px] shadow-sm inline-block shrink-0 overflow-hidden`}>
    <path fill="#c60b1e" d="M0 0h640v480H0z"/>
    <path fill="#ffc400" d="M0 120h640v240H0z"/>
  </svg>
);

const FranceFlag = ({ className = "w-5 h-3.5" }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[2px] shadow-sm inline-block shrink-0 overflow-hidden`}>
    <path fill="#002654" d="M0 0h213.3v480H0z"/>
    <path fill="#fff" d="M213.3 0h213.4v480H213.3z"/>
    <path fill="#ce1126" d="M426.7 0H640v480H426.7z"/>
  </svg>
);

const GermanyFlag = ({ className = "w-5 h-3.5" }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[2px] shadow-sm inline-block shrink-0 overflow-hidden`}>
    <path fill="#000" d="M0 0h640v160H0z"/>
    <path fill="#d00" d="M0 160h640v160H0z"/>
    <path fill="#ffce00" d="M0 320h640v160H0z"/>
  </svg>
);

const JapanFlag = ({ className = "w-5 h-3.5" }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[2px] shadow-sm inline-block shrink-0 overflow-hidden`}>
    <path fill="#fff" d="M0 0h640v480H0z"/>
    <circle cx="320" cy="240" r="144" fill="#bc002d"/>
  </svg>
);

const getFlagComponent = (langId) => {
  switch (langId) {
    case "English": return <UsUkFlag />;
    case "Spanish": return <SpainFlag />;
    case "French": return <FranceFlag />;
    case "German": return <GermanyFlag />;
    case "Japanese": return <JapanFlag />;
    default: return <IndianFlag />;
  }
};

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser, updateProfile, changePassword, logout, isUpdatingProfile } = useAuthStore();
  const { language, setLanguage, globalLanguages, indianLanguages, allLanguages, t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState("theme"); // profile, password, theme, language

  // Language Page UI States
  const [languageCategory, setLanguageCategory] = useState("all"); // all, global, indian
  const [searchQuery, setSearchQuery] = useState("");

  // Profile State
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    if (authUser?.fullName) {
      setFullName(authUser.fullName);
    }
  }, [authUser?.fullName]);

  // Password State
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!newPasswordInput) return { score: 0, text: "", color: "", textColor: "" };
    let score = 0;
    if (newPasswordInput.length >= 6) score++;
    if (newPasswordInput.length >= 8) score++;
    if (/[0-9]/.test(newPasswordInput) && /[a-zA-Z]/.test(newPasswordInput)) score++;
    if (/[^A-Za-z0-9]/.test(newPasswordInput)) score++;

    if (score <= 1) return { score: 1, text: "Weak", color: "bg-error", textColor: "text-error" };
    if (score === 2) return { score: 2, text: "Fair", color: "bg-warning", textColor: "text-warning" };
    if (score === 3) return { score: 3, text: "Good", color: "bg-info", textColor: "text-info" };
    return { score: 4, text: "Strong", color: "bg-success", textColor: "text-success" };
  }, [newPasswordInput]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPasswordInput.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }
    if (newPasswordInput !== confirmPasswordInput) {
      return toast.error("New passwords do not match");
    }

    setIsUpdatingPassword(true);
    const success = await changePassword({ 
      oldPassword: currentPasswordInput, 
      newPassword: newPasswordInput 
    });
    setIsUpdatingPassword(false);

    if (success) {
      setCurrentPasswordInput("");
      setNewPasswordInput("");
      setConfirmPasswordInput("");
    }
  };

  // Theme UI States (Light & Dark Only)
  const [previewInput, setPreviewInput] = useState("");
  const [previewMessages, setPreviewMessages] = useState([
    { id: "1", isSent: false, content: t("chatPreviewMsg1") || "Hey! How's it going?", time: "12:00 PM" },
    { id: "2", isSent: true, content: t("chatPreviewMsg2") || "I'm doing great! Just working on some new features.", time: "12:01 PM" },
  ]);

  const handleThemeChange = (newTheme) => {
    if (theme === newTheme) return;
    setTheme(newTheme);
    toast.success(`Theme switched to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`);
  };

  const handleSendPreviewMessage = (textToSend) => {
    const text = (typeof textToSend === "string" ? textToSend : previewInput).trim();
    if (!text) return;

    const newMsg = {
      id: Date.now().toString(),
      content: text,
      isSent: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setPreviewMessages((prev) => [...prev, newMsg]);
    if (typeof textToSend !== "string") setPreviewInput("");
  };

  const handleResetPreview = () => {
    setPreviewMessages([
      { id: "1", isSent: false, content: t("chatPreviewMsg1") || "Hey! How's it going?", time: "12:00 PM" },
      { id: "2", isSent: true, content: t("chatPreviewMsg2") || "I'm doing great! Just working on some new features.", time: "12:01 PM" },
    ]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
    };
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfile({ fullName, profilePic: selectedImg });
  };

  const handleLanguageSelect = (langId) => {
    if (language === langId) return;
    setLanguage(langId);
    const msg = TRANSLATIONS[langId]?.languageChanged || `Language changed to ${langId}`;
    toast.success(msg);
  };

  const isIndianLangSelected = indianLanguages.some((l) => l.id === language);
  const currentLangObj = allLanguages.find((l) => l.id === language) || { label: language, nativeName: language };

  // Filtered languages based on category and search
  const filteredLanguages = useMemo(() => {
    let list = allLanguages;
    if (languageCategory === "global") list = globalLanguages;
    if (languageCategory === "indian") list = indianLanguages;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.label.toLowerCase().includes(query) ||
          l.nativeName.toLowerCase().includes(query) ||
          l.id.toLowerCase().includes(query)
      );
    }
    return list;
  }, [allLanguages, globalLanguages, indianLanguages, languageCategory, searchQuery]);

  const tabs = [
    { id: "theme", label: t("themeTab"), icon: theme === "light" ? Sun : Moon, badge: theme === "light" ? "Light" : "Dark" },
    { id: "language", label: t("languageTab"), icon: Globe, badge: currentLangObj.nativeName },
    ...(authUser ? [
      { id: "profile", label: t("profileTab"), icon: User },
      { id: "password", label: t("passwordTab"), icon: Lock },
    ] : [])
  ];

  if (!tabs.find((tVal) => tVal.id === activeTab)) {
    setActiveTab("theme");
  }

  return (
    <div className="min-h-screen container mx-auto px-4 pt-20 pb-6 max-w-6xl">
      <div className="grid md:grid-cols-12 gap-6 h-[calc(100vh-6.5rem)]">
        {/* Sidebar Navigation */}
        <div className="md:col-span-3 lg:col-span-3 space-y-2">
          <div className="card bg-base-100 shadow-xl h-full border border-base-300 backdrop-blur-md">
            <div className="card-body p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <h2 className="text-lg font-bold tracking-tight">{t("settings")}</h2>
              </div>

              <nav className="space-y-1.5">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm
                        ${isActive 
                          ? "bg-primary text-primary-content font-semibold shadow-md shadow-primary/25" 
                          : "hover:bg-base-200 text-base-content/80 font-medium"}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <tab.icon className={`w-4 h-4 ${isActive ? "text-primary-content" : "text-primary"}`} />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold truncate max-w-[80px] ${
                          isActive ? "bg-primary-content/20 text-primary-content" : "bg-base-200 text-base-content/60"
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {authUser && (
                <div className="mt-4 pt-4 border-t border-base-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-error/10 text-error font-medium transition-all duration-200 border border-error/20 text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("logout")}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-9 lg:col-span-9">
          <div className="card bg-base-100 shadow-xl h-full border border-base-300 overflow-y-auto">
            <div className="card-body p-6 sm:p-8">

              {/* Profile Settings (Premium Redesign) */}
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6 max-w-2xl"
                >
                  {/* Top Header Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-sm">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold tracking-tight">{t("editProfile")}</h2>
                        <p className="text-xs text-base-content/70">{t("updatePersonalInfo")}</p>
                      </div>
                    </div>

                    {/* Account Status Badge */}
                    <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-base-100 border border-base-300 shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                      </span>
                      <span className="text-xs font-semibold text-success">Active Account</span>
                    </div>
                  </div>

                  {/* Profile Form Card */}
                  <div className="card bg-base-100 border border-base-300 shadow-xl rounded-2xl overflow-hidden">
                    <div className="card-body p-6 sm:p-8 space-y-6">
                      <form onSubmit={handleUpdateProfile} className="space-y-6">
                        {/* Avatar Showcase */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 rounded-2xl bg-base-200/40 border border-base-200">
                          <div className="relative group shrink-0">
                            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-primary via-secondary to-accent shadow-xl">
                              <div className="w-full h-full rounded-full overflow-hidden bg-base-100 flex items-center justify-center text-3xl font-bold text-primary">
                                {selectedImg ? (
                                  <img src={selectedImg} alt="Profile" className="w-full h-full object-cover" />
                                ) : authUser?.profilePic ? (
                                  <img 
                                    src={authUser.profilePic} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                                  />
                                ) : (
                                  <span>{authUser?.fullName ? authUser.fullName.charAt(0).toUpperCase() : "U"}</span>
                                )}
                              </div>
                            </div>

                            {/* Upload Badge */}
                            <label
                              htmlFor="avatar-upload"
                              className="absolute bottom-1 right-1 bg-primary text-primary-content hover:scale-110 p-2.5 rounded-full cursor-pointer shadow-lg transition-all duration-200 border-2 border-base-100"
                              title="Change Avatar"
                            >
                              <Camera className="w-4 h-4" />
                              <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                              />
                            </label>
                          </div>

                          <div className="text-center sm:text-left space-y-1.5 my-auto">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                              <h3 className="text-lg font-bold text-base-content">{fullName || authUser?.fullName || "User"}</h3>
                              <span className="badge badge-primary badge-sm font-semibold">Verified User</span>
                            </div>
                            <p className="text-xs text-base-content/60">
                              {authUser?.email || "No email linked"}
                            </p>
                            <p className="text-[11px] text-base-content/50 pt-1">
                              JPG, PNG, GIF or WEBP. Max size 5MB. Click camera badge to select photo.
                            </p>
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                          <div className="form-control w-full">
                            <label className="label py-1.5">
                              <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">
                                {t("fullName")}
                              </span>
                            </label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                              <input
                                type="text"
                                className="input input-bordered w-full pl-10 rounded-xl bg-base-100 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                              />
                            </div>
                          </div>

                          <div className="form-control w-full">
                            <label className="label py-1.5">
                              <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">
                                {t("emailAddress")}
                              </span>
                              <span className="label-text-alt text-xs font-semibold text-success flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" /> Verified
                              </span>
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                              <input
                                type="text"
                                className="input input-bordered w-full pl-10 rounded-xl opacity-75 bg-base-200 text-sm cursor-not-allowed"
                                value={authUser?.email || ""}
                                disabled
                              />
                            </div>
                            <p className="text-[11px] text-base-content/50 mt-1 pl-1">
                              Your email is associated with your authentication account and cannot be changed.
                            </p>
                          </div>
                        </div>

                        {/* Account Meta Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="p-3.5 rounded-xl bg-base-200/50 border border-base-200 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-base-content/50">Member Since</p>
                              <p className="text-xs font-bold text-base-content">
                                {authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Active Member"}
                              </p>
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl bg-base-200/50 border border-base-200 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center text-success shrink-0">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-base-content/50">Account Status</p>
                              <p className="text-xs font-bold text-success flex items-center gap-1">
                                Active · Verified
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Submit Action */}
                        <div className="pt-2">
                          <button 
                            type="submit" 
                            disabled={isUpdatingProfile}
                            className="btn btn-primary w-full h-11 rounded-xl shadow-lg shadow-primary/25 font-semibold text-sm flex items-center justify-center gap-2"
                          >
                            {isUpdatingProfile ? (
                              <>
                                <span className="loading loading-spinner loading-xs"></span>
                                <span>Updating Profile...</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                <span>{t("updateProfileBtn")}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Password Settings (Premium Redesign) */}
              {activeTab === "password" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6 max-w-2xl"
                >
                  {/* Top Header Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-sm">
                        <KeyRound className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold tracking-tight">{t("changePassword")}</h2>
                        <p className="text-xs text-base-content/70">{t("managePassword")}</p>
                      </div>
                    </div>

                    {/* Security Status Badge */}
                    <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-base-100 border border-base-300 shadow-sm">
                      <Lock className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-semibold text-base-content/80">Protected</span>
                    </div>
                  </div>

                  {/* Password Form Card */}
                  <div className="card bg-base-100 border border-base-300 shadow-xl rounded-2xl overflow-hidden">
                    <div className="card-body p-6 sm:p-8 space-y-6">
                      <form onSubmit={handlePasswordSubmit} className="space-y-5">
                        {/* Current Password Field */}
                        <div className="form-control">
                          <label className="label py-1.5">
                            <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">
                              {t("currentPassword")}
                            </span>
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            <input
                              type={showOldPassword ? "text" : "password"}
                              placeholder="Enter current password"
                              className="input input-bordered w-full pl-10 pr-10 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                              value={currentPasswordInput}
                              onChange={(e) => setCurrentPasswordInput(e.target.value)}
                              required
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-base-content/40 hover:text-base-content transition-colors"
                              onClick={() => setShowOldPassword(!showOldPassword)}
                            >
                              {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* New Password Field */}
                        <div className="form-control">
                          <div className="flex items-center justify-between py-1.5">
                            <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">
                              {t("newPassword")}
                            </span>
                            {newPasswordInput && (
                              <span className={`text-[11px] font-bold ${passwordStrength.textColor}`}>
                                Strength: {passwordStrength.text}
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            <input
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              className="input input-bordered w-full pl-10 pr-10 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                              value={newPasswordInput}
                              onChange={(e) => setNewPasswordInput(e.target.value)}
                              required
                              minLength={6}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-base-content/40 hover:text-base-content transition-colors"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>

                          {/* Password Strength Meter */}
                          {newPasswordInput && (
                            <div className="mt-2 space-y-1">
                              <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                                <div className={`h-full rounded-full transition-colors ${passwordStrength.score >= 1 ? passwordStrength.color : "bg-base-300"}`} />
                                <div className={`h-full rounded-full transition-colors ${passwordStrength.score >= 2 ? passwordStrength.color : "bg-base-300"}`} />
                                <div className={`h-full rounded-full transition-colors ${passwordStrength.score >= 3 ? passwordStrength.color : "bg-base-300"}`} />
                                <div className={`h-full rounded-full transition-colors ${passwordStrength.score >= 4 ? passwordStrength.color : "bg-base-300"}`} />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="form-control">
                          <div className="flex items-center justify-between py-1.5">
                            <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">
                              {t("confirmPassword")}
                            </span>
                            {confirmPasswordInput && (
                              <span className={`text-[11px] font-semibold ${
                                newPasswordInput === confirmPasswordInput ? "text-success" : "text-error"
                              }`}>
                                {newPasswordInput === confirmPasswordInput ? "✓ Passwords Match" : "✕ Passwords don't match"}
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <CheckCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Re-enter your new password"
                              className="input input-bordered w-full pl-10 pr-10 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                              value={confirmPasswordInput}
                              onChange={(e) => setConfirmPasswordInput(e.target.value)}
                              required
                              minLength={6}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-base-content/40 hover:text-base-content transition-colors"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Password Guidelines Card */}
                        <div className="p-4 rounded-xl bg-base-200/50 border border-base-200 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-base-content">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span>Password Security Tips</span>
                          </div>
                          <ul className="text-xs text-base-content/70 space-y-1 pl-6 list-disc">
                            <li>Use at least 6 characters (8+ recommended)</li>
                            <li>Include numbers, lowercase & uppercase letters</li>
                            <li>Add symbols or punctuation for higher security</li>
                          </ul>
                        </div>

                        {/* Submit Action */}
                        <div className="pt-2">
                          <button 
                            type="submit" 
                            disabled={isUpdatingPassword}
                            className="btn btn-primary w-full h-11 rounded-xl shadow-lg shadow-primary/25 font-semibold text-sm flex items-center justify-center gap-2"
                          >
                            {isUpdatingPassword ? (
                              <>
                                <span className="loading loading-spinner loading-xs"></span>
                                <span>Updating Password...</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4" />
                                <span>{t("updatePasswordBtn")}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Theme Settings (Light & Dark Only) */}
              {activeTab === "theme" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Top Header Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${
                        theme === "light" 
                          ? "bg-amber-500/20 text-amber-500" 
                          : "bg-indigo-500/20 text-indigo-400"
                      }`}>
                        {theme === "light" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold tracking-tight">{t("themeTab")} Mode</h2>
                        <p className="text-xs text-base-content/70">Select your preferred interface mode: Light or Dark</p>
                      </div>
                    </div>

                    {/* Active Mode Status Badge */}
                    <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-xl bg-base-100 border border-base-300 shadow-sm">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          theme === "light" ? "bg-amber-500" : "bg-indigo-500"
                        }`}></span>
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                          theme === "light" ? "bg-amber-500" : "bg-indigo-500"
                        }`}></span>
                      </span>
                      <span className="text-xs font-medium text-base-content/70">Active Mode:</span>
                      <span className={`text-xs font-bold capitalize px-2.5 py-0.5 rounded-lg border ${
                        theme === "light" 
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" 
                          : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                      }`}>
                        {theme === "light" ? "☀️ Light Mode" : "🌙 Dark Mode"}
                      </span>
                    </div>
                  </div>

                  {/* Two Modes Cards: Sun (Light) and Moon (Dark) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
                    {/* Light Mode Card (Sun) */}
                    <motion.div
                      whileHover={{ y: -4, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleThemeChange("light")}
                      className={`
                        cursor-pointer group relative flex flex-col p-6 rounded-2xl transition-all duration-300 border
                        ${theme === "light" 
                          ? "bg-amber-500/5 border-amber-500/50 ring-2 ring-amber-500/30 shadow-xl shadow-amber-500/10" 
                          : "bg-base-100 hover:bg-base-200/60 border-base-300 hover:border-amber-500/40 shadow-sm"}
                      `}
                    >
                      {/* Active Indicator Checkmark */}
                      {theme === "light" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 z-10 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </motion.div>
                      )}

                      {/* Mode Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-105 transition-transform">
                          <Sun className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-base-content group-hover:text-amber-600 transition-colors">
                              Light Mode
                            </h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold border border-amber-500/20">
                              Sun
                            </span>
                          </div>
                          <p className="text-xs text-base-content/60 mt-0.5">
                            Clean, crisp & high-visibility day theme
                          </p>
                        </div>
                      </div>

                      {/* Mini Live Simulation (Light) */}
                      <div 
                        data-theme="light" 
                        className="rounded-xl border border-base-300 p-3 bg-white text-slate-800 shadow-inner mb-4 select-none pointer-events-none"
                      >
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <div className="h-2 w-16 bg-slate-200 rounded-full" />
                          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-start">
                            <div className="bg-slate-100 text-slate-700 text-[10px] px-2.5 py-1 rounded-xl rounded-tl-xs">
                              Good morning! ☀️
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <div className="bg-primary text-primary-content text-[10px] px-2.5 py-1 rounded-xl rounded-tr-xs font-medium">
                              Ready for today! ✨
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Selection Status Button */}
                      <div className="mt-auto pt-2">
                        <button
                          type="button"
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            theme === "light"
                              ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
                              : "bg-base-200 hover:bg-amber-500/10 hover:text-amber-600 text-base-content/70"
                          }`}
                        >
                          <Sun className="w-3.5 h-3.5" />
                          <span>{theme === "light" ? "Active Mode" : "Switch to Light Mode"}</span>
                        </button>
                      </div>
                    </motion.div>

                    {/* Dark Mode Card (Moon) */}
                    <motion.div
                      whileHover={{ y: -4, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleThemeChange("dark")}
                      className={`
                        cursor-pointer group relative flex flex-col p-6 rounded-2xl transition-all duration-300 border
                        ${theme === "dark" 
                          ? "bg-indigo-500/5 border-indigo-500/50 ring-2 ring-indigo-500/30 shadow-xl shadow-indigo-500/10" 
                          : "bg-base-100 hover:bg-base-200/60 border-base-300 hover:border-indigo-500/40 shadow-sm"}
                      `}
                    >
                      {/* Active Indicator Checkmark */}
                      {theme === "dark" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 z-10 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </motion.div>
                      )}

                      {/* Mode Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner group-hover:scale-105 transition-transform">
                          <Moon className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-base-content group-hover:text-indigo-400 transition-colors">
                              Dark Mode
                            </h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                              Moon
                            </span>
                          </div>
                          <p className="text-xs text-base-content/60 mt-0.5">
                            Sleek, eye-friendly & modern night theme
                          </p>
                        </div>
                      </div>

                      {/* Mini Live Simulation (Dark) */}
                      <div 
                        data-theme="dark" 
                        className="rounded-xl border border-slate-700 p-3 bg-slate-900 text-slate-100 shadow-inner mb-4 select-none pointer-events-none"
                      >
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
                          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                          <div className="h-2 w-16 bg-slate-700 rounded-full" />
                          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-start">
                            <div className="bg-slate-800 text-slate-200 text-[10px] px-2.5 py-1 rounded-xl rounded-tl-xs">
                              Good evening! 🌙
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <div className="bg-primary text-primary-content text-[10px] px-2.5 py-1 rounded-xl rounded-tr-xs font-medium">
                              Easy on the eyes! ✨
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Selection Status Button */}
                      <div className="mt-auto pt-2">
                        <button
                          type="button"
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            theme === "dark"
                              ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/25"
                              : "bg-base-200 hover:bg-indigo-500/10 hover:text-indigo-400 text-base-content/70"
                          }`}
                        >
                          <Moon className="w-3.5 h-3.5" />
                          <span>{theme === "dark" ? "Active Mode" : "Switch to Dark Mode"}</span>
                        </button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Interactive Live Chat Preview Section */}
                  <div className="pt-4 space-y-3 max-w-3xl mx-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold tracking-tight text-base-content">{t("preview")}</h3>
                          <p className="text-[11px] text-base-content/60">
                            Live chat interface in {theme === "light" ? "Light (Sun)" : "Dark (Moon)"} mode
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetPreview}
                        className="btn btn-ghost btn-xs gap-1.5 text-base-content/60 hover:text-base-content hover:bg-base-200 rounded-lg text-xs"
                        title="Reset preview messages"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    </div>

                    {/* Simulated App Window */}
                    <div className="rounded-2xl border border-base-300 bg-base-100 shadow-xl overflow-hidden transition-all duration-300">
                      {/* macOS Style Window Bar */}
                      <div className="px-4 py-2.5 bg-base-200/80 border-b border-base-300 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-error/80 border border-error/20" />
                          <div className="w-3 h-3 rounded-full bg-warning/80 border border-warning/20" />
                          <div className="w-3 h-3 rounded-full bg-success/80 border border-success/20" />
                          <span className="text-[11px] font-semibold text-base-content/60 ml-2 tracking-wide">
                            Preview · <span className="font-bold text-primary capitalize">{theme} Mode</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-base-content/50">
                          {theme === "light" ? (
                            <span className="flex items-center gap-1 text-amber-600 font-medium">
                              <Sun className="w-3.5 h-3.5" /> Light
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-indigo-400 font-medium">
                              <Moon className="w-3.5 h-3.5" /> Dark
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Chat Header */}
                      <div className="px-4 py-3 bg-base-100 border-b border-base-300 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm text-primary">
                              {authUser?.fullName ? authUser.fullName.charAt(0).toUpperCase() : "V"}
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-base-100" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm leading-tight text-base-content">
                              {authUser?.fullName || "Vinayak"}
                            </h4>
                            <p className="text-[11px] text-success font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse inline-block" />
                              {t("online")}
                            </p>
                          </div>
                        </div>

                        {/* Simulated Actions */}
                        <div className="flex items-center gap-1 text-base-content/50">
                          <div className="p-1.5 rounded-lg hover:bg-base-200 cursor-pointer">
                            <Phone className="w-3.5 h-3.5" />
                          </div>
                          <div className="p-1.5 rounded-lg hover:bg-base-200 cursor-pointer">
                            <Video className="w-3.5 h-3.5" />
                          </div>
                          <div className="p-1.5 rounded-lg hover:bg-base-200 cursor-pointer">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Chat Message Scroll Area */}
                      <div className="p-4 space-y-3 min-h-[170px] max-h-[190px] overflow-y-auto bg-base-200/25">
                        {previewMessages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`
                                max-w-[78%] rounded-2xl px-4 py-2.5 shadow-sm text-sm break-words
                                ${msg.isSent 
                                  ? "bg-primary text-primary-content font-medium rounded-tr-sm shadow-md shadow-primary/20" 
                                  : "bg-base-100 text-base-content rounded-tl-sm border border-base-300"}
                              `}
                            >
                              <p className="leading-relaxed">{msg.content}</p>
                              <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                                msg.isSent ? "text-primary-content/80" : "text-base-content/50"
                              }`}>
                                <span>{msg.time || "12:00 PM"}</span>
                                {msg.isSent && <CheckCheck className="w-3.5 h-3.5" />}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Quick Test Chips */}
                      <div className="px-4 py-2 bg-base-100/90 border-t border-base-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
                        <span className="text-[10px] font-semibold text-base-content/50 shrink-0">Test Mode:</span>
                        {[
                          theme === "light" ? "☀️ Sun mode feels so crisp!" : "🌙 Moon mode is so easy on the eyes!",
                          "✨ Chat bubbles look great",
                          "🚀 Perfect!",
                        ].map((chip, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSendPreviewMessage(chip)}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-base-200 hover:bg-primary/15 hover:text-primary text-base-content/70 transition-colors whitespace-nowrap border border-base-300"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>

                      {/* Chat Input Bar */}
                      <div className="p-3 bg-base-100 border-t border-base-300">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSendPreviewMessage();
                          }}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="text"
                            className="input input-bordered flex-1 h-9 text-xs rounded-xl bg-base-200/40 focus:bg-base-100 transition-colors"
                            placeholder="Type a preview message..."
                            value={previewInput}
                            onChange={(e) => setPreviewInput(e.target.value)}
                          />
                          <button 
                            type="submit" 
                            disabled={!previewInput.trim()}
                            className="btn btn-primary btn-sm h-9 px-3.5 rounded-xl shadow-md shadow-primary/20 disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Language Settings (Fully Redesigned & Professional) */}
              {activeTab === "language" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Top Header Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-sm">
                        <Languages className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold tracking-tight">{t("appLanguage")}</h2>
                        <p className="text-xs text-base-content/70">{t("chooseLanguage")}</p>
                      </div>
                    </div>

                    {/* Active Status Badge */}
                    <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-base-100 border border-base-300 shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                      </span>
                      <span className="text-xs text-base-content/70">Active:</span>
                      <div className="flex items-center gap-1.5">
                        {getFlagComponent(language)}
                        <span className="text-xs font-bold text-primary">{currentLangObj.label}</span>
                        <span className="text-[10px] text-base-content/60 font-medium">({currentLangObj.nativeName})</span>
                      </div>
                    </div>
                  </div>



                  {/* Filter & Search Bar for Language Cards */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    {/* Category Filter Tabs */}
                    <div className="join bg-base-200 p-1 rounded-xl w-full sm:w-auto">
                      <button
                        onClick={() => setLanguageCategory("all")}
                        className={`join-item btn btn-xs sm:btn-sm rounded-lg border-none flex-1 sm:flex-initial transition-all ${
                          languageCategory === "all" ? "btn-primary shadow-sm font-bold" : "btn-ghost text-base-content/70"
                        }`}
                      >
                        All ({allLanguages.length})
                      </button>
                      <button
                        onClick={() => setLanguageCategory("global")}
                        className={`join-item btn btn-xs sm:btn-sm rounded-lg border-none flex-1 sm:flex-initial transition-all ${
                          languageCategory === "global" ? "btn-primary shadow-sm font-bold" : "btn-ghost text-base-content/70"
                        }`}
                      >
                        Global ({globalLanguages.length})
                      </button>
                      <button
                        onClick={() => setLanguageCategory("indian")}
                        className={`join-item btn btn-xs sm:btn-sm rounded-lg border-none flex-1 sm:flex-initial transition-all ${
                          languageCategory === "indian" ? "btn-primary shadow-sm font-bold" : "btn-ghost text-base-content/70"
                        }`}
                      >
                        <IndianFlag className="w-3.5 h-2.5 inline" /> Indian ({indianLanguages.length})
                      </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search language..."
                        className="input input-bordered input-sm sm:input-md h-9 sm:h-10 w-full pl-9 pr-3 rounded-xl text-xs sm:text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Language Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
                    <AnimatePresence>
                      {filteredLanguages.map((langItem) => {
                        const isSelected = language === langItem.id;
                        return (
                          <motion.div
                            key={langItem.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            whileHover={{ y: -2, scale: 1.015 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleLanguageSelect(langItem.id)}
                            className={`
                              p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200
                              ${isSelected
                                ? "bg-primary/10 border-primary ring-2 ring-primary/20 shadow-md shadow-primary/10"
                                : "bg-base-100 hover:bg-base-200/70 border-base-300 hover:border-base-content/20 shadow-sm"
                              }
                            `}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="size-8 rounded-lg bg-base-200 flex items-center justify-center shadow-sm shrink-0 border border-base-300">
                                {getFlagComponent(langItem.id)}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-sm tracking-tight truncate flex items-center gap-1.5">
                                  <span>{langItem.label}</span>
                                </div>
                                <div className="text-xs text-base-content/60 font-medium">
                                  {langItem.nativeName}
                                </div>
                              </div>
                            </div>

                            {/* Animated Radio Checkmark */}
                            <div
                              className={`size-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
                                isSelected
                                  ? "border-primary bg-primary text-primary-content shadow-sm scale-105"
                                  : "border-base-300 bg-base-100"
                              }`}
                            >
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {filteredLanguages.length === 0 && (
                      <div className="col-span-2 text-center py-8 text-base-content/50 text-sm">
                        No languages found matching "{searchQuery}"
                      </div>
                    )}
                  </div>

                  {/* Security / Persistence Note Card */}
                  <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-base-200/60 border border-base-300 text-xs text-base-content/70">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    <span>{t("languageNote")}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;