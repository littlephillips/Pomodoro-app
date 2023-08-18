import React from 'react';

const TimerDisplay = ({ timeLeft, formatTime }) => {
  return <div className="time">{formatTime(timeLeft)}</div>;
};

export default TimerDisplay;
