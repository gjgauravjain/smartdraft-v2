'use client';

import { PrivateRoute } from '@/components/routes';

export default function PlayerRankingPage() {
  return (
    <PrivateRoute>
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Talent Order</h1>
        <p className="text-muted-foreground">Player ranking content coming soon...</p>
      </div>
    </PrivateRoute>
  );
}
