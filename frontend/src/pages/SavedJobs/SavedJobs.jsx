import JobCard from "../../components/JobCard/JobCard";
import { useSavedJobs } from "../../context/SavedJobsContext";

import "./SavedJobs.css";

function SavedJobs() {
  const { savedJobs, loading } = useSavedJobs();

  if (loading) {
    return (
      <section className="saved-jobs-page">
        <div className="saved-header">
          <h1>❤️ Saved Jobs</h1>
          <p>Loading saved jobs...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="saved-jobs-page">
      <div className="saved-header">
        <h1>❤️ Saved Jobs</h1>
        <p>
          You have {savedJobs.length} saved job
          {savedJobs.length !== 1 ? "s" : ""}.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">❤️</div>
          <h2>No Saved Jobs</h2>
          <p>Click the heart icon on any job to save it here.</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {savedJobs.map((savedJob) => {
            const job = {
              id: savedJob.jobId,
              title: savedJob.title,
              company: savedJob.company,
              location: savedJob.location,
              salary: savedJob.salary,
              experience: savedJob.experience,
              type: savedJob.type,
              skills: savedJob.skills || [],
              posted: savedJob.posted,
              logo: savedJob.logo,
              description: savedJob.description,
              responsibilities: savedJob.responsibilities,
              requirements: savedJob.requirements,
            };

            return <JobCard key={savedJob._id || savedJob.jobId} job={job} />;
          })}
        </div>
      )}
    </section>
  );
}

export default SavedJobs;
