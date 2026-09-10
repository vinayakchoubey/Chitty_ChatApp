import { useState } from "react";

const Avatar = ({
  src,
  name = "User",
  size = "w-10 h-10",
  textSize = "text-sm",
  className = "",
  badge = null,
  ring = true,
}) => {
  const [hasError, setHasError] = useState(false);

  const initial = name && typeof name === "string" ? name.trim().charAt(0).toUpperCase() : "U";

  // Deterministic pleasing gradient based on user's name
  const getGradient = (str) => {
    const gradients = [
      "from-primary/25 via-primary/15 to-primary/5 text-primary border-primary/20",
      "from-secondary/25 via-secondary/15 to-secondary/5 text-secondary border-secondary/20",
      "from-accent/25 via-accent/15 to-accent/5 text-accent border-accent/20",
      "from-info/25 via-info/15 to-info/5 text-info border-info/20",
      "from-success/25 via-success/15 to-success/5 text-success border-success/20",
    ];
    if (!str || typeof str !== "string") return gradients[0];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  const colorScheme = getGradient(name);

  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      <div
        className={`
          ${size} rounded-full overflow-hidden flex items-center justify-center font-bold ${textSize}
          ${ring ? "ring-2 ring-base-100 shadow-xs" : ""}
          bg-gradient-to-br ${colorScheme} border
        `}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
            loading="lazy"
          />
        ) : (
          <span className="font-extrabold uppercase tracking-wider">{initial}</span>
        )}
      </div>
      {badge}
    </div>
  );
};

export default Avatar;
