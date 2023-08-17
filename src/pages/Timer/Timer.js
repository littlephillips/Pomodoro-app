// Timer.js
import React, { useState, useEffect } from 'react';
import alarmSound from '../../assests/alarmSound.wav'; 

// style
import '../../styles/Timer.css';



const Timer = () => {
  const [workTime, setWorkTime] = useState(1);
  const [breakTime, setBreakTime] = useState(1);
  const [isWorking, setIsWorking] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [tasks, setTasks] = useState([]);
  const audioRef = React.createRef();

  useEffect(() => {
    let interval;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      audioRef.current.play(); // Play notification sound
      setIsWorking(prevIsWorking => !prevIsWorking);
      setTimeLeft(isWorking ? breakTime * 60 : workTime * 60);
      setTasks(prevTasks => [...prevTasks, isWorking ? 'Work' : 'Break']);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, workTime, breakTime, isWorking, audioRef]);

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
      <div className="task-list">
        <h2>Task List</h2>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </div>
      <audio ref={audioRef} src={alarmSound}></audio>
    </div>
  );
};

export default Timer;
