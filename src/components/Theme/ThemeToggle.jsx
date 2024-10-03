import React, { useState } from 'react';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  return (
    <button onClick={toggleTheme} className="p-2">
      {!isDarkMode ? '🌙' : '☀️'} {/* Simple icons for dark/light mode */}
    </button>
  );
};

export default ThemeToggle;
