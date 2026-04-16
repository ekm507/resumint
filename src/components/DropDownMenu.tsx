import { useState, useRef, useEffect } from "react";
import { type DropdownOption } from "../utils/types";

interface DropdownMenuProps<T> {
  options: DropdownOption<T>[];
  value?: T;
  text?: string;
  onChange: (v: T) => void;
}

export function DropdownMenu<T>({
  options,
  value,
  onChange,
  text,
}: DropdownMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = value ? options.find((o) => o.value === value) : null;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="dropdown-menu" ref={containerRef}>
      {selected && (
        <div className="dropdown-selected" onClick={() => setOpen((o) => !o)}>
          {selected?.icon && (
            <span className="dropdown-icon">{selected.icon}</span>
          )}
          {selected?.label && (
            <span className="dropdown-label">{selected.label}</span>
          )}
        </div>
      )}

      {open ? (
        <div className="dropdown-list">
          {options.map((opt) => (
            <div
              key={opt.key}
              className="dropdown-item"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.icon && <span className="dropdown-icon">{opt.icon}</span>}
              {opt.label && <span className="dropdown-label">{opt.label}</span>}
            </div>
          ))}
        </div>
      ) : (
        <button onClick={() => setOpen(!open)}>{text || "Open Menu"}</button>
      )}
    </div>
  );
}
