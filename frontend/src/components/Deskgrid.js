import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const DeskGrid = ({ selectedFloor, highlightedDesk }) => {
  const [desks, setDesks] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Fetch desks for the selected floor
  const fetchDesks = useCallback(async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/desks/${selectedFloor}`);
      if (res.data.desks) {
        setDesks(res.data.desks);
      } else {
        console.error("No desks data found for floor:", selectedFloor);
        setDesks({});
      }
    } catch (error) {
      console.error(`Error fetching desks for ${selectedFloor}:`, error);
      setDesks({});
    }
  }, [selectedFloor]);

  useEffect(() => {
    fetchDesks();

    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchDesks]);

  const updateDesk = async (deskId, action) => {
    let userName = "";
    if (action === "occupy") {
      userName = prompt("Enter your name:");
      if (!userName) return;
    }

    try {
      await axios.post(`http://127.0.0.1:5000/desk/${selectedFloor}/${deskId}`, {
        action,
        user: userName,
      });
      fetchDesks(); // Refresh desk data after update
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
      <h3>Current Floor: {selectedFloor}</h3>
      {Object.entries(groupedDesks).map(([techArea, deskList]) => (
        <div key={techArea} className="tech-area">
          <h3>{techArea}</h3>
          <div className="grid">
            {deskList.map(({ deskId, status, user }) => (
              <button
                key={deskId}
                id={deskId}
                className={`desk ${status === "available" ? "green" : "red"} ${
                  highlightedDesk === deskId ? "highlight" : ""
                }`}
                onClick={() => updateDesk(deskId, status === "available" ? "occupy" : "leave")}
              >
                {deskId} {user && `(${user})`}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑ Back to Top
        </button>
      )}
    </div>
  );
};

export default DeskGrid;
