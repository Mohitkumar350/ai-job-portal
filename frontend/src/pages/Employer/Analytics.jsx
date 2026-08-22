import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getEmployerAnalytics } from "../../services/analyticsService";
import "./Analytics.css";

const ranges = [
  ["7d", "7 Days"],
  ["30d", "30 Days"],
  ["90d", "90 Days"],
  ["all", "All Time"],
];
const statusLabels = {
  APPLIED: "Applied",
  UNDER_REVIEW: "Under Review",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  SELECTED: "Selected",
  REJECTED: "Rejected",
};

function Analytics() {
  const [range, setRange] = useState("30d");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (selectedRange = range) => {
    try {
      setLoading(true);
      setError("");
      setData(await getEmployerAnalytics(selectedRange));
    } catch (err) {
      setError("Unable to load analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [range]);

  if (loading)
    return (
      <main className="analytics-page">
        <div className="analytics-loading">
          Loading recruitment analytics...
        </div>
      </main>
    );
  if (error)
    return (
      <main className="analytics-page">
        <div className="analytics-error">
          <p>{error}</p>
          <button onClick={() => load()}>Retry</button>
        </div>
      </main>
    );
  const summary = data.summary;
  const hasData = summary.totalJobs > 0 || summary.totalApplications > 0;

  return (
    <main className="analytics-page">
      <div className="analytics-header">
        <div>
          <p className="eyebrow">Employer workspace</p>
          <h1>Recruitment Analytics</h1>
          <p>Understand how your jobs are performing.</p>
        </div>
        <Link to="/employer/dashboard">Back to dashboard</Link>
      </div>
      <div className="analytics-filters">
        {ranges.map(([value, label]) => (
          <button
            className={range === value ? "active" : ""}
            key={value}
            onClick={() => setRange(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {!hasData ? (
        <div className="analytics-empty">
          <h2>No recruitment data available yet.</h2>
          <p>Post a job and start receiving applications to see analytics.</p>
          <Link to="/employer/jobs/new">Post a job</Link>
        </div>
      ) : (
        <>
          <section className="analytics-summary">
            {[
              ["Total Jobs", summary.totalJobs],
              ["Active Jobs", summary.activeJobs],
              ["Applications", summary.totalApplications],
              ["Under Review", summary.underReview],
              ["Interviews", summary.interviews],
              ["Selected", summary.selected],
              ["Rejected", summary.rejected],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </section>
          <section className="analytics-grid">
            <div className="analytics-panel">
              <h2>Application Trend</h2>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data.trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="analytics-panel">
              <h2>Applications by Job</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.jobs}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" hide />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#0f766e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="analytics-grid">
            <div className="analytics-panel">
              <h2>Status Distribution</h2>
              <div className="status-bars">
                {Object.entries(data.statuses).map(([status, count]) => (
                  <div className="status-bar-row" key={status}>
                    <span>{statusLabels[status]}</span>
                    <div>
                      <i
                        style={{
                          width: `${summary.totalApplications ? (count / summary.totalApplications) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="analytics-panel">
              <h2>Interview Overview</h2>
              <div className="interview-metrics">
                <div>
                  <strong>{data.interviews.total}</strong>
                  <span>Total</span>
                </div>
                <div>
                  <strong>{data.interviews.upcoming}</strong>
                  <span>Upcoming</span>
                </div>
                <div>
                  <strong>{data.interviews.completed}</strong>
                  <span>Completed</span>
                </div>
                <div>
                  <strong>{data.interviews.cancelled}</strong>
                  <span>Cancelled</span>
                </div>
              </div>
              <p className="rate">
                Selection rate: <strong>{summary.selectionRate}%</strong>
              </p>
              <p className="rate">
                Interview rate: <strong>{summary.interviewRate}%</strong>
              </p>
            </div>
          </section>
          <section className="analytics-panel">
            <h2>Job Performance</h2>
            <div className="performance-list">
              {data.jobs.map((job) => (
                <article key={job.jobId}>
                  <div>
                    <h3>{job.title}</h3>
                    <p>{job.company}</p>
                  </div>
                  <span>
                    Applications <strong>{job.applications}</strong>
                  </span>
                  <span>
                    Interviews <strong>{job.interviews}</strong>
                  </span>
                  <span>
                    Selected <strong>{job.selected}</strong>
                  </span>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default Analytics;
