import { GoogleGenAI } from "@google/genai";

// =====================================================
// GEMINI CONFIG
// =====================================================

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error(
    "❌ VITE_GEMINI_API_KEY is missing from environment variables.",
  );
}

// =====================================================
// GEMINI CLIENT
// =====================================================

const ai = API_KEY
  ? new GoogleGenAI({
      apiKey: API_KEY,
    })
  : null;

// =====================================================
// GEMINI MODEL
// =====================================================

const GEMINI_MODEL = "gemini-3.6-flash";

// =====================================================
// HELPER
// =====================================================

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// =====================================================
// ERROR MESSAGE
// =====================================================

function getErrorMessage(error) {
  return (
    error?.message ||
    error?.errorDetails?.[0]?.message ||
    "Unknown Gemini API error"
  );
}

// =====================================================
// TEMPORARY ERROR
// =====================================================

function isTemporaryError(error) {
  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("429") ||
    message.includes("500") ||
    message.includes("503") ||
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("overloaded") ||
    message.includes("high demand") ||
    message.includes("temporarily unavailable")
  );
}

// =====================================================
// NORMALIZE ERROR
// =====================================================

function normalizeGeminiError(error) {
  const message = getErrorMessage(error);
  const lower = message.toLowerCase();

  if (
    lower.includes("api key") ||
    lower.includes("invalid api key") ||
    lower.includes("api_key")
  ) {
    return new Error(
      "Gemini API key is invalid or missing. Check VITE_GEMINI_API_KEY.",
    );
  }

  if (
    lower.includes("403") ||
    lower.includes("permission denied") ||
    lower.includes("permission")
  ) {
    return new Error(
      "Gemini API permission denied. Check your Google AI API key.",
    );
  }

  if (lower.includes("404") || lower.includes("not found")) {
    return new Error("Gemini model is unavailable for this API account.");
  }

  if (
    lower.includes("429") ||
    lower.includes("quota") ||
    lower.includes("rate limit")
  ) {
    return new Error(
      "Gemini API quota/rate limit reached. Please try again later.",
    );
  }

  if (
    lower.includes("503") ||
    lower.includes("overloaded") ||
    lower.includes("high demand") ||
    lower.includes("temporarily unavailable")
  ) {
    return new Error("Gemini AI is temporarily busy. Please try again.");
  }

  return new Error(`Gemini AI error: ${message}`);
}

// =====================================================
// GENERATE CONTENT
// =====================================================

async function generateContent(prompt, maxRetries = 3) {
  if (!API_KEY || !ai) {
    throw new Error(
      "Gemini API key is missing. Configure VITE_GEMINI_API_KEY.",
    );
  }

  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `🤖 Gemini request | ${GEMINI_MODEL} | Attempt ${attempt}/${maxRetries}`,
      );

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = response.text?.trim();

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      console.log("✅ Gemini response received");

      return text;
    } catch (error) {
      lastError = error;

      console.error(`❌ Gemini attempt ${attempt}:`, getErrorMessage(error));

      if (isTemporaryError(error) && attempt < maxRetries) {
        const waitTime = attempt * 2000;

        console.log(`⏳ Retrying Gemini in ${waitTime}ms...`);

        await sleep(waitTime);
        continue;
      }

      if (!isTemporaryError(error)) {
        throw normalizeGeminiError(error);
      }
    }
  }

  throw normalizeGeminiError(lastError);
}

// =====================================================
// GENERATE INTERVIEW QUESTION
// =====================================================

export async function generateQuestion(role, difficulty) {
  if (!role) {
    throw new Error("Interview role is required.");
  }

  if (!difficulty) {
    throw new Error("Interview difficulty is required.");
  }

  const prompt = `
You are a professional technical interviewer.

Job Role: ${role}
Difficulty: ${difficulty}

Generate exactly ONE technical interview question.

Rules:
- Return ONLY the question.
- Do not provide the answer.
- Do not number the question.
- Do not ask multiple questions.
- Keep it clear and professional.
- Make it relevant to the selected role.
- The question should be suitable for a real technical interview.

Example format:

What is the difference between var, let, and const in JavaScript?
`;

  try {
    const question = await generateContent(prompt);

    return question.replace(/^["']|["']$/g, "").trim();
  } catch (error) {
    console.error("❌ Generate Question Error:", error);
    throw error;
  }
}

// =====================================================
// EVALUATE ANSWER
// =====================================================

export async function evaluateAnswer(question, answer) {
  if (!question) {
    throw new Error("Interview question is required.");
  }

  if (!answer || !answer.trim()) {
    answer = "No answer submitted.";
  }

  const prompt = `
You are an experienced software engineering interviewer.

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate the candidate's answer.

Return ONLY valid JSON.

Use exactly this structure:

{
  "score": 8,
  "strengths": [
    "Good understanding of the concept",
    "Used appropriate technical terminology"
  ],
  "improvements": [
    "Add a practical example",
    "Explain the concept in more technical depth"
  ],
  "feedback": "Overall feedback about the candidate's answer.",
  "correctAnswer": "An ideal interview answer in 4 to 6 sentences."
}

Rules:

- score must be an integer from 0 to 10.
- strengths must be an array.
- improvements must be an array.
- feedback must be a string.
- correctAnswer must be a string.
- Return ONLY JSON.
- Do not use Markdown.
- Do not use code fences.
`;

  try {
    const text = await generateContent(prompt);

    let cleanText = text.trim();

    // Remove accidental markdown fences
    cleanText = cleanText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const evaluation = JSON.parse(cleanText);

    const score = Number(evaluation.score);

    return {
      score: Number.isFinite(score)
        ? Math.max(0, Math.min(10, Math.round(score)))
        : 0,

      strengths: Array.isArray(evaluation.strengths)
        ? evaluation.strengths
        : [],

      improvements: Array.isArray(evaluation.improvements)
        ? evaluation.improvements
        : [],

      feedback:
        typeof evaluation.feedback === "string"
          ? evaluation.feedback
          : "No feedback available.",

      correctAnswer:
        typeof evaluation.correctAnswer === "string"
          ? evaluation.correctAnswer
          : "No ideal answer available.",
    };
  } catch (error) {
    console.error("❌ Evaluate Answer Error:", error);

    return {
      score: 0,
      strengths: [],
      improvements: [],
      feedback: error?.message || "Unable to evaluate the answer.",
      correctAnswer: "Not available.",
    };
  }
}

// =====================================================
// SCHEDULED INTERVIEW API
// =====================================================

const SCHEDULING_API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/interviews`;

// =====================================================
// SCHEDULING REQUEST
// =====================================================

async function schedulingRequest(path = "", options = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  try {
    const response = await fetch(`${SCHEDULING_API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
      const error = new Error(data.message || "Interview request failed");

      error.status = response.status;

      throw error;
    }

    return data;
  } catch (error) {
    console.error("❌ Scheduling Request Error:", error);

    throw error;
  }
}

// =====================================================
// SCHEDULED INTERVIEW FUNCTIONS
// =====================================================

export const createScheduledInterview = (data) =>
  schedulingRequest("", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getUpcomingInterviews = () => schedulingRequest("/upcoming");

export const getMyInterviews = () => schedulingRequest("/my");

export const getScheduledInterview = (id) => schedulingRequest(`/${id}`);

export const updateScheduledInterview = (id, data) =>
  schedulingRequest(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const cancelScheduledInterview = (id) =>
  schedulingRequest(`/${id}/cancel`, {
    method: "PATCH",
  });
