import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (displayName: string, photoURL?: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock auth functions - replace with actual authentication logic
  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock user data
    const user: User = {
      uid: 'mock-user-123',
      email,
      displayName: email.split('@')[0],
      photoURL: null,
      emailVerified: true,
    };
    
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const signup = async (email: string, password: string, displayName: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock user data
    const user: User = {
      uid: 'mock-user-' + Math.random().toString(36).substr(2, 9),
      email,
      displayName,
      photoURL: null,
      emailVerified: false,
    };
    
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setCurrentUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const resetPassword = async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Password reset email sent to:', email);
  };

  const updateProfile = async (displayName: string, photoURL?: string) => {
    if (!currentUser) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser: User = {
      ...currentUser,
      displayName,
      photoURL: photoURL || currentUser.photoURL,
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const updateEmail = async (email: string) => {
    if (!currentUser) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser: User = {
      ...currentUser,
      email,
      emailVerified: false,
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const updatePassword = async (password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Password updated');
  };

  // Check for logged in user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
