import { useState, useEffect } from "react";

function getSavedState(key, initialValue) {
  const state = JSON.parse(localStorage.getItem(key));
  if (state) return state;

  if (initialValue instanceof Function) return initialValue();
  return initialValue;
}

export default function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    return getSavedState(key, initialValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}
