import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import UserRegistration from './components/UserRegistration';
import UserLogin from './components/UserLogin';
import UserProfile from './components/UserProfile';
import Dashboard from './components/Dashboard';
import HouseholdCreate from './components/household/HouseholdCreate';
import HouseholdMembers from './components/household/HouseholdMembers';
import HouseholdSettings from './components/household/HouseholdSettings';
import ExpenseEntry from './components/finance/ExpenseEntry';
import ExpenseList from './components/finance/ExpenseList';
import BudgetOverview from './components/finance/BudgetOverview';
import BudgetSettings from './components/finance/BudgetSettings';
import AnalyticsDashboard from './components/finance/AnalyticsDashboard';
import RecurringExpenses from './components/finance/RecurringExpenses';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <div className="app-content">
          <Routes>
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/login" element={<UserLogin setIsAuthenticated={setIsAuthenticated} />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/household/create" 
              element={
                <ProtectedRoute>
                  <HouseholdCreate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/household/members" 
              element={
                <ProtectedRoute>
                  <HouseholdMembers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/household/settings" 
              element={
                <ProtectedRoute>
                  <HouseholdSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance/expenses" 
              element={
                <ProtectedRoute>
                  <ExpenseEntry />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance/history" 
              element={
                <ProtectedRoute>
                  <ExpenseList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance/budget" 
              element={
                <ProtectedRoute>
                  <BudgetOverview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance/budget-settings" 
              element={
                <ProtectedRoute>
                  <BudgetSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance/analytics" 
              element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance/recurring" 
              element={
                <ProtectedRoute>
                  <RecurringExpenses />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
