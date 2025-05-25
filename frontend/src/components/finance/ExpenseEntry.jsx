import { useState } from 'react';
import { 
  CheckCircleIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  TagIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

function ExpenseEntry() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState('monthly');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Connect with backend API
    const expenseData = { 
      amount, 
      description, 
      category, 
      date,
      isRecurring,
      recurrenceInterval: isRecurring ? recurrenceInterval : null
    };
    
    console.log('Submitting expense:', expenseData);
    
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);
      
      // Reset form after successful submission
      setTimeout(() => {
        setAmount('');
        setDescription('');
        setCategory('food');
        setDate(new Date().toISOString().split('T')[0]);
        setIsRecurring(false);
        setRecurrenceInterval('monthly');
        setSuccess(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Expense</h1>
        <p className="mt-1 text-sm text-gray-500">
          Record your expenses to track your spending and stay within budget
        </p>
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <CheckCircleSolidIcon className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-800 font-medium">Expense added successfully!</span>
          </div>
        </div>
      )}
      
      {/* Expense entry form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Amount */}
            <div>
              <label htmlFor="amount" className="form-label flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-1" />
                Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  className="form-input pl-7 block w-full"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="form-label flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-1" />
                Date
              </label>
              <input
                type="date"
                id="date"
                className="form-input mt-1 block w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="form-label flex items-center">
                <PencilSquareIcon className="h-5 w-5 text-gray-400 mr-1" />
                Description
              </label>
              <input
                type="text"
                id="description"
                className="form-input mt-1 block w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this expense for?"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="form-label flex items-center">
                <TagIcon className="h-5 w-5 text-gray-400 mr-1" />
                Category
              </label>
              <select
                id="category"
                className="form-input mt-1 block w-full"
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

            {/* Recurring expense toggle */}
            <div className="flex items-center">
              <div className="form-control">
                <div className="flex items-center h-5">
                  <input
                    id="recurring"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                  />
                </div>
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="recurring" className="font-medium text-gray-700">Recurring expense</label>
                <p className="text-gray-500">This expense repeats on a regular basis</p>
              </div>
            </div>
          </div>

          {/* Recurrence interval (conditional) */}
          {isRecurring && (
            <div className="p-4 bg-gray-50 rounded-md mt-4">
              <label className="form-label">Recurrence Interval</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="weekly"
                    name="recurrence"
                    type="radio"
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    value="weekly"
                    checked={recurrenceInterval === 'weekly'}
                    onChange={() => setRecurrenceInterval('weekly')}
                  />
                  <label htmlFor="weekly" className="ml-3 block text-sm font-medium text-gray-700">
                    Weekly
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="bi-weekly"
                    name="recurrence"
                    type="radio"
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    value="bi-weekly"
                    checked={recurrenceInterval === 'bi-weekly'}
                    onChange={() => setRecurrenceInterval('bi-weekly')}
                  />
                  <label htmlFor="bi-weekly" className="ml-3 block text-sm font-medium text-gray-700">
                    Bi-weekly
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="monthly"
                    name="recurrence"
                    type="radio"
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    value="monthly"
                    checked={recurrenceInterval === 'monthly'}
                    onChange={() => setRecurrenceInterval('monthly')}
                  />
                  <label htmlFor="monthly" className="ml-3 block text-sm font-medium text-gray-700">
                    Monthly
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="quarterly"
                    name="recurrence"
                    type="radio"
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    value="quarterly"
                    checked={recurrenceInterval === 'quarterly'}
                    onChange={() => setRecurrenceInterval('quarterly')}
                  />
                  <label htmlFor="quarterly" className="ml-3 block text-sm font-medium text-gray-700">
                    Quarterly
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="yearly"
                    name="recurrence"
                    type="radio"
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    value="yearly"
                    checked={recurrenceInterval === 'yearly'}
                    onChange={() => setRecurrenceInterval('yearly')}
                  />
                  <label htmlFor="yearly" className="ml-3 block text-sm font-medium text-gray-700">
                    Yearly
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary inline-flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Expense...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                  Add Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseEntry;
