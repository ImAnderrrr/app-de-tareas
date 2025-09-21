import { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface TaskBadgeProps {
  variant?: 'done' | 'pending' | 'priority' | 'custom';
  children?: ReactNode;
  className?: string;
}

export function TaskBadge({ 
  variant = 'done', 
  children, 
  className = '' 
}: TaskBadgeProps) {
  const baseClasses = "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium";
  
  const variantClasses = {
    done: "bg-secondary/10 text-secondary border border-secondary/20",
    pending: "bg-neutral-300/50 text-neutral-600 border border-neutral-300",
    priority: "bg-destructive/10 text-destructive border border-destructive/20",
    custom: "bg-primary/10 text-primary border border-primary/20"
  };
  
  const defaultContent = {
    done: (
      <>
        <Check className="w-3 h-3" />
        Completada
      </>
    ),
    pending: "Pendiente",
    priority: "Prioridad Alta",
    custom: null
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children || defaultContent[variant]}
    </span>
  );
}