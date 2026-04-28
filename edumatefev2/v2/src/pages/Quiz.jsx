import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Square, CheckSquare, Clock, Award, RotateCcw } from 'lucide-react';
import './Quiz.css';
import { useLocation } from "react-router-dom";

export default function QuizPage() {
  const location = useLocation();
  const { quizData, timeLimit } = location.state || {};

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState((timeLimit || 10) * 60);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  if (!quizData) {
    return <div className="quiz-container">No quiz loaded. Go back and generate again.</div>;
  }

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex) => {
    const question = quizData.questions[currentQuestion];
    const currentAnswers = selectedAnswers[currentQuestion] || [];

    if (question.type === 'single') {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion]: [optionIndex]
      });
    } else {
      const newAnswers = currentAnswers.includes(optionIndex)
        ? currentAnswers.filter(idx => idx !== optionIndex)
        : [...currentAnswers, optionIndex];

      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion]: newAnswers
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.questions.forEach((q, idx) => {
      const user = selectedAnswers[idx] || [];
      if (JSON.stringify(user.sort()) === JSON.stringify(q.correctAnswer.sort())) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmitQuiz = () => {
    setScore(calculateScore());
    setQuizCompleted(true);
  };

  const handleRetake = () => {
    window.location.href = "/quiz-settings";
  };

  if (quizCompleted) {
    const percentage = (score / quizData.totalQuestions) * 100;

    return (
      <div className="quiz-container">
        <div className="quiz-result">
          <Award size={80} />
          <h1>Quiz Completed</h1>
          <h2>{score}/{quizData.totalQuestions}</h2>
          <p>{percentage.toFixed(1)}%</p>
          <button onClick={handleRetake}>
            <RotateCcw size={18} /> Generate New Quiz
          </button>
        </div>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];
  const currentAnswers = selectedAnswers[currentQuestion] || [];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>{quizData.title}</h1>
        <div className="timer">
          <Clock size={18} /> {formatTime(timeLeft)}
        </div>
      </div>

      <h2>{question.question}</h2>

      <div className="options-container">
        {question.options.map((opt, idx) => {
          const isSelected = currentAnswers.includes(idx);
          const Icon = question.type === 'single'
            ? (isSelected ? CheckCircle : Circle)
            : (isSelected ? CheckSquare : Square);

          return (
            <div
              key={idx}
              className={`option ${isSelected ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(idx)}
            >
              <Icon size={20} /> {opt}
            </div>
          );
        })}
      </div>

      <div className="quiz-navigation">
        <button onClick={handlePrevious} disabled={currentQuestion === 0}>Previous</button>

        {currentQuestion === quizData.questions.length - 1 ? (
          <button onClick={handleSubmitQuiz}>Submit</button>
        ) : (
          <button onClick={handleNext}>Next</button>
        )}
      </div>
    </div>
  );
}
