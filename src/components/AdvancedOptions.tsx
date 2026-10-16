import { useRef, useState, useLayoutEffect } from "react";

import { useI18n } from "../i18nContext";

export default function AdvancedOptions({ block, update, children }: any) {
  const { t } = useI18n();
  const advanced = block.props?.__advanced ?? false;
  const toggle = () =>
    update({
      ...block,
      props: {
        ...(block.props || {}),
        __advanced: !advanced,
      },
    });

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!advanced || !anchorRef.current) return;

    const updatePos = () => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: rect.left });
    };

    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true);

    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, [advanced]);

  return (
    <div ref={anchorRef} className="block-advanced" style={{ position: "relative" }}>
      {!advanced && (
        <button
          className="block-advanced-toggle"
          onClick={toggle}
          title={t("advanced.show")}
        >
          {t("advanced.show")} ▾
        </button>
      )}

      {advanced && (
        <div
          className="block-advanced-open block-advanced-floating"
          style={
            pos
              ? {
                  position: "fixed",
                  top: pos.top,
                  left: pos.left,
                }
              : undefined
          }
        >
          <div className="block-advanced-controls">{children}</div>

          <button
            className="block-advanced-toggle"
            onClick={toggle}
            title={t("advanced.hide")}
          >
            {t("advanced.hide")} ▴
          </button>
        </div>
      )}
    </div>
  );
}