import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';

export default function ThemeToggle() {
  const { state, dispatch } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
      className="relative overflow-hidden"
    >
      <div className={`transition-all duration-300 ${state.theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'} absolute`}>
        <Sun className="h-4 w-4" />
      </div>
      <div className={`transition-all duration-300 ${state.theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'} absolute`}>
        <Moon className="h-4 w-4" />
      </div>
      <div className="opacity-0">
        <Sun className="h-4 w-4" />
      </div>
    </Button>
  );
}