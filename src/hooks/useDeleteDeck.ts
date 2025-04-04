import { useState } from "react";
import Deck from "../types/deck";

export default function useDeleteDeck() {
    const [error, setError] = useState(null);

    const deleteDeck = (deckId: string) => {
        try {
            const decks = localStorage.getItem("decks") || "";
            if (!decks) {
                throw new Error("No decks found");
            }
            const parsedDecks = JSON.parse(decks);
            const updatedDecks = parsedDecks.filter((d: Deck) => d.id !== deckId);
            localStorage.setItem("decks", JSON.stringify(updatedDecks));
        } catch (err: any) {
            setError(err);
        }
    };

    return { deleteDeck, error };
}
