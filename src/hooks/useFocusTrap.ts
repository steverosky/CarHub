import { useEffect, useRef } from 'react';

export const useFocusTrap = (isActive: boolean) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const focusableElements = ref.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleFocus);
    return () => {
      document.removeEventListener('keydown', handleFocus);
    };
  }, [isActive]);

  return ref;
};