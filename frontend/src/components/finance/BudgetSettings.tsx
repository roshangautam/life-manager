import React, { useState, useEffect } from 'react';
import './BudgetSettings.css';

type ExpenseCategory = 'food' | 'transportation' | 'housing' | 'utilities' | 'entertainment' | 'shopping' | 'health' | 'other';

interface Budget {
  category: ExpenseCategory;
  limit: number;
}

function BudgetSettings(): JSX.Element {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockBudgets: Budget[] = [
      { category: 'food', limit: 400 },
      { category: 'transportation', limit: 200 },
      { category: 'housing', limit: 1200 },
      { category: 'utilities', limit: 300 },
      { category: 'entertainment', limit: 150 },
      { category: 'shopping', limit: 200 },
      { category: 'health', limit: 100 },
      { category: 'other', limit: 150 },
    ];

    setTimeout(() => {
      setBudgets(mockBudgets);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleLimitChange = (category: ExpenseCategory, value: string): void => {
    setBudgets(budgets.map(budget => 
      budget.category === category ? { ...budget, limit: Number(value) } : budget
    ));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsSaving(true);
    
    // TODO: Connect with backend API
    console.log('Updating budget limits:', budgets);
    
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setIsSaving(false);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const getCategoryName = (category: ExpenseCategory): string => {
    const names: Record<ExpenseCategory, string> = {
      food: 'Food & Dining',
      transportation: 'Transportation',
      housing: 'Housing',
      utilities: 'Utilities',
      entertainment: 'Entertainment',
      shopping: 'Shopping',
      health: 'Health & Fitness',
      other: 'Other'
    };
    return names[category] || category;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading budget settings...</p>
      </div>
    );
  }

  return (
    <div className="budget-settings-container">
      <h2>Budget Settings</h2>
      
      {success && (
        <div className="success-message">
          Budget settings updated successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="budget-form">
        <div className="budget-items">
          {budgets.map((budget) => (
            <div key={budget.category} className="budget-item">
              <label>{getCategoryName(budget.category)}</label>
              <div className="input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  value={budget.limit}
                  onChange={(e) => handleLimitChange(budget.category, e.target.value)}
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>
          ))}
        </div>
        
        <button 
          type="submit" 
          className="save-btn"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Budgets'}
        </button>
      </form>
    </div>
  );
}

export default BudgetSettings;