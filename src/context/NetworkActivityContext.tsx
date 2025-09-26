import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

interface NetworkActivityContextValue {
  busy: boolean;
  count: number;
  start: () => void;
  end: () => void;
  wrapPromise: <T>(p: Promise<T>) => Promise<T>;
}

const NetworkActivityContext = createContext<
  NetworkActivityContextValue | undefined
>(undefined);

export const NetworkActivityProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [count, setCount] = useState(0);
  const mounted = useRef(true);
  React.useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  const start = useCallback(() => setCount((c) => c + 1), []);
  const end = useCallback(() => setCount((c) => (c > 0 ? c - 1 : 0)), []);
  const wrapPromise = useCallback(
    async <T,>(p: Promise<T>) => {
      start();
      try {
        return await p;
      } finally {
        if (mounted.current) end();
      }
    },
    [start, end],
  );
  return (
    <NetworkActivityContext.Provider
      value={{ busy: count > 0, count, start, end, wrapPromise }}
    >
      {/* Expose quick-access global for non-hook modules (services) */}
      <NetGlobalInstaller start={start} end={end} />
      <Watchdog count={count} reset={() => setCount(0)} />
      {children}
    </NetworkActivityContext.Provider>
  );
};

const NetGlobalInstaller: React.FC<{ start: () => void; end: () => void }> = ({
  start,
  end,
}) => {
  React.useEffect(() => {
    window.__net = { start, end };
    return () => {
      if (window.__net && window.__net.start === start) {
        delete window.__net;
      }
    };
  }, [start, end]);
  return null;
};

// Watchdog: si el contador queda trabado (>0) más de 10s, lo resetea y loguea.
const Watchdog: React.FC<{ count: number; reset: () => void }> = ({
  count,
  reset,
}) => {
  const tsRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (count > 0 && tsRef.current == null) {
      tsRef.current = Date.now();
    }
    if (count === 0) {
      tsRef.current = null;
    }
  }, [count]);
  React.useEffect(() => {
    if (count === 0) return;
    const id = setInterval(() => {
      if (tsRef.current && Date.now() - tsRef.current > 10_000) {
        console.warn(
          '[NetworkActivity] contador atascado >10s, reseteando a 0 para liberar UI',
        );
        reset();
        tsRef.current = null;
      }
    }, 2_000);
    return () => clearInterval(id);
  }, [count, reset]);
  return null;
};

export function useNetworkActivity() {
  const ctx = useContext(NetworkActivityContext);
  if (!ctx)
    throw new Error(
      'useNetworkActivity must be used within a NetworkActivityProvider',
    );
  return ctx;
}
