import { useState, useEffect } from 'react';
import { TaskNavbar } from './TaskNavbar';
import { TaskCard, TaskCardHeader, TaskCardContent, TaskCardFooter } from './TaskCard';
import { TaskInput } from './TaskInput';
import { TaskButton } from './TaskButton';
import { TaskToggle } from './TaskToggle';
import { TaskBadge } from './TaskBadge';
import { TaskEmptyState } from './TaskEmptyState';
import { TaskModal } from './TaskModal';
import { FeedbackBar } from './FeedbackBar';
import { Edit3, Trash2, Plus } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

interface FormData {
  title: string;
  description: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

interface FeedbackState {
  type: 'success' | 'error' | 'loading' | null;
  message: string;
}

export function TasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; taskId: string | null }>({
    isOpen: false,
    taskId: null
  });
  const [feedback, setFeedback] = useState<FeedbackState>({ type: null, message: '' });

  // Initialize with some sample tasks
  useEffect(() => {
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Revisar diseños de la nueva funcionalidad',
        description: 'Validar mockups y flujos de usuario antes de la reunión del equipo',
        completed: false,
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        title: 'Actualizar documentación del API',
        description: 'Documentar los nuevos endpoints y ejemplos de uso',
        completed: true,
        createdAt: new Date('2024-01-14')
      },
      {
        id: '3',
        title: 'Preparar presentación del sprint',
        description: 'Recopilar métricas y logros del sprint actual',
        completed: false,
        createdAt: new Date('2024-01-13')
      }
    ];
    setTasks(sampleTasks);
  }, []);

  const pendingTasksCount = tasks.filter(task => !task.completed).length;

  const showFeedback = (type: FeedbackState['type'], message: string) => {
    setFeedback({ type, message });
  };

  const hideFeedback = () => {
    setFeedback({ type: null, message: '' });
  };

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.title.trim()) {
      errors.title = 'El título es obligatorio';
    }

    if (!formData.description.trim()) {
      errors.description = 'La descripción es obligatoria';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    showFeedback('loading', 'Agregando tarea...');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      completed: false,
      createdAt: new Date()
    };

    setTasks(prev => [newTask, ...prev]);
    setFormData({ title: '', description: '' });
    setIsSubmitting(false);
    showFeedback('success', 'Tarea agregada exitosamente');
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    showFeedback('loading', 'Actualizando tarea...');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));

    showFeedback('success', task.completed ? 'Tarea marcada como pendiente' : 'Tarea completada');
  };

  const handleDeleteClick = (taskId: string) => {
    setDeleteModal({ isOpen: true, taskId });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.taskId) return;

    showFeedback('loading', 'Eliminando tarea...');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setTasks(prev => prev.filter(t => t.id !== deleteModal.taskId));
    setDeleteModal({ isOpen: false, taskId: null });
    showFeedback('success', 'Tarea eliminada');
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, taskId: null });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Feedback Bar */}
      <FeedbackBar
        type={feedback.type}
        message={feedback.message}
        onClose={hideFeedback}
      />

      {/* Header */}
      <header className="bg-white border-b border-neutral-300 px-4 py-6 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-neutral-900">Mis Tareas</h1>
              <TaskBadge variant="custom" className="bg-neutral-300/50 text-neutral-600 border-neutral-300">
                {pendingTasksCount} pendientes
              </TaskBadge>
            </div>
          </div>

          {/* Add Task Form */}
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <TaskInput
                label="Título de la tarea"
                placeholder="¿Qué necesitas hacer?"
                value={formData.title}
                onChange={handleInputChange('title')}
                error={formErrors.title}
                required
              />
              <TaskInput
                label="Descripción"
                placeholder="Detalles adicionales..."
                value={formData.description}
                onChange={handleInputChange('description')}
                error={formErrors.description}
                required
              />
            </div>
            
            <div className="flex justify-end">
              <TaskButton
                type="submit"
                variant="solid"
                loading={isSubmitting}
                disabled={!formData.title.trim() || !formData.description.trim()}
              >
                <Plus className="w-4 h-4" />
                Agregar Tarea
              </TaskButton>
            </div>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 lg:p-6">
        {tasks.length === 0 ? (
          <TaskEmptyState
            title="No tienes tareas aún"
            description="Comienza agregando tu primera tarea para organizar tu día."
            actionLabel="Crear primera tarea"
            onAction={() => {
              // Focus on title input
              const titleInput = document.querySelector('input[placeholder="¿Qué necesitas hacer?"]') as HTMLInputElement;
              titleInput?.focus();
            }}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} hover>
                <TaskCardHeader>
                  <TaskToggle
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    label={task.title}
                    className="flex-1"
                  />
                  {task.completed && <TaskBadge variant="done" />}
                </TaskCardHeader>
                
                <TaskCardContent>
                  <p className="text-sm text-neutral-600">
                    {task.description}
                  </p>
                </TaskCardContent>
                
                <TaskCardFooter>
                  <div className="text-xs text-neutral-600">
                    {task.createdAt.toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TaskButton
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('Edit task:', task.id)}
                      className="text-neutral-600 hover:text-primary"
                    >
                      <Edit3 className="w-4 h-4" />
                    </TaskButton>
                    
                    <TaskButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(task.id)}
                      className="text-neutral-600 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </TaskButton>
                  </div>
                </TaskCardFooter>
              </TaskCard>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <TaskModal
        isOpen={deleteModal.isOpen}
        onClose={handleCancelDelete}
        title="Eliminar Tarea"
        type="destructive"
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        loading={feedback.type === 'loading' && feedback.message.includes('Eliminando')}
      >
        ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.
      </TaskModal>
    </div>
  );
}