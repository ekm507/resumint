import { useState, useRef, useEffect } from "react";
import { getAllBlocks } from "../blocks/blockRegistry";

interface AddBlockMenuProps {
  onSelect: (type: string) => void;
}

export default function AddBlockMenu({ onSelect }: AddBlockMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const blockTypes = getAllBlocks();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="add-block-container">
      <div className="add-block-line" />

      <button className="add-block-trigger" onClick={() => setIsOpen(!isOpen)}>
        +
      </button>

      {isOpen && (
        <div className="add-block-menu">
          <div className="add-block-grid">
            {blockTypes.map((b) => (
              <button
                key={b.type}
                className="add-block-item"
                onClick={() => {
                  onSelect(b.type);
                  setIsOpen(false);
                }}
              >
                <span className="add-block-icon">{b.icon}</span>
                <span className="add-block-label">{b.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
