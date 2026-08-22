 import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import ReactMarkdown from "react-markdown";

import { analyzeResume } from "../../utils/resumeAnalyzer";
import { analyzeResumeWithAI } from "../../services/geminiService";

import "./ResumeAI.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function ResumeAI() {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [skillCount, setSkillCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================
  // EXTRACT TEXT FROM PDF
  // =========================================

  const extractTextFromPDF = async (pdfFile) => {
    const buffer = await pdfFile.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
    }).promise;

    let text = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const content = await page.getTextContent();

      text +=
        content.items
          .map((item) => item.str)
          .join(" ") + "\n";
    }

    return text;
  };

  // =========================================
  // ANALYZE RESUME
  // =========================================

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a PDF resume.");
      return;
    }

    setLoading(true);

    setScore(null);
    setSkillCount(0);
    setSuggestions([]);
    setAiResult("");

    try {
      const resumeText = await extractTextFromPDF(file);

      // =====================================
      // LOCAL ANALYSIS
      // =====================================

      const result = analyzeResume(resumeText);

      setScore(result.score);
      setSkillCount(result.skillCount);
      setSuggestions(result.suggestions);

      // =====================================
      // GEMINI AI ANALYSIS
      // =====================================

      try {
        const aiResponse =
          await analyzeResumeWithAI(resumeText);

        setAiResult(aiResponse);
      } catch (aiError) {
        console.error("Gemini Error:", aiError);

        setAiResult(
          "⚠️ AI analysis is currently unavailable. Local analysis completed successfully."
        );
      }
    } catch (error) {
      console.error(
        "Resume Analysis Error:",
        error
      );

      alert(
        "Unable to analyze the uploaded PDF."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="resume-page">

      <div className="resume-card">

        {/* HEADER */}

        <div className="resume-header">

          <div className="resume-icon">
            🤖
          </div>

          <h1>
            Resume AI Analyzer
          </h1>

          <p>
            Upload your resume and get
            AI-powered career insights.
          </p>

        </div>


        {/* UPLOAD */}

        <div className="upload-box">

          <div className="upload-icon">
            📄
          </div>

          <h3>
            Upload your Resume
          </h3>

          <p>
            PDF files only
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
          />

          {file && (
            <div className="selected-file">
              📄 {file.name}
            </div>
          )}

        </div>


        {/* ANALYZE BUTTON */}

        <button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={loading || !file}
        >
          {loading
            ? "🤖 Analyzing Resume..."
            : "✨ Analyze Resume"}
        </button>


        {/* LOCAL RESULT */}

        {score !== null && (

          <div className="local-analysis">

            <h2>
              📊 Resume Analysis
            </h2>


            <div className="score-section">

              <div
                className="score-circle"
              >
                {score}%
              </div>

              <div className="score-info">

                <h3>
                  Resume Score
                </h3>

                <p>
                  Skills Found:{" "}
                  <strong>
                    {skillCount}
                  </strong>
                </p>

              </div>

            </div>


            {/* SUGGESTIONS */}

            <div className="suggestions">

              <h3>
                💡 Suggestions
              </h3>

              {suggestions.length > 0 ? (

                <ul>

                  {suggestions.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}

                </ul>

              ) : (

                <div className="success-message">
                  🎉 Excellent Resume!
                  No major improvements
                  needed.
                </div>

              )}

            </div>

          </div>

        )}


        {/* GEMINI RESULT */}

        {aiResult && (

          <div className="ai-result">

            <div className="ai-result-header">

              <div className="ai-title-icon">
                🤖
              </div>

              <div>

                <h2>
                  Gemini AI Analysis
                </h2>

                <p>
                  AI-powered resume feedback
                </p>

              </div>

            </div>


            <div className="ai-content">

              <ReactMarkdown>
                {aiResult}
              </ReactMarkdown>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default ResumeAI;