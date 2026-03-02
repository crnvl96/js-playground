import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface MathContextType {
  history: number[];
  pushToHistory: (result: number) => void;
}

const MathContext = createContext<MathContextType | undefined>(undefined);

export const MathProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<number[]>([]);
  const pushToHistory = useCallback((result: number) => {
    setHistory((prev) => [...prev, result]);
  }, []);
  const value = useMemo(() => ({ history, pushToHistory }), [history, pushToHistory]);
  return <MathContext.Provider value={value}>{children}</MathContext.Provider>;
};

export const useMath = () => {
  const context = useContext(MathContext);
  if (!context) throw new Error("useMath must be used within a MathProvider");
  return context;
};
