import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { ChevronDown, Check } from "lucide-react";

const Select = ({
  id,
  name,
  label,
  options,
  value,
  onChange,
  error,
  disabled,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (val) => {
    onChange({ target: { name, value: val } });
    setIsOpen(false);
  };

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="space-y-2 relative">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          id={id}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm text-left",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-600" : "border-gray-300",
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{selectedOption?.label}</span>
          <ChevronDown
            className={`h-4 w-4 opacity-50 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
            <ul role="listbox" className="max-h-60 overflow-auto py-1 text-sm">
              {options.map((option) => (
                <li
                  key={option.value}
                  className={cn(
                    "relative cursor-default select-none py-2 pl-8 pr-4",
                    "hover:bg-gray-100",
                    value === option.value ? "bg-gray-50" : ""
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="block truncate">{option.label}</span>
                  {value === option.value && (
                    <span className="absolute inset-y-0 left-2 flex items-center">
                      <Check className="h-4 w-4 text-primary" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
