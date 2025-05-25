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
        <div className="card text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Household Created Successfully!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Your new household <span className="font-semibold text-slate-900 dark:text-white">"{householdName}"</span> is ready to use.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              className="btn btn-primary flex items-center justify-center space-x-2"
              onClick={() => window.location.href = '/household/members'}
            >
              <UserPlusIcon className="w-5 h-5" />
              <span>Invite Members</span>
            </button>
            <button 
              className="btn btn-secondary"
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
      <div className="card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <HomeIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Create New Household
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Households help you organize and share finances with family members or roommates.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="householdName" className="form-label">
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