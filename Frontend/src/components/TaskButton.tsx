import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface TaskButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export const TaskButton = forwardRef<HTMLButtonElement, TaskButtonProps>(
  ({ 
    variant = 'solid', 
    size = 'md', 
    loading = false, 
    children, 
    className = '', 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed";
    
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    };
    
    const variantClasses = {
      solid: `
        bg-primary text-primary-foreground
        hover:bg-primary/90 
        focus:ring-primary/50
        disabled:bg-primary/50 disabled:text-primary-foreground/70
      `,
      outline: `
        bg-transparent text-primary border border-primary
        hover:bg-primary hover:text-primary-foreground
        focus:ring-primary/50
        disabled:border-primary/50 disabled:text-primary/50 disabled:hover:bg-transparent disabled:hover:text-primary/50
      `,
      ghost: `
        bg-transparent text-neutral-900
        hover:bg-neutral-300/50
        focus:ring-neutral-600/50
        disabled:text-neutral-600/50 disabled:hover:bg-transparent
      `
    };
    
    const isDisabled = disabled || loading;
    
    return (
      <motion.button
        {...props}
        ref={ref}
        disabled={isDisabled}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        whileHover={{ scale: isDisabled ? 1 : 1.02 }}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
          </motion.div>
        )}
        {children}
      </motion.button>
    );
  }
);

TaskButton.displayName = 'TaskButton';