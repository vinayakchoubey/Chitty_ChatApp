import { motion } from "framer-motion";
import chatBg from "../assets/chat-bg.jpg";

const AiChatBackground = () => {
  // Floating neural particles
  const particles = [
    { id: 1, x: "15%", y: "25%", size: 4, duration: 6, delay: 0 },
    { id: 2, x: "75%", y: "35%", size: 3, duration: 8, delay: 1 },
    { id: 3, x: "40%", y: "60%", size: 5, duration: 7, delay: 2 },
    { id: 4, x: "85%", y: "70%", size: 3, duration: 9, delay: 0.5 },
    { id: 5, x: "25%", y: "80%", size: 4, duration: 6.5, delay: 1.5 },
    { id: 6, x: "60%", y: "20%", size: 3, duration: 7.5, delay: 2.5 },
    { id: 7, x: "90%", y: "15%", size: 4, duration: 8.5, delay: 3 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Animated AI Generated Neural Image Wallpaper */}
      <div
        className="absolute -inset-[5%] w-[110%] h-[110%] bg-cover bg-center animate-ai-bg opacity-35 dark:opacity-45"
        style={{
          backgroundImage: `url(${chatBg})`,
        }}
      />

      {/* Atmospheric Ambient Glow & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-100/70 via-base-100/40 to-base-100/80 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_var(--fallback-b1,oklch(var(--b1)))_90%)] opacity-85" />

      {/* Ambient Pulsing Aurora Ring */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-aurora pointer-events-none" />

      {/* Interactive/Ambient Neural Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -18, 0],
            x: [0, 10, 0],
            opacity: [0.3, 0.9, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

export default AiChatBackground;
