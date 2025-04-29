
import React, { createContext, useContext, useState, useEffect } from 'react';

interface EditorSettings {
  fontSize: string;
  tabSize: number;
  autoUpdate: boolean;
  theme: string;
  showLineNumbers: boolean;
  autoCloseBrackets: boolean;
  wordWrap: boolean;
  highlightActiveLine: boolean;
  keymap: string;
}

interface SettingsContextProps {
  settings: EditorSettings;
  updateSettings: (newSettings: Partial<EditorSettings>) => void;
}

const defaultSettings: EditorSettings = {
  fontSize: '14px',
  tabSize: 2,
  autoUpdate: true,
  theme: 'dark',
  showLineNumbers: true,
  autoCloseBrackets: true,
  wordWrap: false,
  highlightActiveLine: true,
  keymap: 'default'
};

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('codeplayground-settings');
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  // Save to localStorage when settings change
  useEffect(() => {
    localStorage.setItem('codeplayground-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<EditorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
