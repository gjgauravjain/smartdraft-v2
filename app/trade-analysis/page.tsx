'use client';

import { PrivateRoute } from '@/components/routes';

export default function TradeAnalysisPage() {
  return (
    <PrivateRoute>
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Trade Analysis</h1>
        <p className="text-muted-foreground">Trade analysis content coming soon...</p>
      </div>
    </PrivateRoute>
  );
}
