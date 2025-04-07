import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { BsArrowLeft, BsCheckCircle } from "react-icons/bs";
import Navbar from "../../components/navbar";
import {
  ResponseQuality,
  useReviewContext,
} from "../../contexts/review-context";

export default function ReviewPage() {
  const {
    cards,
    currentCard,
    currentCardIndex,
    showAnswer,
    toggleShowAnswer,
    answerCard,
    isFinished,
    resetReview,
    progress,
    isLoading,
    fetchCardsToReview,
  } = useReviewContext();

  useEffect(() => {
    fetchCardsToReview();
  }, [fetchCardsToReview]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-200">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-700">Carregando cartões...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-slate-200">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              Nenhum cartão para revisar
            </h2>
            <p className="text-gray-700 mb-6">
              Você não tem cartões para revisar agora. Volte mais tarde ou
              adicione novos cartões.
            </p>
            <button
              onClick={() => (window.location.href = "/decks")}
              className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-hover transition duration-200"
            >
              Voltar para Baralhos
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-200">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <BsCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Revisão Concluída!</h2>
            <p className="text-gray-700 mb-6">
              Você revisou todos os {cards.length} cartões.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-center">
              <button
                onClick={() => resetReview()}
                className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-hover transition duration-200"
              >
                Revisar Novamente
              </button>
              <button
                onClick={() => (window.location.href = "/decks")}
                className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300 transition duration-200"
              >
                Voltar para Baralhos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200">
      <Navbar />

      {/* Botão de voltar */}
      <button
        onClick={() => (window.location.href = "/decks")}
        className="absolute top-20 left-4 bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-gray-800 transition duration-200"
        aria-label="Voltar"
      >
        <BsArrowLeft className="text-2xl" />
      </button>

      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Barra de progresso */}
        <div className="w-full bg-gray-300 rounded-full h-2.5 mb-8">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Contador de cartões */}
        <div className="text-center mb-6 text-gray-600">
          Cartão {currentCardIndex + 1} de {cards.length}
        </div>

        {/* Card */}
        <div className="max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCardIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Pergunta */}
              <div className="p-6 bg-gray-50">
                <h3 className="text-sm uppercase font-semibold text-primary mb-2">
                  Pergunta
                </h3>
                <p className="text-2xl font-medium text-gray-800">
                  {currentCard?.question}
                </p>
              </div>

              {/* Resposta (condicional) */}
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="p-6 border-t border-gray-200"
                >
                  <h3 className="text-sm uppercase font-semibold text-green-600 mb-2">
                    Resposta
                  </h3>
                  <p className="text-2xl font-medium text-gray-800">
                    {currentCard?.answer}
                  </p>
                </motion.div>
              )}

              {/* Botões de ação */}
              <div className="p-4 bg-gray-50">
                {!showAnswer ? (
                  <button
                    onClick={toggleShowAnswer}
                    className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-hover transition duration-200"
                  >
                    Mostrar Resposta
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-center text-sm text-gray-600 mb-2">
                      Como você se saiu?
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                      <button
                        onClick={() => answerCard(ResponseQuality.INCORRECT)}
                        className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200"
                      >
                        Incorreto
                      </button>
                      <button
                        onClick={() => answerCard(ResponseQuality.HARD)}
                        className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-200"
                      >
                        Difícil
                      </button>
                      <button
                        onClick={() => answerCard(ResponseQuality.DIFFICULT)}
                        className="bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
                      >
                        Regular
                      </button>
                      <button
                        onClick={() => answerCard(ResponseQuality.EASY)}
                        className="bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-500 transition duration-200"
                      >
                        Fácil
                      </button>
                      <button
                        onClick={() => answerCard(ResponseQuality.GOOD)}
                        className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Bom
                      </button>
                      <button
                        onClick={() => answerCard(ResponseQuality.PERFECT)}
                        className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
                      >
                        Perfeito
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Instruções */}
        {!showAnswer && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Tente lembrar da resposta antes de clicar em "Mostrar Resposta"
          </div>
        )}
      </div>
    </div>
  );
}
