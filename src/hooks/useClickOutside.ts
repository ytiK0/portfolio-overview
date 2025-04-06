import {RefObject, useEffect} from "react";

export function useClickOutside(ref: RefObject<null | HTMLElement>, callback: () => void) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      console.log(target)

      if (ref.current && !ref.current.contains(target)) {
        callback();
      }
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [callback]);
}