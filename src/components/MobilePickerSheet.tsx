import { useEffect, useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../i18nContext';

interface Props {
  title: string;
  onClose: () => void;
  panelRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}

export default function MobilePickerSheet({ title, onClose, panelRef, children }: Props) {
  const { t, locale } = useI18n();
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => { if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, []);

  return createPortal(
    <div className="mobile-picker-layer" style={{ position: 'fixed', inset: 0, zIndex: 1200 }}>
      <button className="mobile-picker-backdrop" aria-label={t('mobile.close')} onClick={onClose} />
      <div ref={panelRef} className="mobile-picker-sheet" role="dialog" aria-modal="true" aria-label={title} dir={locale === 'fa' ? 'rtl' : 'ltr'}
        onKeyDown={event => {
          if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
          if (event.key === 'Tab') {
            const nodes = panelRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input, [tabindex="0"]');
            if (!nodes?.length) return;
            const first = nodes[0];
            const last = nodes[nodes.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
          }
        }}>
        <header><strong>{title}</strong><button ref={closeRef} onClick={onClose}>{t('mobile.close')}</button></header>
        <div className="mobile-picker-content">{children}</div>
      </div>
    </div>, document.body,
  );
}
