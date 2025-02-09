import React, { useState, useEffect, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import DateFilter from './components/DateFilter';
import UserSetup from './components/UserSetup';
import GoogleCalendarWidget from './components/GoogleCalendarWidget';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

// Obtém as variáveis de ambiente
const CALENDAR_SCOPE = import.meta.env.VITE_GOOGLE_CALENDAR_SCOPE;
const APP_NAME = import.meta.env.VITE_APP_NAME;

function App() {
  const [theme, setTheme] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [todos, setTodos] = useState(() => {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    token: null,
    error: null
  });

  const calendarWidgetRef = useRef(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    console.log("Salvando tarefas no localStorage:", todos);
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = async (todoData) => {
    const newTodo = {
      id: Date.now(),
      ...todoData,
      completed: false
    };

    if (todoData.date && todoData.time && authStatus.isAuthenticated) {
      try {
        await handleAddToCalendar(newTodo);
      } catch (error) {
        console.error('Erro ao adicionar ao Google Calendar:', error);
      }
    }

    setTodos([...todos, newTodo]);
    toast.success('Tarefa adicionada!');
  };

  const handleAddToCalendar = async (todo) => {
    if (authStatus.isAuthenticated && calendarWidgetRef.current) {
      await calendarWidgetRef.current.addEventToCalendar(todo);
    }
  };

  const handleLoginSuccess = (credentialResponse) => {
    console.log("Login de sucesso:", credentialResponse);
    setIsLoggedIn(true);
    setAuthStatus({
      isAuthenticated: true,
      token: credentialResponse.credential,
      error: null
    });
    localStorage.setItem('googleToken', credentialResponse.credential);
    toast.success('Login realizado com sucesso!');
  };

  const handleLoginError = () => {
    console.log("Falha no login");
    setAuthStatus({
      isAuthenticated: false,
      token: null,
      error: 'Falha na autenticação'
    });
    toast.error('Erro ao realizar login');
  };

  // Calcula progresso das tarefas concluídas
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-4xl font-bold mb-8 cyberpunk-text text-center ${
          theme === 'dark' ? 'text-purple-300' : 'text-blue-600'
        }`}>
          {APP_NAME}
        </h1>
        
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            useOneTap
            auto_select
            scope={CALENDAR_SCOPE}
            cookiePolicy={'single_host_origin'}
          />
        </div>

        {/* Status de Autenticação */}
        {authStatus.isAuthenticated ? (
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mb-4">
            <p className="text-green-800 dark:text-green-200">
              Usuário conectado ✓
            </p>
          </div>
        ) : authStatus.error ? (
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg mb-4">
            <p className="text-red-800 dark:text-red-200">
              Falha na autenticação: {authStatus.error}
            </p>
          </div>
        ) : null}

        <div className="max-w-3xl mx-auto">
          {/* Widget do Google Calendar */}
          <GoogleCalendarWidget 
            ref={calendarWidgetRef}
            isLoggedIn={authStatus.isAuthenticated}
            token={authStatus.token}
          />

          <TodoForm 
            onSubmit={handleAddTodo}
          />
          <DateFilter 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />

          {/* Barra de progresso */}
          <div className="progress-bar-container my-4">
            <p>Progresso: {progressPercent}% concluído</p>
            <progress value={completedCount} max={totalCount} className="w-full" />
          </div>

          <TodoList 
            todos={todos} 
            selectedDate={selectedDate}
            setTodos={setTodos}
          />
        </div>
      </div>
      
      <UserSetup theme={theme} setTheme={setTheme} />
      <Toaster position="bottom-center" />
    </div>
  );
}

export default App; 