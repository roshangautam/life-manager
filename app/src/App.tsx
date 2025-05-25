import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, ReactNode } from 'react';
import Layout from './components/layout/Layout';
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

// Define interface for props passed to UserLogin component
interface UserLoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

// Define interface for ProtectedRoute props
interface ProtectedRouteProps {
  children: ReactNode;
}

function App(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Protected route component with Layout
  const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return <Layout>{children}</Layout>;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<UserRegistration />} />
        <Route path="/login" element={<UserLogin setIsAuthenticated={setIsAuthenticated} />} />
        
        {/* Protected routes */}
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

        {/* Household routes */}
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

        {/* Finance routes */}
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

        {/* Default route */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
