import React, { useEffect } from "react";
import { cn } from "../../utils/cn";

const Toast = ({ message, title, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const variants = {
    success: "border bg-background text-foreground",
    error:
      "border bg-background text-foreground group-[.destructive]:border-destructive/30 group-[.destructive]:bg-destructive group-[.destructive]:text-destructive-foreground",
    info: "border bg-background text-foreground",
  };

  return (
    <li
      role="status"
      aria-live="off"
      aria-atomic="true"
      tabIndex="0"
      data-state="open"
      data-swipe-direction="right"
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md p-6 pr-8 shadow-lg transition-all",
        "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
        "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out",
        "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
        "data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
        variants[type],
        type === "error" ? "destructive" : ""
      )}
      data-radix-collection-item=""
      data-swipe="cancel"
      style={{ userSelect: "none", touchAction: "none" }}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        <div className="text-sm opacity-90">{message}</div>
      </div>
      <button
        type="button"
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600"
        onClick={onClose}
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-x h-4 w-4"
        >
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
    </li>
  );
};

export default Toast;
