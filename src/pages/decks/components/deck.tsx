import type Deck from "../../../types/deck";

interface DeckProps {
  deck: Deck;
  onDelete: (deckId: string) => void;
  onEdit: (deck: Deck) => void;
}

export default function DeckComponent({ deck, onDelete, onEdit }: DeckProps) {
  return (
    <>
      <div className="bg-white shadow-md rounded-lg border border-gray-300 p-4">
        <h2 className="text-lg font-semibold mb-2">{deck.name}</h2>
        <p className="text-gray-600">{deck.description}</p>
        <div className="flex justify-between mt-4">
          <button
            className="bg-primary text-white py-1 px-3 rounded-md"
            onClick={() => onEdit(deck)}
          >
            Editar
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded-md"
            onClick={() => onDelete(deck.id)}
          >
            Deletar
          </button>
        </div>
      </div>
    </>
  );
}
