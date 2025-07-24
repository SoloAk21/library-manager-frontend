import React, { useEffect } from "react";
import { cn } from "../../utils/cn";
import { XIcon } from "../ui/icons";

const Dialog = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "sm",
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-[425px]",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-describedby={description ? "dialog-description" : undefined}
        aria-labelledby="dialog-title"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full translate-x-[-50%] translate-y-[-50%] grid gap-4 border border-primary/10 bg-white p-6 shadow-lg rounded-lg animate-in fade-in-0 zoom-in-95",
          sizeClasses[size]
        )}
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 id="dialog-title" className="text-lg font-semibold text-primary">
            {title}
          </h2>
          {description && (
            <p id="dialog-description" className="text-sm text-primary/70">
              {description}
            </p>
          )}
        </div>
        {children}
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          onClick={onClose}
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
};

export default Dialog;
