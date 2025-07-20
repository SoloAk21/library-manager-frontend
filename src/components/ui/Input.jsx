import React from "react";
import { cn } from "../../utils/cn";

const Input = ({
  id,
  name,
  type = "text",
  label,
  error,
  disabled,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-primary">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-red-600" : "border-gray-300",
          className
        )}
        disabled={disabled}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
