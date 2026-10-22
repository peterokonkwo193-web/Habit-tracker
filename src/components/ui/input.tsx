import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[rgb(15,23,42)] dark:text-[rgb(241,245,249)]"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-xl border bg-white px-4 py-2 text-sm transition-all duration-200",
            "border-[rgb(226,232,240)] text-[rgb(15,23,42)] placeholder:text-[rgb(148,163,184)]",
            "focus:outline-none focus:ring-2 focus:ring-[rgb(37,99,235)] focus:border-transparent",
            "dark:bg-[rgb(15,23,42)] dark:border-[rgb(30,41,59)] dark:text-[rgb(241,245,249)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[rgb(239,68,68)] focus:ring-[rgb(239,68,68)]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-[rgb(239,68,68)]">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
