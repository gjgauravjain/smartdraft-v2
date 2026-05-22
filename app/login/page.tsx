'use client';

import { PublicRoute } from '@/components/routes';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LoginContent } from './login-content';

export default function LoginPage() {
  return (
    <PublicRoute redirectTo="/dashboard">
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <LoginContent />
        </main>
        <Footer />
      </div>
    </PublicRoute>
  );
}
