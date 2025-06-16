import { useState } from "react";
import { fullQuizData } from "./data/quizData";

type QuestionType = {
  question: string;
  options?: string[];
  correct?: string;
  explanation?: string;
  expected_answer?: string;
  super_topic: string;
  topic?: string;
};

function App() {
  const [mode, setMode] = useState<"quizdb" | "homemade" | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [quizData, setQuizData] = useState<QuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [answersOpen, setAnswersOpen] = useState<string[]>([]);

  const isOpenQuestion = (q: QuestionType) =>
    !!q.expected_answer && !q.options;

  const startQuiz = () => {
    let filtered = fullQuizData;
    if (mode === "quizdb") {
      filtered = filtered.filter((q) => q.super_topic === "QuizDB");
    } else if (mode === "homemade" && selectedTopics.length > 0) {
      filtered = filtered.filter((q) =>
        selectedTopics.includes(q.topic ?? "")
      );
    }

    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(
      0,
      Math.min(numQuestions, shuffled.length)
    );

    setQuizData(selectedQuestions);
    setAnswers(Array(selectedQuestions.length).fill(null));
    setAnswersOpen(Array(selectedQuestions.length).fill(""));
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

  const finishQuiz = () => setQuizFinished(true);

  const resetQuiz = () => {
    setMode(null);
    setQuizStarted(false);
    setQuizFinished(false);
    setQuizData([]);
    setAnswers([]);
    setAnswersOpen([]);
    setCurrentQuestionIndex(0);
    setSelected(null);
    setSelectedTopics([]);
  };

  const allTopics = Array.from(
    new Set(
      fullQuizData
        .filter((q) => q.super_topic === "Quiz Homemade")
        .map((q) => q.topic ?? "Altro")
    )
  ).sort();

  if (!quizStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-xl w-full">
          <h1 className="text-3xl font-bold mb-6">Bioinformatics Quiz</h1>

          {!mode && (
            <div className="flex justify-center gap-6 mb-6">
              <button
                onClick={() => {
                  setMode("quizdb");
                  setSelectedTopics(["QuizDB"]);
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                🧪 QuizDB
              </button>

              <button
                onClick={() => setMode("homemade")}
                className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
              >
                🧠 Quiz Homemade
              </button>
            </div>
          )}

          {mode === "homemade" && (
            <>
              <h2 className="text-xl font-semibold mb-2">Scegli uno o più topic</h2>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {allTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() =>
                      setSelectedTopics((prev) =>
                        prev.includes(topic)
                          ? prev.filter((t) => t !== topic)
                          : [...prev, topic]
                      )
                    }
                    className={`px-3 py-1 rounded-full border text-sm transition 
                      ${selectedTopics.includes(topic)
                        ? "bg-green-600 text-white border-green-700"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </>
          )}

          {mode && (
            <>
              <h2 className="text-xl font-semibold mb-2">Numero di domande</h2>
              <select
                className="mb-4 p-2 border rounded"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
              >
                {[5, 10, 20, 30, 40, 66, fullQuizData.length].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  onClick={startQuiz}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Avvia Test
                </button>
                <button
                  onClick={resetQuiz}
                  className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  ⬅️ Indietro
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = quizData[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold mb-4">
          Domanda {currentQuestionIndex + 1} di {quizData.length}
        </h1>
        <p className="text-lg font-medium mb-6">{currentQuestion.question}</p>

        {isOpenQuestion(currentQuestion) ? (
          <div className="space-y-2">
            <textarea
              rows={4}
              className="w-full p-3 border rounded-lg"
              placeholder="Scrivi la tua risposta..."
              value={answersOpen[currentQuestionIndex] || ""}
              onChange={(e) => {
                const updated = [...answersOpen];
                updated[currentQuestionIndex] = e.target.value;
                setAnswersOpen(updated);
              }}
              disabled={quizFinished}
            />
            {quizFinished && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg text-yellow-800 text-sm">
                <p><strong>Risposta attesa:</strong> {currentQuestion.expected_answer}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {(() => {
              const letterToIndex = { a: 0, b: 1, c: 2, d: 3 } as const;
              const correctAnswer =
                currentQuestion.options![letterToIndex[currentQuestion.correct as keyof typeof letterToIndex]];

              return (
                <>
                  {currentQuestion.options!.map((opt, idx) => {
                    const isSelected = selected === opt;
                    const isCorrect = opt === correctAnswer;
                    const isWrong = answers[currentQuestionIndex] === opt && opt !== correctAnswer;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(opt)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors duration-150
                          ${quizFinished
                            ? isCorrect
                              ? "bg-green-100 border-green-400 text-green-800"
                              : isWrong
                              ? "bg-red-100 border-red-400 text-red-800"
                              : "bg-white border-gray-300 text-gray-800"
                            : isSelected
                            ? "bg-blue-500 text-white border-blue-700"
                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"}`}
                      >
                        {opt}
                      </button>
                    );
                  })}

                  {quizFinished && currentQuestion.explanation && (
                    <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg text-yellow-800 text-sm">
                      <p><strong>Spiegazione:</strong> {currentQuestion.explanation}</p>
                      <p className="mt-2"><strong>Risposta corretta:</strong> {correctAnswer}</p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

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
          {quizData.map((q, i) => {
            const isAnswered = isOpenQuestion(q)
              ? answersOpen[i]?.trim().length > 0
              : answers[i] !== null;

            const letterToIndex = { a: 0, b: 1, c: 2, d: 3 } as const;
            const correctAnswer = q.options
              ? q.options[letterToIndex[q.correct as keyof typeof letterToIndex]]
              : "";

            const isCorrect = isOpenQuestion(q)
              ? answersOpen[i]?.trim().length > 0
              : answers[i] === correctAnswer;

            const isCurrent = currentQuestionIndex === i;

            return (
              <button
                key={i}
                onClick={() => goToQuestion(i)}
                className={`w-8 h-8 rounded-full border text-sm font-bold
                  ${isCurrent
                    ? "bg-blue-600 text-white border-blue-700"
                    : quizFinished && isAnswered && isCorrect
                    ? "bg-green-100 text-green-700 border-green-400"
                    : quizFinished && isAnswered
                    ? "bg-red-100 text-red-700 border-red-400"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"}`}
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
