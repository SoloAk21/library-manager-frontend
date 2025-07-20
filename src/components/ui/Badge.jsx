import React from "react";
import { cn } from "../../utils/cn";

const Badge = ({ variant = "primary", children, className }) => {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 border-transparent",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
