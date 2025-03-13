import { useEffect, useRef } from "react";

function useOutsideClick<T extends HTMLElement>(
  callback: () => void,
  externalRef?: React.RefObject<T>
) {
  const internalRef = useRef<T>(null);

  useEffect(() => {
    if (!callback) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const parentElement = externalRef?.current;
      const internalElement = internalRef.current;

      if (
        parentElement &&
        !parentElement.contains(target) &&
        internalElement &&
        !internalElement.contains(target)
      ) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, externalRef]);

  return internalRef;
}

export default useOutsideClick;