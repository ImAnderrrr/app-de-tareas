import { CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { useEffect } from 'react';

interface FeedbackBarProps {
  type: 'success' | 'error' | 'loading' | null;
  message: string;
  onClose?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export function FeedbackBar({ 
  type, 
  message, 
  onClose, 
  autoHide = true, 
  duration = 4000 
}: FeedbackBarProps) {
  useEffect(() => {
    if (type && autoHide && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [type, autoHide, onClose, duration]);

  if (!type || !message) return null;

  const styles = {
    success: {
      bg: 'bg-secondary/10',
      border: 'border-secondary/20',
      text: 'text-secondary',
      icon: CheckCircle
    },
    error: {
      bg: 'bg-destructive/10',
      border: 'border-destructive/20', 
      text: 'text-destructive',
      icon: AlertCircle
    },
    loading: {
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      text: 'text-primary',
      icon: Loader2
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`
      fixed top-4 left-1/2 -translate-x-1/2 z-50
      flex items-center gap-3 px-4 py-3 rounded-lg border
      ${style.bg} ${style.border} ${style.text}
      animate-in slide-in-from-top-2 duration-300
      max-w-md w-full mx-4
    `}>
      <Icon className={`w-4 h-4 ${type === 'loading' ? 'animate-spin' : ''}`} />
      <span className="text-sm font-medium flex-1">{message}</span>
      
      {onClose && type !== 'loading' && (
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-current/10 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}