import React from "react";
import "./styles/ThemeToggle.scss";

interface ThemeToggleProps {
  onToggle: () => void;
  isDarkMode: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ onToggle, isDarkMode }) => (
  <div className='themeToggle'>
    <button onClick={onToggle}>
      {isDarkMode ? "Light Mode" : "Dark Mode"}
    </button>
  </div>
);

export default ThemeToggle;
