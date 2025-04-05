import Card from '../types/card';
import useFetchDeckById from './useFetchDeckById';

export default function useFetchCardsByDeckId() {
    const { fetchDeckById } = useFetchDeckById();

    const fetchCardsByDeckId = (deckId: string) => {
        try {
            const deck = fetchDeckById(deckId);
            if (!deck) {
                return [];
            }
            const cards = localStorage.getItem("cards");
            const parsedCards = cards ? JSON.parse(cards) : [];
            const deckCards = parsedCards.filter((card: Card) => card.deckId === deckId);
            return deckCards;
        } catch (error) {
            console.error("Error fetching cards by deck ID:", error);
            return [];
        }
    }

    return { fetchCardsByDeckId }
}
