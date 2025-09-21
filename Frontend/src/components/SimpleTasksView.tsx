import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, Trash2, LogOut, User } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface User {
  email: string;
  name?: string;
}

interface SimpleTasksViewProps {
  user?: User | null;
  onLogout?: () => void;
}

export function SimpleTasksView({ user, onLogout }: SimpleTasksViewProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Revisar diseños de la nueva funcionalidad',
      description: 'Validar mockups y flujos de usuario antes de la reunión del equipo',
      completed: false
    },
    {
      id: '2',
      title: 'Actualizar documentación del API',
      description: 'Documentar los nuevos endpoints y ejemplos de uso',
      completed: true
    }
  ]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const pendingCount = tasks.filter(t => !t.completed).length;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      completed: false
    };

    setTasks(prev => [newTask, ...prev]);
    setTitle('');
    setDescription('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <motion.header 
        className="bg-white border-b px-4 py-6" 
        style={{ borderColor: '#E2E8F0' }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold" style={{ color: '#0F172A' }}>
                Mis Tareas
              </h1>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {pendingCount} pendientes
              </span>
            </div>
            
            {/* User Info and Logout */}
            {user && onLogout && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#334155' }}>
                  <User className="w-4 h-4" />
                  <span>Hola, {user.name || 'Usuario'}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm"
                  style={{ 
                    color: '#334155',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.color = '#2563EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#334155';
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </div>
            )}
          </div>

          {/* Add Task Form */}
          <motion.form 
            onSubmit={handleAddTask} 
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>
                  Título de la tarea
                </label>
                <motion.input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="¿Qué necesitas hacer?"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    borderColor: '#E2E8F0',
                    focusRingColor: '#2563EB'
                  }}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>
                  Descripción
                </label>
                <motion.input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles adicionales..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    borderColor: '#E2E8F0'
                  }}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={!title.trim() || !description.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                style={{ 
                  backgroundColor: '#2563EB',
                  color: 'white'
                }}
                whileHover={!title.trim() || !description.trim() ? {} : { scale: 1.02 }}
                whileTap={!title.trim() || !description.trim() ? {} : { scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <Plus className="w-4 h-4" />
                Agregar Tarea
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        className="max-w-6xl mx-auto p-4 lg:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {tasks.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5, type: "spring" }}
            >
              <Check className="w-8 h-8 text-gray-500" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#0F172A' }}>
              No tienes tareas aún
            </h3>
            <p className="text-gray-600">
              Comienza agregando tu primera tarea para organizar tu día.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {tasks.map((task, index) => (
                <motion.div 
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: Math.min(index * 0.1, 0.5),
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  style={{ borderColor: '#E2E8F0' }}
                >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <motion.button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1 w-5 h-5 rounded border-2 flex items-center justify-center"
                      style={{
                        borderColor: task.completed ? '#22C55E' : '#334155',
                        backgroundColor: task.completed ? '#22C55E' : 'transparent'
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <AnimatePresence>
                        {task.completed && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm" style={{ color: '#0F172A' }}>
                        {task.title}
                      </h4>
                    </div>
                  </div>
                  <AnimatePresence>
                    {task.completed && (
                      <motion.span 
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#22C55E20', color: '#22C55E' }}
                        initial={{ opacity: 0, scale: 0.8, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="w-3 h-3" />
                        Completada
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Content */}
                <div className="mb-4">
                  <p className="text-sm" style={{ color: '#334155' }}>
                    {task.description}
                  </p>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-end pt-3 border-t" style={{ borderColor: '#E2E8F0' }}>
                  <motion.button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 rounded-lg transition-colors hover:bg-red-50 text-gray-600 hover:text-red-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.main>
    </div>
  );
}