import { useEffect, useRef } from "react"

const useElementStyle = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const style = getComputedStyle(ref.current);
      console.log(style);
    }
  }, []);
  
  return ref;
};

export default useElementStyle;