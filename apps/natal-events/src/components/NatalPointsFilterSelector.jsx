import React from 'react';
import { Label } from '@embed-tools/components';
import { PLANETS } from '@embed-tools/astro-utils';

const NatalPointsFilterSelector = ({ value = [], onChange, id }) => {
  // Available natal points: planets + angles
  const natalPoints = [
    // Traditional planets
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn',
    // Outer planets
    'Uranus', 'Neptune', 'Pluto',
    // Angles
    'Ascendant', 'Midheaven'
  ];

  const handlePointToggle = (point) => {
    const newValue = value.includes(point)
      ? value.filter(p => p !== point)
      : [...value, point];
    onChange(newValue);
  };

  const handleSelectAll = () => {
    onChange(natalPoints);
  };

  const handleSelectNone = () => {
    onChange([]);
  };

  const handleSelectTraditional = () => {
    // Traditional planets + angles
    const traditional = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Ascendant', 'Midheaven'];
    onChange(traditional);
  };

  const handleSelectAngles = () => {
    // Just the angles
    const angles = ['Ascendant', 'Midheaven'];
    onChange(angles);
  };

  const handleSelectPersonal = () => {
    // Personal planets + angles
    const personal = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Ascendant', 'Midheaven'];
    onChange(personal);
  };

  return (
    <div>
      <Label htmlFor={id}>Natal Points Filter</Label>
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
            Traditional + Angles
          </button>
          <button
            type="button"
            onClick={handleSelectAngles}
            className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
          >
            Angles Only
          </button>
          <button
            type="button"
            onClick={handleSelectPersonal}
            className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
          >
            Personal + Angles
          </button>
        </div>

        {/* Natal points checkboxes */}
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded p-3">
          {natalPoints.map((point) => (
            <label key={point} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value.includes(point)}
                onChange={() => handlePointToggle(point)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm">{point}</span>
            </label>
          ))}
        </div>

        {/* Selection summary */}
        <div className="text-xs text-gray-600 mt-2">
          Selected: {value.length} of {natalPoints.length} natal points
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

export default NatalPointsFilterSelector; 