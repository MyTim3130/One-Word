'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const themes = {
  'neo-green': {
    name: 'Neo Green',
    colors: {
      // Background gradients
      'bg-primary': 'linear-gradient(135deg, #f0fdf4 0%, #22c55e 25%, #166534 75%, #064e3b 100%)',
      'bg-glass': 'rgba(255, 255, 255, 0.08)',
      'bg-glass-strong': 'rgba(255, 255, 255, 0.12)',
      'bg-glass-subtle': 'rgba(255, 255, 255, 0.05)',
      
      // Primary colors
      'primary-50': '#f0fdf4',
      'primary-100': '#dcfce7',
      'primary-200': '#bbf7d0',
      'primary-300': '#86efac',
      'primary-400': '#4ade80',
      'primary-500': '#22c55e',
      'primary-600': '#16a34a',
      'primary-700': '#15803d',
      'primary-800': '#166534',
      'primary-900': '#14532d',
      
      // Accent colors
      'accent-300': '#86efac',
      'accent-400': '#4ade80',
      'accent-500': '#22c55e',
      'accent-600': '#16a34a',
      'accent-700': '#15803d',
      
      // Text colors
      'text-primary': '#ffffff',
      'text-secondary': 'rgba(255, 255, 255, 0.8)',
      'text-muted': 'rgba(255, 255, 255, 0.6)',
      
      // Gradients
      'gradient-primary': 'linear-gradient(135deg, #86efac 0%, #166534 100%)',
      'gradient-secondary': 'linear-gradient(135deg, #bbf7d0 0%, #15803d 100%)',
      'gradient-accent': 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
      
      // Shadows
      'shadow-glow': '0 0 20px rgba(34, 197, 94, 0.3)',
      'shadow-glow-strong': '0 0 30px rgba(34, 197, 94, 0.5)',
      'shadow-glass': '0 8px 32px 0 rgba(22, 163, 74, 0.15)',
    }
  },
  
  'ocean-blue': {
    name: 'Ocean Blue',
    colors: {
      'bg-primary': 'linear-gradient(135deg, #f0f9ff 0%, #0ea5e9 25%, #0369a1 75%, #0c4a6e 100%)',
      'bg-glass': 'rgba(255, 255, 255, 0.08)',
      'bg-glass-strong': 'rgba(255, 255, 255, 0.12)',
      'bg-glass-subtle': 'rgba(255, 255, 255, 0.05)',
      
      'primary-50': '#f0f9ff',
      'primary-100': '#e0f2fe',
      'primary-200': '#bae6fd',
      'primary-300': '#7dd3fc',
      'primary-400': '#38bdf8',
      'primary-500': '#0ea5e9',
      'primary-600': '#0284c7',
      'primary-700': '#0369a1',
      'primary-800': '#075985',
      'primary-900': '#0c4a6e',
      
      'accent-300': '#7dd3fc',
      'accent-400': '#38bdf8',
      'accent-500': '#0ea5e9',
      'accent-600': '#0284c7',
      'accent-700': '#0369a1',
      
      'text-primary': '#ffffff',
      'text-secondary': 'rgba(255, 255, 255, 0.8)',
      'text-muted': 'rgba(255, 255, 255, 0.6)',
      
      'gradient-primary': 'linear-gradient(135deg, #7dd3fc 0%, #0c4a6e 100%)',
      'gradient-secondary': 'linear-gradient(135deg, #bae6fd 0%, #0369a1 100%)',
      'gradient-accent': 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
      
      'shadow-glow': '0 0 20px rgba(14, 165, 233, 0.3)',
      'shadow-glow-strong': '0 0 30px rgba(14, 165, 233, 0.5)',
      'shadow-glass': '0 8px 32px 0 rgba(2, 132, 199, 0.15)',
    }
  },
  
  'sunset-orange': {
    name: 'Sunset Orange',
    colors: {
      'bg-primary': 'linear-gradient(135deg, #fff7ed 0%, #f97316 25%, #c2410c 75%, #9a3412 100%)',
      'bg-glass': 'rgba(255, 255, 255, 0.08)',
      'bg-glass-strong': 'rgba(255, 255, 255, 0.12)',
      'bg-glass-subtle': 'rgba(255, 255, 255, 0.05)',
      
      'primary-50': '#fff7ed',
      'primary-100': '#ffedd5',
      'primary-200': '#fed7aa',
      'primary-300': '#fdba74',
      'primary-400': '#fb923c',
      'primary-500': '#f97316',
      'primary-600': '#ea580c',
      'primary-700': '#c2410c',
      'primary-800': '#9a3412',
      'primary-900': '#7c2d12',
      
      'accent-300': '#fdba74',
      'accent-400': '#fb923c',
      'accent-500': '#f97316',
      'accent-600': '#ea580c',
      'accent-700': '#c2410c',
      
      'text-primary': '#ffffff',
      'text-secondary': 'rgba(255, 255, 255, 0.8)',
      'text-muted': 'rgba(255, 255, 255, 0.6)',
      
      'gradient-primary': 'linear-gradient(135deg, #fdba74 0%, #9a3412 100%)',
      'gradient-secondary': 'linear-gradient(135deg, #fed7aa 0%, #c2410c 100%)',
      'gradient-accent': 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
      
      'shadow-glow': '0 0 20px rgba(249, 115, 22, 0.3)',
      'shadow-glow-strong': '0 0 30px rgba(249, 115, 22, 0.5)',
      'shadow-glass': '0 8px 32px 0 rgba(234, 88, 12, 0.15)',
    }
  },
  
  'purple-night': {
    name: 'Purple Night',
    colors: {
      'bg-primary': 'linear-gradient(135deg, #faf5ff 0%, #a855f7 25%, #7c3aed 75%, #581c87 100%)',
      'bg-glass': 'rgba(255, 255, 255, 0.08)',
      'bg-glass-strong': 'rgba(255, 255, 255, 0.12)',
      'bg-glass-subtle': 'rgba(255, 255, 255, 0.05)',
      
      'primary-50': '#faf5ff',
      'primary-100': '#f3e8ff',
      'primary-200': '#e9d5ff',
      'primary-300': '#d8b4fe',
      'primary-400': '#c084fc',
      'primary-500': '#a855f7',
      'primary-600': '#9333ea',
      'primary-700': '#7c3aed',
      'primary-800': '#6b21a8',
      'primary-900': '#581c87',
      
      'accent-300': '#d8b4fe',
      'accent-400': '#c084fc',
      'accent-500': '#a855f7',
      'accent-600': '#9333ea',
      'accent-700': '#7c3aed',
      
      'text-primary': '#ffffff',
      'text-secondary': 'rgba(255, 255, 255, 0.8)',
      'text-muted': 'rgba(255, 255, 255, 0.6)',
      
      'gradient-primary': 'linear-gradient(135deg, #d8b4fe 0%, #581c87 100%)',
      'gradient-secondary': 'linear-gradient(135deg, #e9d5ff 0%, #7c3aed 100%)',
      'gradient-accent': 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)',
      
      'shadow-glow': '0 0 20px rgba(168, 85, 247, 0.3)',
      'shadow-glow-strong': '0 0 30px rgba(168, 85, 247, 0.5)',
      'shadow-glass': '0 8px 32px 0 rgba(147, 51, 234, 0.15)',
    }
  },
  
  'minimalistic': {
    name: 'Minimalistic',
    colors: {
      'bg-primary': 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #e2e8f0 75%, #cbd5e1 100%)',
      'bg-glass': 'rgba(0, 0, 0, 0.05)',
      'bg-glass-strong': 'rgba(0, 0, 0, 0.08)',
      'bg-glass-subtle': 'rgba(0, 0, 0, 0.03)',
      
      'primary-50': '#ffffff',
      'primary-100': '#f8fafc',
      'primary-200': '#f1f5f9',
      'primary-300': '#e2e8f0',
      'primary-400': '#cbd5e1',
      'primary-500': '#94a3b8',
      'primary-600': '#64748b',
      'primary-700': '#475569',
      'primary-800': '#334155',
      'primary-900': '#1e293b',
      
      'accent-300': '#e2e8f0',
      'accent-400': '#cbd5e1',
      'accent-500': '#94a3b8',
      'accent-600': '#64748b',
      'accent-700': '#475569',
      
      'text-primary': '#1e293b',
      'text-secondary': '#475569',
      'text-muted': '#64748b',
      
      'gradient-primary': 'linear-gradient(135deg, #e2e8f0 0%, #1e293b 100%)',
      'gradient-secondary': 'linear-gradient(135deg, #f1f5f9 0%, #475569 100%)',
      'gradient-accent': 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
      
      'shadow-glow': '0 0 20px rgba(30, 41, 59, 0.1)',
      'shadow-glow-strong': '0 0 30px rgba(30, 41, 59, 0.15)',
      'shadow-glass': '0 8px 32px 0 rgba(100, 116, 139, 0.1)',
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('neo-green');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
    setIsLoaded(true);
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    if (!isLoaded) return;
    
    const theme = themes[currentTheme];
    const root = document.documentElement;
    
    // Apply all color variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    // Save to localStorage
    localStorage.setItem('app-theme', currentTheme);
  }, [currentTheme, isLoaded]);

  const switchTheme = (themeKey) => {
    if (themes[themeKey]) {
      setCurrentTheme(themeKey);
    }
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      switchTheme,
      themes,
      isLoaded
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};