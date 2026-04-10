import { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { getAllBlocks } from "../blocks/blockRegistry";

interface AddBlockMenuProps {
  onSelect: (type: string) => void;
}

export default function AddBlockMenu({ onSelect }: AddBlockMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    direction: "up" | "down";
  } | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const blockTypes = getAllBlocks();
  const editorPanel = document.getElementById("editor-panel");

  function toggleMenu() {
    if (!buttonRef.current || !editorPanel) return;

    const btn = buttonRef.current.getBoundingClientRect();
    const panel = editorPanel.getBoundingClientRect();

    const spaceBelow = panel.bottom - btn.bottom;
    const spaceAbove = btn.top - panel.top;

    const direction =
      spaceBelow < 220 && spaceAbove > spaceBelow ? "up" : "down";

    setMenuPos({
      left: btn.left - panel.left + btn.width / 2,
      top: direction === "down" ? btn.bottom - panel.top : btn.top - panel.top,
      direction,
    });

    setIsOpen((v) => !v);
  }

  useLayoutEffect(() => {
    if (!isOpen) return;

    const close = (e: MouseEvent) => {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        className="add-block-trigger"
        onClick={toggleMenu}
      >
        +
      </button>

      {isOpen &&
        menuPos &&
        editorPanel &&
        createPortal(
          <div
            ref={menuRef}
            className={`add-block-menu add-block-menu-${menuPos.direction}`}
            style={{
              position: "absolute",
              left: menuPos.left,
              top: menuPos.top,
              transform:
                menuPos.direction === "down"
                  ? "translateX(-50%)"
                  : "translate(-50%, -100%)",
            }}
          >
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
                  {b.label}
                </button>
              ))}
            </div>
          </div>,
          editorPanel,
        )}
    </>
  );
}
