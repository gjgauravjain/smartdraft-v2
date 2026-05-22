'use client';

import { PrivateRoute } from '@/components/routes';
import { DashboardContent } from '../../components/dashboard/dashboard-content';

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <DashboardContent />
    </PrivateRoute>
  );
}
      
