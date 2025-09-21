import { ReactNode, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { TaskButton } from './TaskButton';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  type?: 'confirmation' | 'destructive' | 'info';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  loading?: boolean;
  className?: string;
}

export function TaskModal({
  isOpen,
  onClose,
  title,
  children,
  type = 'confirmation',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  loading = false,
  className = ''
}: TaskModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const iconsByType = {
    confirmation: null,
    destructive: <AlertTriangle className="w-6 h-6 text-destructive" />,
    info: null
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`
        relative bg-white rounded-lg shadow-xl w-full max-w-md
        animate-in fade-in-0 zoom-in-95 duration-200
        ${className}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            {iconsByType[type]}
            <h2 className="text-lg font-semibold text-neutral-900">
              {title}
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-300/50 transition-colors"
            disabled={loading}
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>
        </div>
        
        {/* Content */}
        {children && (
          <div className="px-6 pb-4">
            <div className="text-sm text-neutral-600">
              {children}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-neutral-300">
          <TaskButton
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </TaskButton>
          
          {onConfirm && (
            <TaskButton
              variant={type === 'destructive' ? 'solid' : 'solid'}
              onClick={onConfirm}
              loading={loading}
              className={type === 'destructive' ? 'bg-destructive hover:bg-destructive/90 focus:ring-destructive/50' : ''}
            >
              {confirmLabel}
            </TaskButton>
          )}
        </div>
      </div>
    </div>
  );
}