'use client';

import Link from 'next/link';
import { useHomeWizard } from './use-home-wizard';
import { ArrowRight, Shield, Zap, Layers, TrendingUp, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  );
}

function AuthenticatedView({ userName, userEmail }: { userName?: string; userEmail?: string }) {
  return (
    <section className="container px-4 py-12 md:py-24">
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground text-lg">
            {userEmail}
          </p>
        </div>

        <Link href="/dashboard">
          <Button size="lg" className="gap-2">
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl w-full mt-12">
          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 mb-2 text-indigo-600" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Track your draft performance in real-time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-indigo-600" />
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                Manage your roster and player database
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 mb-2 text-indigo-600" />
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate detailed draft analysis reports
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}

function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="container px-4 py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Smart Draft Analysis
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            Advanced analytics and real-time insights to help you make better draft decisions. 
            Optimize your strategy with data-driven recommendations.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={onGetStarted} className="gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with Auth0 to protect your data and ensure safe access.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built on Next.js 14 with optimized performance for seamless user experience.',
    },
    {
      icon: Layers,
      title: 'Smart State Management',
      description: 'Efficient state handling with Zustand and persistent storage for reliability.',
    },
  ];

  return (
    <section className="container px-4 py-12 md:py-24 bg-muted/50">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Why Choose GTX Smart Draft?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cutting-edge technology meets intuitive design to deliver the best draft analysis platform.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-indigo-600 transition-colors">
                <CardHeader>
                  <Icon className="h-12 w-12 mb-4 text-indigo-600" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '500K+', label: 'Drafts Analyzed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <section className="container px-4 py-12 md:py-24">
      <div className="grid gap-8 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-2">
            <div className="text-4xl font-bold text-indigo-600">{stat.value}</div>
            <div className="text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomeContent() {
  const { isAuthenticated, isLoading, user, handleGetStarted } = useHomeWizard();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isAuthenticated) {
    return (
      <AuthenticatedView
        userName={user?.name}
        userEmail={user?.email}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
      <StatsSection />
    </div>
  );
}
