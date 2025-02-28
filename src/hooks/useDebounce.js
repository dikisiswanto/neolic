"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook untuk debounce nilai.
 * @param {any} value - Nilai yang akan di-debounce
 * @param {number} delay - Waktu tunda dalam ms (default: 500ms)
 * @returns {any} - Nilai yang sudah di-debounce
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
