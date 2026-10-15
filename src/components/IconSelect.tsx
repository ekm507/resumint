import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { loadAllIcons } from "../utils/loadIcons";

interface IconSelectProps {
  value?: string | null; // icon src URL
  onSelect: (iconSrc: string | null) => void;
  dir?: string | null; // optional filter by directory
}

export default function IconSelect({ value, onSelect, dir }: IconSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    direction: "up" | "down";
  } | null>(null);

  const [icons, setIcons] = useState<
    { name: string; path: string; src: string }[]
  >([]);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load all icons once
  useEffect(() => {
    setIcons(loadAllIcons());
  }, []);

  // Let parents know when this menu is open so outside clicks/focus
  // (e.g. parent component closing) do not dismiss the icon picker.
  useEffect(() => {
    (window as any).__iconSelectOpen = isOpen;
    return () => {
      (window as any).__iconSelectOpen = false;
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      (window as any).__iconSelectOpen = false;
    };
  }, []);

  // Filter icons by directory if dir prop is provided
  const filteredIcons = dir
    ? icons.filter((i) => i.path === dir || i.path.startsWith(dir + "/"))
    : icons;

  function calculatePosition() {
    const btn = buttonRef.current?.getBoundingClientRect();
    if (!btn) return;

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

  useLayoutEffect(() => {
    if (!isOpen || !menuRef.current || !menuPos) return;

    const menuEl = menuRef.current.getBoundingClientRect();

    let left = menuPos.left;
    let top = menuPos.top;

    const margin = 8;

    const minLeft = margin + menuEl.width / 2;
    const maxLeft = window.innerWidth - margin - menuEl.width / 2;

    left = Math.min(Math.max(left, minLeft), maxLeft);

    if (menuPos.direction === "down") {
      if (top + menuEl.height > window.innerHeight - margin) {
        top = window.innerHeight - margin - menuEl.height;
      }
    } else {
      if (top - menuEl.height < margin) {
        top = margin + menuEl.height;
      }
    }

    menuRef.current.style.left = left + "px";
    menuRef.current.style.top = top + "px";
  }, [isOpen, menuPos]);

  function toggleMenu() {
    calculatePosition();
    setIsOpen((prev) => !prev);
  }

  // click outside
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

  // reposition on resize + scroll
  useEffect(() => {
    if (!isOpen) return;

    const reposition = () => calculatePosition();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [isOpen]);

  return (
    <>
      <div className="icon-select-box">
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="icon-preview"
          title="select icon"
        >
          {value ? (
            <img src={value} className="icon-img" />
          ) : (
            <label className="icon-select-label">Select icon</label>
          )}
        </button>


      </div>

      {isOpen &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            className={`icon-select-menu icon-select-menu-${menuPos.direction}`}
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
            <div className="grid-menu">
              <button
                key="__remove__"
                className="icon-item icon-item-empty"
                title="remove icon"
                onClick={() => {
                  onSelect(null);
                  setIsOpen(false);
                }}
              >
                <span
                  className="icon-empty-rectangle"
                  style={{
                    display: "inline-block",
                    width: "22px",
                    height: "22px",
                    border: "1px solid #94a3b8",
                    borderRadius: "4px",
                    background: "transparent",
                  }}
                />
              </button>

              {filteredIcons.map((ic) => (
                <button
                  key={ic.path}
                  className="icon-item"
                  title={ic.name}
                  onClick={() => {
                    onSelect(ic.src);
                    setIsOpen(false);
                  }}
                >
                  <img src={ic.src} alt={ic.name} className="icon-box" />
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
