import { useEffect, useRef } from "react";

const useScrollHeight = (callback) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = elementRef.current;
        if (scrollHeight - scrollTop === clientHeight) {
          callback(); // Call the callback function when scrolled to the bottom
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [callback]);

  return elementRef;
};

export default useScrollHeight;
