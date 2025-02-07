import React, { useState, useEffect } from "react";
import "../App.css"; // Ensure to add new styles for the clock visuals

const Clock = () => {
  const [timeIST, setTimeIST] = useState(new Date());
  const [timeAEST, setTimeAEST] = useState(new Date());

  useEffect(() => {
    const updateTime = () => {
      const nowUTC = new Date();

      // Convert UTC to IST (UTC+5:30)
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istTime = new Date(nowUTC.getTime() + istOffset);
      setTimeIST(istTime);

      // Convert UTC to AEST (UTC+10:00)
      const aestOffset = 10 * 60 * 60 * 1000;
      const aestTime = new Date(nowUTC.getTime() + aestOffset);
      setTimeAEST(aestTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="clock-container">
      <h3>Time Zones</h3>
      <div className="analog-clock">
        <div className="clock-face">
          <div
            className="hand hour-hand"
            style={{ transform: `rotate(${(timeIST.getHours() % 12) * 30 + timeIST.getMinutes() * 0.5}deg)` }}
          ></div>
          <div
            className="hand minute-hand"
            style={{ transform: `rotate(${timeIST.getMinutes() * 6}deg)` }}
          ></div>
          <div
            className="hand second-hand"
            style={{ transform: `rotate(${timeIST.getSeconds() * 6}deg)` }}
          ></div>
        </div>
        <p className="clock-label">IST</p>
      </div>
      <p className="clock">IST: {formatTime(timeIST)}</p>

      <div className="analog-clock">
        <div className="clock-face">
          <div
            className="hand hour-hand"
            style={{ transform: `rotate(${(timeAEST.getHours() % 12) * 30 + timeAEST.getMinutes() * 0.5}deg)` }}
          ></div>
          <div
            className="hand minute-hand"
            style={{ transform: `rotate(${timeAEST.getMinutes() * 6}deg)` }}
          ></div>
          <div
            className="hand second-hand"
            style={{ transform: `rotate(${timeAEST.getSeconds() * 6}deg)` }}
          ></div>
        </div>
        <p className="clock-label">AEST</p>
      </div>
      <p className="clock">AEST: {formatTime(timeAEST)}</p>
    </div>
  );
};

export default Clock;
