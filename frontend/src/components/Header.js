import React from "react";
import anzLogo from "../assets/anz-logo.png";  // Add ANZ logo to `src/assets/`

const Header = ({ selectedFloor, setSelectedFloor }) => {
  return (
    <header className="header">
      <img src={anzLogo} alt="ANZ Logo" />
      <h1>ANZ Building - Acacia : Desk Management Portal</h1>
      <select className="floor-selector" value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)}>
        {[...Array(17)].map((_, i) => (
          <option key={i + 2} value={`L${i + 2}`}>
            Floor {i + 2}
          </option>
        ))}
      </select>
    </header>
  );
};

export default Header;
