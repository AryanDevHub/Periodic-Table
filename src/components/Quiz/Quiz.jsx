// src/components/Quiz/Quiz.jsx

import React, { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../../api/apiClient';
import { recordQuizCompletion } from '../../utils/progress';
import styles from './Quiz.module.css';

const TOTAL_QUESTIONS = 10;
const SEEN_KEY_PREFIX = 'quiz_seen_';

function getSeenIds(difficulty) {
  try {
    const raw = localStorage.getItem(SEEN_KEY_PREFIX + difficulty);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addSeenIds(difficulty, ids) {
  const current = getSeenIds(difficulty);
  const updated = Array.from(new Set([...current, ...ids]));
  localStorage.setItem(SEEN_KEY_PREFIX + difficulty, JSON.stringify(updated));
}

function resetSeenIds(difficulty) {
  localStorage.removeItem(SEEN_KEY_PREFIX + difficulty);
}

const Quiz = () => {
  const [difficulty, setDifficulty] = useState(null); // null = selection screen
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const fetchQuestions = useCallback(async (selectedDifficulty) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const seenIds = getSeenIds(selectedDifficulty);
      const excludeParam = seenIds.length > 0 ? `&exclude=${seenIds.join(',')}` : '';
      const data = await apiClient.get(
        `/questions?difficulty=${selectedDifficulty}&limit=${TOTAL_QUESTIONS}${excludeParam}`
      );

      if (data.poolExhausted) {
        // The pool ran low — reset tracking so future quizzes cycle back through everything.
        resetSeenIds(selectedDifficulty);
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions available for this difficulty yet.');
      }

      addSeenIds(selectedDifficulty, data.questions.map((q) => q._id));

      setQuestions(data.questions);
      setCurrentIndex(0);
      setScore(0);
      setWrongAnswers(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setFeedback('');
      setIsComplete(false);
      setIsQuizActive(true);
    } catch (err) {
      console.error('Failed to load quiz questions:', err);
      setLoadError('Could not load quiz questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectDifficulty = (level) => {
    setDifficulty(level);
    fetchQuestions(level);
  };

  const handleAnswerClick = (clickedOption) => {
    if (isAnswered) return;

    const currentQuestion = questions[currentIndex];
    setIsAnswered(true);
    setSelectedAnswer(clickedOption);

    if (clickedOption === currentQuestion.correctAnswer) {
      setFeedback('Correct!');
      setScore((prev) => prev + 1);
    } else {
      setFeedback(`Sorry! The correct answer was ${currentQuestion.correctAnswer}.`);
      setWrongAnswers((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setFeedback('');
      } else {
        setIsQuizActive(false);
        setIsComplete(true);
      }
    }, 2000);
  };

  const handlePlayAgain = () => {
    if (difficulty) fetchQuestions(difficulty);
  };

  const handleChangeDifficulty = () => {
    setDifficulty(null);
    setIsQuizActive(false);
    setIsComplete(false);
  };

  // Award XP + update streak exactly once per completed quiz.
  useEffect(() => {
    if (isComplete) {
      recordQuizCompletion({ score, total: questions.length });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  // --- Difficulty selection screen ---
  if (!difficulty) {
    return (
      <div className={styles.quizSection}>
        <h2>Element Quiz</h2>
        <p>Test your knowledge of the periodic table! Pick a difficulty to start.</p>
        <div className={styles.difficultyGrid}>
          <button className={styles.difficultyButton} onClick={() => handleSelectDifficulty('beginner')}>
            🌱 Beginner
          </button>
          <button className={styles.difficultyButton} onClick={() => handleSelectDifficulty('intermediate')}>
            ⚗️ Intermediate
          </button>
          <button className={styles.difficultyButton} onClick={() => handleSelectDifficulty('advanced')}>
            🔬 Advanced
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.quizSection}>
        <h2>Element Quiz</h2>
        <p className="status-message">Loading questions...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={styles.quizSection}>
        <h2>Element Quiz</h2>
        <p role="alert">{loadError}</p>
        <button className={styles.startButton} onClick={() => fetchQuestions(difficulty)}>
          Try Again
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className={styles.quizSection}>
      <h2>Element Quiz</h2>

      {!isQuizActive && isComplete ? (
        <div className={styles.intro}>
          <div className={styles.finalScore}>
            <h3>Quiz Complete!</h3>
            <div className={styles.scoreDetail}>
              <span>Total Score:</span>
              <span>{score} / {questions.length}</span>
            </div>
            <div className={styles.scoreDetail} style={{ '--detail-color': '#2ecc71' }}>
              <span>Correct Answers:</span>
              <span>{score}</span>
            </div>
            <div className={styles.scoreDetail} style={{ '--detail-color': '#e74c3c' }}>
              <span>Wrong Answers:</span>
              <span>{wrongAnswers}</span>
            </div>
          </div>
          <div className={styles.postQuizActions}>
            <button onClick={handlePlayAgain} className={styles.startButton}>
              Play Again ({difficulty})
            </button>
            <button onClick={handleChangeDifficulty} className={styles.secondaryButton}>
              Change Difficulty
            </button>
          </div>
        </div>
      ) : (
        currentQuestion && (
          <div className={styles.questionArea}>
            <div className={styles.progress}>
              <span>Score: {score}</span>
              <span>Question: {currentIndex + 1} / {questions.length}</span>
            </div>
            <p className={styles.questionText}>{currentQuestion.question}</p>
            <div className={styles.optionsGrid}>
              {currentQuestion.options.map((option, index) => {
                const isCorrect = option === currentQuestion.correctAnswer;
                const isSelected = option === selectedAnswer;

                const buttonClasses = [styles.optionButton];
                if (isAnswered) {
                  buttonClasses.push(styles.answered);
                  if (isCorrect) buttonClasses.push(styles.correct);
                  else if (isSelected) buttonClasses.push(styles.incorrect);
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(option)}
                    className={buttonClasses.join(' ')}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {isAnswered && <p className={styles.feedback}>{feedback}</p>}
          </div>
        )
      )}
    </div>
  );
};

export default Quiz;