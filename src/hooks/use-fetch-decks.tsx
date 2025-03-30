import { useEffect, useState } from "react";
import Deck from "../types/deck";
import { useAuth } from "../contexts/auth-context";

export interface FetchDecksResponse {
  decks: Deck[];
  error: string | null;
  isLoading: boolean;
}

export default function useFetchDecks(): FetchDecksResponse {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const decks = localStorage.getItem("decks");
    const parsedDecks = decks ? JSON.parse(decks) : [];
    const userDecks = parsedDecks.filter(
      (deck: Deck) => deck.userId === user?.id
    );
    setDecks(userDecks);
    setIsLoading(false);
    setError(null);
  }, [user]);

  return {
    decks,
    error,
    isLoading,
  };
}
