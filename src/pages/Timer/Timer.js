import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [isWorking, setIsWorking] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(workTime * 60);

  useEffect(() => {
    let interval;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsWorking(prevIsWorking => !prevIsWorking);
      setTimeLeft(isWorking ? breakTime * 60 : workTime * 60);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, workTime, breakTime, isWorking]);

  // Format time function 
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds % 60).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  

  return (
    <div className="timer">
      <h1>{isWorking ? 'Work' : 'Break'} Timer</h1>
      <div className="time">{formatTime(timeLeft)}</div>
      <div className="controls">
        <button onClick={() => setIsActive(!isActive)}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => setTimeLeft(isWorking ? workTime * 60 : breakTime * 60)}>
          Reset
        </button>
      </div>
    </div>
  );
  
};

export default Timer;
