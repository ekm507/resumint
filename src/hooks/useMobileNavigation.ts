import { useEffect, useRef, useState } from 'react';

export function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const change = () => setMobile(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  return mobile;
}

// Each transient mobile screen gets one history entry, so browser Back dismisses it.
export function useMobileNavigation(mobile: boolean) {
  const [screen, setScreen] = useState<string | null>(null);
  const owner = useRef(crypto.randomUUID());
  useEffect(() => {
    const pop = () => setScreen(history.state?.mobileOwner === owner.current ? history.state.mobileScreen : null);
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  const close = () => {
    if (history.state?.mobileOwner === owner.current) history.back();
    setScreen(null);
  };
  useEffect(() => {
    if (!mobile && history.state?.mobileOwner === owner.current) {
      history.back();
      setScreen(null);
    }
  }, [mobile]);
  return { screen, open: (next: string) => {
    if (mobile) {
      const state = { ...history.state, mobileOwner: owner.current, mobileScreen: next };
      if (history.state?.mobileOwner === owner.current) history.replaceState(state, '');
      else history.pushState(state, '');
    }
    setScreen(next);
  }, close };
}

export function useMenuState(): [boolean, (next: boolean | ((previous: boolean) => boolean)) => void] {
  const mobile = useIsMobile();
  const navigation = useMobileNavigation(mobile);
  const open = navigation.screen === 'menu';
  return [open, next => {
    const value = typeof next === 'function' ? next(open) : next;
    if (value === open) return;
    if (value) navigation.open('menu');
    else navigation.close();
  }];
}
