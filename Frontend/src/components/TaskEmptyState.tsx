import { ReactNode } from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import { TaskButton } from './TaskButton';

interface TaskEmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function TaskEmptyState({
  title = "No hay tareas aún",
  description = "Comienza creando tu primera tarea para organizar tu día.",
  icon,
  actionLabel = "Crear primera tarea",
  onAction,
  className = ''
}: TaskEmptyStateProps) {
  const defaultIcon = (
    <div className="w-16 h-16 bg-neutral-300/50 rounded-full flex items-center justify-center">
      <CheckCircle2 className="w-8 h-8 text-neutral-600" />
    </div>
  );
  
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}>
      {icon || defaultIcon}
      
      <h3 className="mt-6 text-lg font-semibold text-neutral-900">
        {title}
      </h3>
      
      <p className="mt-2 text-sm text-neutral-600 max-w-sm">
        {description}
      </p>
      
      {onAction && (
        <TaskButton
          onClick={onAction}
          className="mt-6"
          variant="solid"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </TaskButton>
      )}
    </div>
  );
}