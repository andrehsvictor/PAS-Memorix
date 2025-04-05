import { useState } from 'react';
import Deck from '../types/deck';

export default function useFetchDeckById() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDeckById = (deckId: string) => {
        setLoading(true);
        setError(null);
        try {
            const decks = localStorage.getItem('decks');
            const parsedDecks = decks ? JSON.parse(decks) : [];
            const foundDeck = parsedDecks.find((deck: Deck) => deck.id === deckId);
            if (!foundDeck) {
                setError('Baralho não encontrado');
                setLoading(false);
                return;
            }
            if (foundDeck.userId !== localStorage.getItem('user_id')) {
                setError('Baralho não encontrado');
                setLoading(false);
                return;
            }
            setLoading(false);
            return foundDeck;
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    }

    return { loading, error, fetchDeckById }
}
