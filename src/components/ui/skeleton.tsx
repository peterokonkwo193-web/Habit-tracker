import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-[rgb(226,232,240)] dark:bg-[rgb(30,41,59)]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
