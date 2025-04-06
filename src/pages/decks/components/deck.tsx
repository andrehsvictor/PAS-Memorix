import { TbTrash } from "react-icons/tb";
import type Deck from "../../../types/deck";
import { BsEye } from "react-icons/bs";

interface DeckProps {
  deck: Deck;
  onDelete: (deckId: string) => void;
  onView: (deckId: string) => void;
}

export default function DeckComponent({ deck, onDelete, onView }: DeckProps) {
  return (
    <>
      <div className="bg-white rounded-lg border border-gray-300 p-4 hover:shadow-sm transition duration-200 h-32 flex flex-col justify-between">
        <h2 className="text-lg font-semibold mb-2">{deck.name}</h2>
        <p className="text-gray-600 whitespace-nowrap overflow-clip overflow-ellipsis">
          {deck.description}
        </p>
        <div className="flex justify-between mt-4">
          {/* Link para ver o baralho */}
          <a
            href={`/decks/${deck.id}`}
            className="text-primary hover:text-primary-hover transition duration-200"
            onClick={(e) => {
              e.preventDefault();
              onView(deck.id);
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
