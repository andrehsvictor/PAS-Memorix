import { useReviewContext } from "../../contexts/review-context";

export default function Page() {
  const { cards,
   } = useReviewContext();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Review Page</h1>
      <div className="bg-white shadow-md rounded p-4 w-full max-w-md">
        {cards.map((card) => (
          <div key={card.id} className="mb-4 p-4 border rounded">
            <h2 className="text-xl font-semibold">{card.question}</h2>
            <p>{card.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
