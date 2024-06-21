import { useState, useEffect } from 'react';

function useSessionStorage<T>(key: string): {
  value: T | null,
  setSessionValue: (newValue: T) => void,
  removeSessionValue: () => void,
} {
  const [value, setValue] = useState<T | null>(() => {
    const storedValue = sessionStorage.getItem(key);
    if (storedValue) {
      try {
        return JSON.parse(storedValue);
      } catch (error) {
        console.error('Error parsing sessionStorage value:', error);
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
          console.error('Error parsing sessionStorage value:', error);
        }
      }
    };

    // Listen for changes in sessionStorage
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  const setSessionValue = (newValue: T) => {
    try {
      const serializedValue = JSON.stringify(newValue);
      sessionStorage.setItem(key, serializedValue);
      setValue(newValue);
      window.dispatchEvent(new StorageEvent('storage', { key, newValue: serializedValue }));
    } catch (error) {
      console.error('Error setting sessionStorage value:', error);
    }
  };

  const removeSessionValue = () => {
    try {
      sessionStorage.removeItem(key);
      setValue(null);
      window.dispatchEvent(new StorageEvent('storage', { key, newValue: null }));
    } catch (error) {
      console.error('Error removing sessionStorage value:', error);
    }
  };

  return { value, setSessionValue, removeSessionValue };
}

export default useSessionStorage;
