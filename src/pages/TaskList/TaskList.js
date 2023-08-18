import React from 'react';

const TaskList = ({ tasks }) => {
  return (
    <div className="task-list">
      <h2>Task List</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={Date.now() + index}>{task}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
