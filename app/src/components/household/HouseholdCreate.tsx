import React, { useState } from 'react';
import { 
  HomeIcon, 
  UserPlusIcon, 
  CheckCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';

function HouseholdCreate(): JSX.Element {
  const [householdName, setHouseholdName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!householdName.trim()) {
      setError('Please enter a household name');
      return;
    }
    
    setIsCreating(true);
    setError('');
    
    try {
      // TODO: Connect with backend API
      console.log('Creating household:', householdName);
      
      // Simulate API call
      setTimeout(() => {
        setSuccess(true);
        setIsCreating(false);
      }, 1000);
    } catch (err) {
      setError('Failed to create household. Please try again.');
      setIsCreating(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            Household Created Successfully!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Your new household <span className="font-semibold text-slate-900 dark:text-white">"{householdName}"</span> is ready to use.
          </p>
          
          <div className="space-y-3 pt-2">
            <button 
              type="button"
              className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
              onClick={() => window.location.href = '/household/members'}
            >
              <UserPlusIcon className="w-4 h-4 mr-2" />
              <span>Invite Members</span>
            </button>
            <button 
              type="button"
              className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
              onClick={() => window.location.href = '/dashboard'}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="flex items-center justify-center w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <HomeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Create New Household
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Households help you organize and share finances with family members or roommates.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="householdName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Household Name
            </label>
            <input
              type="text"
              id="householdName"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              placeholder="e.g. Smith Family, Roommate House"
              className="form-input"
              required
            />
            {error && (
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <XCircleIcon className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full flex items-center justify-center space-x-2"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <HomeIcon className="w-5 h-5" />
                <span>Create Household</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default HouseholdCreate;