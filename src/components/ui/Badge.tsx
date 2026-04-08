import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "primary" | "accent" | "success" | "warning" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:  "bg-gray-100 text-gray-700",
  primary:  "bg-black text-white",
  accent:   "bg-gray-900 text-white",
  success:  "bg-gray-100 text-gray-700",
  warning:  "border border-gray-300 text-gray-700",
  outline:  "border border-gray-300 text-gray-600",
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
