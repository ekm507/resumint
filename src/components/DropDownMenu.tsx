import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
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
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    direction: "up" | "down";
  } | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const editorPanelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    editorPanelRef.current = document.getElementById("editor-panel");
  }, []);

  const selected = value ? options.find((o) => o.value === value) : null;

  // Position calculation (copied from AddBlockMenu and adapted)
  function calculatePosition() {
    const button = buttonRef.current;
    if (!button) return;

    const btn = button.getBoundingClientRect();
    const spaceBelow = window.innerHeight - btn.bottom;
    const spaceAbove = btn.top;

    const direction =
      spaceBelow < 220 && spaceAbove > spaceBelow ? "up" : "down";

    setMenuPos({
      left: btn.left + btn.width / 2,
      top: direction === "down" ? btn.bottom : btn.top,
      direction,
    });
  }

  function toggleMenu() {
    calculatePosition();
    setOpen((o) => !o);
  }

  // Close on outside click
  useLayoutEffect(() => {
    if (!open) return;

    const close = (e: MouseEvent) => {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  // Reposition on resize / scroll
  useEffect(() => {
    if (!open) return;

    const reposition = () => calculatePosition();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);

    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open]);

  const editorPanel = editorPanelRef.current;

  return (
    <>
      <button
        ref={buttonRef}
        className="dropdown-menu-open editor-add-button"
        onClick={toggleMenu}
      >
        {selected?.label || text || "Open Menu"}
      </button>

      {open &&
        menuPos &&
        editorPanel &&
        createPortal(
          <div
            ref={menuRef}
            className={`dropdown-menu dropdown-${menuPos.direction}`}
            style={{
              position: "fixed",
              left: menuPos.left,
              top: menuPos.top,
              transform:
                menuPos.direction === "down"
                  ? "translateX(-50%)"
                  : "translate(-50%, -100%)",
            }}
          >
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
                  {opt.icon && (
                    <span className="dropdown-icon">{opt.icon}</span>
                  )}
                  {opt.label && (
                    <span className="dropdown-label">{opt.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>,
          editorPanel,
        )}
    </>
  );
}
