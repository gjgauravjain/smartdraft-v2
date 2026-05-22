# Route Protection Components

This guide explains how to use the `PrivateRoute` and `PublicRoute` components for route protection.

## Components

### PrivateRoute

Protects routes that require authentication. Redirects unauthenticated users to the login page.

**Location:** `/components/routes/private-route.tsx`

#### Usage

```tsx
'use client';

import { PrivateRoute } from '@/components/routes';

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <YourProtectedContent />
    </PrivateRoute>
  );
}
```

#### Props

- `children` (ReactNode) - The protected content to render
- `fallback` (ReactNode, optional) - Custom loading component

#### Example with Custom Fallback

```tsx
<PrivateRoute 
  fallback={
    <div className="flex items-center justify-center min-h-screen">
      <p>Checking authentication...</p>
    </div>
  }
>
  <ProtectedContent />
</PrivateRoute>
```

---

### PublicRoute

For pages that should only be accessible to non-authenticated users (e.g., login, register pages). Redirects authenticated users to a specified route.

**Location:** `/components/routes/public-route.tsx`

#### Usage

```tsx
'use client';

import { PublicRoute } from '@/components/routes';

export default function LoginPage() {
  return (
    <PublicRoute redirectTo="/dashboard">
      <YourLoginForm />
    </PublicRoute>
  );
}
```

#### Props

- `children` (ReactNode) - The public content to render
- `redirectTo` (string, optional) - Where to redirect authenticated users (default: `/dashboard`)
- `fallback` (ReactNode, optional) - Custom loading component

#### Example with Custom Redirect

```tsx
<PublicRoute redirectTo="/home">
  <LoginForm />
</PublicRoute>
```

---

## Complete Page Examples

### Protected Dashboard Page

**File:** `/app/dashboard/page.tsx`

```tsx
'use client';

import { PrivateRoute } from '@/components/routes';
import { useStore } from '@/store/useStore';
import { useAuth0 } from '@auth0/auth0-react';

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <DashboardContent />
    </PrivateRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth0();
  const { currentProject, setCurrentProject } = useStore();

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Current Project: {currentProject}</p>
    </div>
  );
}
```

### Public Login Page

**File:** `/app/login/page.tsx`

```tsx
'use client';

import { PublicRoute } from '@/components/routes';
import { useAuth0 } from '@auth0/auth0-react';

export default function LoginPage() {
  return (
    <PublicRoute redirectTo="/dashboard">
      <LoginContent />
    </PublicRoute>
  );
}

function LoginContent() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => loginWithRedirect()}>
        Sign In
      </button>
    </div>
  );
}
```

---

## How It Works

### Authentication Flow

1. **User visits protected route** → `PrivateRoute` checks authentication
   - ✅ Authenticated → Shows content
   - ❌ Not authenticated → Redirects to Auth0 login

2. **After successful login** → Auth0 redirects to `/dashboard` (configured in `auth-provider.tsx`)

3. **User visits public route (e.g., /login)** → `PublicRoute` checks authentication
   - ✅ Authenticated → Redirects to dashboard
   - ❌ Not authenticated → Shows login page

### Return URL Handling

When redirecting to login, the `PrivateRoute` preserves the original URL:

```tsx
loginWithRedirect({
  appState: { returnTo: window.location.pathname },
});
```

After login, users are returned to their original destination or `/dashboard`.

---

## Common Patterns

### Multiple Protected Routes

```tsx
// app/projects/page.tsx
export default function ProjectsPage() {
  return (
    <PrivateRoute>
      <ProjectsList />
    </PrivateRoute>
  );
}

// app/settings/page.tsx
export default function SettingsPage() {
  return (
    <PrivateRoute>
      <SettingsForm />
    </PrivateRoute>
  );
}
```

### Mixed Public/Private Routes

```tsx
// Public routes
/login        → PublicRoute
/register     → PublicRoute

// Protected routes
/dashboard    → PrivateRoute
/projects     → PrivateRoute
/settings     → PrivateRoute
```

### Nested Protection

```tsx
// Layout-level protection
export default function DashboardLayout({ children }) {
  return (
    <PrivateRoute>
      <DashboardNav />
      {children}
    </PrivateRoute>
  );
}
```

---

## Best Practices

1. **Wrap at the page level** - Apply route protection in page components, not in nested components
2. **Use consistent redirects** - Keep `redirectTo` consistent across public routes
3. **Custom loading states** - Provide meaningful loading indicators
4. **Error boundaries** - Wrap protected content in error boundaries for better UX

---

## Troubleshooting

### Issue: Infinite redirect loop
**Solution:** Ensure you're not wrapping the same route with both `PrivateRoute` and `PublicRoute`

### Issue: Not redirecting after login
**Solution:** Check that `NEXT_PUBLIC_AUTH0_DOMAIN` and `NEXT_PUBLIC_AUTH0_CLIENT_ID` are set in `.env.local`

### Issue: Page flashes before redirect
**Solution:** This is normal behavior during the authentication check. Use the `fallback` prop to show a loading state

---

## Testing

### Test Protected Route
1. Visit `/dashboard` while logged out → Should redirect to Auth0 login
2. Complete login → Should return to dashboard

### Test Public Route
1. Visit `/login` while logged out → Should show login page
2. Log in and visit `/login` → Should redirect to `/dashboard`

---

## Related Files

- [store/useStore.ts](../store/useStore.ts) - State management
- [providers/auth-provider.tsx](../providers/auth-provider.tsx) - Auth0 configuration
- [providers/auth-manager.tsx](../providers/auth-manager.tsx) - Auth lifecycle management
- [MIGRATION.md](../MIGRATION.md) - Full migration guide
