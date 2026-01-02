import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const CollapsibleSection = ({
  title,
  defaultOpen = false,
  children,
  icon,
  className,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('border-b border-border/30', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="section-header w-full flex items-center justify-between py-2.5 px-3 hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <span className="text-xs font-medium text-foreground">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-3 pb-3 pt-1 space-y-2">{children}</div>
      </div>
    </div>
  );
};
