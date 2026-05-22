# Migration Guide: Redux to Zustand with Auth0

This document outlines the migration from Redux + Redux Persist to Zustand with persist middleware in the Next.js application.

## What Was Set Up

### 1. Dependencies Installed
- `zustand` - State management
- `@auth0/auth0-react` - Authentication

### 2. Zustand Store (`/store/useStore.ts`)

The store combines authentication and application state in a single location:

#### Authentication State
- `accessToken` - Auth0 access token
- `user` - User information
- `setAccessToken()` - Update access token
- `setUser()` - Update user info
- `clearAuth()` - Clear authentication state

#### Application State
All state from the old Redux `header` slice:
- `currentProject`
- `currentOrganisation`
- `selectedFlag`
- `hoveredTeamId`
- `selectedTransactionModal`
- `uploadCsvTransactionTypeModal`
- `isSideBarOpen`
- `flagList`
- `refreshFlagData`

With corresponding setter functions for each.

#### Persistence
The store uses `persist` middleware to save state to localStorage under the key `gtx-storage`. Only critical fields are persisted:
- `accessToken`
- `user`
- `currentProject`
- `currentOrganisation`
- `selectedFlag`

### 3. Provider Components

#### `Auth0ProviderWrapper` (`/providers/auth-provider.tsx`)
- Wraps the app with Auth0 authentication
- Handles redirect callbacks
- Uses environment variables for configuration

#### `AuthManager` (`/providers/auth-manager.tsx`)
- Manages authentication lifecycle
- Automatically fetches access token when user is authenticated
- Syncs Auth0 user state with Zustand store
- Provides logout functionality

### 4. Layout Integration (`/app/layout.tsx`)
The root layout now includes the authentication providers:
```tsx
<Auth0ProviderWrapper>
  <AuthManager>
    {children}
  </AuthManager>
</Auth0ProviderWrapper>
```

## Environment Variables

Create a `.env.local` file with:
```env
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
```

## Usage Examples

### Using the Store in Components

```tsx
'use client';

import { useAuth, useAppState, useStore } from '@/store/useStore';
import { useAuth0 } from '@auth0/auth0-react';

function MyComponent() {
  // Method 1: Use specific selector hooks (with shallow comparison)
  const { accessToken, user } = useAuth();
  const { currentProject, setCurrentProject } = useAppState();

  // Method 2: Use the main store with selectors (best for single values)
  const isSideBarOpen = useStore((state) => state.isSideBarOpen);
  const setIsSideBarOpen = useStore((state) => state.setIsSideBarOpen);

  // Auth0 hooks
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  // ... your component logic
}
```

**Important:** The `useAuth()` and `useAppState()` hooks use shallow comparison to prevent unnecessary re-renders. This means they only re-render when the actual values change, not when a new object reference is created.

### Authentication Actions

```tsx
// Login
const { loginWithRedirect } = useAuth0();
loginWithRedirect();

// Logout
const { clearAuth } = useAuth();
const { logout } = useAuth0();

clearAuth(); // Clear Zustand state
logout({ 
  logoutParams: { returnTo: window.location.origin } 
});

// Check authentication
const { isAuthenticated, isLoading } = useAuth0();
```

### Accessing State

```tsx
// Get current project
const currentProject = useStore((state) => state.currentProject);

// Set current project
const setCurrentProject = useStore((state) => state.setCurrentProject);
setCurrentProject('project-id');

// Toggle sidebar
const { isSideBarOpen, setIsSideBarOpen } = useStore();
setIsSideBarOpen(!isSideBarOpen);
```

## Key Differences from Redux

### Before (Redux)
```tsx
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentProject } from '@/store/header';

const dispatch = useDispatch();
const currentProject = useSelector((state) => state.header.currentProject);
dispatch(setCurrentProject('project-id'));
```

### After (Zustand)
```tsx
import { useStore } from '@/store/useStore';

const { currentProject, setCurrentProject } = useStore();
setCurrentProject('project-id');
```

## Benefits

1. **Simpler**: No need for reducers, actions, or dispatch
2. **Less Boilerplate**: Direct state updates
3. **Better TypeScript**: Full type inference
4. **Flexible**: Use the whole store or select specific parts
5. **Performance**: Optimized re-renders with selectors
6. **Built-in Persistence**: Easy localStorage integration

## Performance Optimization

### Shallow Comparison
The helper hooks (`useAuth` and `useAppState`) use shallow comparison to prevent infinite loops:

```tsx
// Uses shallow comparison - only re-renders when values change
const { accessToken, user, setUser } = useAuth();

// Equivalent to:
const auth = useStore((state) => ({
  accessToken: state.accessToken,
  user: state.user,
  setUser: state.setUser,
}), shallow);
```

### Best Practices

1. **Select only what you need:**
   ```tsx
   // Good - only re-renders when currentProject changes
   const currentProject = useStore((state) => state.currentProject);
   
   // Avoid - re-renders when any state changes
   const store = useStore();
   ```

2. **Use helper hooks for multiple values:**
   ```tsx
   // Good - uses shallow comparison
   const { accessToken, user } = useAuth();
   
   // Also good - single selector
   const accessToken = useStore((state) => state.accessToken);
   ```

3. **Separate getters and setters when possible:**
   ```tsx
   // If you only need the setter, select it directly
   const setCurrentProject = useStore((state) => state.setCurrentProject);
   ```

## Next Steps

1. Set up your Auth0 application and add environment variables
2. Create your page components using the store
3. Add protected routes using `isAuthenticated` from `useAuth0()`
4. Extend the store with additional state as needed

See `/components/example-usage.tsx` for a complete working example.
