import { useState } from "react";

interface ToggleOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface Props {
  value?: string;
  onChange: (value: string) => void;
  options: ToggleOption[];
  initial?: ToggleOption;
}

export default function ToggleButton({ value, onChange, options }: Props) {
  const [current, setCurrent] = useState(value);

  return (
    <div className="toggle-button-container">
      {options.map((o) => (
        <button
          className={`toggle-button ${o.value === current && "toggle-button-active"}`}
          key={o.value}
          onClick={() => {
            onChange(o.value);
            setCurrent(o.value);
          }}
        >
          {o?.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}
