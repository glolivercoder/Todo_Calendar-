import React, { useState } from 'react';
import './TodoForm.css';

const TodoForm = ({ onSubmit }) => {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringUntil, setRecurringUntil] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    if (isRecurring && !recurringUntil) {
      alert('Informe a data final para a recorrência.');
      return;
    }

    onSubmit({
      task,
      priority,
      date: date || null,
      time: time || null,
      isRecurring,
      recurringUntil: isRecurring ? recurringUntil : null,
    });

    setTask('');
    setDate('');
    setTime('');
    setIsRecurring(false);
    setRecurringUntil('');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Digite sua tarefa"
        required
      />
      
      <select 
        value={priority} 
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="high">Alta Prioridade</option>
        <option value="medium">Média Prioridade</option>
        <option value="low">Baixa Prioridade</option>
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
        />
        Tarefa Recorrente
      </label>
      {isRecurring && (
        <input
          type="date"
          value={recurringUntil}
          onChange={(e) => setRecurringUntil(e.target.value)}
          placeholder="Até quando?"
        />
      )}

      <button type="submit">Adicionar Tarefa</button>
    </form>
  );
};

export default TodoForm; 