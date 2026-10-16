import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

interface TopBarMenuProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}

export default function TopBarMenu({ icon, label, children }: TopBarMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const calculatePosition = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setPos({ top: rect.bottom + 6, left: rect.left });
  };

  useEffect(() => {
    if (!open) return;
    calculatePosition();
    const handleResize = () => calculatePosition();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !panelRef.current || !pos) return;
    const panel = panelRef.current.getBoundingClientRect();
    const margin = 8;
    let left = pos.left;
    if (left + panel.width > window.innerWidth - margin) {
      left = window.innerWidth - panel.width - margin;
    }
    if (left < margin) left = margin;
    if (panelRef.current) {
      panelRef.current.style.left = `${left}px`;
    }
  }, [open, pos]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (
        !buttonRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const dark =
    typeof document !== "undefined" &&
    document.body.classList.contains("look-colorful-dark");

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    top: pos?.top ?? 0,
    left: pos?.left ?? 0,
    zIndex: 1000,
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="toolbar-button flex items-center gap-2"
        onClick={() => setOpen((v) => !v)}
      >
        {icon}
        {label}
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={panelRef}
            className="topbar-menu-panel"
            style={{
              ...panelStyle,
              backgroundColor: dark ? "#1e293b" : "#ffffff",
              color: dark ? "#e2e8f0" : "#1e293b",
              border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
              borderRadius: "12px",
              padding: "12px",
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.18)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              minWidth: "220px",
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}