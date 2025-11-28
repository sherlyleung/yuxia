import React, { useState, useEffect } from 'react';
import { UserConfig } from './types';
import { getUserConfig, saveUserConfig } from './services/storageService';
import ConfigScreen from './components/ConfigScreen';
import LoveLetterModal from './components/LoveLetterModal';
import Dashboard from './components/Dashboard';

type AppState = 'loading' | 'config' | 'letter' | 'dashboard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [config, setConfig] = useState<UserConfig | null>(null);

  useEffect(() => {
    const storedConfig = getUserConfig();
    if (storedConfig) {
      setConfig(storedConfig);
      // If user exists, go straight to dashboard
      // Or we could show letter every time? PRD implies "First time opens... force config". 
      // PRD 4.0 says: "First time... if empty force config... After confirm, show letter".
      // Implication: If already configured, maybe skip letter? 
      // Let's assume for returning users we go to dashboard to avoid annoyance.
      setAppState('dashboard');
    } else {
      setAppState('config');
    }
  }, []);

  const handleConfigComplete = (newConfig: UserConfig) => {
    setConfig(newConfig);
    // Do not save yet? PRD says "Click 'Open Reminder' then save".
    // But we need to store it in state to show the letter.
    setAppState('letter');
  };

  const handleOpenDashboard = () => {
    if (config) {
      saveUserConfig(config);
      setAppState('dashboard');
    }
  };

  if (appState === 'loading') {
    return <div className="min-h-screen bg-blue-50" />;
  }

  if (appState === 'config') {
    return <ConfigScreen onComplete={handleConfigComplete} />;
  }

  if (appState === 'letter' && config) {
    return (
      <div className="relative min-h-screen bg-blue-50">
        {/* Render config screen in background or simple bg */}
         <div className="absolute inset-0 filter blur-sm bg-blue-100"></div>
        <LoveLetterModal config={config} onOpenDashboard={handleOpenDashboard} />
      </div>
    );
  }

  if (appState === 'dashboard' && config) {
    return <Dashboard config={config} />;
  }

  return null;
};

export default App;