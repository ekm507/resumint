import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { loadAllIcons } from "../utils/loadIcons";

interface IconSelectProps {
  value: string | null; // icon name OR icon URL
  onSelect: (iconName: string | null) => void;
}

export default function IconSelect({ value, onSelect }: IconSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    direction: "up" | "down";
  } | null>(null);

  const [icons, setIcons] = useState<{ name: string; src: string }[]>([]);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  // load icons once
  useEffect(() => {
    loadAllIcons().then(setIcons);
  }, []);

  useEffect(() => {
    panelRef.current = document.getElementById("editor-panel");
  }, []);

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

    const margin = 8; // padding from screen edges

    const minLeft = margin + menuEl.width / 2;
    const maxLeft = window.innerWidth - margin - menuEl.width / 2;

    // clamp horizontally
    left = Math.min(Math.max(left, minLeft), maxLeft);

    if (menuPos.direction === "down") {
      // clamp down direction
      if (top + menuEl.height > window.innerHeight - margin) {
        top = window.innerHeight - margin - menuEl.height;
      }
    } else {
      // clamp up direction
      if (top - menuEl.height < margin) {
        top = margin + menuEl.height;
      }
    }

    // Write back adjusted values
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

  const editorPanel = panelRef.current;

  return (
    <>
      <div className="icon-select-box">
        <button ref={buttonRef} onClick={toggleMenu} className="icon-preview">
          {value ? (
            <img src={value} className="icon-img" />
          ) : (
            <label className="icon-select-label">Select icon</label>
          )}
        </button>
        {value ? (
          <button
            className="item-remove-text"
            onClick={() => {
              onSelect(null);
              setIsOpen(false);
            }}
          >
            Remove
          </button>
        ) : null}
      </div>

      {isOpen &&
        menuPos &&
        editorPanel &&
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
              {icons.map((ic) => (
                <button
                  key={ic.name}
                  className="icon-item"
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
          editorPanel,
        )}
    </>
  );
}
