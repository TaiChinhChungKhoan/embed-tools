import React, { useState } from 'react';
import { Input, Button } from '@embed-tools/components';

const EventFinder = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch({ term: searchTerm.trim(), type: searchType });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="title">Event Title</option>
          <option value="planet">Planet</option>
          <option value="aspect">Aspect Type</option>
          <option value="score">Min Score</option>
        </select>
        <Input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSearch}>
          Search
        </Button>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>Search by event title, planet name, aspect type, or minimum score.</p>
        <p>Examples: "Sun", "Conjunction", "4.5"</p>
      </div>
    </div>
  );
};

export default EventFinder; 