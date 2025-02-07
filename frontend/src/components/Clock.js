import React, { useState, useEffect } from "react";

const Clock = () => {
  const [timeIST, setTimeIST] = useState("");
  const [timeAEST, setTimeAEST] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Convert UTC to IST (UTC+5:30)
      const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      setTimeIST(istTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));

      // Convert UTC to AEST (UTC+10:00)
      const aestTime = new Date(now.getTime() + (10 * 60 * 60 * 1000));
      setTimeAEST(aestTime.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clock-container">
      <h3>Time Zones</h3>
      <div className="analog-clock">IST</div>
      <p className="clock">IST: {timeIST}</p>
      <div className="analog-clock">AEST</div>
      <p className="clock">AEST: {timeAEST}</p>
    </div>
  );
};

export default Clock;
