import React, { createContext, useContext, useMemo, useState } from 'react';

interface Joke {
  id: number;
  joke: string;
  categories: string[];
  favorite: boolean;
}

interface FavoriteContextData {
  favorite: Joke[];
}

const FavoriteContext = createContext<FavoriteContextData>(
  {} as FavoriteContextData,
);

export const FavoriteProvider: React.FC = ({ children }) => {
  const [favorite, setFavorite] = useState<Joke[]>([]);

  const value = useMemo(() => ({ favorite }), [favorite]);

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};

export function useFavorite(): FavoriteContextData {
  const context = useContext(FavoriteContext);

  return context;
}
