import React, { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

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


  if (isLoading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading budget data...</p>
        </div>
      </div>
    );
  }

  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalLimit = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalRemaining = budgets.reduce((sum, budget) => sum + (budget.limit - budget.spent), 0);
  const totalOverspent = budgets.reduce((sum, budget) => sum + Math.max(0, budget.spent - budget.limit), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Budget Overview</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track your spending across different categories
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              timeframe === 'month' 
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            onClick={() => setTimeframe('month')}
          >
            Monthly
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              timeframe === 'week' 
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            onClick={() => setTimeframe('week')}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Budget</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                ${totalLimit.toLocaleString()}
              </p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Spent</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                ${totalSpent.toLocaleString()}
              </p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Remaining</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                ${totalRemaining.toLocaleString()}
              </p>
            </div>
            <ClockIcon className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Overspent</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                ${totalOverspent.toLocaleString()}
              </p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Category Breakdown</h3>
        <div className="space-y-6">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isOverBudget = budget.spent > budget.limit;
            const isNearLimit = percentage > 75 && !isOverBudget;
            
            return (
              <div key={budget.category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {getCategoryName(budget.category)}
                    </h4>
                    {isOverBudget && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                        Over Budget
                      </span>
                    )}
                    {isNearLimit && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        Near Limit
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">
                      ${budget.spent.toLocaleString()}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {' '}/ ${budget.limit.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700">
                    <div 
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                        isOverBudget 
                          ? 'bg-red-500' 
                          : isNearLimit 
                            ? 'bg-amber-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                    {isOverBudget && (
                      <div 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600"
                        style={{ width: `${Math.min(25, percentage - 100)}%` }}
                      />
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>0</span>
                    <span>{Math.round(percentage)}%</span>
                    <span>${budget.limit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BudgetOverview;