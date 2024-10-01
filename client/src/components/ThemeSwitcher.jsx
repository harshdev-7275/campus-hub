// ThemeSwitcher.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../slices/themeSlice";

const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 bg-gray-200 dark:bg-black dark:border hover:scale-105 transition-transform delay-100 rounded-full"
    >
      {isDarkMode ? "🌞" : "🌙"}
    </button>
  );
};

export default ThemeSwitcher;
