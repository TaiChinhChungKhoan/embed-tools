import React from "react";
import TimePicker from "react-time-picker";
import 'react-time-picker/dist/TimePicker.css';

export default function TimePickerComponent({
  value,
  onChange,
  label,
  id,
  inputClassName,
  disabled
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <TimePicker
        id={id}
        value={value}
        onChange={onChange}
        format="HH:mm"
        placeholder="HH:MM"
        disableClock            // completely remove the clock UI
        clockIcon={null}        // no clock toggle icon
        clearIcon={null}        // no "×" clear icon
        className={
          inputClassName ||
          "w-full h-10 px-3 py-2 border border-gray-300 rounded-md " +
          "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        }
        disabled={disabled}
        aria-label={label}
      />
    </div>
  );
}
