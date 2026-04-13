import { useState, useRef, useLayoutEffect, useEffect } from "react";
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
  const editorPanelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    editorPanelRef.current = document.getElementById("editor-panel");
  }, []);

  const blockTypes = getAllBlocks();

  useLayoutEffect(() => {
    editorPanelRef.current = document.getElementById("editor-panel");
  }, []);

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
    setIsOpen((v) => !v);
  }

  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => calculatePosition();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

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

  const editorPanel = editorPanelRef.current;

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
              position: "fixed",
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
