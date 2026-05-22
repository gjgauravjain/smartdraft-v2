# Route Protection - Quick Reference

## 🚀 Components Created

### 1. PrivateRoute (`/components/routes/private-route.tsx`)
Protects routes requiring authentication.

```tsx
import { PrivateRoute } from '@/components/routes';

export default function ProtectedPage() {
  return (
    <PrivateRoute>
      <YourContent />
    </PrivateRoute>
  );
}
```

### 2. PublicRoute (`/components/routes/public-route.tsx`)
For login/register pages - redirects authenticated users.

```tsx
import { PublicRoute } from '@/components/routes';

export default function LoginPage() {
  return (
    <PublicRoute redirectTo="/dashboard">
      <LoginForm />
    </PublicRoute>
  );
}
```

## 📁 Example Pages Created

### `/app/page.tsx` - Landing Page
- Shows different content for authenticated/unauthenticated users
- Links to login or dashboard

### `/app/login/page.tsx` - Login Page
- Uses `PublicRoute`
- Redirects authenticated users to `/dashboard`

### `/app/dashboard/page.tsx` - Dashboard
- Uses `PrivateRoute`
- Shows user info and Zustand state examples

## 🔄 Authentication Flow

```
1. User visits /dashboard (protected)
   ↓
2. PrivateRoute checks authentication
   ↓
   ├─ ✅ Authenticated → Show dashboard
   └─ ❌ Not authenticated → Redirect to Auth0 login
      ↓
3. User logs in via Auth0
   ↓
4. Auth0 redirects back to /dashboard
   ↓
5. Access token saved in Zustand store
```

## 📝 Usage Examples

### Protect a Page
```tsx
// app/projects/page.tsx
'use client';

import { PrivateRoute } from '@/components/routes';

export default function ProjectsPage() {
  return (
    <PrivateRoute>
      <div>Protected Content</div>
    </PrivateRoute>
  );
}
```

### Create a Login Page
```tsx
// app/login/page.tsx
'use client';

import { PublicRoute } from '@/components/routes';
import { useAuth0 } from '@auth0/auth0-react';

export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginForm />
    </PublicRoute>
  );
}

function LoginForm() {
  const { loginWithRedirect } = useAuth0();
  
  return (
    <button onClick={() => loginWithRedirect()}>
      Sign In
    </button>
  );
}
```

### Access User Info in Protected Page
```tsx
'use client';

import { PrivateRoute } from '@/components/routes';
import { useAuth0 } from '@auth0/auth0-react';
import { useStore } from '@/store/useStore';

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <ProfileContent />
    </PrivateRoute>
  );
}

function ProfileContent() {
  const { user } = useAuth0();
  const { accessToken } = useStore();
  
  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <p>Token: {accessToken ? 'Present' : 'None'}</p>
    </div>
  );
}
```

### Logout
```tsx
const handleLogout = () => {
  const logoutBtn = document.getElementById('getToken') as HTMLButtonElement;
  logoutBtn?.click();
};

<button onClick={handleLogout}>Logout</button>
```

Or programmatically:
```tsx
import { useAuth0 } from '@auth0/auth0-react';
import { useStore } from '@/store/useStore';

const { logout } = useAuth0();
const { clearAuth } = useStore();

const handleLogout = () => {
  clearAuth();
  logout({ logoutParams: { returnTo: window.location.origin } });
};
```

## 🛠️ Configuration

### Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
```

### Post-Login Redirect
Configured in [providers/auth-provider.tsx](../providers/auth-provider.tsx):
```tsx
const onRedirectCallback = (appState?: any) => {
  router.push(appState?.returnTo || '/dashboard');
};
```

## 📊 State Management

Access auth state and app state anywhere:
```tsx
import { useAuth, useAppState, useStore } from '@/store/useStore';

// Method 1: Use selector hooks (with shallow comparison for performance)
const { accessToken, user } = useAuth();
const { currentProject, setCurrentProject } = useAppState();

// Method 2: Select individual values (best for single values)
const isSideBarOpen = useStore((state) => state.isSideBarOpen);
const setIsSideBarOpen = useStore((state) => state.setIsSideBarOpen);
```

**Performance Tip:** The `useAuth()` and `useAppState()` hooks use shallow comparison to prevent unnecessary re-renders. Only select the values you actually need.

## 🎯 Common Routes Structure

```
/                   → Landing page (public)
/login              → Login page (PublicRoute)
/dashboard          → Dashboard (PrivateRoute)
/projects           → Projects (PrivateRoute)
/settings           → Settings (PrivateRoute)
```

## 🔍 Check Authentication Status

```tsx
import { useAuth0 } from '@auth0/auth0-react';

const { isAuthenticated, isLoading, user } = useAuth0();

if (isLoading) return <div>Loading...</div>;
if (!isAuthenticated) return <div>Please log in</div>;

return <div>Welcome, {user?.name}!</div>;
```

## 📚 Documentation

- Full route details: [components/routes/README.md](README.md)
- Migration guide: [MIGRATION.md](../../MIGRATION.md)
- Store usage: [store/useStore.ts](../../store/useStore.ts)

## ✅ Testing Checklist

- [ ] Visit `/dashboard` without login → Redirects to Auth0
- [ ] Complete login → Redirects to `/dashboard`
- [ ] Visit `/login` while authenticated → Redirects to `/dashboard`
- [ ] State persists after page refresh
- [ ] Logout clears state and redirects properly
