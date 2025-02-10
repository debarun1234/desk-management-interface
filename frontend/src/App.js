import React, { useState } from "react";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import DeskGrid from "./components/Deskgrid.js";
import SearchBar from "./components/SearchBar.js";
import "./App.css";

function App() {
  const [selectedFloor, setSelectedFloor] = useState("L2"); // Default Floor
  const [highlightedDesk, setHighlightedDesk] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");  // <-- Fix: Add this

  return (
    <div>
      <Header selectedFloor={selectedFloor} setSelectedFloor={setSelectedFloor} />
      <div className="container">
        <div className="desk-area">
          <SearchBar setHighlightedDesk={setHighlightedDesk} 
          selectedFloor={selectedFloor}
          setErrorMessage={setErrorMessage}
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <DeskGrid highlightedDesk={highlightedDesk} selectedFloor={selectedFloor} />
        </div>
      </div>
      <Footer />
    </div>
  );
}


export default App;
