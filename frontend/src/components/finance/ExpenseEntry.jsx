import { useState } from 'react';
import './ExpenseEntry.css';

function ExpenseEntry() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Connect with backend API
    console.log('Submitting expense:', { amount, description, category, date });
    
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);
      
      // Reset form after successful submission
      setTimeout(() => {
        setAmount('');
        setDescription('');
        setCategory('food');
        setSuccess(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="expense-entry-container">
      <h2>Add New Expense</h2>
      
      {success && (
        <div className="success-message">
          Expense added successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <div className="input-with-symbol">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this expense for?"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select 
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
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
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}

export default ExpenseEntry;
