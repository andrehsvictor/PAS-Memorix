import clsx from "clsx";
import { BsExclamationCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

interface ReviewNotificationProps {
  cardCount: number;
}

export default function ReviewNotification({
  cardCount,
}: ReviewNotificationProps) {
  const navigate = useNavigate();

  const handleReviewClick = () => {
    navigate("/review");
  };

  if (cardCount <= 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        "flex items-center justify-between",
        "bg-white rounded-lg p-4",
        "border border-primary",
        "w-[80%]"
      )}
    >
      <div className="flex items-center">
        <BsExclamationCircle className="text-2xl text-primary mr-2" />
        <span className="text-gray-700">
          Você tem {cardCount} {cardCount === 1 ? "cartão" : "cartões"} para
          revisar
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleReviewClick}
          className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-hover transition duration-200 cursor-pointer"
        >
          Revisar cartões
        </button>
      </div>
    </div>
  );
}
