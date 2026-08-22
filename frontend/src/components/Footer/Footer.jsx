import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <h2>MohiJobs</h2>

          <p>
            Find your dream job with AI-powered recommendations, resume
            analysis, and interview preparation.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/companies">Companies</Link>
          <Link to="/resume-ai">Resume AI</Link>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>

          <p>Email:mohitkushwah849@gmail.com</p>
          <p>Phone: +91 9027415605</p>
        </div>
      </div>

      <hr />

      <p className="copyright">© 2026 MohiJobs. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
