import React, { useState, useEffect } from "react";
import "../App.css";

const Clock = () => {
    const [timeIST, setTimeIST] = useState(new Date());
    const [timeAEST, setTimeAEST] = useState(new Date());
  
    useEffect(() => {
      const updateTime = () => {
        const nowUTC = new Date();
  
        // **IST (UTC+5:30) - No DST**
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istTime = new Date(nowUTC.getTime() + istOffset);
        setTimeIST(istTime);
  
        // **AEST (Melbourne) - Adjust for DST**
        const aestStandardOffset = 10 * 60 * 60 * 1000; // UTC+10
        const aestDstOffset = 11 * 60 * 60 * 1000; // UTC+11 (DST)
  
        // DST for Melbourne (First Sunday of October → First Sunday of April)
        const year = istTime.getFullYear();
        const dstStart = new Date(year, 9, 1); // October 1st
        while (dstStart.getDay() !== 0) dstStart.setDate(dstStart.getDate() + 1); // Move to first Sunday
  
        const dstEnd = new Date(year, 3, 1); // April 1st
        while (dstEnd.getDay() !== 0) dstEnd.setDate(dstEnd.getDate() + 1); // Move to first Sunday
  
        const isDST = nowUTC >= dstStart && nowUTC < dstEnd;
        const aestTime = new Date(nowUTC.getTime() + (isDST ? aestDstOffset : aestStandardOffset));
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
      <div className="clock-sidebar">
        <h3>Time Zones</h3>
  
        {/* IST Analog Clock */}
        <div className="analog-clock">
          <div className="clock-face">
            <div className="hand hour-hand" style={{ transform: `rotate(${(timeIST.getHours() % 12) * 30 + timeIST.getMinutes() * 0.5}deg)` }}></div>
            <div className="hand minute-hand" style={{ transform: `rotate(${timeIST.getMinutes() * 6}deg)` }}></div>
            <div className="hand second-hand" style={{ transform: `rotate(${timeIST.getSeconds() * 6}deg)` }}></div>
          </div>
          <p className="clock-label">IST</p>
        </div>
        <p className="clock">IST: {formatTime(timeIST)}</p>
  
        {/* AEST Analog Clock */}
        <div className="analog-clock">
          <div className="clock-face">
            <div className="hand hour-hand" style={{ transform: `rotate(${(timeAEST.getHours() % 12) * 30 + timeAEST.getMinutes() * 0.5}deg)` }}></div>
            <div className="hand minute-hand" style={{ transform: `rotate(${timeAEST.getMinutes() * 6}deg)` }}></div>
            <div className="hand second-hand" style={{ transform: `rotate(${timeAEST.getSeconds() * 6}deg)` }}></div>
          </div>
          <p className="clock-label">AEST</p>
        </div>
        <p className="clock">AEST: {formatTime(timeAEST)}</p>
      </div>
    );
  };
  
  export default Clock;
  
