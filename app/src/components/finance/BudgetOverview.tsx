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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Budget Overview</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Budget</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">${totalLimit.toFixed(2)}</p>
            </div>
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <CurrencyDollarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Spent</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
              <ClockIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Remaining Budget Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Remaining</p>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">${totalRemaining.toFixed(2)}</p>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <CheckCircleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        {/* Overspent Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Overspent</p>
              <p className="text-lg font-bold text-rose-600 dark:text-rose-400">${totalOverspent.toFixed(2)}</p>
            </div>
            <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/30">
              <ExclamationTriangleIcon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
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