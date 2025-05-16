import { useState, useEffect } from 'react';
import './ExpenseList.css';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockExpenses = [
      { id: 1, amount: 45.99, description: 'Grocery shopping', category: 'food', date: '2025-05-10' },
      { id: 2, amount: 12.50, description: 'Lunch with colleagues', category: 'food', date: '2025-05-12' },
      { id: 3, amount: 65.00, description: 'Monthly transit pass', category: 'transportation', date: '2025-05-01' },
      { id: 4, amount: 29.99, description: 'Movie tickets', category: 'entertainment', date: '2025-05-08' },
      { id: 5, amount: 120.00, description: 'Electric bill', category: 'utilities', date: '2025-05-05' },
    ];

    setTimeout(() => {
      setExpenses(mockExpenses);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredExpenses = expenses.filter(expense => {
    // Filter by category
    if (filter !== 'all' && expense.category !== filter) return false;
    
    // Filter by date range
    if (startDate && expense.date < startDate) return false;
    if (endDate && expense.date > endDate) return false;
    
    return true;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍔',
      transportation: '🚗',
      housing: '🏠',
      utilities: '💡',
      entertainment: '🎬',
      shopping: '🛍️',
      health: '🏥',
      other: '💼'
    };
    return icons[category] || icons.other;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading expenses...</p>
      </div>
    );
  }

  return (
    <div className="expense-list-container">
      <div className="expense-list-header">
        <h2>Expense History</h2>
        <div className="total-amount">
          <span>Total:</span>
          <span className="amount">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="category-filter">Category</label>
          <select 
            id="category-filter" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="food">Food & Dining</option>
            <option value="transportation">Transportation</option>
            <option value="housing">Housing</option>
            <option value="utilities">Utilities</option>
            <option value="entertainment">Entertainment</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health & Fitness</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="start-date">From</label>
          <input 
            type="date" 
            id="start-date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="end-date">To</label>
          <input 
            type="date" 
            id="end-date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="expense-items">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map(expense => (
            <div key={expense.id} className="expense-item">
              <div className="expense-icon">
                {getCategoryIcon(expense.category)}
              </div>
              <div className="expense-details">
                <div className="expense-description">{expense.description}</div>
                <div className="expense-date">{formatDate(expense.date)}</div>
              </div>
              <div className="expense-amount">
                ${expense.amount.toFixed(2)}
              </div>
            </div>
          ))
        ) : (
          <div className="no-expenses">
            No expenses found matching your filters
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseList;
