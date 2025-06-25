import React, { useState } from "react";
import TimezoneSelect from "react-timezone-select";

export default function App() {
  // 1️⃣ Keep your existing state
  const [timeZone, setTimeZone] = useState({
    value: Intl.DateTimeFormat().resolvedOptions().timeZone
      || "Asia/Ho_Chi_Minh",
  });

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="tz" className="text-sm font-medium">
        Múi Giờ
      </label>

      <TimezoneSelect
        id="tz"
        value={timeZone}
        onChange={setTimeZone}
        className="react-tz w-full cursor-pointer"
        // 👉 you can override these styles with Tailwind or CSS-in-JS
        styles={{
          menu: (provided) => ({ ...provided, zIndex: 9999 }),
          control: (provided) => ({
            ...provided,
            minHeight: "2.5rem",
            borderRadius: "0.375rem",
          }),
        }}
        // remove the flag icons if you don’t want them:
        showFlag={false}
      />

      <p className="mt-2 text-sm text-gray-600">
        Chosen zone: <strong>{timeZone.value}</strong>
      </p>
    </div>
  );
}
