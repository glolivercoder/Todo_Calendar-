import React from 'react';
import { motion } from 'framer-motion';
import './TodoList.css';

const TodoList = ({ todos = [], selectedDate, setTodos }) => {
  const safeTodos = todos || [];
  const filteredTodos = safeTodos.filter(todo => {
    if (!selectedDate) return true;
    // Se a tarefa é recorrente e tem data final definida:
    if (todo.isRecurring && todo.recurringUntil && todo.date) {
      const taskStart = new Date(todo.date);
      const taskEnd = new Date(todo.recurringUntil);
      const filterDate = new Date(selectedDate);
      return filterDate >= taskStart && filterDate <= taskEnd;
    }
    // Tarefas não recorrentes: comparar datas exatas
    return todo.date === selectedDate;
  });

  const toggleComplete = (id) => {
    setTodos(safeTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Normal';
    }
  };

  return (
    <div className="space-y-4">
      {filteredTodos.map(todo => (
        <motion.div
          key={todo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-md shadow-md flex items-center gap-4 ${getPriorityColor(todo.priority)}`}
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleComplete(todo.id)}
            className="w-5 h-5 rounded-full"
          />
          <div className="flex-1">
            <span className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.task}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              ({getPriorityLabel(todo.priority)})
            </span>
          </div>
          {todo.date && (
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {todo.date} {todo.time}
            </span>
          )}
          {todo.isRecurring && todo.recurringUntil && (
            <span className="text-xs text-indigo-600 dark:text-indigo-400 ml-2">
              Recorrente até {todo.recurringUntil}
            </span>
          )}
        </motion.div>
      ))}
      {filteredTodos.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          Nenhuma tarefa encontrada
        </div>
      )}
    </div>
  );
};

export default TodoList; 