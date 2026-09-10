import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { Camera, Mail, User, ShieldCheck, Calendar, Save, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const { t } = useLanguageStore();
  const [selectedImg, setSelectedImg] = useState(authUser?.profilePic || null);
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (authUser?.fullName) {
      setFullName(authUser.fullName);
    }
    if (authUser?.profilePic) {
      setSelectedImg(authUser.profilePic);
      setImgError(false);
    }
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      setImgError(false);
      await updateProfile({ fullName, profilePic: base64Image });
    };
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }
    await updateProfile({ fullName, profilePic: selectedImg });
  };

  const userInitial = fullName ? fullName.charAt(0).toUpperCase() : authUser?.fullName ? authUser.fullName.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 bg-base-200/40">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 bg-base-100 shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-sm">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{t("profile")}</h1>
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

        {/* Profile Card */}
        <div className="card bg-base-100 border border-base-300 shadow-xl rounded-2xl overflow-hidden">
          <div className="card-body p-6 sm:p-8 space-y-6">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Avatar Showcase */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 rounded-2xl bg-base-200/50 border border-base-300/50">
                <div className="relative group shrink-0">
                  <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-primary via-secondary to-accent shadow-xl">
                    <div className="w-full h-full rounded-full overflow-hidden bg-base-100 flex items-center justify-center text-3xl font-bold text-primary select-none">
                      {selectedImg && !imgError ? (
                        <img 
                          src={selectedImg} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <span className="bg-primary/10 text-primary w-full h-full flex items-center justify-center">
                          {userInitial}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Camera Upload Badge */}
                  <label
                    htmlFor="avatar-upload"
                    className={`absolute bottom-1 right-1 bg-primary text-primary-content hover:scale-110 p-2.5 rounded-full cursor-pointer shadow-lg transition-all duration-200 border-2 border-base-100 ${
                      isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                    }`}
                    title="Change Avatar"
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>

                <div className="text-center sm:text-left space-y-1.5 my-auto">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-lg font-bold text-base-content">{fullName || "User Profile"}</h2>
                    <span className="badge badge-primary badge-sm font-semibold">User</span>
                  </div>
                  <p className="text-xs text-base-content/60">
                    {authUser?.email || "No email linked"}
                  </p>
                  <p className="text-[11px] text-base-content/50 pt-1">
                    {isUpdatingProfile ? "Uploading photo..." : "JPG, PNG or WEBP. Max size 5MB. Click camera badge to update."}
                  </p>
                </div>
              </div>

              {/* Form Inputs */}
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
                    Your email address is verified and permanently linked to your account.
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
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-base-content/50">{t("memberSince")}</p>
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
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-base-content/50">{t("accountStatus")}</p>
                    <p className="text-xs font-bold text-success flex items-center gap-1">
                      {t("active")} · Verified
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
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
    </div>
  );
};

export default ProfilePage;

