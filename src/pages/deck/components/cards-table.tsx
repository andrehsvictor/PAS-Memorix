import { BiTrash } from "react-icons/bi";
import { PiPencil } from "react-icons/pi";
import Card from "../../../types/card";

interface CardsTableProps {
  cards: Card[];
  onEditCard: (card: Card) => void;
  onDeleteCard: (cardId: string) => void;
}

export default function CardsTable({
  cards,
  onEditCard,
  onDeleteCard,
}: CardsTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200 mt-4">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Questão
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Resposta
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Ações
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {cards.length === 0 ? (
          <tr>
            <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
              Nenhum cartão encontrado
            </td>
          </tr>
        ) : (
          cards.map((card) => (
            <tr key={card.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {card.question}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {card.answer}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEditCard(card)}
                  className="text-primary hover:text-primary-hover cursor-pointer"
                >
                  <PiPencil className="inline-block mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => onDeleteCard(card.id)}
                  className="text-red-600 hover:text-red-900 ml-4 cursor-pointer"
                >
                  <BiTrash className="inline-block mr-1" />
                  Excluir
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
