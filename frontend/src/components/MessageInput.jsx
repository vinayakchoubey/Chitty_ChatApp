import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { Image, Send, X, Smile } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const { t } = useLanguageStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !imagePreview) || isSending) return;

    try {
      setIsSending(true);
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const canSend = text.trim().length > 0 || imagePreview;

  return (
    <div className="p-3 sm:p-4 w-full border-t border-base-300/80 bg-base-100/70 backdrop-blur-md">
      {/* Floating Image Preview */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="mb-3 flex items-center gap-3 p-2 rounded-xl bg-base-200/80 border border-base-300 w-fit"
          >
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="w-16 h-16 object-cover rounded-lg border border-base-300 shadow-xs"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-error text-error-content hover:scale-110 flex items-center justify-center shadow-md transition-transform"
                type="button"
                title="Remove attached image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="text-xs text-base-content/70 pr-2">
              <p className="font-semibold">Image attached</p>
              <p className="text-[10px] text-base-content/50">Ready to send</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Input Pill Container */}
        <div className="flex-1 flex items-center gap-1.5 bg-base-200/70 border border-base-300 rounded-2xl px-3 py-1.5 focus-within:border-primary focus-within:bg-base-100 transition-all shadow-xs">
          <button
            type="button"
            className={`btn btn-ghost btn-circle btn-xs ${
              imagePreview ? "text-primary" : "text-base-content/50 hover:text-primary"
            }`}
            onClick={() => fileInputRef.current?.click()}
            title="Attach image (Max 5MB)"
          >
            <Image className="w-4 h-4" />
          </button>

          <input
            type="text"
            className="w-full bg-transparent border-none outline-none text-sm text-base-content placeholder:text-base-content/40 px-1 py-1"
            placeholder={t("typeMessage") || "Type a message..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSending}
          />
        </div>

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className={`
            btn btn-circle btn-sm shadow-md transition-all
            ${canSend && !isSending
              ? "btn-primary shadow-primary/25" 
              : "btn-ghost text-base-content/30 cursor-not-allowed bg-base-200"}
          `}
          disabled={!canSend || isSending}
          title="Send message"
        >
          {isSending ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </motion.button>
      </form>
    </div>
  );
};
export default MessageInput;