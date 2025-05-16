import { useState, useEffect } from 'react';
import './RecurringExpenses.css';

function RecurringExpenses() {
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0]
  });
  
  // Mock data for demonstration
  useEffect(() => {
    const mockData = [
      { id: 1, description: 'Netflix Subscription', amount: 15.99, frequency: 'monthly', nextDate: '2025-06-01' },
      { id: 2, description: 'Gym Membership', amount: 45.00, frequency: 'monthly', nextDate: '2025-06-05' },
      { id: 3, description: 'Car Insurance', amount: 120.00, frequency: 'monthly', nextDate: '2025-06-15' },
      { id: 4, description: 'Phone Bill', amount: 75.50, frequency: 'monthly', nextDate: '2025-06-20' },
    ];

    setTimeout(() => {
      setRecurringExpenses(mockData);
      setIsLoading(false);
    }, 800);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      id: Date.now(),
      ...formData,
      nextDate: formData.startDate,
      amount: parseFloat(formData.amount) || 0
    };
    
    setRecurringExpenses(prev => [...prev, newExpense]);
    setShowAddForm(false);
    setFormData({
      description: '',
      amount: '',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this recurring expense?')) {
      setRecurringExpenses(prev => prev.filter(exp => exp.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading recurring expenses...</p>
      </div>
    );
  }

  return (
    <div className="recurring-expenses-container">
      <div className="header">
        <h2>Recurring Expenses</h2>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(true)}
        >
          <i className="fas fa-plus"></i> Add Recurring Expense
        </button>
      </div>

      {showAddForm && (
        <div className="add-expense-form">
          <h3>Add New Recurring Expense</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Frequency</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Save Expense
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="expenses-list">
        {recurringExpenses.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Frequency</th>
                <th>Next Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recurringExpenses.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>${expense.amount.toFixed(2)}</td>
                  <td>{expense.frequency}</td>
                  <td>{formatDate(expense.nextDate)}</td>
                  <td>
                    <button className="edit-btn">
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-expenses">
            <p>No recurring expenses found</p>
            <button className="add-btn">Add Your First Recurring Expense</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecurringExpenses;
