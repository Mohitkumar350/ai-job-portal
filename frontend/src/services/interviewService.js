import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
});

// ==========================
// Generate Interview Question
// ==========================
export async function generateQuestion(role, difficulty) {
  try {
    const prompt = `
You are a senior technical interviewer.

Job Role: ${role}
Difficulty: ${difficulty}

Generate ONE interview question only.

Rules:
- Return only the interview question.
- Do not provide the answer.
- Do not number it.
- Keep the question short and professional.
`;

    const result = await model.generateContent(prompt);

    return result.response.text().trim();
  } catch (error) {
    console.error("Generate Question Error:", error);
    throw new Error("Unable to generate interview question.");
  }
}

// ==========================
// Evaluate Answer
// ==========================
export async function evaluateAnswer(question, answer) {
  try {
    const prompt = `
You are an experienced software engineering interviewer.

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate the candidate's answer.

Return ONLY valid JSON in this format:

{
  "score": 8,
  "strengths": [
    "Good understanding of the topic",
    "Used correct technical terms"
  ],
  "improvements": [
    "Add more examples",
    "Explain the concept in more detail"
  ],
  "feedback": "Overall your answer is good but could include more technical depth.",
  "correctAnswer": "Provide the ideal interview answer in 4-6 sentences."
}

Rules:
- Return ONLY JSON.
- Do NOT use markdown.
- Do NOT wrap JSON inside \`\`\`.
- Score must be between 0 and 10.
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text().trim();

    // Remove markdown if Gemini adds it
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Evaluate Answer Error:", error);

    return {
      score: 0,
      strengths: [],
      improvements: [],
      feedback:
        "Unable to evaluate your answer at the moment. Please try again.",
      correctAnswer: "Not available.",
    };
  }
}

const SCHEDULING_API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/interviews`;

async function schedulingRequest(path = "", options = {}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Please login first.");
  const response = await fetch(`${SCHEDULING_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || "Interview request failed");
    error.status = response.status;
    throw error;
  }
  return data;
}

export const createScheduledInterview = (data) =>
  schedulingRequest("", { method: "POST", body: JSON.stringify(data) });
export const getUpcomingInterviews = () => schedulingRequest("/upcoming");
export const getMyInterviews = () => schedulingRequest("/my");
export const getScheduledInterview = (id) => schedulingRequest(`/${id}`);
export const updateScheduledInterview = (id, data) =>
  schedulingRequest(`/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const cancelScheduledInterview = (id) =>
  schedulingRequest(`/${id}/cancel`, { method: "PATCH" });
