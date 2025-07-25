import React from "react";
import { cn } from "../../utils/cn";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const Card = React.forwardRef(
  (
    {
      className,
      title,
      subtitle,
      headerActions,
      footerActions,
      children,
      hoverEffect = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-primary/10 bg-white text-card-foreground shadow-sm",
          hoverEffect && "hover:shadow-md transition-shadow",
          className
        )}
        {...props}
      >
        {(title || subtitle || headerActions) && (
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                {title && (
                  <div className="font-semibold text-lg truncate">{title}</div>
                )}
                {subtitle && (
                  <div className="text-sm text-gray-500 truncate">
                    {subtitle}
                  </div>
                )}
              </div>
              {headerActions && (
                <div className="flex-shrink-0">{headerActions}</div>
              )}
            </div>
          </div>
        )}
        <div className="p-6 pt-0">
          {children}
          {footerActions && (
            <div className="flex justify-end gap-2 mt-4">{footerActions}</div>
          )}
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
