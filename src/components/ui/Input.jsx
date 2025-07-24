import React from "react";
import { cn } from "../../utils/cn";

const Input = ({
  id,
  name,
  type = "text",
  label,
  disabled,
  className,
  required,
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
        required={required}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};

export default Input;
