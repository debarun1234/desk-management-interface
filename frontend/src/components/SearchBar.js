import React, { useState } from "react";
import axios from "axios";

const SearchBar = ({ setHighlightedDesk, selectedFloor, setErrorMessage }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchUser = async () => {
    if (!searchQuery) {
      setErrorMessage("Please enter a name.");  // <-- Fix: Ensure this function exists
      return;
    }

    try {
      const res = await axios.get(`http://127.0.0.1:5000/search/${selectedFloor}/${searchQuery}`);
      if (res.data.desk_id) {
        setHighlightedDesk(res.data.desk_id);

        // Scroll to the found desk
        const deskElement = document.getElementById(res.data.desk_id);
        if (deskElement) {
          deskElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        // Highlight the desk for 5 seconds
        setTimeout(() => setHighlightedDesk(null), 5000);
        setErrorMessage(""); // Clear previous error message
      } else {
        setErrorMessage("Person not found.");
        setTimeout(() => setErrorMessage(""), 2000);
        setHighlightedDesk(null);
      }
    } catch (error) {
      setErrorMessage("Person not found.");
      console.error("Search error:", error);
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  // Listen for "Enter" key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchUser(); // Trigger search when Enter is pressed
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search team member..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button onClick={searchUser}>Search</button>
    </div>
  );
};

export default SearchBar;
