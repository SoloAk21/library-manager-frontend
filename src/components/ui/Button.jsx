import React from "react";
import { LoadingIcon } from "./icons";
import { cn } from "../../utils/cn";

const Button = ({
  variant = "primary",
  size = "sm",
  disabled,
  isLoading,
  children,
  className,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800",
    secondary:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "h-8 px-3",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 py-3",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className,
        isLoading && "opacity-50"
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingIcon />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
