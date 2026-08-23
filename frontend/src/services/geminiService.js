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
// ERROR MESSAGE
// =====================================================

function getGeminiErrorMessage(error) {
  return (
    error?.message ||
    error?.error?.message ||
    error?.errorDetails?.[0]?.message ||
    "Unknown Gemini API error"
  );
}

// =====================================================
// NORMALIZE ERROR
// =====================================================

function normalizeGeminiError(error) {
  const message = getGeminiErrorMessage(error);
  const lowerMessage = message.toLowerCase();

  // API KEY
  if (
    lowerMessage.includes("api key") ||
    lowerMessage.includes("invalid api key") ||
    lowerMessage.includes("api_key") ||
    lowerMessage.includes("unauthenticated")
  ) {
    return new Error(
      "Gemini API key is invalid or missing. Please check VITE_GEMINI_API_KEY.",
    );
  }

  // PERMISSION
  if (
    lowerMessage.includes("403") ||
    lowerMessage.includes("permission denied") ||
    lowerMessage.includes("permission")
  ) {
    return new Error(
      "Gemini API permission denied. Check your Google AI API key and project.",
    );
  }

  // MODEL
  if (
    lowerMessage.includes("404") ||
    lowerMessage.includes("not found") ||
    lowerMessage.includes("model not found") ||
    lowerMessage.includes("no longer available")
  ) {
    return new Error(
      `Gemini model ${GEMINI_MODEL} is unavailable for this API key.`,
    );
  }

  // RATE LIMIT
  if (
    lowerMessage.includes("429") ||
    lowerMessage.includes("rate limit") ||
    lowerMessage.includes("quota")
  ) {
    return new Error(
      "Gemini API quota or rate limit reached. Please try again later.",
    );
  }

  // SERVER
  if (
    lowerMessage.includes("500") ||
    lowerMessage.includes("503") ||
    lowerMessage.includes("overloaded") ||
    lowerMessage.includes("temporarily unavailable") ||
    lowerMessage.includes("service unavailable")
  ) {
    return new Error(
      "Gemini AI is temporarily unavailable. Please try again in a few seconds.",
    );
  }

  return new Error(`Gemini AI analysis failed: ${message}`);
}

// =====================================================
// GENERATE GEMINI CONTENT
// =====================================================

async function generateGeminiContent(prompt) {
  if (!API_KEY || !ai) {
    throw new Error(
      "Gemini API key is missing. Please configure VITE_GEMINI_API_KEY.",
    );
  }

  try {
    console.log(`🤖 Starting Gemini request using ${GEMINI_MODEL}...`);

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("✅ Gemini response received successfully.");

    return text;
  } catch (error) {
    console.error("❌ Gemini API Error:", error);

    throw normalizeGeminiError(error);
  }
}

// =====================================================
// ANALYZE RESUME WITH AI
// =====================================================

export async function analyzeResumeWithAI(resumeText) {
  // ===================================================
  // API KEY CHECK
  // ===================================================

  if (!API_KEY || !ai) {
    throw new Error(
      "Gemini API key is missing. Please configure VITE_GEMINI_API_KEY.",
    );
  }

  // ===================================================
  // RESUME CHECK
  // ===================================================

  if (!resumeText || resumeText.trim().length < 20) {
    throw new Error("Resume text is empty or too short for AI analysis.");
  }

  // ===================================================
  // PROMPT
  // ===================================================

  const prompt = `
You are an expert technical recruiter and ATS resume analyzer.

Analyze the following resume carefully.

Return the result using exactly this structure:

Overall Resume Score: XX/100

Candidate Summary:

Write a short professional summary of the candidate.

Technical Skills:

- List the important technical skills found in the resume.

Strengths:

- Give 3 to 5 important strengths.

Weaknesses:

- Give 3 to 5 realistic weaknesses or missing areas.

ATS Improvements:

- Give practical ATS optimization suggestions.

Project Improvements:

- Give practical improvements for the candidate's projects.

Final Recommendation:

Tell the candidate what they should improve to become job-ready.

IMPORTANT RULES:

1. Do not invent skills.
2. Do not assume technologies that are not mentioned.
3. Analyze only the provided resume.
4. Give a realistic score between 0 and 100.
5. Keep the response professional.
6. Keep the response useful for a job seeker.
7. Do not mention that you are an AI.
8. Do not create fake experience.
9. Do not create fake certifications.
10. Do not create fake projects.

Resume:

${resumeText}
`;

  console.log("📄 Starting Gemini Resume Analysis...");

  try {
    const result = await generateGeminiContent(prompt);

    console.log("✅ Gemini Resume Analysis Completed.");

    return result;
  } catch (error) {
    console.error("❌ Resume Analysis Error:", error);

    throw new Error(error?.message || "Unable to analyze resume with Gemini.");
  }
}
