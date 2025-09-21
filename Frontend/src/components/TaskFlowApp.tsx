import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthScreen } from './AuthScreen';
import { SimpleTasksView } from './SimpleTasksView';

type AppView = 'auth' | 'tasks';

interface User {
  email: string;
  name?: string;
}

export function TaskFlowApp() {
  const [currentView, setCurrentView] = useState<AppView>('auth');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView('tasks');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('auth');
  };

  return (
    <AnimatePresence mode="wait">
      {currentView === 'auth' ? (
        <motion.div
          key="auth"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <AuthScreen onLogin={handleLogin} />
        </motion.div>
      ) : (
        <motion.div
          key="tasks"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <SimpleTasksView 
            user={user} 
            onLogout={handleLogout} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}