import React from 'react';

const TimerControls = ({
  isActive,
  setIsActive,
  isWorking,
  workTime,
  breakTime,
  setWorkSessions,
  setTimeLeft
}) => {
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(isWorking ? workTime * 60 : breakTime * 60);
    setWorkSessions(0);
  };

  return (
    <div className="controls">
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default TimerControls;
