import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { type DropdownOption } from "../utils/types";
import { useI18n } from "../i18nContext";

interface DropdownMenuProps<T> {
  options: DropdownOption<T>[];
  value?: T;
  text?: string;
  icon?: React.ReactNode;
  onChange: (v: T) => void;
}

export function DropdownMenu<T>({
  options,
  value,
  onChange,
  text,
  icon,
}: DropdownMenuProps<T>) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    direction: "up" | "down";
  } | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <button
        ref={buttonRef}
        className="dropdown-menu-open editor-add-button flex items-center justify-center gap-2"
        onClick={toggleMenu}
      >
        {icon && <span className="dropdown-icon">{icon}</span>}
        {selected?.label
          ? t(selected.label)
          : text
          ? t(text)
          : t("common.openMenu")}
      </button>

      {open &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            className={`dropdown-menu dropdown-${menuPos.direction}`}
            style={{
              zIndex: 1002,
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
                  className={`dropdown-item ${opt.disabled ? "dropdown-item-disabled" : ""}`}
                  style={opt.disabled ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
                  onClick={() => {
                    if (opt.disabled) return;
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.icon && (
                    <span className="dropdown-icon">{opt.icon}</span>
                  )}
                  {opt.label && (
                    <span className="dropdown-label">{t(opt.label)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
