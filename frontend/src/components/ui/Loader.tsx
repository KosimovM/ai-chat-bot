import { cn } from "../../lib/utils";

type LoaderProps = {
  label?: string;
  className?: string;
};

export function Loader({ label = "Loading...", className }: LoaderProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-xs text-muted-foreground",
        className
      )}
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
      </span>
      <span>{label}</span>
    </div>
  );
}
