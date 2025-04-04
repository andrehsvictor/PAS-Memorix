import { TbTrash } from "react-icons/tb";
import type Deck from "../../../types/deck";
import { BsEye } from "react-icons/bs";

interface DeckProps {
  deck: Deck;
  onDelete: (deckId: string) => void;
  onEdit: (deck: Deck) => void;
}

export default function DeckComponent({ deck, onDelete, onEdit }: DeckProps) {
  return (
    <>
      <div className="bg-white rounded-lg border border-gray-300 p-4 hover:shadow-sm transition duration-200">
        <h2 className="text-lg font-semibold mb-2">{deck.name}</h2>
        <p className="text-gray-600">{deck.description}</p>
        <div className="flex justify-between mt-4">
          {/* Link para ver o baralho */}
          <a
            href={`/decks/${deck.id}`}
            className="text-primary hover:text-primary-hover transition duration-200"
            onClick={(e) => {
              e.preventDefault();
              onEdit(deck);
            }}
          >
            <BsEye className="inline-block mr-2" />
            Ver baralho
          </a>

          {/* Botão de deletar baralho. Será um ícone de lixeira */}
          <button
            className="text-red-500 hover:text-red-700 cursor-pointer"
            onClick={() => onDelete(deck.id)}
          >
            <TbTrash className="text-xl" />
          </button>
        </div>
      </div>
    </>
  );
}
