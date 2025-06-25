import React from "react";

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
      <input
        type="time"
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className={
          inputClassName ||
          "w-full h-10 px-3 py-2 border border-gray-300 rounded-md " +
          "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        }
        aria-label={label}
      />
    </div>
  );
}
