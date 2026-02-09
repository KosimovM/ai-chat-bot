import { cn } from "@/lib/utils";

type ToastProps = {
  message: string;
  variant?: "default" | "success" | "error";
  className?: string;
};

export function Toast({ message, variant = "default", className }: ToastProps) {
  const colorClasses =
    variant === "success"
      ? "border-emerald-500/40 bg-emerald-600 text-emerald-50"
      : variant === "error"
      ? "border-destructive/50 bg-destructive text-destructive-foreground"
      : "border-border bg-card text-card-foreground";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={cn(
          "inline-flex items-center rounded-lg border px-3 py-2 text-xs shadow-lg shadow-black/40",
          colorClasses,
          className
        )}
      >
        {message}
      </div>
    </div>
  );
}
