import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const navigate = useNavigate();
  const financeMenuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleFinanceMenu = (e) => {
    e.stopPropagation();
    setIsFinanceOpen(!isFinanceOpen);
  };

  // Close finance menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (financeMenuRef.current && !financeMenuRef.current.contains(event.target)) {
        setIsFinanceOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsFinanceOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          Life Manager
        </Link>

        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <i className={isMobileMenuOpen ? "fa fa-times" : "fa fa-bars"}></i>
        </div>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link" onClick={closeMobileMenu}>
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item finance-menu" ref={financeMenuRef}>
                <div className="nav-link" onClick={toggleFinanceMenu}>
                  <i className="fas fa-wallet"></i> Finance
                  <i className={`fas fa-chevron-${isFinanceOpen ? 'up' : 'down'}`}></i>
                </div>
                {isFinanceOpen && (
                  <div className="dropdown-menu">
                    <Link to="/finance/expenses" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fas fa-plus-circle"></i> Add Expense
                    </Link>
                    <Link to="/finance/history" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fas fa-history"></i> Expense History
                    </Link>
                    <Link to="/finance/budget" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fas fa-chart-pie"></i> Budget Overview
                    </Link>
                    <Link to="/finance/analytics" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fas fa-chart-line"></i> Analytics
                    </Link>
                    <Link to="/finance/recurring" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fas fa-sync"></i> Recurring Expenses
                    </Link>
                    <Link to="/finance/budget-settings" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fas fa-cog"></i> Budget Settings
                    </Link>
                  </div>
                )}
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link" onClick={closeMobileMenu}>
                  <i className="fas fa-user"></i> Profile
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="logout-button">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={closeMobileMenu}>
                  <i className="fas fa-sign-in-alt"></i> Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link" onClick={closeMobileMenu}>
                  <i className="fas fa-user-plus"></i> Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
