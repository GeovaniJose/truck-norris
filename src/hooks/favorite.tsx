import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface JokeItem {
  id: number;
  joke: string;
  categories: string[];
  favorite: boolean;
}

interface FavoriteContextData {
  favoriteJokes: JokeItem[];
  addFavoriteJoke(item: JokeItem): void;
  removeFavoriteJoke(id: number): void;
}

const FavoriteContext = createContext<FavoriteContextData>(
  {} as FavoriteContextData,
);

export const FavoriteProvider: React.FC = ({ children }) => {
  const [favoriteJokes, setFavoriteJokes] = useState<JokeItem[]>(() => {
    const storagedFavoriteJokes = localStorage.getItem(
      '@TruckNorris:favoriteJokes',
    );

    if (storagedFavoriteJokes) {
      return [...JSON.parse(storagedFavoriteJokes)];
    }

    return [];
  });

  const addFavoriteJoke = useCallback(
    ({ id, joke, categories, favorite }: JokeItem) => {
      const newJoke = {
        id,
        joke,
        categories,
        favorite,
      };

      const newFavoriteJokes = [...favoriteJokes, newJoke];

      setFavoriteJokes(newFavoriteJokes);
      localStorage.setItem(
        '@TruckNorris:favoriteJokes',
        JSON.stringify(newFavoriteJokes),
      );
    },
    [favoriteJokes],
  );

  const removeFavoriteJoke = useCallback(
    (id: number) => {
      const newFavoriteJokes = favoriteJokes.filter(joke => joke.id !== id);

      setFavoriteJokes(newFavoriteJokes);
      localStorage.setItem(
        '@TruckNorris:favoriteJokes',
        JSON.stringify(newFavoriteJokes),
      );
    },
    [favoriteJokes],
  );

  const value = useMemo(
    () => ({ favoriteJokes, addFavoriteJoke, removeFavoriteJoke }),
    [favoriteJokes, addFavoriteJoke, removeFavoriteJoke],
  );

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
