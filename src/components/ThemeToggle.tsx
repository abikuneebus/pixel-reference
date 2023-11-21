import React from "react";

interface ThemeToggleProps {
  onToggle: () => void;
  isDarkMode: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ onToggle, isDarkMode }) => (
  <div className='themeToggle'>
    <button onClick={onToggle}>
      {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
  </div>
);

export default ThemeToggle;
