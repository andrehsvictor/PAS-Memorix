import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Card from "../types/card";
import useEditCard from "../hooks/useEditCard";

export enum ResponseQuality {
  INCORRECT = 0,
  HARD = 1,
  DIFFICULT = 2,
  EASY = 3,
  GOOD = 4,
  PERFECT = 5,
}

interface ReviewContextProps {
  cards: Card[];
  currentCardIndex: number;
  currentCard: Card | null;
  isFinished: boolean;
  isLoading: boolean;
  showAnswer: boolean;
  fetchCardsToReview: () => Promise<void>;
  toggleShowAnswer: () => void;
  answerCard: (quality: ResponseQuality) => Promise<void>;
  resetReview: () => void;
  progress: number;
}

const ReviewContext = createContext<ReviewContextProps | null>(null);

export function useReviewContext() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReviewContext must be used within a ReviewProvider");
  }
  return context;
}

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { editCard } = useEditCard();

  const currentCard =
    cards.length > 0 && currentCardIndex < cards.length
      ? cards[currentCardIndex]
      : null;

  const isFinished = currentCardIndex >= cards.length && cards.length > 0;
  const progress =
    cards.length > 0 ? (currentCardIndex / cards.length) * 100 : 0;

  const fetchCardsToReview = useCallback(async (userId?: string) => {
    setIsLoading(true);
    try {
      const now = new Date();

      const allDecks = JSON.parse(localStorage.getItem("decks") || "[]");
      const allCards = JSON.parse(localStorage.getItem("cards") || "[]");

      const userDecks = userId
        ? allDecks.filter((deck: any) => deck.userId === userId)
        : allDecks;

      const userDeckIds = userDecks.map((deck: any) => deck.id);

      const cardsToReview = allCards.filter((card: Card) => {
        const belongsToUser = userDeckIds.includes(card.deckId);

        if (!belongsToUser) return false;

        if (!card.nextReviewAt) return true;

        const reviewDate = new Date(card.nextReviewAt);
        return reviewDate <= now;
      });

      setCards(cardsToReview);
    } catch (error) {
      console.error("Erro ao buscar cartões para revisão:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCardsToReview();
  }, [fetchCardsToReview]);

  const calculateNextReview = (card: Card, quality: ResponseQuality): Card => {
    let { easinessFactor, interval, repetitions } = card;

    if (quality < 3) {
      // Se a resposta for difícil, resetamos as repetições
      repetitions = 0;
    } else {
      // Incrementamos o contador de repetições
      repetitions += 1;

      // Calculamos o novo intervalo
      if (repetitions === 1) {
        interval = 1; // 1 dia
      } else if (repetitions === 2) {
        interval = 6; // 6 dias
      } else {
        interval = Math.round(interval * easinessFactor);
      }
    }

    // Atualizamos o fator de facilidade (limitado entre 1.3 e 2.5)
    const newEF =
      easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easinessFactor = Math.max(1.3, Math.min(2.5, newEF));

    const now = new Date();
    const nextReviewAt = new Date(now);
    nextReviewAt.setDate(now.getDate() + interval);
    nextReviewAt.setHours(0, 0, 0, 0);

    return {
      ...card,
      easinessFactor,
      interval,
      repetitions,
      nextReviewAt,
      updatedAt: new Date(),
    };
  };

  const toggleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const answerCard = async (quality: ResponseQuality) => {
    if (!currentCard) return;

    try {
      const updatedCard = calculateNextReview(currentCard, quality);

      editCard(updatedCard.id, updatedCard);

      setCards((prev) =>
        prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
      );

      setCurrentCardIndex((prev) => prev + 1);
      setShowAnswer(false);
    } catch (error) {
      console.error("Erro ao responder cartão:", error);
    }
  };

  const resetReview = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    fetchCardsToReview();
  };

  const value = {
    cards,
    currentCardIndex,
    currentCard,
    isFinished,
    isLoading,
    showAnswer,
    fetchCardsToReview,
    toggleShowAnswer,
    answerCard,
    resetReview,
    progress,
  };

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
}

export default ReviewContext;
