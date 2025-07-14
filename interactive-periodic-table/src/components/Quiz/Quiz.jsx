// src/components/Quiz/Quiz.jsx

import React, { useState, useEffect, useCallback } from 'react';
import styles from './Quiz.module.css';

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const Quiz = ({ allElements }) => {
  // --- STATE MANAGEMENT ---
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState('');
  
  // Scoring
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // UI Control
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isQuizActive, setIsQuizActive] = useState(false);

  const TOTAL_QUESTIONS = 10;

  // This function is now only called when we explicitly want a new question.
  const generateQuestion = useCallback(() => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setFeedback('');

    const correctElement = allElements[Math.floor(Math.random() * allElements.length)];
    const incorrectElements = [];
    while (incorrectElements.length < 3) {
      const randomElement = allElements[Math.floor(Math.random() * allElements.length)];
      if (randomElement.number !== correctElement.number && !incorrectElements.some(el => el.number === randomElement.number)) {
        incorrectElements.push(randomElement);
      }
    }

    const questionTypes = ['symbol', 'number'];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    const answerType = 'name';

    let questionText = '';
    if (questionType === 'symbol') {
      questionText = `Which element has the symbol "${correctElement.symbol}"?`;
    } else {
      questionText = `Which element is atomic number ${correctElement.number}?`;
    }

    setCurrentQuestion({
      text: questionText,
      correctAnswer: correctElement[answerType],
    });

    const answerOptions = [correctElement, ...incorrectElements].map(el => el[answerType]);
    setOptions(shuffleArray(answerOptions));
  }, [allElements]);

  // REMOVED: The useEffect that was causing the double question skip is gone.
  
  const handleAnswerClick = (clickedOption) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(clickedOption);
    setQuestionsAnswered(prev => prev + 1);

    if (clickedOption === currentQuestion.correctAnswer) {
      setFeedback('Correct!');
      setScore(prev => prev + 1);
    } else {
      setFeedback(`Sorry! The correct answer was ${currentQuestion.correctAnswer}.`);
      setWrongAnswers(prev => prev + 1);
    }

    const nextQuestionDelay = 2000;
    setTimeout(() => {
      if (questionsAnswered < TOTAL_QUESTIONS - 1) { // Check against TOTAL_QUESTIONS - 1
        generateQuestion();
      } else {
        setIsQuizActive(false); // End the quiz
      }
    }, nextQuestionDelay);
  };
  
  // THIS IS THE KEY FIX: The first question must be generated here.
  const startQuiz = () => {
    setScore(0);
    setWrongAnswers(0);
    setQuestionsAnswered(0);
    setSelectedAnswer(null);
    setIsQuizActive(true);
    generateQuestion(); // Generate the first question immediately.
  };

  return (
    <div className={styles.quizSection}>
      <h2>Element Quiz</h2>
      
      {!isQuizActive ? (
        <div className={styles.intro}>
          {questionsAnswered === TOTAL_QUESTIONS ? (
            <div className={styles.finalScore}>
              <h3>Quiz Complete!</h3>
              <div className={styles.scoreDetail}>
                <span>Total Score:</span>
                <span>{score} / {TOTAL_QUESTIONS}</span>
              </div>
              <div className={styles.scoreDetail} style={{'--detail-color': '#2ecc71'}}>
                <span>Correct Answers:</span>
                <span>{score}</span>
              </div>
              <div className={styles.scoreDetail} style={{'--detail-color': '#e74c3c'}}>
                <span>Wrong Answers:</span>
                <span>{wrongAnswers}</span>
              </div>
            </div>
          ) : (
            <p>Test your knowledge of the periodic table!</p>
          )}
          <button onClick={startQuiz} className={styles.startButton}>
            {questionsAnswered === TOTAL_QUESTIONS ? 'Play Again' : 'Start Quiz'}
          </button>
        </div>
      ) : (
        currentQuestion && (
          <div className={styles.questionArea}>
            <div className={styles.progress}>
              <span>Score: {score}</span>
              <span>Question: {questionsAnswered + 1 > TOTAL_QUESTIONS ? TOTAL_QUESTIONS : questionsAnswered + 1} / {TOTAL_QUESTIONS}</span>
            </div>
            <p className={styles.questionText}>{currentQuestion.text}</p>
            <div className={styles.optionsGrid}>
              {options.map((option, index) => {
                const isCorrect = option === currentQuestion.correctAnswer;
                const isSelected = option === selectedAnswer;

                const buttonClasses = [styles.optionButton];
                if (isAnswered) {
                  buttonClasses.push(styles.answered);
                  if (isCorrect) {
                    buttonClasses.push(styles.correct);
                  } else if (isSelected) {
                    buttonClasses.push(styles.incorrect);
                  }
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