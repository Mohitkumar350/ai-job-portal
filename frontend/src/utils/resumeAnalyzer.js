
export function analyzeResume(text) {
  let score = 50;

  const suggestions = [];

  const skills = [
    "html",
    "css",
    "javascript",
    "react",
    "node",
    "express",
    "mongodb",
    "git",
    "github",
  ];

  let skillCount = 0;

  const resumeText = text.toLowerCase();

  skills.forEach((skill) => {
    if (resumeText.includes(skill)) {
      skillCount++;
    }
  });

  // Add points for detected skills
  score += skillCount * 4;

  // Resume length
  if (text.length > 1500) {
    score += 10;
  } else {
    suggestions.push(
      "Resume content is too short."
    );
  }

  // Required sections
  if (!resumeText.includes("project")) {
    suggestions.push(
      "Add Projects section."
    );
  }

  if (!resumeText.includes("education")) {
    suggestions.push(
      "Add Education section."
    );
  }

  if (!resumeText.includes("skill")) {
    suggestions.push(
      "Add Skills section."
    );
  }

  if (!resumeText.includes("experience")) {
    suggestions.push(
      "Add Experience section."
    );
  }

  // Maximum score
  if (score > 100) {
    score = 100;
  }

  return {
    score,
    skillCount,
    suggestions,
  };
};
