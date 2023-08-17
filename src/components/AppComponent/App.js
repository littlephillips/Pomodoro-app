import React, { useState } from 'react';
import Timer from '../../pages/Timer/Timer';
// style
import '../../styles/App.css';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`app ${theme}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        Toggle Theme
      </button>
      <Timer />
    </div>
  );
}

export default App;