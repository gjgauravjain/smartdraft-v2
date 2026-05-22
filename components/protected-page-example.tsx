'use client';

import { useProtectedRoute } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';

/**
 * Example of a protected page component
 * This page requires authentication to access
 */
export default function ProtectedPage() {
  const { isLoading } = useProtectedRoute();
  const { currentProject, setCurrentProject } = useStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
      <p>This page is only accessible to authenticated users.</p>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Current Project</h2>
        <p>{currentProject || 'No project selected'}</p>
        <button
          onClick={() => setCurrentProject('new-project-id')}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Set Project
        </button>
      </div>
    </div>
  );
}
