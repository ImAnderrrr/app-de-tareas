import { forwardRef, InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';

interface TaskToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const TaskToggle = forwardRef<HTMLInputElement, TaskToggleProps>(
  ({ label, description, className = '', ...props }, ref) => {
    const toggleId = props.id || `toggle-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <div className="relative">
          <input
            {...props}
            ref={ref}
            type="checkbox"
            id={toggleId}
            className="sr-only peer"
          />
          
          <label
            htmlFor={toggleId}
            className={`
              relative flex items-center justify-center w-5 h-5 rounded border-2 cursor-pointer
              transition-all duration-200
              border-neutral-600 bg-transparent
              hover:border-primary
              peer-checked:bg-primary peer-checked:border-primary
              peer-focus:ring-2 peer-focus:ring-primary/50 peer-focus:ring-offset-2
              peer-disabled:cursor-not-allowed peer-disabled:opacity-50
              peer-disabled:hover:border-neutral-600
            `}
          >
            <Check 
              className={`
                w-3 h-3 text-white
                transition-all duration-200
                scale-0 peer-checked:scale-100
              `}
            />
          </label>
        </div>
        
        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label 
                htmlFor={toggleId}
                className="block text-sm font-medium text-neutral-900 cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-neutral-600 mt-0.5">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

TaskToggle.displayName = 'TaskToggle';