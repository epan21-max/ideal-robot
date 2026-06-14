import { ReactNode } from 'react';
import { ChevronRightIcon } from './Icon';

export function Section({
  title,
  subtitle,
  icon,
  action,
  children,
  onAction,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: string;
  onAction?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="mb-6 animate-fade-in-up">
      <div className="flex items-end justify-between mb-3 px-0.5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--muted)] mb-0.5">
            {icon}
            {subtitle || title}
          </div>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        </div>
        {action && (
          <button onClick={onAction} className="text-xs font-semibold text-[var(--accent)] flex items-center gap-0.5">
            {action} <ChevronRightIcon size={12} />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
