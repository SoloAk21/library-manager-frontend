import React, { useEffect } from "react";
import { cn } from "../../utils/cn";
import { X } from "lucide-react";

const Toast = ({ id, message, title, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const variants = {
    success: "border border-primary/0 bg-white text-foreground",
    error: "bg-destructive text-destructive-foreground",
    info: "border bg-background text-foreground",
  };

  return (
    <div
      data-id={id}
      role="status"
      aria-live="off"
      aria-atomic="true"
      data-state="open"
      className={cn(
        "group pointer-events-auto relative  flex w-full items-center justify-between space-x-3 overflow-hidden rounded-md border p-4 pr-7 shadow-lg transition-all",
        variants[type],
        type === "error" ? "destructive" : ""
      )}
      style={{ userSelect: "none", minWidth: "350px" }}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        <div className="text-xs opacity-90">{message}</div>
      </div>
      <button
        type="button"
        className="absolute right-1.5 top-1.5 rounded-md p-0.5 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

export default Toast;
