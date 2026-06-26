import React, { useEffect, useState } from 'react';

/**
 * Animate numbers counting up to their value on load.
 * Supports integers and floating point values.
 */
export default function AnimatedCounter({ value, duration = 800 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endValue = Number(value);

    if (isNaN(endValue)) {
      setCount(value);
      return;
    }

    if (endValue === 0) {
      setCount(0);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const currentCount = progress * endValue;

      // Handle decimals (e.g. 4.2 rating) vs integers
      if (endValue % 1 !== 0) {
        setCount(parseFloat(currentCount.toFixed(1)));
      } else {
        setCount(Math.floor(currentCount));
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{count}</span>;
}
