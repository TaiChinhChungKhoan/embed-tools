import * as React from 'react';
import { getBrowserLocale } from '../utils/locale';

export default function DatePickerComponent({ value, onChange, label, id, inputClassName }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState('');

  // Get locale-specific date format help text
  const getDateFormatHelp = () => {
    const locale = getBrowserLocale();
    if (locale.startsWith('vi')) {
      return '(Ngày/Tháng/Năm)';
    } else if (locale.startsWith('en-US')) {
      return '(Month/Day/Year)';
    } else if (locale.startsWith('en-GB') || locale.startsWith('en')) {
      return '(Day/Month/Year)';
    } else if (locale.startsWith('fr')) {
      return '(Jour/Mois/Année)';
    } else if (locale.startsWith('de')) {
      return '(Tag/Monat/Jahr)';
    } else if (locale.startsWith('es')) {
      return '(Día/Mes/Año)';
    } else if (locale.startsWith('zh')) {
      return '(年/月/日)';
    } else if (locale.startsWith('ja')) {
      return '(年/月/日)';
    } else if (locale.startsWith('ko')) {
      return '(년/월/일)';
    } else {
      return '(DD/MM/YYYY)';
    }
  };

  // Format date for input value (YYYY-MM-DD format required by HTML5 date input)
  const formatDateForInput = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format date for display in user's locale
  const formatDateForDisplay = (date) => {
    if (!date) return '';
    return date.toLocaleDateString(getBrowserLocale(), {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Parse date from user input
  const parseDateFromInput = (inputValue) => {
    if (!inputValue) return null;
    
    try {
      // Try to parse as a date string
      const parsedDate = new Date(inputValue);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
      
      // Try common date formats
      const formats = [
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // MM/DD/YYYY or DD/MM/YYYY
        /(\d{4})-(\d{1,2})-(\d{1,2})/,   // YYYY-MM-DD
        /(\d{1,2})-(\d{1,2})\/(\d{4})/,   // MM-DD-YYYY or DD-MM-YYYY
      ];
      
      for (const format of formats) {
        const match = inputValue.match(format);
        if (match) {
          const [, first, second, third] = match;
          // Try different interpretations
          const interpretations = [
            new Date(third, second - 1, first), // YYYY-MM-DD
            new Date(third, first - 1, second), // YYYY-DD-MM
          ];
          
          for (const date of interpretations) {
            if (!isNaN(date.getTime())) {
              return date;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Could not parse date from input:', inputValue);
    }
    
    return null;
  };

  const handleFocus = () => {
    setIsEditing(true);
    setEditValue(formatDateForDisplay(value));
  };

  const handleBlur = () => {
    setIsEditing(false);
    const parsedDate = parseDateFromInput(editValue);
    if (parsedDate) {
      onChange(parsedDate);
    } else {
      // Reset to original value if parsing failed
      setEditValue(formatDateForDisplay(value));
    }
  };

  const handleChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(formatDateForDisplay(value));
      e.target.blur();
    }
  };

  const handleClick = () => {
    if (!isEditing) {
      // Open the native date picker
      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.value = formatDateForInput(value);
      dateInput.style.position = 'absolute';
      dateInput.style.left = '-9999px';
      document.body.appendChild(dateInput);
      
      dateInput.addEventListener('change', (e) => {
        const newDate = new Date(e.target.value);
        onChange(newDate);
        document.body.removeChild(dateInput);
      });
      
      dateInput.addEventListener('blur', () => {
        document.body.removeChild(dateInput);
      });
      
      dateInput.click();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label} <span className="text-gray-500 font-normal">{getDateFormatHelp()}</span>
      </label>
      <input
        type="text"
        id={id}
        value={isEditing ? editValue : formatDateForDisplay(value)}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        placeholder="Click to select or type date"
        className={`${inputClassName || ''} w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer bg-white`}
      />
    </div>
  );
}
