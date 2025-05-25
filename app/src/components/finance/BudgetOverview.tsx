import React, { useState, useEffect } from 'react';
import './BudgetOverview.css';

type ExpenseCategory = 'food' | 'transportation' | 'housing' | 'utilities' | 'entertainment' | 'shopping' | 'health' | 'other';
type Timeframe = 'month' | 'week';

interface Budget {
  category: ExpenseCategory;
  limit: number;
  spent: number;
}

function BudgetOverview(): JSX.Element {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeframe, setTimeframe] = useState<Timeframe>('month');

  // Mock data for demonstration
  useEffect(() => {
    const mockBudgets: Budget[] = [
      { category: 'food', limit: 400, spent: 325 },
      { category: 'transportation', limit: 200, spent: 180 },
      { category: 'housing', limit: 1200, spent: 1200 },
      { category: 'utilities', limit: 300, spent: 280 },
      { category: 'entertainment', limit: 150, spent: 210 },
      { category: 'shopping', limit: 200, spent: 175 },
      { category: 'health', limit: 100, spent: 45 },
      { category: 'other', limit: 150, spent: 90 },
    ];

    setTimeout(() => {
      setBudgets(mockBudgets);
      setIsLoading(false);
    }, 800);
  }, []);

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

  const getProgressColor = (spent: number, limit: number): string => {
    const percentage = (spent / limit) * 100;
    if (percentage > 100) return '#e74c3c';
    if (percentage > 75) return '#f39c12';
    return '#2ecc71';
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading budget data...</p>
      </div>
    );
  }

  return (
    <div className="budget-overview-container">
      <div className="budget-header">
        <h2>Budget Overview</h2>
        <div className="timeframe-selector">
          <button 
            className={timeframe === 'month' ? 'active' : ''}
            onClick={() => setTimeframe('month')}
          >
            Monthly
          </button>
          <button 
            className={timeframe === 'week' ? 'active' : ''}
            onClick={() => setTimeframe('week')}
          >
            Weekly
          </button>
        </div>
      </div>

      <div className="budget-summary">
        <div className="summary-card total-spent">
          <h3>Total Spent</h3>
          <p>${budgets.reduce((sum, budget) => sum + budget.spent, 0)}</p>
        </div>
        <div className="summary-card remaining">
          <h3>Remaining</h3>
          <p>${budgets.reduce((sum, budget) => sum + (budget.limit - budget.spent), 0)}</p>
        </div>
        <div className="summary-card overspent">
          <h3>Overspent</h3>
          <p>${budgets.reduce((sum, budget) => sum + Math.max(0, budget.spent - budget.limit), 0)}</p>
        </div>
      </div>

      <div className="budget-categories">
        {budgets.map((budget) => (
          <div key={budget.category} className="budget-category">
            <div className="category-info">
              <h4>{getCategoryName(budget.category)}</h4>
              <div className="amounts">
                <span className="spent">${budget.spent}</span>
                <span className="limit">/ ${budget.limit}</span>
              </div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{
                  width: `${Math.min(100, (budget.spent / budget.limit) * 100)}%`,
                  backgroundColor: getProgressColor(budget.spent, budget.limit)
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BudgetOverview;