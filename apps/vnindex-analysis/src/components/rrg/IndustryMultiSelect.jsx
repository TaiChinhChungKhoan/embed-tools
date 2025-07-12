import React, { useState, useEffect, useRef } from 'react';

// Custom Multi-Select with Checkboxes for Industry Filtering
function IndustryMultiSelect({ options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleToggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((v) => v !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="relative min-w-[200px]" ref={ref}>
      <button
        type="button"
        className="w-full border rounded px-2 py-1 text-sm bg-gray-800 text-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        {selected.length === 0
          ? "Chọn ngành"
          : selected.length === 1
          ? options.find((o) => o.id === selected[0])?.name
          : `${selected.length} ngành`}
        <span className="ml-2">▼</span>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-700"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.id)}
                onChange={() => handleToggle(option.id)}
                className="accent-blue-500 mr-2"
              />
              <span className="text-white">{option.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default IndustryMultiSelect; 