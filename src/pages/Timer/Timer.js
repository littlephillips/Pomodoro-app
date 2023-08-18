import React, { useState, useEffect } from 'react';
import alarmSound from '../../assests/alarmSound.wav';

// style
import '../../styles/Timer.css'; 

const Timer = () => {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [workSessions, setWorkSessions] = useState(0);
  const [isWorking, setIsWorking] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [tasks, setTasks] = useState([]);
  const [offline, setOffline] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const audioRef = React.createRef();

  useEffect(() => {
    const handleNotificationPermission = () => {
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    };

    handleNotificationPermission();
  }, []);

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }
  };

  useEffect(() => {
    let interval;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      audioRef.current.play();
      setIsWorking(prevIsWorking => !prevIsWorking);
      setTimeLeft(isWorking ? breakTime * 60 : workTime * 60);
      setTasks(prevTasks => [...prevTasks, isWorking ? 'Work' : 'Break']);
      if (isWorking) {
        setWorkSessions(prevSessions => prevSessions + 1);
      }
      if (workSessions > 0 && workSessions % 4 === 0) {
        setTimeLeft(longBreakTime * 60);
        setIsWorking(false);
        setTasks(prevTasks => [...prevTasks, 'Long Break']);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, workTime, breakTime, longBreakTime, isWorking, workSessions, audioRef]);

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds % 60).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    const handleOffline = () => {
      setOffline(!navigator.onLine);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOffline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isActive && timeLeft === 5) {
      if (notificationPermission === 'granted') {
        new Notification(`Next ${isWorking ? 'Break' : 'Work'} starts in 5 seconds!`);
      }
    }
  }, [isActive, timeLeft, isWorking, notificationPermission]);

  return (
    <div className={`timer ${offline ? 'offline' : ''}`}>
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
      <button onClick={requestNotificationPermission}>
        Request Notification Permission
      </button>
    </div>
  );
};

export default Timer;
