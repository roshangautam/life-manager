import { useState, useEffect } from 'react';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Define TypeScript interfaces
interface Expense {
  id: number;
  amount: number;
  description: string;
  category: string;
  date: string;
}

type SortField = 'date' | 'amount' | 'description' | 'category';
type SortDirection = 'asc' | 'desc';
type CategoryFilter = 'all' | 'food' | 'transportation' | 'housing' | 'utilities' | 'entertainment' | 'shopping' | 'health' | 'other';

interface CategoryColorMap {
  [key: string]: string;
}

interface CategoryLabelMap {
  [key: string]: string;
}

function ExpenseList(): JSX.Element {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  // Handle sorting and filtering
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleClearFilters = () => {
    setFilter('all');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
  };

  // Apply filters and sorting
  const filteredExpenses = expenses.filter(expense => {
    // Filter by category
    if (filter !== 'all' && expense.category !== filter) return false;
    
    // Filter by date range
    if (startDate && expense.date < startDate) return false;
    if (endDate && expense.date > endDate) return false;
    
    // Filter by search query
    if (searchQuery && !expense.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'date') {
      comparison = new Date(a.date) - new Date(b.date);
    } else if (sortField === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortField === 'description') {
      comparison = a.description.localeCompare(b.description);
    } else if (sortField === 'category') {
      comparison = a.category.localeCompare(b.category);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: 'bg-green-100 text-green-800',
      transportation: 'bg-blue-100 text-blue-800',
      housing: 'bg-purple-100 text-purple-800',
      utilities: 'bg-yellow-100 text-yellow-800',
      entertainment: 'bg-pink-100 text-pink-800',
      shopping: 'bg-indigo-100 text-indigo-800',
      health: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      food: 'Food & Dining',
      transportation: 'Transportation',
      housing: 'Housing',
      utilities: 'Utilities',
      entertainment: 'Entertainment',
      shopping: 'Shopping',
      health: 'Health & Fitness',
      other: 'Other'
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense History</h1>
          <p className="mt-1 text-sm text-gray-500">
            A detailed list of all your expenses and transactions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-md">
            <span className="font-medium">Total:</span>
            <span className="ml-2 font-bold">${totalAmount.toFixed(2)}</span>
          </div>
          <button 
            className="btn btn-secondary flex items-center"
            onClick={() => {/* Export functionality */}}
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Search and filter */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter toggle button */}
          <button
            type="button"
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="w-5 h-5 mr-2 text-gray-400" />
            Filters
            {(filter !== 'all' || startDate || endDate) && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Filter options */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category-filter"
                  className="block w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
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

              <div className="flex-1">
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <input
                  type="date"
                  id="start-date"
                  className="block w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="flex-1">
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  type="date"
                  id="end-date"
                  className="block w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500"
                onClick={handleClearFilters}
              >
                <XMarkIcon className="w-4 h-4 mr-1.5" />
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expenses table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    <span>Date</span>
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? 
                        <ChevronUpIcon className="w-4 h-4 ml-1" /> : 
                        <ChevronDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('description')}
                >
                  <div className="flex items-center">
                    <span>Description</span>
                    {sortField === 'description' && (
                      sortDirection === 'asc' ? 
                        <ChevronUpIcon className="w-4 h-4 ml-1" /> : 
                        <ChevronDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    <span>Category</span>
                    {sortField === 'category' && (
                      sortDirection === 'asc' ? 
                        <ChevronUpIcon className="w-4 h-4 ml-1" /> : 
                        <ChevronDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end">
                    <span>Amount</span>
                    {sortField === 'amount' && (
                      sortDirection === 'asc' ? 
                        <ChevronUpIcon className="w-4 h-4 ml-1" /> : 
                        <ChevronDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedExpenses.length > 0 ? (
                sortedExpenses.map(expense => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                        {getCategoryLabel(expense.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <p className="text-base">No expenses found matching your filters</p>
                    <button
                      className="mt-2 text-sm text-primary-600 hover:text-primary-800"
                      onClick={handleClearFilters}
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ExpenseList;
