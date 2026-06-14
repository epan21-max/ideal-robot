import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'anime' }
  | { name: 'search' }
  | { name: 'library'; tab?: 'ongoing' | 'complete' }
  | { name: 'favorites' }
  | { name: 'donate' }
  | { name: 'schedule' }
  | { name: 'genre' }
  | { name: 'detail'; slug: string }
  | { name: 'episode'; slug: string }
  | { name: 'donghua' }
  | { name: 'donghua-search' }
  | { name: 'donghua-library'; tab?: 'ongoing' | 'completed' }
  | { name: 'donghua-schedule' }
  | { name: 'donghua-genre' }
  | { name: 'genre-detail'; slug: string; genreName?: string }
  | { name: 'donghua-genre-detail'; slug: string; genreName?: string }
  | { name: 'donghua-detail'; slug: string }
  | { name: 'donghua-episode'; slug: string };

type RouterCtx = {
  route: Route;
  history: Route[];
  navigate: (r: Route) => void;
  back: () => void;
  canGoBack: boolean;
};

const Ctx = createContext<RouterCtx | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Route[]>([{ name: 'home' }]);
  const route = history[history.length - 1];

  const navigate = useCallback((r: Route) => {
    setHistory(h => [...h, r]);
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, []);

  const back = useCallback(() => {
    setHistory(h => h.length > 1 ? h.slice(0, -1) : h);
  }, []);

  useEffect(() => {
    const onPop = () => back();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [back]);

  return (
    <Ctx.Provider value={{ route, history, navigate, back, canGoBack: history.length > 1 }}>
      {children}
    </Ctx.Provider>
  );
}

export function useRouter() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useRouter must be inside RouterProvider');
  return c;
}
