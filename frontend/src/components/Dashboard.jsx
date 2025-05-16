import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    name: 'John Doe',
    household: 'Doe Family'
  });

  // Mock data for dashboard widgets
  const financeData = {
    monthlyBudget: 5000,
    currentSpending: 3245,
    categories: [
      { name: 'Food', amount: 1200, budget: 1500 },
      { name: 'Bills', amount: 1500, budget: 1800 },
      { name: 'Healthcare', amount: 545, budget: 800 }
    ]
  };

  const upcomingEvents = [
    { id: 1, title: 'Doctor Appointment', date: '2025-05-20', time: '10:00 AM' },
    { id: 2, title: 'School Meeting', date: '2025-05-24', time: '3:30 PM' },
    { id: 3, title: 'Family Dinner', date: '2025-05-25', time: '7:00 PM' }
  ];

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.name}</h1>
      <p className="subtitle">Household: {user.household}</p>

      <div className="dashboard-grid">
        <div className="dashboard-card finance-card">
          <h2>Financial Overview</h2>
          <div className="budget-overview">
            <div className="budget-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${(financeData.currentSpending / financeData.monthlyBudget) * 100}%` }}
              ></div>
            </div>
            <div className="budget-text">
              <p>${financeData.currentSpending} of ${financeData.monthlyBudget}</p>
            </div>
          </div>

          <h3>Categories</h3>
          <div className="categories-list">
            {financeData.categories.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-header">
                  <span className="category-name">{category.name}</span>
                  <span className="category-amount">${category.amount} / ${category.budget}</span>
                </div>
                <div className="category-progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${(category.amount / category.budget) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="card-action-btn"
            onClick={() => navigate('/finance/history')}
          >
            Manage Finances
          </button>
        </div>

        <div className="dashboard-card calendar-card">
          <h2>Upcoming Events</h2>
          <div className="events-list">
            {upcomingEvents.map(event => (
              <div key={event.id} className="event-item">
                <div className="event-date">
                  <span className="event-month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="event-day">{new Date(event.date).getDate()}</span>
                </div>
                <div className="event-details">
                  <h4>{event.title}</h4>
                  <p>{event.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="card-action-btn">View Calendar</button>
        </div>

        <div className="dashboard-card household-card">
          <h2>Household Management</h2>
          <div className="household-menu">
            <div className="household-menu-item">
              <i className="icon">👪</i>
              <span>Members</span>
            </div>
            <div className="household-menu-item">
              <i className="icon">📝</i>
              <span>Tasks</span>
            </div>
            <div className="household-menu-item">
              <i className="icon">🛒</i>
              <span>Shopping</span>
            </div>
            <div className="household-menu-item">
              <i className="icon">⚙️</i>
              <span>Settings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
