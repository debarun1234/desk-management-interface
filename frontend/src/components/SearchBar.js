import React, { useState } from "react";
import axios from "axios";

const SearchBar = ({ setHighlightedDesk }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const searchUser = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/search/${searchQuery}`);
      if (res.data.desk_id) {
        setHighlightedDesk(res.data.desk_id);

        // Scroll to desk
        const deskElement = document.getElementById(res.data.desk_id);
        if (deskElement) {
          deskElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        // Remove highlight after 5 seconds
        setTimeout(() => setHighlightedDesk(null), 5000);
        setErrorMessage(""); // Clear error message
      } else {
        setErrorMessage("Person not found.");
        setHighlightedDesk(null);
      }
    } catch (error) {
      setErrorMessage("Person not found.");
      console.error("Search error:", error);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search team member..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={searchUser}>Search</button>
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
};

export default SearchBar;
