import { GoogleGenerativeAI } from "@google/generative-ai";

// =====================================================
// GEMINI API KEY
// =====================================================

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ VITE_GEMINI_API_KEY is missing from frontend/.env");
}

// =====================================================
// GEMINI CLIENT
// =====================================================

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// =====================================================
// ANALYZE RESUME WITH GEMINI
// =====================================================

export async function analyzeResumeWithAI(resumeText) {
  if (!API_KEY) {
    throw new Error(
      "Gemini API key is missing. Check your frontend .env file.",
    );
  }

  if (!resumeText || resumeText.trim().length < 20) {
    throw new Error("Resume text is empty or too short for AI analysis.");
  }

  try {
    console.log("🤖 Starting Gemini Resume Analysis...");

    // Current Flash model
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
    });

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

Important:
- Do not invent skills that are not present in the resume.
- Base your analysis only on the resume text.
- Keep the response professional and useful for a job seeker.

Resume:
${resumeText}
`;

    console.log("📤 Sending resume to Gemini...");

    const result = await model.generateContent(prompt);

    const response = result.response;

    const text = response.text();

    if (!text || !text.trim()) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("✅ Gemini Resume Analysis Completed");

    return text;
  } catch (error) {
    console.error("❌ GEMINI API ERROR:", error);

    // ==========================================
    // SHOW ACTUAL ERROR
    // ==========================================

    const errorMessage =
      error?.message ||
      error?.errorDetails?.[0]?.message ||
      "Unknown Gemini API error";

    console.error("❌ Gemini Error Message:", errorMessage);

    // API KEY ERROR
    if (
      errorMessage.toLowerCase().includes("api key") ||
      errorMessage.toLowerCase().includes("invalid")
    ) {
      throw new Error("Gemini API key is invalid. Check VITE_GEMINI_API_KEY.");
    }

    // QUOTA ERROR
    if (
      errorMessage.toLowerCase().includes("quota") ||
      errorMessage.toLowerCase().includes("429")
    ) {
      throw new Error("Gemini API quota exceeded. Please try again later.");
    }

    // MODEL ERROR
    if (
      errorMessage.toLowerCase().includes("model") ||
      errorMessage.toLowerCase().includes("404")
    ) {
      throw new Error(
        "Gemini model is unavailable. Please check the configured Gemini model.",
      );
    }

    // PERMISSION ERROR
    if (
      errorMessage.toLowerCase().includes("permission") ||
      errorMessage.toLowerCase().includes("403")
    ) {
      throw new Error(
        "Gemini API permission denied. Check your API key and project settings.",
      );
    }

    // OTHER ERROR
    throw new Error(`Gemini AI analysis failed: ${errorMessage}`);
  }
}
