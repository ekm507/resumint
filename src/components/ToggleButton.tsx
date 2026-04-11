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
  const [index, setIndex] = useState(
    options.findIndex((x) => x.value == value) || 0,
  );

  const cycleOption = () => {
    const next = (index + 1) % options.length;
    setIndex(next);
    onChange(options[next].value);
  };

  return (
    <button className={`toggle-button`} onClick={cycleOption} type="button">
      {options[index]?.icon}
      {options[index].label}
    </button>
  );
}
