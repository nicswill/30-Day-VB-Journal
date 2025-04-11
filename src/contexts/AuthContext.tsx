import { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      const storedUser = users[email];
      
      if (!storedUser || storedUser.password !== password) {
        throw new Error('Invalid credentials');
      }

      const user = {
        id: storedUser.id,
        email: email
      };
      setUser(user);
    } catch (error) {
      throw new Error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      
      if (users[email]) {
        throw new Error('User already exists');
      }

      const newUser = {
        id: btoa(email),
        email,
        password
      };

      users[email] = newUser;
      localStorage.setItem('users', JSON.stringify(users));

      const user = {
        id: newUser.id,
        email: email
      };
      setUser(user);
    } catch (error) {
      throw new Error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}