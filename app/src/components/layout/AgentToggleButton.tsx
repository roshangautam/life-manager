import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useAgentPanel } from '../../contexts/AgentPanelContext';

export default function AgentToggleButton() {
  const { isOpen, togglePanel } = useAgentPanel();

  return (
    <button
      onClick={togglePanel}
      className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-lg ${isOpen ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-blue-600'} transition-colors duration-200`}
      aria-label={isOpen ? 'Close agent panel' : 'Open agent panel'}
    >
      <ChatBubbleLeftRightIcon className="h-6 w-6" />
    </button>
  );
}
