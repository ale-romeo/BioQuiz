import { useState } from "react";
import { fullQuizData } from "./data/quizData";

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizData, setQuizData] = useState<{
    question: string;
    options: string[];
    correct: string;
  }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const startQuiz = () => {
    const shuffled = [...fullQuizData].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, numQuestions);
    setQuizData(selectedQuestions);
    setAnswers(Array(selectedQuestions.length).fill(null));
    setCurrentQuestionIndex(0);
    setSelected(null);
    setQuizStarted(true);
    setQuizFinished(false);
  };

  const handleAnswer = (option: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = option;
    setAnswers(updatedAnswers);
    setSelected(option);
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setSelected(answers[index]);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      goToQuestion(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setQuizData([]);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setSelected(null);
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Seleziona il numero di domande</h1>
          <select
            className="mb-4 p-2 border rounded"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
          >
            {[5, 10, 20, 30, 40, fullQuizData.length].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <br />
          <button
            onClick={startQuiz}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Avvia Test
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold mb-4">Domanda {currentQuestionIndex + 1} di {quizData.length}</h1>
        <p className="text-lg font-medium mb-6">{currentQuestion.question}</p>

        <div className="space-y-3">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selected === opt;
            const isCorrect = opt === currentQuestion.correct;
            const isWrong = answers[currentQuestionIndex] === opt && opt !== currentQuestion.correct;
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className={`w-full text-left p-3 rounded-lg border transition-colors duration-150
                  ${quizFinished ?
                    isCorrect ? "bg-green-100 border-green-400 text-green-800" :
                    isWrong ? "bg-red-100 border-red-400 text-red-800" :
                    "bg-white border-gray-300 text-gray-800" :
                    isSelected ? "bg-blue-500 text-white border-blue-700" :
                    "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Indietro
          </button>

          {!quizFinished ? (
            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === quizData.length - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Avanti
            </button>
          ) : (
            <button
              onClick={resetQuiz}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Nuovo Test
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {quizData.map((_q, i) => {
            const isAnswered = answers[i] !== null;
            const isCorrect = answers[i] === quizData[i].correct;
            const isCurrent = currentQuestionIndex === i;
            return (
              <button
                key={i}
                onClick={() => goToQuestion(i)}
                className={`w-8 h-8 rounded-full border text-sm font-bold
                  ${isCurrent ? "bg-blue-600 text-white border-blue-700" :
                    quizFinished && isAnswered && isCorrect ? "bg-green-100 text-green-700 border-green-400" :
                    quizFinished && isAnswered ? "bg-red-100 text-red-700 border-red-400" :
                    "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {!quizFinished && (
          <div className="mt-6 text-center">
            <button
              onClick={finishQuiz}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Concludi Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;