import { Info, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";

type CalloutVariant = "info" | "warning" | "success" | "tip";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<CalloutVariant, { bg: string; border: string; icon: typeof Info; iconClass: string }> = {
  info:    { bg: "bg-surface-warm",   border: "border-line-warm",   icon: Info,           iconClass: "text-primary" },
  warning: { bg: "bg-warning/10",     border: "border-warning/30",  icon: AlertTriangle,  iconClass: "text-warning" },
  success: { bg: "bg-success/10",     border: "border-success/30",  icon: CheckCircle2,   iconClass: "text-success" },
  tip:     { bg: "bg-surface-warm",   border: "border-line-warm",   icon: Lightbulb,      iconClass: "text-cta" },
};

export function Callout({ variant = "info", title, children }: CalloutProps) {
  const styles = VARIANT_STYLES[variant];
  const Icon = styles.icon;
  return (
    <div className={`not-prose my-8 rounded-xl border ${styles.border} ${styles.bg} p-5 sm:p-6`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${styles.iconClass}`} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold text-ink leading-snug mb-1.5">{title}</p>
          )}
          <div className="font-sans text-[15px] sm:text-base text-ink-muted leading-relaxed [&>p:not(:first-child)]:mt-2 [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-line-strong [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
