import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[rgba(37,99,235,0.1)] text-[rgb(37,99,235)]",
        secondary: "bg-[rgba(16,185,129,0.1)] text-[rgb(16,185,129)]",
        accent: "bg-[rgba(245,158,11,0.1)] text-[rgb(245,158,11)]",
        destructive: "bg-[rgba(239,68,68,0.1)] text-[rgb(239,68,68)]",
        outline: "border border-[rgb(226,232,240)] text-[rgb(100,116,139)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
