import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@embed-tools/components';
import { Calendar } from '@embed-tools/components';
import { Popover, PopoverContent, PopoverTrigger } from '@embed-tools/components';

export default function DatePickerComponent({ value, onChange, label, id, inputClassName }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              readOnly
              id={id}
              value={value ? format(value, 'dd/MM/yyyy') : ''}
              placeholder="Chọn ngày"
              className={`${inputClassName || ''} cursor-pointer pr-10`} // padding right để icon không che text
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            captionLayout="dropdown"
            fromYear={1900}
            toYear={new Date().getFullYear()}
            disabled={(date) => date > new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
