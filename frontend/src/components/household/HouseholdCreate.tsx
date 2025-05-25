import React, { useState } from 'react';
import './HouseholdCreate.css';

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
      <div className="household-create-success">
        <h2>Household Created Successfully!</h2>
        <p>Your new household "{householdName}" is ready.</p>
        <div className="success-actions">
          <button 
            className="primary-btn"
            onClick={() => window.location.href = '/household/members'}
          >
            Invite Members
          </button>
          <button 
            className="secondary-btn"
            onClick={() => window.location.href = '/dashboard'}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="household-create-container">
      <h2>Create New Household</h2>
      <p className="subtitle">
        Households help you organize and share with family members or roommates.
      </p>
      
      <form onSubmit={handleSubmit} className="household-create-form">
        <div className="form-group">
          <label htmlFor="householdName">Household Name</label>
          <input
            type="text"
            id="householdName"
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
            placeholder="e.g. Smith Family, Roommate House"
          />
          {error && <p className="error-message">{error}</p>}
        </div>
        
        <button 
          type="submit" 
          className="primary-btn"
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Household'}
        </button>
      </form>
    </div>
  );
}

export default HouseholdCreate;