import { createContext, useContext, useEffect, useState } from "react";

import { getSavedJobs, saveJob, removeJob } from "../services/savedJobsService";

import { useAuth } from "./AuthContext";

const SavedJobsContext = createContext(null);

export function SavedJobsProvider({ children }) {
  const { currentUser } = useAuth();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD SAVED JOBS
  ========================= */

  useEffect(() => {
    const loadSavedJobs = async () => {
      if (!currentUser) {
        setSavedJobs([]);
        return;
      }

      try {
        setLoading(true);

        const jobs = await getSavedJobs();

        setSavedJobs(Array.isArray(jobs) ? jobs : []);
      } catch (error) {
        console.error("LOAD SAVED JOBS ERROR:", error);

        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadSavedJobs();
  }, [currentUser]);

  /* =========================
     CHECK SAVED
  ========================= */

  const isSaved = (jobId) => {
    return savedJobs.some((job) => String(job.jobId) === String(jobId));
  };

  /* =========================
     ADD
  ========================= */

  const addSavedJob = async (job) => {
    try {
      const data = await saveJob(job);

      if (data?.job) {
        setSavedJobs((prev) => [...prev, data.job]);
      }

      return true;
    } catch (error) {
      console.error("SAVE JOB ERROR:", error);

      alert(error.message || "Failed to save job");

      return false;
    }
  };

  /* =========================
     REMOVE
  ========================= */

  const removeSavedJob = async (jobId) => {
    try {
      await removeJob(jobId);

      setSavedJobs((prev) =>
        prev.filter((job) => String(job.jobId) !== String(jobId)),
      );

      return true;
    } catch (error) {
      console.error("REMOVE JOB ERROR:", error);

      alert(error.message || "Failed to remove job");

      return false;
    }
  };

  /* =========================
     TOGGLE
  ========================= */

  const toggleSavedJob = async (job) => {
    if (!currentUser) {
      alert("Please login first.");
      return false;
    }

    if (isSaved(job.id)) {
      return await removeSavedJob(job.id);
    }

    return await addSavedJob(job);
  };

  return (
    <SavedJobsContext.Provider
      value={{
        savedJobs,
        loading,
        isSaved,
        addSavedJob,
        removeSavedJob,
        toggleSavedJob,
      }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  const context = useContext(SavedJobsContext);

  if (!context) {
    throw new Error("useSavedJobs must be used inside SavedJobsProvider");
  }

  return context;
}
