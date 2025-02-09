import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import './GoogleCalendarWidget.css';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const GoogleCalendarWidget = forwardRef(({ isLoggedIn, token }, ref) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchCalendarEvents();
    }
  }, [isLoggedIn, token, selectedDate]);

  const fetchCalendarEvents = async () => {
    try {
      // Configurar parâmetros de data
      const timeMin = new Date(selectedDate);
      timeMin.setHours(0, 0, 0, 0);
      const timeMax = new Date(selectedDate);
      timeMax.setHours(23, 59, 59, 999);

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        `timeMin=${timeMin.toISOString()}&` +
        `timeMax=${timeMax.toISOString()}&` +
        `orderBy=startTime&` +
        `singleEvents=true&` +
        `key=${API_KEY}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Falha ao carregar eventos');
      }

      const data = await response.json();
      setEvents(data.items || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      toast.error('Erro ao carregar eventos do calendário');
      setIsLoading(false);
    }
  };

  const addEventToCalendar = async (todo) => {
    try {
      const event = {
        summary: todo.task,
        description: `Prioridade: ${todo.priority}`,
        start: {
          dateTime: new Date(todo.date + 'T' + (todo.time || '00:00:00')).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: new Date(todo.date + 'T' + (todo.time || '23:59:59')).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) throw new Error('Falha ao adicionar evento');

      toast.success('Evento adicionado ao Google Calendar!');
      fetchCalendarEvents();
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
      toast.error('Erro ao adicionar evento ao calendário');
    }
  };

  useImperativeHandle(ref, () => ({
    addEventToCalendar
  }));

  if (!isLoggedIn) {
    return (
      <div className="calendar-widget-warning">
        <p>Faça login com o Google para ver seus eventos do calendário</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="calendar-widget"
      initial={false}
      animate={{ height: isExpanded ? 'auto' : '100px' }}
    >
      <div 
        className="calendar-widget-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <h3 className="text-lg font-semibold">
            Google Calendar
          </h3>
          {isLoading && (
            <motion.div
              className="ml-2 text-sm text-blue-500"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Carregando...
            </motion.div>
          )}
        </div>
        <motion.button
          className="text-blue-500 hover:text-blue-700"
          animate={{ rotate: isExpanded ? 180 : 0 }}
        >
          ▼
        </motion.button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="calendar-widget-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="calendar-date-picker mb-4">
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="p-2 border rounded"
              />
            </div>

            {events.length > 0 ? (
              <ul className="space-y-2">
                {events.map(event => (
                  <motion.li
                    key={event.id}
                    className="calendar-event"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{event.summary}</p>
                      <motion.div
                        className="text-sm text-blue-500"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {new Date(event.start.dateTime).toLocaleTimeString()}
                      </motion.div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(event.start.dateTime).toLocaleDateString()}
                    </p>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Nenhum evento encontrado para esta data
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default GoogleCalendarWidget; 