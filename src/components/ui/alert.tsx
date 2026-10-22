import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 text-sm",
  {
    variants: {
      variant: {
        default: "border-[rgb(226,232,240)] bg-white text-[rgb(15,23,42)] dark:border-[rgb(30,41,59)] dark:bg-[rgb(15,23,42)] dark:text-[rgb(241,245,249)]",
        destructive: "border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.05)] text-[rgb(239,68,68)]",
        success: "border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.05)] text-[rgb(16,185,129)]",
        warning: "border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.05)] text-[rgb(245,158,11)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("opacity-90", className)} {...props} />
  )
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
