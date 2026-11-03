import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole, AccountStatus } from '../types';

interface CreateUserParams {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: AccountStatus;
  demoBalance: number;
  phone?: string;
  country?: string;
  adminNotes?: string;
}

export const MRG_ADMIN_PASSWORD = 'admin@786';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  directEmailLogin: (email: string) => Promise<{ success: boolean; message?: string; isNewUser?: boolean }>;
  adminLoginWithPassword: (pass: string) => Promise<{ success: boolean; message?: string }>;
  loginAs: (role: 'trader' | 'admin') => void;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  verifyEmail: (code: string) => boolean;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (email: string, code: string, newPass: string) => Promise<boolean>;
  adminCreateUser: (params: CreateUserParams) => { success: boolean; message?: string; user?: User };
  adminUpdateUserStatus: (userId: string, status: AccountStatus) => void;
  adminAdjustUserBalance: (userId: string, amount: number) => void;
  adminToggleUserRole: (userId: string) => void;
  adminUpdateUser: (userId: string, updates: Partial<User>) => void;
  adminDeleteUser: (userId: string) => void;
}

const PRESET_USERS: User[] = [
  {
    id: 'TP-849201',
    name: 'Sarah Lin',
    email: 'trader@tradepro.io',
    role: 'user',
    status: 'active',
    avatarUrl: '/assets/images/avatar_trader_sarah_1793624992270.jpg',
    phone: '+1 (555) 234-5678',
    country: 'United States',
    kycTier: 'tier2',
    emailVerified: true,
    twoFactorEnabled: false,
    demoBalance: 14850.50,
    initialDemoBalance: 10000,
    adminNotes: 'VIP Trader - Strategy backtesting in crypto & forex',
    createdAt: '2026-01-15T09:20:00Z',
  },
  {
    id: 'TP-000001',
    name: 'MRG company Admin',
    email: 'admin@tradepro.io',
    role: 'admin',
    status: 'active',
    avatarUrl: '/assets/images/avatar_trader_marcus_1793624992948.jpg',
    phone: '+44 20 7946 0991',
    country: 'United Kingdom',
    kycTier: 'tier3',
    emailVerified: true,
    twoFactorEnabled: true,
    demoBalance: 50000.00,
    initialDemoBalance: 10000,
    adminNotes: 'MRG company Super Administrator - System Authority',
    createdAt: '2025-10-01T12:00:00Z',
  },
  {
    id: 'TP-391024',
    name: 'David Zhao',
    email: 'david.zhao@quantlabs.sg',
    role: 'user',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    phone: '+65 9123 4567',
    country: 'Singapore',
    kycTier: 'tier2',
    emailVerified: true,
    twoFactorEnabled: true,
    demoBalance: 9420.00,
    initialDemoBalance: 10000,
    adminNotes: 'Quant trader from Singapore desk',
    createdAt: '2026-02-10T14:30:00Z',
  },
  {
    id: 'TP-552199',
    name: 'Elena Rostova',
    email: 'elena.rostova@berlintrade.de',
    role: 'user',
    status: 'pending',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    phone: '+49 30 123456',
    country: 'Germany',
    kycTier: 'tier1',
    emailVerified: false,
    twoFactorEnabled: false,
    demoBalance: 10000.00,
    initialDemoBalance: 10000,
    adminNotes: 'Awaiting KYC tier 2 documents',
    createdAt: '2026-03-01T08:15:00Z',
  },
  {
    id: 'TP-109283',
    name: 'Klaus Mueller',
    email: 'klaus.m@invalidaudit.com',
    role: 'user',
    status: 'suspended',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    phone: '+41 22 765 4321',
    country: 'Switzerland',
    kycTier: 'tier1',
    emailVerified: true,
    twoFactorEnabled: false,
    demoBalance: 3200.00,
    initialDemoBalance: 10000,
    adminNotes: 'Account temporarily suspended by risk officer',
    createdAt: '2026-01-20T11:45:00Z',
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('tradepro_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved users', e);
      }
    }
    return PRESET_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('tradepro_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Never auto-log in preset/mock accounts like Sarah Lin or Klaus
        if (parsed && parsed.email && !parsed.email.includes('tradepro.io') && !parsed.email.includes('invalidaudit')) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse current user', e);
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('tradepro_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tradepro_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tradepro_current_user');
    }
  }, [currentUser]);

  const login = async (emailOrUsername: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    const query = emailOrUsername.trim().toLowerCase();
    
    // Check if logging in as MRG company admin
    if (query === 'admin' || query === 'mrg' || query === 'admin@tradepro.io' || pass === MRG_ADMIN_PASSWORD) {
      if (pass !== MRG_ADMIN_PASSWORD) {
        return { success: false, message: 'Incorrect password for MRG company. Access denied.' };
      }
      const admin = users.find((u) => u.role === 'admin') || PRESET_USERS[1];
      setCurrentUser(admin);
      return { success: true };
    }

    const existing = users.find((u) => 
      u.email.toLowerCase() === query || 
      u.name.toLowerCase() === query ||
      u.email.toLowerCase().split('@')[0] === query
    );

    if (!existing) {
      return { success: false, message: 'No account found with this username or email. Please sign up first.' };
    }

    if (existing.status === 'suspended') {
      return { success: false, message: 'Account is suspended by administrator. Please contact support desk.' };
    }

    setCurrentUser(existing);
    return { success: true };
  };

  const adminLoginWithPassword = async (pass: string): Promise<{ success: boolean; message?: string }> => {
    if (pass.trim() !== MRG_ADMIN_PASSWORD) {
      return { success: false, message: 'Incorrect password for MRG company. Access denied.' };
    }
    const admin = users.find((u) => u.role === 'admin') || PRESET_USERS[1];
    setCurrentUser(admin);
    return { success: true };
  };

  const loginAs = (role: 'trader' | 'admin') => {
    if (role === 'admin') {
      const admin = users.find((u) => u.role === 'admin') || PRESET_USERS[1];
      setCurrentUser(admin);
    } else {
      const trader = users.find((u) => u.id === 'TP-849201') || PRESET_USERS[0];
      setCurrentUser(trader);
    }
  };

  const directEmailLogin = async (email: string): Promise<{ success: boolean; message?: string; isNewUser?: boolean }> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      if (existing.status === 'suspended') {
        return { success: false, message: 'Account is suspended by administrator.' };
      }
      setCurrentUser(existing);
      return { success: true, isNewUser: false };
    }

    // Auto-create new user with 0.00 balance awaiting admin allocation
    const uniqueId = `TP-${Math.floor(100000 + Math.random() * 900000)}`;
    const rawName = normalizedEmail.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    const newUser: User = {
      id: uniqueId,
      name: formattedName || 'New Trader',
      email: normalizedEmail,
      role: 'user',
      status: 'active',
      avatarUrl: '/assets/images/avatar_trader_sarah_1793624992270.jpg',
      kycTier: 'tier1',
      emailVerified: true,
      twoFactorEnabled: false,
      demoBalance: 0.00, // Blank until admin adds balance
      initialDemoBalance: 0.00,
      adminNotes: 'Direct email registered - Awaiting initial balance funding',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true, isNewUser: true };
  };

  const register = async (name: string, email: string, pass: string): Promise<{ success: boolean; message?: string; user?: User }> => {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const uniqueId = `TP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newUser: User = {
      id: uniqueId,
      name: name.trim(),
      email: normalizedEmail,
      role: 'user',
      status: 'active',
      avatarUrl: '/assets/images/avatar_trader_sarah_1793624992270.jpg',
      kycTier: 'tier1',
      emailVerified: false,
      twoFactorEnabled: false,
      demoBalance: 0.00, // Starts blank until admin adds balance
      initialDemoBalance: 0.00,
      adminNotes: 'Registered online - Awaiting admin balance allocation',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const verifyEmail = (code: string): boolean => {
    if (!currentUser) return false;
    if (code.length === 6) {
      updateProfile({ emailVerified: true });
      return true;
    }
    return false;
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    return !!existing;
  };

  const resetPassword = async (email: string, code: string, newPass: string): Promise<boolean> => {
    const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    return !!existing && code.length >= 4 && newPass.length >= 6;
  };

  // Admin user creation
  const adminCreateUser = (params: CreateUserParams): { success: boolean; message?: string; user?: User } => {
    const normalizedEmail = params.email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, message: 'User with this email already exists.' };
    }

    const uniqueId = `TP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newUser: User = {
      id: uniqueId,
      name: params.name.trim(),
      email: normalizedEmail,
      role: params.role,
      status: params.status,
      avatarUrl:
        params.role === 'admin'
          ? '/assets/images/avatar_trader_marcus_1793624992948.jpg'
          : '/assets/images/avatar_trader_sarah_1793624992270.jpg',
      phone: params.phone || '',
      country: params.country || 'Global',
      kycTier: 'tier1',
      emailVerified: true,
      twoFactorEnabled: false,
      demoBalance: Number(params.demoBalance) || 10000.0,
      initialDemoBalance: Number(params.demoBalance) || 10000.0,
      adminNotes: params.adminNotes || 'Created by Administrator',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    return { success: true, user: newUser };
  };

  const adminUpdateUserStatus = (userId: string, status: AccountStatus) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, status };
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
  };

  const adminAdjustUserBalance = (userId: string, amount: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, demoBalance: Math.max(0, u.demoBalance + amount) };
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
  };

  const adminToggleUserRole = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newRole: UserRole = u.role === 'admin' ? 'user' : 'admin';
          const updated = { ...u, role: newRole };
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
  };

  const adminUpdateUser = (userId: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...updates };
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
  };

  const adminDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(PRESET_USERS[0]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        directEmailLogin,
        adminLoginWithPassword,
        loginAs,
        register,
        logout,
        updateProfile,
        verifyEmail,
        requestPasswordReset,
        resetPassword,
        adminCreateUser,
        adminUpdateUserStatus,
        adminAdjustUserBalance,
        adminToggleUserRole,
        adminUpdateUser,
        adminDeleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
