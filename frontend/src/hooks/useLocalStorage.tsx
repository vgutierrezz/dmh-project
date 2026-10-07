import { useState, useEffect, useRef } from 'react';

export function useLocalStorage(
  key: string,
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = {}
) {
  const [value, setValue] = useState(() => {
    try {
      const valueInLocalStorage = window.localStorage.getItem(key);

      if (
        valueInLocalStorage === null ||
        valueInLocalStorage === 'undefined'
      ) {
        return null;
      }

      return deserialize(valueInLocalStorage);
    } catch (error) {
      console.error(
        `Error reading localStorage key "${key}":`,
        error
      );
      return null;
    }
  });

  const prevKeyRef = useRef(key);

  useEffect(() => {
    try {
      const prevKey = prevKeyRef.current;

      if (prevKey !== key) {
        window.localStorage.removeItem(prevKey);
      }

      prevKeyRef.current = key;

      if (value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, serialize(value));
      }
    } catch (error) {
      console.error(
        `Error writing localStorage key "${key}":`,
        error
      );
    }
  }, [key, value, serialize]);

  return [value, setValue] as const;
}