import React from "react";

export default function TimePickerComponent({
  value,
  onChange,
  label,
  id,
  inputClassName,
  disabled
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState('');

  // Format time for display in user's locale
  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return date.toLocaleTimeString(navigator.language || 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Use 24-hour format for consistency
    });
  };

  // Parse time from user input
  const parseTimeFromInput = (inputValue) => {
    if (!inputValue) return '';
    
    try {
      // Try to parse the input as a time
      const parsedTime = new Date(`2000-01-01T${inputValue}`);
      if (!isNaN(parsedTime.getTime())) {
        const hours = String(parsedTime.getHours()).padStart(2, '0');
        const minutes = String(parsedTime.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      }
      
      // Try common time formats
      const formats = [
        /(\d{1,2}):(\d{2})/, // HH:MM
        /(\d{1,2})\.(\d{2})/, // HH.MM
        /(\d{1,2})h(\d{2})/, // HHhMM
      ];
      
      for (const format of formats) {
        const match = inputValue.match(format);
        if (match) {
          const [, hours, minutes] = match;
          const hour = parseInt(hours, 10);
          const minute = parseInt(minutes, 10);
          
          if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
            return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
          }
        }
      }
    } catch (e) {
      console.warn('Could not parse time from input:', inputValue);
    }
    
    return '';
  };

  const handleFocus = () => {
    if (!disabled) {
      setIsEditing(true);
      setEditValue(formatTimeForDisplay(value));
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    const parsedTime = parseTimeFromInput(editValue);
    if (parsedTime) {
      onChange(parsedTime);
    } else {
      // Reset to original value if parsing failed
      setEditValue(formatTimeForDisplay(value));
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
      setEditValue(formatTimeForDisplay(value));
      e.target.blur();
    }
  };

  const handleClick = () => {
    if (!disabled && !isEditing) {
      // Open the native time picker
      const timeInput = document.createElement('input');
      timeInput.type = 'time';
      timeInput.value = value;
      timeInput.style.position = 'absolute';
      timeInput.style.left = '-9999px';
      document.body.appendChild(timeInput);
      
      timeInput.addEventListener('change', (e) => {
        onChange(e.target.value);
        document.body.removeChild(timeInput);
      });
      
      timeInput.addEventListener('blur', () => {
        document.body.removeChild(timeInput);
      });
      
      timeInput.click();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        type="text"
        id={id}
        value={isEditing ? editValue : formatTimeForDisplay(value)}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        disabled={disabled}
        placeholder="Click to select or type time"
        className={
          inputClassName ||
          "w-full h-10 px-3 py-2 border border-gray-300 rounded-md " +
          "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer bg-white"
        }
        aria-label={label}
      />
    </div>
  );
} 