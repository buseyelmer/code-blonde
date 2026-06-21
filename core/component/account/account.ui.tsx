import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export const accountLabelClass =
  "text-[10px] font-medium tracking-[0.24em] uppercase text-[#A17E65]";

export const accountInputClass =
  "w-full rounded-xl border border-[#D9C5B0]/60 bg-[#F8F1E9] px-4 py-3 text-sm text-[#5C4638] placeholder:text-[#8B6B57]/50 transition-all focus:border-[#C9A99A] focus:outline-none focus:ring-1 focus:ring-[#C9A99A]";

export const accountCardClass =
  "overflow-hidden rounded-sm border border-[#D9C5B0]/50 bg-[#FDFAF6] shadow-[0_1px_3px_rgba(92,70,56,0.04)]";

export function AccountSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D9C5B0] border-t-[#5C4638]" />
    </div>
  );
}

export function AccountPageHeader({
  eyebrow = "Hesabım",
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className={accountLabelClass}>{eyebrow}</p>
        <h1 className="mt-2 font-serif text-2xl tracking-tight text-[#5C4638] sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm leading-relaxed text-[#8B6B57]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function AccountCard({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${accountCardClass} ${className}`}>
      {title && (
        <div className="border-b border-[#D9C5B0]/40 px-5 py-4 sm:px-6">
          <h2 className="font-serif text-lg text-[#5C4638]">{title}</h2>
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

export function AccountButtonPrimary({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#5C4638] px-5 py-2.5 text-sm font-medium text-[#F8F1E9] transition hover:bg-[#3F2F25] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AccountButtonSecondary({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-[#D9C5B0] px-5 py-2.5 text-sm text-[#5C4638] transition hover:border-[#5C4638] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AccountQuickLink({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-sm border border-[#D9C5B0]/50 bg-[#FDFAF6] p-5 transition hover:border-[#A17E65]/60 hover:shadow-[0_4px_20px_-8px_rgba(92,70,56,0.12)] sm:p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D9C5B0]/70 bg-[#F8F1E9] text-[#5C4638] transition group-hover:border-[#5C4638] group-hover:bg-[#5C4638] group-hover:text-[#F8F1E9]">
          <Icon className="h-4 w-4" strokeWidth={1.5} />
        </div>
        <span className="text-[#D9C5B0] transition group-hover:text-[#A17E65]">→</span>
      </div>
      <h3 className="mt-4 font-serif text-lg text-[#5C4638]">{title}</h3>
      <p className="mt-1 text-sm text-[#8B6B57]">{description}</p>
    </Link>
  );
}

export function AccountInfoRow({
  icon: Icon,
  label,
  value,
  action,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D9C5B0]/60 bg-[#F8F1E9]">
        <Icon className="h-4 w-4 text-[#A17E65]" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={accountLabelClass}>{label}</p>
        <p className="mt-1 text-sm font-medium text-[#5C4638]">{value}</p>
      </div>
      {action}
    </div>
  );
}

export function AccountModal({
  title,
  subtitle,
  children,
  onClose,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#5C4638]/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-sm border border-[#D9C5B0]/50 bg-[#FDFAF6] p-6 shadow-xl">
        <div className="mb-5">
          <h3 className="font-serif text-xl text-[#5C4638]">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-[#8B6B57]">{subtitle}</p>}
        </div>
        {children}
        <button
          type="button"
          onClick={onClose}
          className="sr-only"
          aria-label="Kapat"
        />
      </div>
    </div>
  );
}
