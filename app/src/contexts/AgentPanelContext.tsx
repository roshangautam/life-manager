import React, { createContext, useContext, useState } from 'react';

type AgentPanelContextType = {
  isOpen: boolean;
  isDocked: boolean;
  togglePanel: () => void;
  toggleDock: () => void;
};

const AgentPanelContext = createContext<AgentPanelContextType | undefined>(undefined);

export function AgentPanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDocked, setIsDocked] = useState(false);

  const togglePanel = () => setIsOpen(!isOpen);
  const toggleDock = () => setIsDocked(!isDocked);

  return (
    <AgentPanelContext.Provider value={{ isOpen, isDocked, togglePanel, toggleDock }}>
      {children}
    </AgentPanelContext.Provider>
  );
}

export function useAgentPanel() {
  const context = useContext(AgentPanelContext);
  if (context === undefined) {
    throw new Error('useAgentPanel must be used within an AgentPanelProvider');
  }
  return context;
}
