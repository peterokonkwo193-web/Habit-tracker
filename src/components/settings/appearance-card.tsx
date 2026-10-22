"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function AppearanceCard() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-[rgb(245,158,11)]" />
          Appearance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[rgb(100,116,139)] mb-4">
          Choose how StreakFlow looks to you. System follows your device setting.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-200",
                theme === value
                  ? "border-[rgb(37,99,235)] bg-[rgba(37,99,235,0.07)]"
                  : "border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] hover:border-[rgba(37,99,235,0.4)]"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6",
                  theme === value ? "text-[rgb(37,99,235)]" : "text-[rgb(148,163,184)]"
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  theme === value
                    ? "text-[rgb(37,99,235)]"
                    : "text-[rgb(100,116,139)] dark:text-[rgb(148,163,184)]"
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
