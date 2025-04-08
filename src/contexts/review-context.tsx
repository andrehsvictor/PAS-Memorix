import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Card from "../types/card";
import useEditCard from "../hooks/useEditCard";
import { useAuth } from "./auth-context";

// Enum para qualidade das respostas no algoritmo de repetição espaçada
export enum ResponseQuality {
  INCORRECT = 0, // Resposta completamente errada
  HARD = 1, // Resposta correta com muita dificuldade
  DIFFICULT = 2, // Resposta correta com alguma dificuldade
  EASY = 3, // Resposta correta com pouca dificuldade
  GOOD = 4, // Resposta correta com facilidade
  PERFECT = 5, // Resposta perfeita, sem hesitação
}

// Constantes para o algoritmo SM-2
const MINIMUM_EASINESS_FACTOR = 1.3;
const MAXIMUM_EASINESS_FACTOR = 2.5;
const INITIAL_INTERVAL = 1;
const SECOND_INTERVAL = 6;

// Tipos de dados para o contexto
interface ReviewContextProps {
  cards: Card[]; // Cartões para revisão
  currentCardIndex: number; // Índice do cartão atual
  currentCard: Card | null; // Cartão atual
  isFinished: boolean; // Se a revisão terminou
  isLoading: boolean; // Status de carregamento
  showAnswer: boolean; // Se a resposta está visível
  progress: number; // Progresso da revisão (0-100)
  fetchCardsToReview: (forceRefresh?: boolean) => Promise<void>; // Buscar cartões
  toggleShowAnswer: () => void; // Mostrar/esconder resposta
  answerCard: (quality: ResponseQuality) => Promise<void>; // Responder cartão
  resetReview: () => void; // Reiniciar revisão
  getCardsDueToday: () => number; // Obter número de cartões para hoje
}

// Criar contexto
const ReviewContext = createContext<ReviewContextProps | null>(null);

// Hook para usar o contexto
export function useReviewContext() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReviewContext must be used within a ReviewProvider");
  }
  return context;
}

// Prover o contexto
export function ReviewProvider({ children }: { children: React.ReactNode }) {
  // Estado do contexto
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [allCards, setAllCards] = useState<Card[]>([]);

  // Hooks externos
  const { editCard } = useEditCard();
  const { user } = useAuth();

  // Valores computados
  const currentCard = useMemo(
    () =>
      cards.length > 0 && currentCardIndex < cards.length
        ? cards[currentCardIndex]
        : null,
    [cards, currentCardIndex]
  );

  const isFinished = useMemo(
    () => currentCardIndex >= cards.length && cards.length > 0,
    [currentCardIndex, cards.length]
  );

  const progress = useMemo(
    () => (cards.length > 0 ? (currentCardIndex / cards.length) * 100 : 0),
    [currentCardIndex, cards.length]
  );

  // Buscar todos os cartões - necessário para cálculos de estatísticas
  const fetchAllCards = useCallback(async () => {
    try {
      if (!user?.id) {
        setAllCards([]);
        return;
      }

      const allDecks = JSON.parse(localStorage.getItem("decks") || "[]");
      const allCardsData = JSON.parse(localStorage.getItem("cards") || "[]");

      const userDeckIds = allDecks
        .filter((deck: any) => deck.userId === user.id)
        .map((deck: any) => deck.id);

      const userCards = allCardsData.filter((card: Card) =>
        userDeckIds.includes(card.deckId)
      );

      setAllCards(userCards);
    } catch (error) {
      console.error("Erro ao buscar todos os cartões:", error);
      setAllCards([]);
    }
  }, [user?.id]);

  // Buscar cartões para revisão
  const fetchCardsToReview = useCallback(
    async (forceRefresh = false) => {
      // Se já carregamos recentemente e não forçamos atualização, retorna
      const now = new Date();
      if (
        lastFetch &&
        !forceRefresh &&
        now.getTime() - lastFetch.getTime() < 60000
      ) {
        return;
      }

      setIsLoading(true);
      try {
        if (!user?.id) {
          setCards([]);
          return;
        }

        const allDecks = JSON.parse(localStorage.getItem("decks") || "[]");
        const allCardsData = JSON.parse(localStorage.getItem("cards") || "[]");

        // Filtrar baralhos do usuário
        const userDecks = allDecks.filter(
          (deck: any) => deck.userId === user.id
        );
        const userDeckIds = userDecks.map((deck: any) => deck.id);

        // Filtrar cartões para revisão
        const cardsToReview = allCardsData.filter((card: Card) => {
          // Verificar se pertence a um baralho do usuário
          const belongsToUser = userDeckIds.includes(card.deckId);
          if (!belongsToUser) return false;

          // Se não tem data de próxima revisão, incluir
          if (!card.nextReviewAt) return true;

          // Verificar se a data de revisão já passou
          const reviewDate = new Date(card.nextReviewAt);
          return reviewDate <= now;
        });

        // Embaralhar os cartões para uma ordem aleatória usando algoritmo Fisher-Yates
        const shuffledCards = [...cardsToReview];
        for (let i = shuffledCards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledCards[i], shuffledCards[j]] = [
            shuffledCards[j],
            shuffledCards[i],
          ];
        }

        setCards(shuffledCards);
        setLastFetch(now);

        // Atualizar cache de todos os cartões
        await fetchAllCards();
      } catch (error) {
        console.error("Erro ao buscar cartões para revisão:", error);
        setCards([]);
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, lastFetch, fetchAllCards]
  );

  // Buscar cartões ao inicializar ou quando o usuário mudar
  useEffect(() => {
    fetchCardsToReview();
  }, [fetchCardsToReview]);

  // Calcular próxima revisão baseada no algoritmo SM-2
  const calculateNextReview = useCallback(
    (card: Card, quality: ResponseQuality): Card => {
      // Extrair valores atuais
      let { easinessFactor = 2.5, interval = 0, repetitions = 0 } = card;

      if (quality < ResponseQuality.EASY) {
        // Se a resposta foi difícil, resetar contagem de repetições
        repetitions = 0;
        interval = INITIAL_INTERVAL;
      } else {
        // Incrementar contador de repetições e calcular novo intervalo
        repetitions += 1;

        if (repetitions === 1) {
          interval = INITIAL_INTERVAL; // 1 dia
        } else if (repetitions === 2) {
          interval = SECOND_INTERVAL; // 6 dias
        } else {
          // Intervalo cresce exponencialmente com o fator de facilidade
          interval = Math.round(interval * easinessFactor);
        }
      }

      // Calcular novo fator de facilidade usando fórmula SM-2
      const newEF =
        easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

      // Limitar entre mínimo e máximo
      easinessFactor = Math.max(
        MINIMUM_EASINESS_FACTOR,
        Math.min(MAXIMUM_EASINESS_FACTOR, newEF)
      );

      // Calcular próxima data de revisão
      const now = new Date();
      const nextReviewAt = new Date(now);
      nextReviewAt.setDate(now.getDate() + interval);
      nextReviewAt.setHours(0, 0, 0, 0); // Definir para meia-noite

      return {
        ...card,
        easinessFactor,
        interval,
        repetitions,
        updatedAt: new Date(),
      };
    },
    []
  );

  // Mostrar/esconder resposta
  const toggleShowAnswer = useCallback(() => {
    setShowAnswer((prev) => !prev);
  }, []);

  // Responder cartão atual
  const answerCard = useCallback(
    async (quality: ResponseQuality) => {
      if (!currentCard) return;

      try {
        // Calcular próxima revisão
        const updatedCard = calculateNextReview(currentCard, quality);

        // Persistir mudanças
        await editCard(updatedCard.id, updatedCard);

        // Atualizar estado local
        setCards((prev) =>
          prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
        );

        // Atualizar cache de todos os cartões
        setAllCards((prev) =>
          prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
        );

        // Avançar para o próximo cartão
        setCurrentCardIndex((prev) => prev + 1);
        setShowAnswer(false);
      } catch (error) {
        console.error("Erro ao responder cartão:", error);
      }
    },
    [currentCard, calculateNextReview, editCard]
  );

  // Reiniciar revisão
  const resetReview = useCallback(() => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    fetchCardsToReview(true);
  }, [fetchCardsToReview]);

  // Calcular quantos cartões estão disponíveis para revisão hoje
  const getCardsDueToday = useCallback(() => {
    const now = new Date();
    return allCards.filter((card) => {
      if (!card.nextReviewAt) return true;
      const reviewDate = new Date(card.nextReviewAt);
      return reviewDate <= now;
    }).length;
  }, [allCards]);

  // Valores a serem expostos pelo contexto
  const contextValue = useMemo(
    () => ({
      cards,
      currentCardIndex,
      currentCard,
      isFinished,
      isLoading,
      showAnswer,
      progress,
      fetchCardsToReview,
      toggleShowAnswer,
      answerCard,
      resetReview,
      getCardsDueToday,
    }),
    [
      cards,
      currentCardIndex,
      currentCard,
      isFinished,
      isLoading,
      showAnswer,
      progress,
      fetchCardsToReview,
      toggleShowAnswer,
      answerCard,
      resetReview,
      getCardsDueToday,
    ]
  );

  return (
    <ReviewContext.Provider value={contextValue}>
      {children}
    </ReviewContext.Provider>
  );
}

export default ReviewContext;
