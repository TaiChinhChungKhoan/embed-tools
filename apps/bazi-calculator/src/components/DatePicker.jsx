import * as React from 'react';
import { format } from 'date-fns';

export default function DatePickerComponent({ value, onChange, label, id, inputClassName }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        type="date"
        id={id}
        value={value ? format(value, 'yyyy-MM-dd') : ''}
        onChange={(e) => {
          onChange(new Date(e.target.value));
          setOpen(false);
        }}
        className={`${inputClassName || ''} w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
      />
    </div>
  );
}
