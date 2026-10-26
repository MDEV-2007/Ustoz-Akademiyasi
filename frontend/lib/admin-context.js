'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminApi, getStoredToken, getStoredUser, clearStoredAuth, setStoredToken } from './admin-api';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  // Toast notification dispatcher
  const notify = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Initialize Auth state on client mount
  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      // Verify token in background
      AdminApi.auth.me()
        .then((verifiedUser) => {
          if (verifiedUser) {
            setUser(verifiedUser);
            setStoredToken(storedToken, verifiedUser);
          }
        })
        .catch(() => {
          // If token expired, clear auth if not on login page
          if (!pathname.includes('/login')) {
            clearStoredAuth();
            setToken(null);
            setUser(null);
            router.push('/admin/login');
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      if (!pathname.includes('/login') && pathname.startsWith('/admin')) {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await AdminApi.auth.login(email, password);
      if (res?.accessToken && res?.user) {
        setToken(res.accessToken);
        setUser(res.user);
        notify(`Xush kelibsiz, ${res.user.fullName}!`, 'success');
        router.push('/admin/dashboard');
        return { success: true };
      }
      throw new Error('Kirish ma’lumotlari noto‘g‘ri');
    } catch (err) {
      notify(err.message || 'Kirishda xatolik yuz berdi', 'error');
      return { success: false, error: err.message };
    }
  };

  // Demo / Quick superadmin login
  const loginAsDemoAdmin = async () => {
    return login('admin@ustozakademiyasi.uz', 'SecureAdminPassword2026!#');
  };

  // Logout handler
  const logout = async () => {
    try {
      await AdminApi.auth.logout();
    } catch {
      // Ignore API errors on logout
    } finally {
      clearStoredAuth();
      setToken(null);
      setUser(null);
      notify('Tizimdan muvaffaqiyatli chiqildi', 'info');
      router.push('/admin/login');
    }
  };

  // Role permissions checker
  const hasRole = useCallback(
    (...roles) => {
      if (!user) return false;
      if (user.role === 'SUPER_ADMIN') return true;
      return roles.includes(user.role);
    },
    [user]
  );

  return (
    <AdminContext.Provider
      value={{
        user,
        token,
        loading,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        searchQuery,
        setSearchQuery,
        login,
        loginAsDemoAdmin,
        logout,
        hasRole,
        notify,
        showToast: notify,
        toasts,
        removeToast,
      }}
    >
      {children}

      {/* Global Toast Notifications Container */}
      <div className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start justify-between gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all transform animate-in slide-in-from-bottom-2 ${
              toast.type === 'error'
                ? 'bg-rose-600 text-white'
                : toast.type === 'info'
                ? 'bg-slate-800 text-white'
                : 'bg-[#086641] text-white'
            }`}
          >
            <p className="flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/70 hover:text-white transition-colors cursor-pointer text-base leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return ctx;
}
