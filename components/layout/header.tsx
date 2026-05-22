'use client';

import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';
import { Moon, Sun, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';

export function Header() {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    const logoutBtn = document.getElementById('getToken') as HTMLButtonElement;
    logoutBtn?.click();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>

      {isAuthenticated ? (
        <>
          {user?.picture && (
            <img
              src={user.picture}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </>
      ) : (
        <Button onClick={handleLogin} className="gap-2">
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      )}
    </div>
  );
}
