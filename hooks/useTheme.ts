import { useEffect, useState } from 'react';

export enum Theme {
  LIGHT = 'theme-light',
  DARK = 'theme-dark',
}

type IThemeHook = [currentTheme: Theme, toggleTheme: () => void];

export const useTheme = (): IThemeHook => {
  const [currentTheme, setCurrentTheme] = useState(Theme.LIGHT);

  useEffect(() => {
    const actualTheme = localStorage.getItem('nakiri_theme');

    if (actualTheme === Theme.LIGHT || actualTheme === Theme.DARK) {
      setCurrentTheme(actualTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    document.documentElement.classList.replace(currentTheme, newTheme);
    localStorage.setItem('nakiri_theme', newTheme);
    setCurrentTheme(newTheme);
  };

  return [currentTheme, toggleTheme];
};
