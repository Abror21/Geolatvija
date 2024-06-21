import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string): {
  value: T | null,
  setLocalStorageValue: (newValue: T) => void,
  removeLocalStorageValue: () => void,
} {
  const [value, setValue] = useState<T | null>(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      try {
        return JSON.parse(storedValue);
      } catch (error) {
        console.error('Error parsing localStorage value:', error);
      }
    }
    return null;
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          const newValue = JSON.parse(event.newValue || 'null');
          setValue(newValue);
        } catch (error) {
          console.error('Error parsing localStorage value:', error);
        }
      }
    };

    // Listen for changes in localStorage
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  const setLocalStorageValue = (newValue: T) => {
    try {
      const serializedValue = JSON.stringify(newValue);
      localStorage.setItem(key, serializedValue);
      setValue(newValue);
      window.dispatchEvent(new StorageEvent('storage', { key, newValue: serializedValue }));
    } catch (error) {
      console.error('Error setting localStorage value:', error);
    }
  };

  const removeLocalStorageValue = () => {
    try {
      localStorage.removeItem(key);
      setValue(null);
      window.dispatchEvent(new StorageEvent('storage', { key, newValue: null }));
    } catch (error) {
      console.error('Error removing localStorage value:', error);
    }
  };

  return { value, setLocalStorageValue, removeLocalStorageValue };
}

export default useLocalStorage;
