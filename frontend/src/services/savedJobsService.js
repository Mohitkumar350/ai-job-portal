 const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/saved-jobs`;

/* =========================
   GET SAVED JOBS
========================= */

export async function getSavedJobs() {
  const token = localStorage.getItem("token");

  if (!token) {
    return [];
  }

  const response = await fetch(API_URL, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get saved jobs"
    );
  }

  return data;
}

/* =========================
   SAVE JOB
========================= */

export async function saveJob(job) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      experience: job.experience,
      type: job.type,
      skills: job.skills || [],
      posted: job.posted,
      logo: job.logo,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to save job"
    );
  }

  return data;
}

/* =========================
   REMOVE JOB
========================= */

export async function removeJob(jobId) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(
    `${API_URL}/${jobId}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to remove saved job"
    );
  }

  return data;
}