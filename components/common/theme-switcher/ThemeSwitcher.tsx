import { useTheme, Theme } from '@/hooks/useTheme';

import { Moon, Sun } from 'react-feather';

const ThemeSwitcher = () => {
  const [currentTheme, toggleTheme] = useTheme();

  return (
    <div className="cursor-pointer" onClick={toggleTheme}>
      {currentTheme === Theme.LIGHT && <Moon />}
      {currentTheme === Theme.DARK && <Sun />}
    </div>
  );
};

export default ThemeSwitcher;
