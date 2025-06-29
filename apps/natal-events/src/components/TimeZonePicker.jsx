import React, { useState } from "react";

export default function TimeZonePickerComponent({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="tz" className="text-sm font-medium">
        Time Zone
      </label>

      <select
        id="tz"
        value={value?.value || "Asia/Ho_Chi_Minh"}
        onChange={(e) => onChange({ value: e.target.value })}
        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer bg-white"
      >
        <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (UTC+7)</option>
        <option value="Asia/Bangkok">Asia/Bangkok (UTC+7)</option>
        <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
        <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
        <option value="America/New_York">America/New_York (UTC-5)</option>
        <option value="America/Los_Angeles">America/Los_Angeles (UTC-8)</option>
        <option value="Europe/London">Europe/London (UTC+0)</option>
        <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
        <option value="Australia/Sydney">Australia/Sydney (UTC+10)</option>
      </select>

      <p className="mt-2 text-sm text-gray-600">
        Chosen zone: <strong>{value?.value || "Asia/Ho_Chi_Minh"}</strong>
      </p>
    </div>
  );
} 