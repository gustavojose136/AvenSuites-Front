"use client";

import ThemeToggler from "@/components/Header/ThemeToggler";

const ThemeToggleButton = () => {
  return (
    <div className="fixed right-6 top-28 z-40 lg:top-36">
      <div className="rounded-lg bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:bg-dark-2/90">
        <ThemeToggler />
      </div>
    </div>
  );
};

export default ThemeToggleButton;

