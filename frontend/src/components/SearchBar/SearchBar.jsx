 import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="search-bar">

      <div className="search-input">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search jobs, companies or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>

    </div>
  );
}

export default SearchBar;