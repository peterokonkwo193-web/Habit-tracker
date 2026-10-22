import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-[rgb(37,99,235)] text-white shadow-md hover:bg-[rgb(29,78,216)] hover:shadow-lg focus-visible:ring-[rgb(37,99,235)]",
        destructive:
          "bg-[rgb(239,68,68)] text-white shadow-sm hover:bg-[rgb(220,38,38)] focus-visible:ring-[rgb(239,68,68)]",
        outline:
          "border border-[rgb(226,232,240)] bg-white hover:bg-[rgb(248,250,252)] hover:border-[rgb(37,99,235)] text-[rgb(15,23,42)] dark:border-[rgb(30,41,59)] dark:bg-[rgb(15,23,42)] dark:text-[rgb(241,245,249)] dark:hover:bg-[rgb(30,41,59)]",
        secondary:
          "bg-[rgb(16,185,129)] text-white shadow-sm hover:bg-[rgb(5,150,105)] focus-visible:ring-[rgb(16,185,129)]",
        ghost:
          "hover:bg-[rgb(241,245,249)] text-[rgb(15,23,42)] dark:hover:bg-[rgb(30,41,59)] dark:text-[rgb(241,245,249)]",
        link: "text-[rgb(37,99,235)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
