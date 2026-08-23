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

  // ==========================
  // Start Interview
  // ==========================
  const startInterview = async () => {
    setLoading(true);

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
      alert("Unable to generate question.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Submit Answer
  // ==========================
  const submitAnswer = async () => {
    if (loading || feedback) return;

    const finalAnswer = answer.trim() || "No answer submitted.";

    setLoading(true);

    try {
      const result = await evaluateAnswer(question, finalAnswer);

      setFeedback(result);
      setScores((prev) => [...prev, Number(result.score)]);
    } catch (err) {
      console.error(err);
      alert("Evaluation failed.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Next Question
  // ==========================
  const nextQuestion = async () => {
    if (currentQuestion >= totalQuestions) {
      setInterviewFinished(true);
      return;
    }

    setLoading(true);

    try {
      const q = await generateQuestion(role, difficulty);

      setQuestion(q);
      setCurrentQuestion((prev) => prev + 1);
      setAnswer("");
      setFeedback(null);
      setTimeLeft(120);
    } catch (err) {
      console.error(err);
      alert("Unable to load next question.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Timer
  // ==========================
  useEffect(() => {
    if (!started || feedback || interviewFinished || loading) {
      return;
    }

    if (timeLeft <= 0) {
      submitAnswer();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [started, feedback, interviewFinished, timeLeft, loading]);

  // ==========================
  // Average Score
  // ==========================
  const averageScore =
    scores.length > 0
      ? (
          scores.reduce((total, score) => total + score, 0) / scores.length
        ).toFixed(1)
      : "0.0";

  // ==========================
  // Restart
  // ==========================
  const restartInterview = () => {
    setStarted(false);
    setQuestion("");
    setAnswer("");
    setFeedback(null);
    setScores([]);
    setCurrentQuestion(1);
    setTimeLeft(120);
    setInterviewFinished(false);
  };

  return (
    <div className="interview-page">
      <div className="interview-card">
        {/* HEADER */}
        <div className="interview-header">
          <div className="ai-badge">AI POWERED</div>

          <h1>🤖 AI Mock Interview</h1>

          <p>Practice real interview questions and get instant AI feedback.</p>
        </div>

        {!started ? (
          /* ==========================
             SETUP SCREEN
          ========================== */
          <div className="setup-section">
            <div className="setup-title">
              <h2>Start Your Interview</h2>
              <p>Choose your role and interview difficulty.</p>
            </div>

            <div className="form-group">
              <label>Job Role</label>

              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option>Frontend Developer</option>
                <option>React Developer</option>
                <option>Backend Developer</option>
                <option>Node.js Developer</option>
                <option>Java Developer</option>
                <option>Python Developer</option>
                <option>Full Stack Developer</option>
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty</label>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label>Total Questions</label>

              <select
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value))}
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>

            <button
              className="primary-btn"
              onClick={startInterview}
              disabled={loading}
            >
              {loading ? "Generating..." : "Start Interview →"}
            </button>
          </div>
        ) : (
          /* ==========================
             INTERVIEW SCREEN
          ========================== */
          <div className="interview-content">
            {/* TOP BAR */}
            <div className="interview-topbar">
              <div className="question-count">
                Question <strong>{currentQuestion}</strong> / {totalQuestions}
              </div>

              <div className={`timer ${timeLeft <= 30 ? "timer-danger" : ""}`}>
                ⏱ {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </div>
            </div>

            {/* PROGRESS */}
            <div className="progress-container">
              <div
                className="progress-fill"
                style={{
                  width: `${(currentQuestion / totalQuestions) * 100}%`,
                }}
              />
            </div>

            {/* QUESTION */}
            <div className="question-box">
              <div className="question-label">INTERVIEW QUESTION</div>

              {loading && !feedback ? (
                <div className="question-loading">
                  <span className="spinner"></span>
                  <span>AI is processing...</span>
                </div>
              ) : (
                <h2 className="question-text">{question}</h2>
              )}
            </div>

            {/* ANSWER */}
            {!feedback && (
              <>
                <div className="answer-header">
                  <label>Your Answer</label>

                  <span>Explain your answer clearly and confidently.</span>
                </div>

                <textarea
                  className="answer-textarea"
                  rows="8"
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={loading}
                />

                <button
                  className="primary-btn"
                  onClick={submitAnswer}
                  disabled={loading}
                >
                  {loading ? "Evaluating Answer..." : "Submit Answer →"}
                </button>
              </>
            )}

            {/* FEEDBACK */}
            {feedback && (
              <div className="feedback-wrapper">
                <div className="feedback-card">
                  <div className="feedback-title">
                    <h2>🤖 AI Evaluation</h2>

                    <div className="score-box">⭐ {feedback.score}/10</div>
                  </div>

                  <div className="score-progress">
                    <div
                      className="score-progress-fill"
                      style={{
                        width: `${feedback.score * 10}%`,
                      }}
                    />
                  </div>

                  {/* STRENGTHS */}
                  <div className="section strength-section">
                    <h3>👍 Strengths</h3>

                    <ul>
                      {feedback.strengths?.length ? (
                        feedback.strengths.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))
                      ) : (
                        <li>No strengths available.</li>
                      )}
                    </ul>
                  </div>

                  {/* IMPROVEMENTS */}
                  <div className="section improvement-section">
                    <h3>⚠️ Needs Improvement</h3>

                    <ul>
                      {feedback.improvements?.length ? (
                        feedback.improvements.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))
                      ) : (
                        <li>No improvements suggested.</li>
                      )}
                    </ul>
                  </div>

                  {/* FEEDBACK */}
                  <div className="section">
                    <h3>💬 Feedback</h3>
                    <p>{feedback.feedback}</p>
                  </div>

                  {/* IDEAL ANSWER */}
                  <div className="section ideal-answer">
                    <h3>✅ Ideal Answer</h3>
                    <p>{feedback.correctAnswer}</p>
                  </div>
                </div>

                {/* NEXT / FINAL */}
                {currentQuestion < totalQuestions ? (
                  <button
                    className="primary-btn"
                    onClick={nextQuestion}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Next Question →"}
                  </button>
                ) : (
                  <div className="final-report">
                    <div className="completion-icon">🎉</div>

                    <h2>Interview Completed!</h2>

                    <div className="final-score">
                      {averageScore}
                      <span>/10</span>
                    </div>

                    <p>
                      {Number(averageScore) >= 8
                        ? "🌟 Excellent! You're interview ready."
                        : Number(averageScore) >= 6
                          ? "👍 Good performance. Keep practicing."
                          : "📚 Practice more before attending interviews."}
                    </p>

                    <button
                      className="primary-btn restart-btn"
                      onClick={restartInterview}
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
