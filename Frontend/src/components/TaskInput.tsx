import { forwardRef, InputHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';

interface TaskInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

export const TaskInput = forwardRef<HTMLInputElement, TaskInputProps>(
  ({ label, error, required, helperText, className = '', ...props }, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-900"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <input
            {...props}
            ref={ref}
            id={inputId}
            className={`
              w-full px-3 py-2 bg-input-background border border-neutral-300 rounded-lg
              text-neutral-900 placeholder:text-neutral-600
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
              hover:border-neutral-600
              disabled:bg-neutral-300 disabled:text-neutral-600 disabled:cursor-not-allowed
              ${error ? 'border-destructive focus:border-destructive focus:ring-destructive/50' : ''}
              ${className}
            `}
          />
          
          {error && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive" />
          )}
        </div>
        
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-neutral-600">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TaskInput.displayName = 'TaskInput';