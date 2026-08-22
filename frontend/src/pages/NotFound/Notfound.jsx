import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "100px 20px",
      }}
    >
      <h1>404</h1>
      <h2>Page Not Found</h2>

      <Link to="/">Go Back Home</Link>
    </div>
  );
}

export default NotFound;