import React from 'react';
import './DateFilter.css';

const DateFilter = ({ onDateSelect, selectedDate }) => {
  return (
    <div className="date-filter">
      <input
        type="date"
        value={selectedDate || ''}
        onChange={(e) => onDateSelect(e.target.value)}
      />
      {selectedDate && (
        <button onClick={() => onDateSelect(null)}>
          Limpar Filtro
        </button>
      )}
    </div>
  );
};

export default DateFilter; 