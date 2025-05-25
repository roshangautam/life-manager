import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon, 
  ClockIcon,
  CurrencyDollarIcon, 
  UsersIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  Cog6ToothIcon,
  PlusIcon,
  EyeIcon,
  BanknotesIcon,
  CreditCardIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Enhanced interfaces for modern dashboard
interface User {
  name: string;
  household: string;
  avatar?: string;
}

interface MetricData {
  label: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

interface Category {
  name: string;
  amount: number;
  budget: number;
  color: string;
  percentage: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface FinanceData {
  monthlyBudget: number;
  currentSpending: number;
  categories: Category[];
  metrics: MetricData[];
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'appointment' | 'meeting' | 'reminder' | 'event';
  priority: 'high' | 'medium' | 'low';
}

function Dashboard(): JSX.Element {
  const navigate = useNavigate();
  
  const [user] = useState<User>({
    name: 'John Doe',
    household: 'Doe Family',
    avatar: ''
  });

  // Enhanced mock data for modern dashboard
  const financeData: FinanceData = {
    monthlyBudget: 5000,
    currentSpending: 3245,
    categories: [
      { 
        name: 'Food & Dining', 
        amount: 1200, 
        budget: 1500, 
        color: 'bg-primary-500',
        percentage: 80,
        icon: CurrencyDollarIcon
      },
      { 
        name: 'Bills & Utilities', 
        amount: 1500, 
        budget: 1800, 
        color: 'bg-purple-500',
        percentage: 83,
        icon: BanknotesIcon
      },
      { 
        name: 'Healthcare', 
        amount: 545, 
        budget: 800, 
        color: 'bg-emerald-500',
        percentage: 68,
        icon: CreditCardIcon
      }
    ],
    metrics: [
      {
        label: 'Total Balance',
        value: '$26,540.25',
        change: 12.5,
        changeType: 'increase',
        icon: BanknotesIcon,
        color: 'primary'
      },
      {
        label: 'Monthly Income',
        value: '$8,420.00',
        change: 8.2,
        changeType: 'increase',
        icon: ArrowTrendingUpIcon,
        color: 'success'
      },
      {
        label: 'Monthly Expenses',
        value: '$3,245.00',
        change: -3.8,
        changeType: 'decrease',
        icon: ArrowTrendingDownIcon,
        color: 'warning'
      }
    ]
  };

  const recentTransactions: Transaction[] = [
    {
      id: 1,
      description: 'Apple Store Purchase',
      amount: -999.00,
      type: 'expense',
      category: 'Shopping',
      date: 'Today, 2:45 PM',
      icon: ShoppingCartIcon
    },
    {
      id: 2,
      description: 'Salary Deposit',
      amount: 4500.00,
      type: 'income',
      category: 'Salary',
      date: 'Today, 9:00 AM',
      icon: BanknotesIcon
    },
    {
      id: 3,
      description: 'Netflix Subscription',
      amount: -15.99,
      type: 'expense',
      category: 'Entertainment',
      date: 'Yesterday',
      icon: CreditCardIcon
    }
  ];

  const upcomingEvents: Event[] = [
    { 
      id: 1, 
      title: 'Doctor Appointment', 
      date: '2025-05-20', 
      time: '10:00 AM',
      type: 'appointment',
      priority: 'high'
    },
    { 
      id: 2, 
      title: 'School Meeting', 
      date: '2025-05-24', 
      time: '3:30 PM',
      type: 'meeting',
      priority: 'medium'
    },
    { 
      id: 3, 
      title: 'Family Dinner', 
      date: '2025-05-25', 
      time: '7:00 PM',
      type: 'event',
      priority: 'low'
    }
  ];

  // Calculate percentage
  const spendingPercentage: number = Math.round((financeData.currentSpending / financeData.monthlyBudget) * 100);
  const isOverBudget: boolean = spendingPercentage > 100;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Modern Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's what's happening with your {user.household} today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button 
            onClick={() => navigate('/finance/expenses')}
            className="btn btn-primary btn-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Add Expense
          </button>
          <button 
            onClick={() => navigate('/finance/analytics')}
            className="btn btn-outline btn-sm"
          >
            <ChartBarIcon className="w-4 h-4" />
            Analytics
          </button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {financeData.metrics.map((metric, index) => (
          <div key={index} className="card card-default">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-${metric.color}-100 dark:bg-${metric.color}-950`}>
                  <metric.icon className={`w-5 h-5 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                </div>
                <div>
                  <p className="metric-label">{metric.label}</p>
                  <p className="metric-value">{metric.value}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1 ${
                  metric.changeType === 'increase' 
                    ? 'text-success-600 dark:text-success-400' 
                    : 'text-error-600 dark:text-error-400'
                }`}>
                  {metric.changeType === 'increase' ? (
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-semibold">
                    {Math.abs(metric.change)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  vs last month
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Financial Overview - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Budget Progress Card */}
          <div className="card card-default">
            <div className="card-header">
              <div>
                <h3 className="card-title">Monthly Budget Overview</h3>
                <p className="card-description">
                  Track your spending against your monthly budget
                </p>
              </div>
              <button 
                onClick={() => navigate('/finance/budget')}
                className="btn btn-ghost btn-sm"
              >
                <EyeIcon className="w-4 h-4" />
                View Details
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Overall Budget Progress */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Spent This Month
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${financeData.currentSpending.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      of ${financeData.monthlyBudget.toLocaleString()}
                    </p>
                    <p className={`text-sm font-semibold ${
                      isOverBudget 
                        ? 'text-error-600 dark:text-error-400' 
                        : 'text-success-600 dark:text-success-400'
                    }`}>
                      {spendingPercentage}% used
                    </p>
                  </div>
                </div>
                <div className="progress-bar h-3">
                  <div 
                    className={`progress-fill ${
                      isOverBudget 
                        ? 'bg-error-500' 
                        : spendingPercentage > 80 
                          ? 'bg-warning-500' 
                          : 'bg-success-500'
                    }`}
                    style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Spending by Category
                </h4>
                <div className="space-y-4">
                  {financeData.categories.map((category, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </span>
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            ${category.amount.toLocaleString()} / ${category.budget.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 progress-bar h-2">
                            <div 
                              className={`progress-fill ${
                                category.percentage > 100 
                                  ? 'bg-error-500' 
                                  : category.percentage > 80 
                                    ? 'bg-warning-500' 
                                    : 'bg-success-500'
                              }`}
                              style={{ width: `${Math.min(category.percentage, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${
                            category.percentage > 100 
                              ? 'text-error-600 dark:text-error-400' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {category.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card card-default">
            <div className="card-header">
              <div>
                <h3 className="card-title">Recent Transactions</h3>
                <p className="card-description">Your latest financial activity</p>
              </div>
              <button 
                onClick={() => navigate('/finance/history')}
                className="btn btn-ghost btn-sm"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                  <div className={`p-2.5 rounded-xl ${
                    transaction.type === 'income' 
                      ? 'bg-success-100 dark:bg-success-900' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <transaction.icon className={`w-5 h-5 ${
                      transaction.type === 'income' 
                        ? 'text-success-600 dark:text-success-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.category} • {transaction.date}
                        </p>
                      </div>
                      <span className={`font-semibold ${
                        transaction.type === 'income' 
                          ? 'text-success-600 dark:text-success-400' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Calendar Card */}
          <div className="card card-default">
            <div className="card-header">
              <div>
                <h3 className="card-title">Upcoming Events</h3>
                <p className="card-description">Your schedule for the next few days</p>
              </div>
              <button 
                onClick={() => navigate('/calendar')}
                className="btn btn-ghost btn-sm"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {upcomingEvents.map(event => {
                const eventDate = new Date(event.date);
                const isToday = new Date().toDateString() === eventDate.toDateString();
                const isPast = eventDate < new Date();
                
                const priorityColors = {
                  high: 'border-error-500 bg-error-50 dark:bg-error-900',
                  medium: 'border-warning-500 bg-warning-50 dark:bg-warning-900',
                  low: 'border-gray-300 bg-gray-50 dark:bg-gray-800'
                };
                
                return (
                  <div key={event.id} className={`flex items-center gap-4 p-4 rounded-xl border-l-4 ${priorityColors[event.priority]} transition-colors hover:shadow-sm`}>
                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${
                      isToday 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100'
                    }`}>
                      <span className="text-xs font-medium opacity-80">
                        {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold">
                        {eventDate.getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-medium ${isPast ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                          {event.title}
                        </p>
                        <span className={`badge ${
                          event.priority === 'high' 
                            ? 'badge-error' 
                            : event.priority === 'medium' 
                              ? 'badge-warning' 
                              : 'badge-gray'
                        }`}>
                          {event.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {event.time}
                        </div>
                        <span className="capitalize text-xs">
                          {event.type}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {upcomingEvents.length === 0 && (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No upcoming events</p>
                  <p className="text-sm">Your calendar is clear for now</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="card card-default">
            <div className="card-header">
              <div>
                <h3 className="card-title">Quick Actions</h3>
                <p className="card-description">Common household tasks</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/household/members')} 
                className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 group"
              >
                <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-900 group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
                  <UsersIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Members
                </span>
              </button>
              
              <button className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 group">
                <div className="p-2.5 rounded-xl bg-success-100 dark:bg-success-900 group-hover:bg-success-200 dark:group-hover:bg-success-800 transition-colors">
                  <ClipboardDocumentListIcon className="w-6 h-6 text-success-600 dark:text-success-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Tasks
                </span>
              </button>
              
              <button className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 group">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                  <ShoppingCartIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Shopping
                </span>
              </button>
              
              <button 
                onClick={() => navigate('/household/settings')} 
                className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 group"
              >
                <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                  <Cog6ToothIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Settings
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
