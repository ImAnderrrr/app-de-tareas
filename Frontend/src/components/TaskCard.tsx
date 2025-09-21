import { ReactNode } from 'react';

interface TaskCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function TaskCard({ 
  children, 
  className = '', 
  hover = false,
  onClick 
}: TaskCardProps) {
  const baseClasses = "bg-white rounded-lg border border-neutral-300 p-4 transition-all duration-200";
  const hoverClasses = hover ? "hover:shadow-md hover:border-primary/20 cursor-pointer" : "";
  const clickableClasses = onClick ? "active:scale-[0.98]" : "";
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface TaskCardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TaskCardHeader({ children, className = '' }: TaskCardHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-3 ${className}`}>
      {children}
    </div>
  );
}

interface TaskCardContentProps {
  children: ReactNode;
  className?: string;
}

export function TaskCardContent({ children, className = '' }: TaskCardContentProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  );
}

interface TaskCardFooterProps {
  children: ReactNode;
  className?: string;
}

export function TaskCardFooter({ children, className = '' }: TaskCardFooterProps) {
  return (
    <div className={`flex items-center justify-between mt-4 pt-3 border-t border-neutral-300 ${className}`}>
      {children}
    </div>
  );
}