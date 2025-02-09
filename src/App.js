import React, { useState, useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import DateFilter from './components/DateFilter';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleGoogleSuccess = (response) => {
    setIsAuthenticated(true);
    // Aqui você implementaria a lógica de autenticação com o token
    console.log('Google Auth Success:', response);
  };

  const handleGoogleFailure = (error) => {
    console.log('Google Auth Error:', error);
  };

  const addTodo = async (todo) => {
    const newTodo = {
      ...todo,
      id: Date.now(),
      completed: false
    };

    if (todo.date && todo.time && isAuthenticated) {
      // Aqui você implementaria a integração com o Google Calendar
      try {
        await addToGoogleCalendar(newTodo);
      } catch (error) {
        console.error('Erro ao adicionar ao Google Calendar:', error);
      }
    }

    setTodos([...todos, newTodo]);
  };

  return (
    <div className="app">
      <h1>Todo List</h1>
      
      <GoogleLogin
        clientId="SEU_GOOGLE_CLIENT_ID"
        buttonText="Login com Google"
        onSuccess={handleGoogleSuccess}
        onFailure={handleGoogleFailure}
        cookiePolicy={'single_host_origin'}
      />

      <DateFilter 
        onDateSelect={setSelectedDate} 
        selectedDate={selectedDate} 
      />
      
      <TodoForm onSubmit={addTodo} />
      
      <TodoList 
        todos={todos} 
        selectedDate={selectedDate}
        setTodos={setTodos} 
      />
    </div>
  );
};

export default App; 