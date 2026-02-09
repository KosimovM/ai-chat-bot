import { cn } from "@/lib/utils";
import * as React from "react";

type AlertVariant = "info" | "success" | "error" | "warning";

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
};

const variantClasses: Record<AlertVariant, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
  error:
    "border-destructive/40 bg-destructive/5 text-destructive dark:border-destructive/60 dark:bg-destructive/10",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
};

export function Alert({
  className,
  variant = "info",
  children,
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        "flex gap-2 rounded-lg border px-3 py-2 text-xs leading-relaxed",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
