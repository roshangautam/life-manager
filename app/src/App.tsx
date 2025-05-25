import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { ReactNode, Suspense } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Lazy load components for better performance
const Layout = React.lazy(() => import('./components/layout/Layout'));
const UserRegistration = React.lazy(() => import('./components/UserRegistration'));
const UserLogin = React.lazy(() => import('./components/UserLogin'));
const UserProfile = React.lazy(() => import('./components/UserProfile'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const HouseholdCreate = React.lazy(() => import('./components/household/HouseholdCreate'));
const HouseholdMembers = React.lazy(() => import('./components/household/HouseholdMembers'));
const HouseholdSettings = React.lazy(() => import('./components/household/HouseholdSettings'));
const ExpenseEntry = React.lazy(() => import('./components/finance/ExpenseEntry'));
const ExpenseList = React.lazy(() => import('./components/finance/ExpenseList'));
const BudgetOverview = React.lazy(() => import('./components/finance/BudgetOverview'));
const BudgetSettings = React.lazy(() => import('./components/finance/BudgetSettings'));
const AnalyticsDashboard = React.lazy(() => import('./components/finance/AnalyticsDashboard'));
const RecurringExpenses = React.lazy(() => import('./components/finance/RecurringExpenses'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

// Define interface for ProtectedRoute props
interface ProtectedRouteProps {
  children: ReactNode;
}

// Protected route component with Layout
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Layout>{children}</Layout>
    </Suspense>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/forgot-password" element={<div>Forgot Password</div>} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            
            {/* Finance routes */}
            <Route path="/finance/expenses" element={
              <ProtectedRoute>
                <ExpenseEntry />
              </ProtectedRoute>
            } />
            
            <Route path="/finance/history" element={
              <ProtectedRoute>
                <ExpenseList />
              </ProtectedRoute>
            } />
            
            <Route path="/finance/budget" element={
              <ProtectedRoute>
                <BudgetOverview />
              </ProtectedRoute>
            } />
            
            <Route path="/finance/analytics" element={
              <ProtectedRoute>
                <AnalyticsDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/finance/recurring" element={
              <ProtectedRoute>
                <RecurringExpenses />
              </ProtectedRoute>
            } />
            
            <Route path="/finance/settings" element={
              <ProtectedRoute>
                <BudgetSettings />
              </ProtectedRoute>
            } />
            
            {/* Household routes */}
            <Route path="/household/create" element={
              <ProtectedRoute>
                <HouseholdCreate />
              </ProtectedRoute>
            } />
            
            <Route path="/household/members" element={
              <ProtectedRoute>
                <HouseholdMembers />
              </ProtectedRoute>
            } />
            
            <Route path="/household/settings" element={
              <ProtectedRoute>
                <HouseholdSettings />
              </ProtectedRoute>
            } />
            
            {/* 404 route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </Suspense>
  );
};

export default App;
