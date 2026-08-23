 import { useEffect, useState } from "react";

import {
  generateQuestion,
  evaluateAnswer,
} from "../../services/interviewService";

import "./InterviewAI.css";

function InterviewAI() {
  const [role, setRole] = useState("Frontend Developer");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [totalQuestions, setTotalQuestions] = useState(5);

  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [loading, setLoading] = useState(false);

  const [scores, setScores] = useState([]);

  const [timeLeft, setTimeLeft] = useState(120);

  const [interviewFinished, setInterviewFinished] = useState(false);

  const [error, setError] = useState("");


  // ============================================================
  // START INTERVIEW
  // ============================================================

  const startInterview = async () => {
    setLoading(true);
    setError("");

    try {
      const q = await generateQuestion(role, difficulty);

      setQuestion(q);

      setStarted(true);

      setCurrentQuestion(1);

      setAnswer("");

      setFeedback(null);

      setScores([]);

      setTimeLeft(120);

      setInterviewFinished(false);
    } catch (err) {
      console.error(err);

      setError("Unable to generate interview question.");
    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // SUBMIT ANSWER
  // ============================================================

  const submitAnswer = async () => {
    if (loading || feedback) {
      return;
    }

    const finalAnswer =
      answer.trim() || "No answer submitted.";

    setLoading(true);
    setError("");

    try {
      const result = await evaluateAnswer(
        question,
        finalAnswer
      );

      setFeedback(result);

      setScores((prev) => [
        ...prev,
        Number(result.score) || 0,
      ]);
    } catch (err) {
      console.error(err);

      setError("Unable to evaluate your answer.");
    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // NEXT QUESTION
  // ============================================================

  const nextQuestion = async () => {
    if (currentQuestion >= totalQuestions) {
      setInterviewFinished(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const q = await generateQuestion(
        role,
        difficulty
      );

      setQuestion(q);

      setCurrentQuestion(
        (prev) => prev + 1
      );

      setAnswer("");

      setFeedback(null);

      setTimeLeft(120);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load the next question."
      );
    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // TIMER
  // ============================================================

  useEffect(() => {
    if (
      !started ||
      feedback ||
      interviewFinished ||
      loading
    ) {
      return;
    }

    if (timeLeft <= 0) {
      submitAnswer();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(
        (prev) => prev - 1
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    started,
    feedback,
    interviewFinished,
    timeLeft,
    loading,
  ]);


  // ============================================================
  // AVERAGE SCORE
  // ============================================================

  const averageScore =
    scores.length > 0
      ? (
          scores.reduce(
            (total, score) =>
              total + score,
            0
          ) / scores.length
        ).toFixed(1)
      : "0.0";


  // ============================================================
  // RESTART
  // ============================================================

  const restartInterview = () => {
    setStarted(false);

    setQuestion("");

    setAnswer("");

    setFeedback(null);

    setScores([]);

    setCurrentQuestion(1);

    setTimeLeft(120);

    setInterviewFinished(false);

    setError("");
  };


  // ============================================================
  // TIMER FORMAT
  // ============================================================

  const minutes = Math.floor(
    timeLeft / 60
  );

  const seconds = (
    timeLeft % 60
  )
    .toString()
    .padStart(2, "0");


  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div className="interview-page">

      {/* ======================================================
          UNIQUE CARD CLASS
          IMPORTANT:
          Do NOT use "interview-card"
      ====================================================== */}

      <div className="ai-interview-card">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="interview-header">

          <div className="ai-icon">
            🤖
          </div>

          <h1>
            AI Mock Interview
          </h1>

          <p>
            Practice technical interviews
            with AI-powered evaluation.
          </p>

        </div>


        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* ====================================================
            SETUP SCREEN
        ==================================================== */}

        {!started ? (

          <div className="setup-section">

            <div className="setup-heading">

              <h2>
                Start Your Interview
              </h2>

              <p>
                Select your role, difficulty
                and number of questions.
              </p>

            </div>


            {/* JOB ROLE */}

            <div className="form-group">

              <label>
                Job Role
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
              >

                <option>
                  Frontend Developer
                </option>

                <option>
                  React Developer
                </option>

                <option>
                  Backend Developer
                </option>

                <option>
                  Node.js Developer
                </option>

                <option>
                  Java Developer
                </option>

                <option>
                  Python Developer
                </option>

                <option>
                  Full Stack Developer
                </option>

              </select>

            </div>


            {/* DIFFICULTY */}

            <div className="form-group">

              <label>
                Difficulty
              </label>

              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(
                    e.target.value
                  )
                }
              >

                <option>
                  Beginner
                </option>

                <option>
                  Intermediate
                </option>

                <option>
                  Advanced
                </option>

              </select>

            </div>


            {/* TOTAL QUESTIONS */}

            <div className="form-group">

              <label>
                Total Questions
              </label>

              <select
                value={totalQuestions}
                onChange={(e) =>
                  setTotalQuestions(
                    Number(e.target.value)
                  )
                }
              >

                <option value={5}>
                  5 Questions
                </option>

                <option value={10}>
                  10 Questions
                </option>

              </select>

            </div>


            {/* START BUTTON */}

            <button
              className="primary-btn"
              onClick={startInterview}
              disabled={loading}
            >

              {loading
                ? "Generating Question..."
                : "Start Interview →"}

            </button>

          </div>

        ) : (

          /* ==================================================
             INTERVIEW SCREEN
          ================================================== */

          <div className="ai-interview-content">


            {/* =================================================
                TOP INFORMATION
            ================================================= */}

            <div className="interview-info">

              <div className="question-number">

                Question{" "}

                <strong>
                  {currentQuestion}
                </strong>

                {" "} / {totalQuestions}

              </div>


              <div
                className={
                  timeLeft <= 30
                    ? "timer timer-danger"
                    : "timer"
                }
              >

                ⏱ {minutes}:{seconds}

              </div>

            </div>


            {/* =================================================
                PROGRESS BAR
            ================================================= */}

            <div className="progress-container">

              <div
                className="progress-fill"
                style={{
                  width: `${
                    (currentQuestion /
                      totalQuestions) *
                    100
                  }%`,
                }}
              />

            </div>


            {/* =================================================
                QUESTION
            ================================================= */}

            <div className="question-box">

              <div className="question-label">
                Interview Question
              </div>

              <h2>
                {question}
              </h2>

            </div>


            {/* =================================================
                ANSWER AREA
            ================================================= */}

            {!feedback && (

              <div className="answer-section">

                <div className="answer-heading">

                  <label>
                    Your Answer
                  </label>

                  <span>
                    Explain your answer clearly.
                  </span>

                </div>


                <textarea
                  rows="8"
                  placeholder="Write your answer here..."
                  value={answer}
                  onChange={(e) =>
                    setAnswer(e.target.value)
                  }
                  disabled={loading}
                />


                <button
                  className="primary-btn"
                  onClick={submitAnswer}
                  disabled={loading}
                >

                  {loading
                    ? "Evaluating Answer..."
                    : "Submit Answer →"}

                </button>

              </div>

            )}


            {/* =================================================
                FEEDBACK
            ================================================= */}

            {feedback && (

              <div className="feedback-area">

                <div className="feedback-card">

                  {/* FEEDBACK HEADER */}

                  <div className="feedback-header">

                    <h2>
                      🤖 AI Evaluation
                    </h2>

                    <div className="score-box">
                      ⭐ {feedback.score}/10
                    </div>

                  </div>


                  {/* SCORE BAR */}

                  <div className="score-progress">

                    <div
                      className="score-progress-fill"
                      style={{
                        width: `${
                          Number(
                            feedback.score
                          ) * 10
                        }%`,
                      }}
                    />

                  </div>


                  {/* =================================================
                      STRENGTHS
                  ================================================= */}

                  <div className="feedback-section strengths">

                    <h3>
                      👍 Strengths
                    </h3>

                    <ul>

                      {feedback.strengths?.length ? (

                        feedback.strengths.map(
                          (item, index) => (
                            <li key={index}>
                              {item}
                            </li>
                          )
                        )

                      ) : (

                        <li>
                          No strengths available.
                        </li>

                      )}

                    </ul>

                  </div>


                  {/* =================================================
                      IMPROVEMENTS
                  ================================================= */}

                  <div className="feedback-section improvements">

                    <h3>
                      ⚠️ Needs Improvement
                    </h3>

                    <ul>

                      {feedback.improvements?.length ? (

                        feedback.improvements.map(
                          (item, index) => (
                            <li key={index}>
                              {item}
                            </li>
                          )
                        )

                      ) : (

                        <li>
                          No improvements suggested.
                        </li>

                      )}

                    </ul>

                  </div>


                  {/* =================================================
                      FEEDBACK
                  ================================================= */}

                  <div className="feedback-section">

                    <h3>
                      💬 Feedback
                    </h3>

                    <p>
                      {feedback.feedback}
                    </p>

                  </div>


                  {/* =================================================
                      IDEAL ANSWER
                  ================================================= */}

                  <div className="feedback-section ideal-answer">

                    <h3>
                      ✅ Ideal Answer
                    </h3>

                    <p>
                      {feedback.correctAnswer}
                    </p>

                  </div>

                </div>


                {/* =================================================
                    NEXT QUESTION
                ================================================= */}

                {currentQuestion <
                totalQuestions ? (

                  <button
                    className="primary-btn"
                    onClick={nextQuestion}
                    disabled={loading}
                  >

                    {loading
                      ? "Loading..."
                      : "Next Question →"}

                  </button>

                ) : (

                  /* =================================================
                     FINAL REPORT
                  ================================================= */

                  <div className="final-report">

                    <div className="completion-icon">
                      🎉
                    </div>

                    <h2>
                      Interview Completed!
                    </h2>

                    <div className="final-score">

                      {averageScore}

                      <span>
                        /10
                      </span>

                    </div>

                    <p>

                      {Number(
                        averageScore
                      ) >= 8

                        ? "🌟 Excellent! You're interview ready."

                        : Number(
                            averageScore
                          ) >= 6

                        ? "👍 Good performance. Keep practicing."

                        : "📚 Practice more before attending interviews."}

                    </p>


                    <button
                      className="restart-btn"
                      onClick={
                        restartInterview
                      }
                    >
                      Restart Interview
                    </button>

                  </div>

                )}

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default InterviewAI;