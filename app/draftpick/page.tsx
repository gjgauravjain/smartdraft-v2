'use client';

import DraftPicks from '@/components/draft-picks/DraftPicks';
import { PrivateRoute } from '@/components/routes';

export default function DraftPickPage() {
  return (
    <PrivateRoute>
      <DraftPicks />
    </PrivateRoute>
  );
}
