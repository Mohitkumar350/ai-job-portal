import { GoogleGenerativeAI } from "@google/generative-ai";

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

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// =====================================================
// MODELS
// =====================================================

// Current production models.
// We try the primary model first and fallback if it
// temporarily fails with 503/availability errors.

const GEMINI_MODELS = ["gemini-3.6-flash"];

// =====================================================
// DELAY
// =====================================================

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =====================================================
// ERROR TYPE CHECK
// =====================================================

function isTemporaryError(error) {
  const message = error?.message || error?.errorDetails?.[0]?.message || "";

  const text = message.toLowerCase();

  return (
    text.includes("503") ||
    text.includes("high demand") ||
    text.includes("overloaded") ||
    text.includes("temporarily unavailable") ||
    text.includes("service unavailable") ||
    text.includes("429") ||
    text.includes("rate limit")
  );
}

// =====================================================
// ERROR MESSAGE
// =====================================================

function getGeminiErrorMessage(error) {
  return (
    error?.message ||
    error?.errorDetails?.[0]?.message ||
    "Unknown Gemini API error"
  );
}

// =====================================================
// ANALYZE RESUME
// =====================================================

export async function analyzeResumeWithAI(resumeText) {
  // ---------------------------------------------------
  // API KEY CHECK
  // ---------------------------------------------------

  if (!API_KEY || !genAI) {
    throw new Error(
      "Gemini API key is missing. Please configure VITE_GEMINI_API_KEY.",
    );
  }

  // ---------------------------------------------------
  // RESUME CHECK
  // ---------------------------------------------------

  if (!resumeText || resumeText.trim().length < 20) {
    throw new Error("Resume text is empty or too short for AI analysis.");
  }

  // ---------------------------------------------------
  // PROMPT
  // ---------------------------------------------------

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

  console.log("🤖 Starting Gemini Resume Analysis...");

  // ===================================================
  // TRY EACH MODEL
  // ===================================================

  let lastError = null;

  for (const modelName of GEMINI_MODELS) {
    console.log(`🤖 Trying Gemini model: ${modelName}`);

    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
      });

      // ------------------------------------------------
      // RETRY CURRENT MODEL
      // ------------------------------------------------

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(`📤 Gemini request: ${modelName} | Attempt ${attempt}`);

          const result = await model.generateContent(prompt);

          const response = result.response;

          const text = response.text();

          if (!text || !text.trim()) {
            throw new Error("Gemini returned an empty response.");
          }

          console.log(`✅ Gemini Resume Analysis Completed using ${modelName}`);

          return text;
        } catch (error) {
          lastError = error;

          const errorMessage = getGeminiErrorMessage(error);

          console.error(`❌ ${modelName} attempt ${attempt}:`, errorMessage);

          // --------------------------------------------
          // TEMPORARY ERROR
          // --------------------------------------------

          if (isTemporaryError(error)) {
            if (attempt < 2) {
              console.log(
                `⏳ ${modelName} temporarily unavailable. Retrying...`,
              );

              await sleep(1500);

              continue;
            }

            console.log(
              `⚠️ ${modelName} failed after retries. Trying fallback model...`,
            );

            break;
          }

          // --------------------------------------------
          // NON-TEMPORARY ERROR
          // --------------------------------------------

          const message = errorMessage.toLowerCase();

          // Invalid API key
          if (
            message.includes("api key") ||
            message.includes("invalid api key") ||
            message.includes("api_key")
          ) {
            throw new Error(
              "Gemini API key is invalid. Check VITE_GEMINI_API_KEY.",
            );
          }

          // Permission
          if (
            message.includes("403") ||
            message.includes("permission denied") ||
            message.includes("permission")
          ) {
            throw new Error(
              "Gemini API permission denied. Check your Google AI API key and project.",
            );
          }

          // Model unavailable
          if (
            message.includes("404") ||
            message.includes("not found") ||
            message.includes("no longer available")
          ) {
            console.warn(
              `⚠️ ${modelName} is unavailable. Trying next model...`,
            );

            break;
          }

          // Other error
          throw new Error(`Gemini AI analysis failed: ${errorMessage}`);
        }
      }
    } catch (error) {
      lastError = error;

      console.error(
        `❌ Model ${modelName} failed:`,
        getGeminiErrorMessage(error),
      );

      // Don't continue for authentication errors
      const message = getGeminiErrorMessage(error).toLowerCase();

      if (message.includes("api key") || message.includes("permission")) {
        throw error;
      }

      // Otherwise try next model
      continue;
    }
  }

  // ===================================================
  // ALL MODELS FAILED
  // ===================================================

  console.error("❌ All Gemini models failed.", lastError);

  const finalMessage = getGeminiErrorMessage(lastError);

  if (
    finalMessage.includes("503") ||
    finalMessage.toLowerCase().includes("high demand")
  ) {
    throw new Error(
      "Gemini AI is temporarily busy. Please wait 10-20 seconds and try again.",
    );
  }

  if (
    finalMessage.includes("429") ||
    finalMessage.toLowerCase().includes("quota")
  ) {
    throw new Error(
      "Gemini API quota/rate limit reached. Please try again later.",
    );
  }

  throw new Error(`Gemini AI analysis failed: ${finalMessage}`);
}
