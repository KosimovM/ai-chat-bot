import { cn } from "@/lib/utils";
import * as React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-md mx-4">
        <div
          className={cn(
            "rounded-xl border bg-card text-card-foreground shadow-xl",
            className
          )}
        >
          <div className="p-5 border-b border-border/80 flex items-start justify-between gap-3">
            <div className="space-y-1">
              {title && (
                <h2 className="text-sm font-semibold leading-none tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground text-sm px-1"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          {children && <div className="p-5">{children}</div>}
          {footer && (
            <div className="px-5 pb-4 pt-2 border-t border-border/80">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
