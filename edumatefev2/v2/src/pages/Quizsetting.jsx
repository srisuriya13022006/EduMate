import React, { useState } from 'react';
import { Brain, Clock, ListOrdered, Zap, Target, Users, Play, Sparkles } from 'lucide-react';
import './Quizsetting.css';
import { useNavigate } from "react-router-dom";

export default function QuizSetting() {
  const [difficulty, setDifficulty] = useState('medium');
  const [timeLimit, setTimeLimit] = useState(10);
  const [numQuestions, setNumQuestions] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const difficulties = [
    { 
      id: 'easy', 
      label: 'Easy', 
      icon: Users, 
      color: '#10b981',
      description: 'Perfect for beginners'
    },
    { 
      id: 'medium', 
      label: 'Medium', 
      icon: Target, 
      color: '#f59e0b',
      description: 'Balanced challenge'
    },
    { 
      id: 'hard', 
      label: 'Hard', 
      icon: Zap, 
      color: '#ef4444',
      description: 'For the experts'
    }
  ];

  const timeLimits = [
    { value: 5, label: '5 Minutes' },
    { value: 10, label: '10 Minutes' },
    { value: 15, label: '15 Minutes' },
    { value: 20, label: '20 Minutes' },
    { value: 30, label: '30 Minutes' },
    { value: 60, label: '1 Hour' }
  ];

  const handleGenerateQuiz = async () => {
  setIsGenerating(true);

  try {
    const res = await fetch("http://localhost:5000/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: "PDF Content",
        difficulty,
        numQuestions
      })
    });

    const quizData = await res.json();

    // Navigate to quiz page with quiz data + time
    navigate("/quiz", {
      state: {
        quizData,
        timeLimit
      }
    });

  } catch (err) {
    console.error("Quiz generation failed:", err);
    alert("Failed to generate quiz");
  } finally {
    setIsGenerating(false);
  }
};


  return (
    <div className="quiz-setting-container">
      <div className="setting-header">

        <div className="header-icon">
          <div className="floating-wrapper">
            <Brain size={48} className="brain-icon" />
          </div>
        </div>
        <h1 className="header-title">Customize Your Quiz</h1>
        <p className="header-subtitle">Set your preferences and challenge yourself</p>
      </div>

      <div className="settings-content">
        {/* Difficulty Selection */}
        <div className="setting-section">
          <div className="section-header">
            <Target size={24} className="section-icon" />
            <div>
              <h2 className="section-title">Difficulty Level</h2>
              <p className="section-description">Choose your challenge level</p>
            </div>
          </div>

          <div className="difficulty-cards">
            {difficulties.map((diff) => {
              const Icon = diff.icon;
              return (
                <div
                  key={diff.id}
                  className={`difficulty-card ${difficulty === diff.id ? 'active' : ''}`}
                  onClick={() => setDifficulty(diff.id)}
                  style={{ '--card-color': diff.color }}
                >
                  <Icon className="difficulty-icon" size={32} />
                  <h3 className="difficulty-label">{diff.label}</h3>
                  <p className="difficulty-description">{diff.description}</p>
                  <div className="card-glow" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Limit Selection */}
        <div className="setting-section">
          <div className="section-header">
            <Clock size={24} className="section-icon" />
            <div>
              <h2 className="section-title">Time Limit</h2>
              <p className="section-description">Set your quiz duration</p>
            </div>
          </div>

          <div className="time-selector">
            {timeLimits.map((time) => (
              <div
                key={time.value}
                className={`time-option ${timeLimit === time.value ? 'active' : ''}`}
                onClick={() => setTimeLimit(time.value)}
              >
                {time.label}
              </div>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div className="setting-section">
          <div className="section-header">
            <ListOrdered size={24} className="section-icon" />
            <div>
              <h2 className="section-title">Number of Questions</h2>
              <p className="section-description">Select how many questions you want</p>
            </div>
          </div>

          <div className="question-selector">
            <div className="dropdown-wrapper">
              <select 
                className="question-dropdown"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
              >
                {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Question' : 'Questions'}
                  </option>
                ))}
              </select>
              <div className="dropdown-arrow">▼</div>
            </div>

            <div className="question-range">
              <input
                type="range"
                min="1"
                max="100"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="range-slider"
              />
              <div className="range-labels">
                <span>1</span>
                <span className="current-value">{numQuestions}</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="summary-card">
          <Sparkles className="summary-icon" size={24} />
          <div className="summary-content">
            <h3 className="summary-title">Quiz Summary</h3>
            <div className="summary-details">
              <div className="summary-item">
                <span className="summary-label">Difficulty:</span>
                <span className="summary-value">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Duration:</span>
                <span className="summary-value">{timeLimit} min</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Questions:</span>
                <span className="summary-value">{numQuestions}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button 
          className={`generate-btn ${isGenerating ? 'generating' : ''}`}
          onClick={handleGenerateQuiz}
          disabled={isGenerating}
          
        >
          {isGenerating ? (
            <>
              <div className="spinner" />
              Generating Quiz...
            </>
          ) : (
            <>
              <Play size={24} />
              Generate Quiz
            </>
          )}
        </button>
      </div>
    </div>
  );
}