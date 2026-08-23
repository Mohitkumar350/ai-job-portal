import { GoogleGenerativeAI } from "@google/generative-ai";
import questionBank from "../questionBank.js";

/* ============================================================
   GEMINI CONFIG
   ============================================================ */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("⚠️ VITE_GEMINI_API_KEY is missing.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/*
  IMPORTANT:
  Use a model actually available to your Gemini API key.
*/
 const GEMINI_MODEL = "gemini-3.6-flash";/* ============================================================
   HELPERS
   ============================================================ */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorMessage(error) {
  return (
    error?.message ||
    error?.errorDetails?.[0]?.message ||
    "Unknown Gemini error"
  );
}

function isQuotaError(error) {
  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("rate limit")
  );
}

function isModelError(error) {
  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("404") ||
    message.includes("not found") ||
    message.includes("no longer available") ||
    message.includes("model")
  );
}

/* ============================================================
   QUESTION BANK
   ============================================================ */

function getQuestionsForRole(role, difficulty) {
  if (!questionBank) {
    return [];
  }

  const normalizedRole = String(role || "")
    .trim()
    .toLowerCase();
  const normalizedDifficulty = String(difficulty || "")
    .trim()
    .toLowerCase();

  /* ----------------------------------------------------------
     Structure:
     {
       "Frontend Developer": {
         "Beginner": [...]
       }
     }
  ---------------------------------------------------------- */

  if (
    questionBank[role] &&
    questionBank[role][difficulty] &&
    Array.isArray(questionBank[role][difficulty])
  ) {
    return questionBank[role][difficulty];
  }

  /* ----------------------------------------------------------
     Case-insensitive role
  ---------------------------------------------------------- */

  if (!Array.isArray(questionBank)) {
    const roleKey = Object.keys(questionBank).find(
      (key) => key.toLowerCase() === normalizedRole,
    );

    if (roleKey) {
      if (
        questionBank[roleKey] &&
        questionBank[roleKey][difficulty] &&
        Array.isArray(questionBank[roleKey][difficulty])
      ) {
        return questionBank[roleKey][difficulty];
      }

      if (Array.isArray(questionBank[roleKey])) {
        return questionBank[roleKey];
      }
    }
  }

  /* ----------------------------------------------------------
     Flat array structure
  ---------------------------------------------------------- */

  if (Array.isArray(questionBank)) {
    return questionBank.filter((item) => {
      if (!item || typeof item !== "object") {
        return true;
      }

      const itemRole = String(item.role || "").toLowerCase();
      const itemDifficulty = String(item.difficulty || "").toLowerCase();

      return (
        (!itemRole || itemRole === normalizedRole) &&
        (!itemDifficulty || itemDifficulty === normalizedDifficulty)
      );
    });
  }

  return [];
}

/* ============================================================
   EXTRACT QUESTION
   ============================================================ */

function extractQuestion(item) {
  if (typeof item === "string") {
    return item;
  }

  if (item?.question) {
    return item.question;
  }

  if (item?.text) {
    return item.text;
  }

  if (item?.title) {
    return item.title;
  }

  return "";
}

/* ============================================================
   RANDOM QUESTION
   ============================================================ */

export function getRandomQuestion(
  role = "Frontend Developer",
  difficulty = "Beginner",
  usedQuestions = [],
) {
  const questions = getQuestionsForRole(role, difficulty);

  if (!questions.length) {
    return null;
  }

  const used = new Set(
    usedQuestions.map((q) => String(q).trim().toLowerCase()),
  );

  const availableQuestions = questions.filter((item) => {
    const question = extractQuestion(item);

    return question && !used.has(String(question).trim().toLowerCase());
  });

  const pool = availableQuestions.length > 0 ? availableQuestions : questions;

  const randomIndex = Math.floor(Math.random() * pool.length);

  return extractQuestion(pool[randomIndex]);
}

/* ============================================================
   GEMINI GENERATION
   ============================================================ */

async function generateWithGemini(prompt) {
  if (!API_KEY || !genAI) {
    throw new Error(
      "Gemini API key is missing. Add VITE_GEMINI_API_KEY to frontend/.env",
    );
  }

  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
  });

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`🤖 Gemini request attempt ${attempt} using ${GEMINI_MODEL}`);

      const result = await model.generateContent(prompt);

      const response = result.response;
      const text = response.text();

      if (!text || !text.trim()) {
        throw new Error("Gemini returned an empty response.");
      }

      return text.trim();
    } catch (error) {
      console.error(`❌ Gemini attempt ${attempt}:`, getErrorMessage(error));

      if (isQuotaError(error)) {
        if (attempt < 2) {
          await sleep(1500);
          continue;
        }

        throw new Error(
          "Gemini API quota/rate limit reached. Please try again later.",
        );
      }

      if (isModelError(error)) {
        throw new Error(
          `Gemini model "${GEMINI_MODEL}" is unavailable for this API key.`,
        );
      }

      throw error;
    }
  }

  throw new Error("Gemini request failed.");
}

/* ============================================================
   GENERATE QUESTION
   ============================================================ */

export async function generateQuestion(
  role = "Frontend Developer",
  difficulty = "Beginner",
  usedQuestions = [],
) {
  /* ----------------------------------------------------------
     First use question bank
  ---------------------------------------------------------- */

  const localQuestion = getRandomQuestion(role, difficulty, usedQuestions);

  if (localQuestion) {
    console.log("✅ Question loaded from question bank");
    return localQuestion;
  }

  /* ----------------------------------------------------------
     Gemini fallback
  ---------------------------------------------------------- */

  const prompt = `
You are a professional technical interviewer.

Generate ONE technical interview question.

Role: ${role}
Difficulty: ${difficulty}

Rules:
- Return ONLY the interview question.
- Do not write "Question:".
- Do not provide the answer.
- Do not provide explanation.
- Make it relevant to the selected role.
`;

  try {
    const question = await generateWithGemini(prompt);

    return question.replace(/^question\s*:\s*/i, "").trim();
  } catch (error) {
    console.error("❌ Generate Question Error:", error);

    return getFallbackQuestion(role, difficulty);
  }
}

/* ============================================================
   FALLBACK QUESTIONS
   ============================================================ */

function getFallbackQuestion(role, difficulty) {
  const fallbackQuestions = {
    "Frontend Developer": {
      Beginner: "What is the difference between HTML, CSS, and JavaScript?",

      Intermediate:
        "What is the difference between localStorage, sessionStorage, and cookies?",

      Advanced:
        "How would you optimize the performance of a large frontend application?",
    },

    "React Developer": {
      Beginner: "What are props and state in React?",

      Intermediate: "Explain the difference between useMemo and useCallback.",

      Advanced:
        "How would you design a scalable React application with complex state management?",
    },

    "JavaScript Developer": {
      Beginner: "What is the difference between let, const, and var?",

      Intermediate: "Explain closures in JavaScript with an example.",

      Advanced:
        "Explain the JavaScript event loop and how asynchronous operations are handled.",
    },

    "Backend Developer": {
      Beginner:
        "What is the difference between frontend and backend development?",

      Intermediate: "What is middleware in a backend application?",

      Advanced:
        "How would you design a scalable REST API for millions of users?",
    },

    "Node.js Developer": {
      Beginner: "What is Node.js and why is it used?",

      Intermediate: "Explain the Node.js event loop.",

      Advanced:
        "How would you improve the scalability of a Node.js application?",
    },

    "Java Developer": {
      Beginner: "What is the difference between a class and an object in Java?",

      Intermediate:
        "Explain inheritance, polymorphism, encapsulation, and abstraction.",

      Advanced: "How would you design a scalable Java backend application?",
    },

    "Python Developer": {
      Beginner: "What are lists, tuples, sets, and dictionaries in Python?",

      Intermediate: "Explain decorators and generators in Python.",

      Advanced:
        "How would you optimize a Python application that processes millions of records?",
    },

    "Full Stack Developer": {
      Beginner:
        "What is the difference between frontend, backend, and database layers?",

      Intermediate:
        "How does a request travel from a React frontend to a backend API and database?",

      Advanced:
        "How would you architect a scalable full-stack web application?",
    },
  };

  return (
    fallbackQuestions[role]?.[difficulty] ||
    "Explain an important technical concept related to your selected role."
  );
}

/* ============================================================
   EVALUATE ANSWER
   ============================================================ */

export async function evaluateAnswer(question, answer) {
  if (!question) {
    throw new Error("Question is missing.");
  }

  const finalAnswer = answer?.trim() || "No answer submitted.";

  const prompt = `
You are a strict but fair technical interviewer.

Evaluate the candidate's answer.

Question:
${question}

Candidate Answer:
${finalAnswer}

Return ONLY valid JSON.

Format:
{
  "score": 0,
  "strengths": [],
  "improvements": [],
  "feedback": "",
  "correctAnswer": ""
}

Rules:
1. Score must be between 0 and 10.
2. Evaluate technical correctness.
3. Evaluate clarity.
4. Evaluate completeness.
5. Do not invent candidate experience.
6. strengths should contain 2-4 points.
7. improvements should contain 2-4 points.
8. feedback should be practical.
9. correctAnswer should explain an ideal answer.
10. Return JSON only.
`;

  try {
    const text = await generateWithGemini(prompt);

    return parseEvaluation(text);
  } catch (error) {
    console.error("❌ Evaluation Error:", error);

    return {
      score: 0,

      strengths: ["Answer was submitted successfully."],

      improvements: [
        "AI evaluation is temporarily unavailable.",
        "Please try again later.",
      ],

      feedback: "The AI evaluation service is temporarily unavailable.",

      correctAnswer:
        "Please try again when the AI evaluation service is available.",
    };
  }
}

/* ============================================================
   PARSE GEMINI JSON
   ============================================================ */

function parseEvaluation(text) {
  let cleanText = String(text || "").trim();

  cleanText = cleanText
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleanText);

    return {
      score: normalizeScore(parsed.score),

      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],

      improvements: Array.isArray(parsed.improvements)
        ? parsed.improvements
        : [],

      feedback: parsed.feedback || "No detailed feedback was provided.",

      correctAnswer: parsed.correctAnswer || "No ideal answer was provided.",
    };
  } catch (error) {
    console.error("❌ Could not parse Gemini evaluation:", error);

    return {
      score: 0,

      strengths: [],

      improvements: ["The AI response could not be parsed correctly."],

      feedback: cleanText,

      correctAnswer:
        "Please review the question and provide a technically complete answer.",
    };
  }
}

/* ============================================================
   NORMALIZE SCORE
   ============================================================ */

function normalizeScore(score) {
  const number = Number(score);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.max(0, Math.min(10, number));
}

/* ============================================================
   INTERVIEW SESSION
   ============================================================ */

let interviewSession = {
  role: "Frontend Developer",
  difficulty: "Beginner",
  totalQuestions: 5,
  currentQuestion: 0,
  questions: [],
  answers: [],
  scores: [],
  startedAt: null,
};

/* ============================================================
   START INTERVIEW SESSION
   ============================================================ */

export async function startInterviewSession(
  role = "Frontend Developer",
  difficulty = "Beginner",
  totalQuestions = 5,
) {
  const questions = [];

  const availableQuestions = getQuestionsForRole(role, difficulty);

  /* ----------------------------------------------------------
     Shuffle question bank
  ---------------------------------------------------------- */

  const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);

  /* ----------------------------------------------------------
     Add local questions
  ---------------------------------------------------------- */

  for (let i = 0; i < Math.min(totalQuestions, shuffled.length); i++) {
    const question = extractQuestion(shuffled[i]);

    if (question) {
      questions.push(question);
    }
  }

  /* ----------------------------------------------------------
     Generate additional questions if needed
  ---------------------------------------------------------- */

  let attempts = 0;

  while (questions.length < totalQuestions && attempts < 10) {
    attempts++;

    const question = await generateQuestion(role, difficulty, questions);

    if (!question) {
      break;
    }

    const exists = questions.some(
      (q) => q.trim().toLowerCase() === question.trim().toLowerCase(),
    );

    if (!exists) {
      questions.push(question);
    }
  }

  interviewSession = {
    role,
    difficulty,

    totalQuestions: questions.length || totalQuestions,

    currentQuestion: 0,

    questions,

    answers: [],

    scores: [],

    startedAt: Date.now(),
  };

  return {
    success: true,
    ...interviewSession,
    firstQuestion: questions[0] || null,
  };
}

/* ============================================================
   GET NEXT INTERVIEW QUESTION
   ============================================================ */

export async function getNextInterviewQuestion() {
  const session = interviewSession;

  if (!session.questions.length) {
    return generateQuestion(session.role, session.difficulty);
  }

  if (session.currentQuestion >= session.questions.length) {
    return null;
  }

  const question = session.questions[session.currentQuestion];

  session.currentQuestion += 1;

  return question;
}

/* ============================================================
   SAVE INTERVIEW ANSWER
   ============================================================ */

export function saveInterviewAnswer(answer, score = null) {
  interviewSession.answers.push({
    answer,
    score,
  });

  if (score !== null) {
    interviewSession.scores.push(Number(score));
  }

  return interviewSession;
}

/* ============================================================
   GET INTERVIEW SESSION
   ============================================================ */

export function getInterviewSession() {
  return interviewSession;
}

/* ============================================================
   RESET INTERVIEW SESSION
   ============================================================ */

export function resetInterviewSession() {
  interviewSession = {
    role: "Frontend Developer",
    difficulty: "Beginner",
    totalQuestions: 5,
    currentQuestion: 0,
    questions: [],
    answers: [],
    scores: [],
    startedAt: null,
  };

  return interviewSession;
}

/* ============================================================
   API CONFIG
   ============================================================ */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ============================================================
   GET AUTH TOKEN
   ============================================================ */

function getToken() {
  return localStorage.getItem("token");
}

/* ============================================================
   API REQUEST HELPER
   ============================================================ */

async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...(options.headers || {}),
      },
    });

    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `Request failed with status ${response.status}`,
      );
    }

    return data;
  } catch (error) {
    console.error(`❌ API Error ${endpoint}:`, error);

    throw error;
  }
}

/* ============================================================
   CREATE SCHEDULED INTERVIEW
   ============================================================ */

export async function createScheduledInterview(interviewData) {
  return apiRequest("/api/interviews", {
    method: "POST",

    body: JSON.stringify(interviewData),
  });
}

/* ============================================================
   GET MY INTERVIEWS
   ============================================================ */

export async function getMyInterviews() {
  const data = await apiRequest("/api/interviews/my", {
    method: "GET",
  });

  /*
    Return the array directly because
    Interviews.jsx uses:

    setInterviews(data || [])
  */

  return data?.interviews || data?.data || [];
}

/* ============================================================
   GET UPCOMING INTERVIEWS
   ============================================================ */

export async function getUpcomingInterviews() {
  try {
    const data = await apiRequest("/api/interviews/upcoming", {
      method: "GET",
    });

    return data?.interviews || data?.data || [];
  } catch (error) {
    console.warn("⚠️ Failed to load upcoming interviews:", error);

    return [];
  }
}

/* ============================================================
   GET SINGLE INTERVIEW
   ============================================================ */

export async function getInterviewById(interviewId) {
  if (!interviewId) {
    throw new Error("Interview ID is required.");
  }

  return apiRequest(`/api/interviews/${interviewId}`, {
    method: "GET",
  });
}

/* ============================================================
   GET SCHEDULED INTERVIEW
   ------------------------------------------------------------
   Alias used by InterviewDetails.jsx
   ============================================================ */

export async function getScheduledInterview(interviewId) {
  if (!interviewId) {
    throw new Error("Interview ID is required.");
  }

  return apiRequest(`/api/interviews/${interviewId}`, {
    method: "GET",
  });
}

/* ============================================================
   UPDATE INTERVIEW
   ============================================================ */

export async function updateInterview(interviewId, interviewData) {
  if (!interviewId) {
    throw new Error("Interview ID is required.");
  }

  return apiRequest(`/api/interviews/${interviewId}`, {
    method: "PUT",

    body: JSON.stringify(interviewData),
  });
}

/* ============================================================
   DELETE INTERVIEW
   ============================================================ */

export async function deleteInterview(interviewId) {
  if (!interviewId) {
    throw new Error("Interview ID is required.");
  }

  return apiRequest(`/api/interviews/${interviewId}`, {
    method: "DELETE",
  });
}

/* ============================================================
   CANCEL INTERVIEW
   ============================================================ */

export async function cancelInterview(interviewId) {
  if (!interviewId) {
    throw new Error("Interview ID is required.");
  }

  return apiRequest(`/api/interviews/${interviewId}/cancel`, {
    method: "PATCH",
  });
}

/* ============================================================
   CANCEL SCHEDULED INTERVIEW
   ------------------------------------------------------------
   Alias used by InterviewDetails.jsx
   ============================================================ */

export async function cancelScheduledInterview(interviewId) {
  if (!interviewId) {
    throw new Error("Interview ID is required.");
  }

  return apiRequest(`/api/interviews/${interviewId}/cancel`, {
    method: "PATCH",
  });
}

/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

export default {
  /* AI Interview */

  generateQuestion,

  evaluateAnswer,

  getRandomQuestion,

  startInterviewSession,

  getNextInterviewQuestion,

  saveInterviewAnswer,

  getInterviewSession,

  resetInterviewSession,

  /* Scheduled Interviews */

  createScheduledInterview,

  getMyInterviews,

  getUpcomingInterviews,

  getInterviewById,

  getScheduledInterview,

  updateInterview,

  deleteInterview,

  cancelInterview,

  cancelScheduledInterview,
};
