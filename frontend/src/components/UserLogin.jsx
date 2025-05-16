import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLogin.css';

function UserLogin({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // TODO: Connect with backend API
      console.log('Login data submitted:', formData);
      // Simulate API call success
      setTimeout(() => {
        // Store token in localStorage (in a real app)
        localStorage.setItem('userToken', 'fake-jwt-token');
        setIsAuthenticated(true); // Update authentication state in App.jsx
        // Redirect to profile page
        navigate('/profile');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Invalid email or password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        {errors.submit && <div className="error-message global-error">{errors.submit}</div>}

        <button type="submit" disabled={isSubmitting} className="login-button">
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </form>
    </div>
  );
}

export default UserLogin;
