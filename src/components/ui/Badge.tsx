import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "primary" | "accent" | "success" | "warning" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:  "bg-surface-sunken text-ink-muted",
  primary:  "bg-ink text-white",
  accent:   "bg-cta text-white",
  success:  "bg-success text-white",
  warning:  "bg-warning text-white",
  outline:  "border border-line-strong text-ink-muted",
};

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
