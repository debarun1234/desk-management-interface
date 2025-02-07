import React, { useState, useEffect } from "react";
import axios from "axios";

const DeskGrid = ({ highlightedDesk }) => {
  const [desks, setDesks] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    fetchDesks();
    const handleScroll = () => {
      // Show the Back to Top button if scrolled more than 300px
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchDesks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/desks");
      setDesks(res.data.desks);
    } catch (error) {
      console.error("Error fetching desks:", error);
    }
  };

  const updateDesk = async (deskId, action) => {
    let userName = "";
    if (action === "occupy") {
      userName = prompt("Enter your name:");
      if (!userName) return;
    }

    try {
      await axios.post(`http://127.0.0.1:5000/desk/${deskId}`, { action, user: userName });
      fetchDesks();
    } catch (error) {
      console.error("Error updating desk:", error);
    }
  };

  // Group desks by tech area
  const groupedDesks = {};
  Object.entries(desks).forEach(([deskId, details]) => {
    if (!groupedDesks[details.tech_area]) {
      groupedDesks[details.tech_area] = [];
    }
    groupedDesks[details.tech_area].push({ deskId, ...details });
  });

  return (
    <div>
      {Object.entries(groupedDesks).map(([techArea, deskList]) => (
        <div key={techArea} className="tech-area">
          <h3>{techArea}</h3>
          <div className="grid">
            {deskList.map(({ deskId, status, user }) => (
              <button
                key={deskId}
                id={deskId}
                className={`desk ${status === "available" ? "green" : "red"} ${highlightedDesk === deskId ? "highlight" : ""}`}
                onClick={() => updateDesk(deskId, status === "available" ? "occupy" : "leave")}
              >
                {deskId} {user && `(${user})`}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Back to Top Button */}
      <button
        className={`back-to-top ${showBackToTop ? "show" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑ Back to Top
      </button>
    </div>
  );
};

export default DeskGrid;
