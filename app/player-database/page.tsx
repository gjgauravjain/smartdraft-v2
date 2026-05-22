'use client';

import { PrivateRoute } from '@/components/routes';

export default function PlayerDatabasePage() {
  return (
    <PrivateRoute>
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Player Database</h1>
        <p className="text-muted-foreground">Player database content coming soon...</p>
      </div>
    </PrivateRoute>
  );
}
