import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const NoiseContext = createContext();

export function useNoises() {
  return useContext(NoiseContext);
}

export function NoiseProvider({ children }) {
  const [noises, setNoises] = useLocalStorage("noises", []);

  return (
    <NoiseContext.Provider value={[noises, setNoises]}>
      {children}
    </NoiseContext.Provider>
  );
}
