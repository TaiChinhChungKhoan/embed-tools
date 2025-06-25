import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

function Calendar({ className, ...props }) {
  return (
    <DayPicker
      showOutsideDays
      className={className}
      {...props}
    />
  );
}

export { Calendar }; 