import { useState } from 'react';
import { motion } from 'motion/react';
import { TaskInput } from './TaskInput';
import { TaskButton } from './TaskButton';
import { AuthTabs, AuthTabsList, AuthTabsTrigger, AuthTabsContent } from './AuthTabs';
import { ImageCarousel } from './ImageCarousel';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';
import { storeAccessToken } from '../lib/auth';

const API_BASE_URL = (() => {
  const base = import.meta.env.VITE_API_URL as string | undefined;
  if (!base) return 'http://localhost:3000';
  return base.endsWith('/') ? base.slice(0, -1) : base;
})();

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function postJson<T>(endpoint: string, body: unknown): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Intenta nuevamente.');
  }

  let data: unknown = null;
  if (response.status !== 204) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = (data as { message?: unknown } | null)?.message;
    const errorMessage = Array.isArray(message)
      ? message.join(', ')
      : typeof message === 'string'
        ? message
        : 'Ocurrió un error. Intenta nuevamente.';

    throw new ApiError(response.status, errorMessage);
  }

  return data as T;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface AuthScreenProps {
  onLogin?: (user: { email: string; name?: string }) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Carousel slides for the right panel
  const carouselSlides = [
    {
      image: "https://images.unsplash.com/photo-1755985693158-9e000ced5ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0aXZpdHklMjB3b3Jrc3BhY2UlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc1ODM3NjQ3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Potencia tu productividad",
      description: "Organiza tus tareas, establece prioridades y alcanza tus objetivos con nuestra plataforma intuitiva y eficiente."
    },
    {
      image: "https://images.unsplash.com/photo-1755436613032-10fd47e60014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0aXZlJTIwd29ya3NwYWNlJTIwZGVzayUyMG1pbmltYWx8ZW58MXx8fHwxNzU4Mzc3MDU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Espacio de trabajo inteligente",
      description: "Crea el ambiente perfecto para ser más productivo. Herramientas que se adaptan a tu flujo de trabajo diario."
    },
    {
      image: "https://images.unsplash.com/photo-1743796055651-41c743ff2465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbml6ZWQlMjBwbGFubmluZyUyMG5vdGVib29rfGVufDF8fHx8MTc1ODM3NzA2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Planificación organizada",
      description: "Desde la lluvia de ideas hasta la ejecución. Mantén todo en orden y nunca pierdas el enfoque en lo importante."
    },
    {
      image: "https://images.unsplash.com/photo-1754548930515-ac7eb978280d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXNrJTIwbWFuYWdlbWVudCUyMGNoZWNrbGlzdHxlbnwxfHx8fDE3NTgzNzcwNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Gestión eficiente",
      description: "Convierte tus objetivos en acciones concretas. Cada tarea completada te acerca más a tus metas."
    },
    {
      image: "https://images.unsplash.com/photo-1696087225391-eb97abf5ba20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBwcm9kdWN0aXZpdHl8ZW58MXx8fHwxNzU4MjY5NDIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Trabajo moderno",
      description: "Adapta tu productividad al mundo actual. Herramientas modernas para profesionales que buscan la excelencia."
    }
  ];

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Confirm password validation (only for register)
    if (activeTab === 'register') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setGeneralError(null);

    const normalizedEmail = formData.email.trim().toLowerCase();
    const password = formData.password;

    try {
      if (activeTab === 'register') {
        await postJson<{ id: number; email: string }>('/auth/register', {
          email: normalizedEmail,
          password
        });
      }

      const { access_token } = await postJson<{ access_token: string }>('/auth/login', {
        email: normalizedEmail,
        password
      });

      storeAccessToken(access_token);

      if (onLogin) {
        onLogin({
          email: normalizedEmail,
          name: normalizedEmail.split('@')[0]
        });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setErrors({ email: 'Este email ya está registrado' });
        } else if (error.status === 401) {
          setErrors({ password: 'Credenciales inválidas' });
        } else if (error.status === 0) {
          setGeneralError(error.message);
        } else {
          setGeneralError(error.message || 'Ocurrió un error. Intenta nuevamente.');
        }
      } else {
        setGeneralError('Ocurrió un error inesperado. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', confirmPassword: '' });
    setErrors({});
    setGeneralError(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-6 h-6 text-white" />
            </motion.div>
            <motion.h1 
              className="text-2xl font-semibold text-neutral-900 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              TaskFlow
            </motion.h1>
            <motion.p 
              className="text-neutral-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              Organiza tu día, logra más
            </motion.p>
          </motion.div>

          {/* Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <AuthTabs activeTab={activeTab} onTabChange={handleTabChange}>
            <AuthTabsList>
              <AuthTabsTrigger 
                value="login" 
                activeTab={activeTab} 
                onTabChange={handleTabChange}
              >
                Ingresar
              </AuthTabsTrigger>
              <AuthTabsTrigger 
                value="register" 
                activeTab={activeTab} 
                onTabChange={handleTabChange}
              >
                Crear cuenta
              </AuthTabsTrigger>
            </AuthTabsList>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AuthTabsContent value="login" activeTab={activeTab}>
                <div className="space-y-4">
                  <TaskInput
                    type="email"
                    label="Email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    error={errors.email}
                    required
                  />

                  <div className="relative">
                    <TaskInput
                      type={showPassword ? 'text' : 'password'}
                      label="Contraseña"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      error={errors.password}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-8 text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>
              </AuthTabsContent>

              <AuthTabsContent value="register" activeTab={activeTab}>
                <div className="space-y-4">
                  <TaskInput
                    type="email"
                    label="Email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    error={errors.email}
                    required
                  />

                  <div className="relative">
                    <TaskInput
                      type={showPassword ? 'text' : 'password'}
                      label="Contraseña"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      error={errors.password}
                      helperText="Mínimo 6 caracteres"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-8 text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <TaskInput
                      type={showConfirmPassword ? 'text' : 'password'}
                      label="Confirmar contraseña"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      error={errors.confirmPassword}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-8 text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </AuthTabsContent>

              {/* Submit Button */}
              <TaskButton
                type="submit"
                variant="solid"
                size="lg"
                loading={loading}
                className="w-full mt-6"
              >
                {activeTab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </TaskButton>

              {generalError && (
                <p className="text-sm text-red-600 text-center">
                  {generalError}
                </p>
              )}
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                {activeTab === 'login' ? (
                  <>
                    ¿No tienes cuenta?{' '}
                    <button
                      onClick={() => handleTabChange('register')}
                      className="text-primary hover:underline font-medium"
                    >
                      Regístrate aquí
                    </button>
                  </>
                ) : (
                  <>
                    ¿Ya tienes cuenta?{' '}
                    <button
                      onClick={() => handleTabChange('login')}
                      className="text-primary hover:underline font-medium"
                    >
                      Inicia sesión
                    </button>
                  </>
                )}
              </p>
            </div>
          </AuthTabs>
          </motion.div>
        </div>
      </div>

      {/* Right side - Image Carousel (Desktop only) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/5 to-secondary/5 items-center justify-center p-8">
        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ImageCarousel 
            slides={carouselSlides}
            autoPlay={true}
            interval={4000}
          />
        </motion.div>
      </div>
    </div>
  );
}