
import { useEffect, useState, useRef } from 'react';


export default function useOutside(isOutSide) {
    const [outSide, setOutSide] = useState(isOutSide);
    const ref = useRef(null);
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
            setOutSide(false);
        } 
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);

    return { ref, outSide, setOutSide };
  }
  