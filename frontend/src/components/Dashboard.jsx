import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowTrendingUpIcon, 
  CalendarIcon, 
  ClockIcon,
  CurrencyDollarIcon, 
  UsersIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

function Dashboard() {
  const navigate = useNavigate();
  
  const [user] = useState({
    name: 'John Doe',
    household: 'Doe Family'
  });

  // Mock data for dashboard widgets
  const financeData = {
    monthlyBudget: 5000,
    currentSpending: 3245,
    categories: [
      { name: 'Food', amount: 1200, budget: 1500, color: 'bg-blue-500' },
      { name: 'Bills', amount: 1500, budget: 1800, color: 'bg-purple-500' },
      { name: 'Healthcare', amount: 545, budget: 800, color: 'bg-green-500' }
    ]
  };

  const upcomingEvents = [
    { id: 1, title: 'Doctor Appointment', date: '2025-05-20', time: '10:00 AM' },
    { id: 2, title: 'School Meeting', date: '2025-05-24', time: '3:30 PM' },
    { id: 3, title: 'Family Dinner', date: '2025-05-25', time: '7:00 PM' }
  ];

  // Calculate percentage
  const spendingPercentage = Math.round((financeData.currentSpending / financeData.monthlyBudget) * 100);
  const isOverBudget = spendingPercentage > 100;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
        <p className="mt-1 text-sm text-gray-500">Household: {user.household}</p>
      </div>

      {/* Dashboard grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Financial Overview Card */}
        <div className="col-span-1 xl:col-span-2">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Financial Overview</h2>
              <button 
                onClick={() => navigate('/finance/history')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View Details
              </button>
            </div>
            
            {/* Budget progress */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium text-gray-500">Monthly Budget</div>
                <div className="text-sm font-medium">
                  <span className={isOverBudget ? 'text-red-600' : 'text-gray-900'}>
                    ${financeData.currentSpending.toLocaleString()}
                  </span>
                  {' '}/{' '}
                  <span className="text-gray-900">${financeData.monthlyBudget.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-600' : 'bg-primary-600'}`}
                  style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Top Spending Categories</h3>
              <div className="space-y-3">
                {financeData.categories.map((category, index) => {
                  const percentage = Math.round((category.amount / category.budget) * 100);
                  const isOverCategoryBudget = percentage > 100;
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-900">{category.name}</span>
                        <span className="font-medium">
                          <span className={isOverCategoryBudget ? 'text-red-600' : 'text-gray-900'}>
                            ${category.amount.toLocaleString()}
                          </span>
                          {' '}/{' '}
                          <span className="text-gray-900">${category.budget.toLocaleString()}</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${isOverCategoryBudget ? 'bg-red-600' : category.color}`} 
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button 
                className="btn btn-primary flex items-center justify-center"
                onClick={() => navigate('/finance/expenses')}
              >
                <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                Add Expense
              </button>
              <button 
                className="btn btn-secondary flex items-center justify-center"
                onClick={() => navigate('/finance/budget')}
              >
                <ArrowTrendingUpIcon className="w-5 h-5 mr-2" />
                Budget Overview
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View Calendar
            </button>
          </div>
          
          <div className="divide-y divide-gray-200">
            {upcomingEvents.map(event => {
              const eventDate = new Date(event.date);
              const isToday = new Date().toDateString() === eventDate.toDateString();
              const isPast = eventDate < new Date();
              
              return (
                <div key={event.id} className="flex py-3 first:pt-0 last:pb-0">
                  <div className="flex-shrink-0 mr-4">
                    <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center ${isToday ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                      <span className="text-xs font-medium">
                        {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold">
                        {eventDate.getDate()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isPast ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {event.title}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {event.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {upcomingEvents.length === 0 && (
            <div className="py-6 text-center text-gray-500">
              <CalendarIcon className="w-8 h-8 mx-auto mb-2" />
              <p>No upcoming events</p>
            </div>
          )}
        </div>

        {/* Household Management Card */}
        <div className="card xl:col-span-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Household Management</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => navigate('/household/members')} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <UsersIcon className="w-8 h-8 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Members</span>
            </button>
            
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <ClipboardDocumentListIcon className="w-8 h-8 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Tasks</span>
            </button>
            
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <ShoppingCartIcon className="w-8 h-8 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Shopping</span>
            </button>
            
            <button onClick={() => navigate('/household/settings')} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Cog6ToothIcon className="w-8 h-8 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
