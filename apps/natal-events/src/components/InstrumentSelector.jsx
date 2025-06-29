import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@embed-tools/components';
import { PRESET_INSTRUMENTS } from '@embed-tools/astro-utils';

const InstrumentSelector = ({ value, onChange }) => {
  const handleInstrumentChange = (instrumentName) => {
    const instrument = PRESET_INSTRUMENTS[instrumentName];
    if (instrument) {
      onChange(instrument);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Preset Instruments</label>
        <Select value={value?.name || ''} onValueChange={handleInstrumentChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a preset instrument" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PRESET_INSTRUMENTS).map(([key, instrument]) => (
              <SelectItem key={key} value={key}>
                {instrument.name} - {instrument.birthLocation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>Select a preset instrument to automatically fill in birth details.</p>
        <p>Or enter custom instrument details manually.</p>
      </div>
    </div>
  );
};

export default InstrumentSelector; 