import React, { useState, useEffect, useRef } from 'react';
import TimerControls from '../TimerControls/TimerControls';
import TaskList from '../TaskList/TaskList';
import TimerDisplay from '../TimerDisplay/TimerDisplay';
import NotificationButton from '../NotificationButton/NotificationButton';
import alarmSound from '../../assests/alarmSound.wav';
import '../../styles/Timer.css';

const Timer = () => {
  const [workTime, setWorkTime] = useState(1);
  const [breakTime, setBreakTime] = useState();
  const [longBreakTime, setLongBreakTime] = useState(1);
  const [workSessions, setWorkSessions] = useState(0);
  const [isWorking, setIsWorking] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [offline, setOffline] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const audioRef = useRef();

  useEffect(() => {
    const handleNotificationPermission = () => {
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    };
    handleNotificationPermission();
  }, []);

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
    audioRef.current.addEventListener('error', event => {
      console.error('Audio playback error:', event);
    });
  }, []);

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          let nextTimeLeft = 0;
          if (prevTime > 0) {
            nextTimeLeft = prevTime - 1;
          } else {
            audioRef.current.play();
            const newIsWorking = !isWorking;
            setIsWorking(newIsWorking);
            nextTimeLeft = newIsWorking ? breakTime * 60 : workTime * 60;
            setTasks(prevTasks => [...prevTasks, newIsWorking ? 'Work' : 'Break']);
            if (!newIsWorking) {
              setWorkSessions(workSessions => workSessions + 1);
              if ((workSessions + 1) % 4 === 0) {
                nextTimeLeft = longBreakTime * 60;
                setTasks(prevTasks => [...prevTasks, 'Long Break']);
              }
            }
          }
          return nextTimeLeft;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
  
    return () => clearInterval(interval);
  }, [isActive, isWorking, workTime, breakTime, longBreakTime, audioRef]);
  

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds % 60).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }
  };

  return (
    <div className={`timer ${offline ? 'offline' : ''}`}>
      <h1>{isWorking ? 'Work' : 'Break'} Timer</h1>
      <TimerDisplay timeLeft={timeLeft} formatTime={formatTime} />
      <TimerControls
        isActive={isActive}
        setIsActive={setIsActive}
        isWorking={isWorking}
        workTime={workTime}
        breakTime={breakTime}
        setWorkSessions={setWorkSessions}
        setTimeLeft={setTimeLeft}
      />
      <TaskList tasks={tasks} />
      <audio ref={audioRef} src={alarmSound}></audio>
      {('Notification' in window) && notificationPermission !== 'granted' && (
        <NotificationButton requestNotificationPermission={requestNotificationPermission} />
      )}
    </div>
  );
};

export default Timer;
