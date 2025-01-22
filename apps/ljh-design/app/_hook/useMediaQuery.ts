import { useEffect, useState } from 'react';
export function useMediaQuery(mediaQuery: string) {
  const [isMatch, setIsMatch] = useState(false);
  const [mediaQueryList, setMediaQueryList] = useState<MediaQueryList | null>(null);
  useEffect(() => {
    const list = window.matchMedia(mediaQuery);
    setMediaQueryList(list);
    setIsMatch(list.matches);
  }, [mediaQuery]);

  useEffect(() => {
    if (mediaQueryList) {
      mediaQueryList.addEventListener('change', (e) => setIsMatch(e.matches));
    }
    return () => {
      mediaQueryList?.removeEventListener('change', (e) => setIsMatch(e.matches));
    };
  }, [mediaQueryList]);

  return isMatch;
}
