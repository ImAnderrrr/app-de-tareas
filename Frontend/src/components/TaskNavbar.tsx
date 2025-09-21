import { CheckCircle, Plus, Menu } from 'lucide-react';

interface TaskNavbarProps {
  title?: string;
  onMenuClick?: () => void;
  onAddTask?: () => void;
  taskCount?: number;
}

export function TaskNavbar({ 
  title = "Mis Tareas", 
  onMenuClick,
  onAddTask,
  taskCount = 0 
}: TaskNavbarProps) {
  return (
    <nav className="bg-white border-b border-neutral-300 px-4 py-3 lg:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-neutral-300/50 transition-colors lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5 text-neutral-600" />
          </button>
          
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
          </div>
        </div>

        {/* Center section - Task count (hidden on mobile) */}
        <div className="hidden sm:flex items-center">
          <span className="text-sm text-neutral-600">
            {taskCount} {taskCount === 1 ? 'tarea' : 'tareas'}
          </span>
        </div>

        {/* Right section */}
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 active:bg-primary/80 disabled:bg-primary/50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nueva Tarea</span>
        </button>
      </div>
    </nav>
  );
}