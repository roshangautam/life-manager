import React, { useState, useEffect } from 'react';
import './AnalyticsDashboard.css';

type Timeframe = 'month' | 'week';
type ExpenseCategory = 'food' | 'transportation' | 'housing' | 'utilities' | 'entertainment' | 'shopping' | 'health' | 'other';

interface SpendingByCategory {
  category: ExpenseCategory;
  amount: number;
}

interface MonthlyTrend {
  month: string;
  amount: number;
}

interface BudgetComparison {
  totalSpent: number;
  totalBudget: number;
  remaining: number;
}

interface ChartData {
  spendingByCategory: SpendingByCategory[];
  monthlyTrends: MonthlyTrend[];
  budgetComparison: BudgetComparison;
}

function AnalyticsDashboard(): JSX.Element {
  const [timeframe, setTimeframe] = useState<Timeframe>('month');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: ChartData = {
      spendingByCategory: [
        { category: 'food', amount: 325 },
        { category: 'transportation', amount: 180 },
        { category: 'housing', amount: 1200 },
        { category: 'utilities', amount: 280 },
        { category: 'entertainment', amount: 210 },
        { category: 'shopping', amount: 175 },
        { category: 'health', amount: 45 },
        { category: 'other', amount: 90 },
      ],
      monthlyTrends: [
        { month: 'Jan', amount: 1500 },
        { month: 'Feb', amount: 1800 },
        { month: 'Mar', amount: 2200 },
        { month: 'Apr', amount: 1900 },
        { month: 'May', amount: 2100 },
      ],
      budgetComparison: {
        totalSpent: 2505,
        totalBudget: 2700,
        remaining: 195
      }
    };

    setTimeout(() => {
      setChartData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [timeframe]);

  const getCategoryName = (category: ExpenseCategory): string => {
    const names: Record<ExpenseCategory, string> = {
      food: 'Food',
      transportation: 'Transport',
      housing: 'Housing',
      utilities: 'Utilities',
      entertainment: 'Entertain',
      shopping: 'Shopping',
      health: 'Health',
      other: 'Other'
    };
    return names[category] || category;
  };

  if (isLoading || !chartData) {
    return (
      <div className="loading-container">
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>Financial Analytics</h2>
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

      <div className="analytics-grid">
        <div className="chart-container spending-by-category">
          <h3>Spending by Category</h3>
          <div className="chart-bars">
            {chartData.spendingByCategory.map((item, index) => {
              const maxAmount = Math.max(...chartData.spendingByCategory.map(i => i.amount));
              const heightPercent = (item.amount / maxAmount) * 100;
              
              return (
                <div key={index} className="bar-wrapper">
                  <div className="bar-label">{getCategoryName(item.category)}</div>
                  <div className="bar">
                    <div 
                      className="bar-fill" 
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <div className="bar-amount">${item.amount}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-container monthly-trends">
          <h3>Monthly Spending Trends</h3>
          <div className="trend-line">
            {chartData.monthlyTrends.map((item, index) => {
              const maxAmount = Math.max(...chartData.monthlyTrends.map(i => i.amount));
              const heightPercent = (item.amount / maxAmount) * 100;
              
              return (
                <div key={index} className="trend-point-wrapper">
                  <div className="trend-point" style={{ bottom: `${heightPercent}%` }}></div>
                  <div className="trend-label">{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-container budget-comparison">
          <h3>Budget Overview</h3>
          <div className="budget-meters">
            <div className="meter">
              <div className="meter-label">Spent</div>
              <div className="meter-bar">
                <div 
                  className="meter-fill spent" 
                  style={{ width: `${(chartData.budgetComparison.totalSpent / chartData.budgetComparison.totalBudget) * 100}%` }}
                ></div>
              </div>
              <div className="meter-amount">${chartData.budgetComparison.totalSpent}</div>
            </div>
            <div className="meter">
              <div className="meter-label">Remaining</div>
              <div className="meter-bar">
                <div 
                  className="meter-fill remaining" 
                  style={{ width: `${(chartData.budgetComparison.remaining / chartData.budgetComparison.totalBudget) * 100}%` }}
                ></div>
              </div>
              <div className="meter-amount">${chartData.budgetComparison.remaining}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;