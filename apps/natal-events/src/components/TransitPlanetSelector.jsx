import React from 'react';
import { Label } from '@embed-tools/components';
import { PLANETS } from '@embed-tools/astro-utils';

const TransitPlanetSelector = ({ value = [], onChange, id }) => {
  const handlePlanetToggle = (planet) => {
    const newValue = value.includes(planet)
      ? value.filter(p => p !== planet)
      : [...value, planet];
    onChange(newValue);
  };

  const handleSelectAll = () => {
    onChange(Object.keys(PLANETS));
  };

  const handleSelectNone = () => {
    onChange([]);
  };

  const handleSelectTraditional = () => {
    // Traditional planets: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn
    const traditional = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    onChange(traditional);
  };

  const handleSelectOuter = () => {
    // Outer planets: Uranus, Neptune, Pluto
    const outer = ['Uranus', 'Neptune', 'Pluto'];
    onChange(outer);
  };

  return (
    <div>
      <Label htmlFor={id}>Transit Planets</Label>
      <div className="mt-2 space-y-2">
        {/* Quick selection buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            All
          </button>
          <button
            type="button"
            onClick={handleSelectNone}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            None
          </button>
          <button
            type="button"
            onClick={handleSelectTraditional}
            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Traditional
          </button>
          <button
            type="button"
            onClick={handleSelectOuter}
            className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
          >
            Outer
          </button>
        </div>

        {/* Planet checkboxes */}
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded p-3">
          {Object.keys(PLANETS).map((planet) => (
            <label key={planet} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value.includes(planet)}
                onChange={() => handlePlanetToggle(planet)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm">{planet}</span>
            </label>
          ))}
        </div>

        {/* Selection summary */}
        <div className="text-xs text-gray-600 mt-2">
          Selected: {value.length} of {Object.keys(PLANETS).length} planets
          {value.length > 0 && (
            <span className="ml-2">
              ({value.join(', ')})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransitPlanetSelector; 