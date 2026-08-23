import { GoogleGenerativeAI } from "@google/generative-ai";

// =====================================================
// GEMINI API KEY
// =====================================================

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error(
    "❌ VITE_GEMINI_API_KEY is missing from frontend environment variables.",
  );
}

// =====================================================
// GEMINI CLIENT
// =====================================================

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// =====================================================
// ANALYZE RESUME WITH GEMINI
// =====================================================

export async function analyzeResumeWithAI(resumeText) {
  // ---------------------------------------------
  // Check API key
  // ---------------------------------------------

  if (!API_KEY || !genAI) {
    throw new Error(
      "Gemini API key is missing. Add VITE_GEMINI_API_KEY to Vercel Environment Variables.",
    );
  }

  // ---------------------------------------------
  // Check resume text
  // ---------------------------------------------

  if (!resumeText || resumeText.trim().length < 20) {
    throw new Error("Resume text is empty or too short for AI analysis.");
  }

  try {
    console.log("🤖 Starting Gemini Resume Analysis...");

    // ---------------------------------------------
    // Gemini Model
    // ---------------------------------------------

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // ---------------------------------------------
    // Prompt
    // ---------------------------------------------

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

Important Rules:

- Do not invent skills.
- Do not assume technologies that are not mentioned.
- Analyze only the provided resume.
- Keep the response professional.
- Keep the recommendations useful for a job seeker.
- Give a realistic score between 0 and 100.

Resume:

${resumeText}
`;

    console.log("📤 Sending resume to Gemini...");

    // ---------------------------------------------
    // Send request
    // ---------------------------------------------

    const result = await model.generateContent(prompt);

    const response = result.response;

    const text = response.text();

    // ---------------------------------------------
    // Validate response
    // ---------------------------------------------

    if (!text || !text.trim()) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("✅ Gemini Resume Analysis Completed");

    return text;
  } catch (error) {
    console.error("❌ GEMINI API ERROR:", error);

    const errorMessage =
      error?.message ||
      error?.errorDetails?.[0]?.message ||
      "Unknown Gemini API error";

    console.error("❌ Gemini Error Message:", errorMessage);

    const message = errorMessage.toLowerCase();

    // =================================================
    // 503 - MODEL BUSY / HIGH DEMAND
    // =================================================

    if (
      message.includes("503") ||
      message.includes("high demand") ||
      message.includes("unavailable") ||
      message.includes("overloaded")
    ) {
      throw new Error(
        "Gemini AI is temporarily busy. Please wait a few seconds and try again.",
      );
    }

    // =================================================
    // API KEY ERROR
    // =================================================

    if (
      message.includes("api key") ||
      message.includes("invalid api key") ||
      message.includes("api_key")
    ) {
      throw new Error(
        "Gemini API key is invalid. Check VITE_GEMINI_API_KEY in Vercel.",
      );
    }

    // =================================================
    // QUOTA / RATE LIMIT
    // =================================================

    if (
      message.includes("quota") ||
      message.includes("429") ||
      message.includes("rate limit")
    ) {
      throw new Error(
        "Gemini API quota or rate limit exceeded. Please try again later.",
      );
    }

    // =================================================
    // MODEL NOT FOUND
    // =================================================

    if (
      message.includes("404") ||
      message.includes("not found") ||
      message.includes("model")
    ) {
      throw new Error(
        "Gemini model is unavailable. Please check the configured Gemini model.",
      );
    }

    // =================================================
    // PERMISSION ERROR
    // =================================================

    if (
      message.includes("403") ||
      message.includes("permission") ||
      message.includes("permission denied")
    ) {
      throw new Error(
        "Gemini API permission denied. Check your API key and Google AI project.",
      );
    }

    // =================================================
    // NETWORK ERROR
    // =================================================

    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("failed to fetch")
    ) {
      throw new Error(
        "Unable to connect to Gemini AI. Please check your internet connection and try again.",
      );
    }

    // =================================================
    // GENERIC ERROR
    // =================================================

    throw new Error(`Gemini AI analysis failed: ${errorMessage}`);
  }
}
