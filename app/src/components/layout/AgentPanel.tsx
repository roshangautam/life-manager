import { ArrowsPointingOutIcon, ArrowsPointingInIcon, XMarkIcon } from '@heroicons/react/24/outline';
import LangGraphChat from '../LangGraphChat';
import { useAgentPanel } from '../../contexts/AgentPanelContext';

export default function AgentPanel() {
  const { isOpen, isDocked, togglePanel, toggleDock } = useAgentPanel();

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-y-0 right-0 z-50 flex ${isDocked ? 'w-80' : 'w-96'} flex-col bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ease-in-out`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Life Assistant</h2>
        <div className="flex space-x-2">
          <button 
            onClick={toggleDock}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={isDocked ? 'Undock' : 'Dock'}
          >
            {isDocked ? (
              <ArrowsPointingOutIcon className="h-5 w-5" />
            ) : (
              <ArrowsPointingInIcon className="h-5 w-5" />
            )}
          </button>
          <button 
            onClick={togglePanel}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close panel"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <LangGraphChat />
      </div>
    </div>
  );
}
