'use client';

import { useLoginWizard } from './use-login-wizard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Fingerprint, CheckCircle2 } from 'lucide-react';

function SecurityFeature({ icon: Icon, title, description }: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        <Icon className="h-5 w-5 text-indigo-600" />
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function LoginContent() {
  const { handleLogin } = useLoginWizard();

  const securityFeatures = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security protocols',
    },
    {
      icon: Lock,
      title: 'Secure Authentication',
      description: 'Powered by Auth0 with multi-factor authentication',
    },
    {
      icon: Fingerprint,
      title: 'Privacy First',
      description: 'Your data is encrypted and never shared',
    },
    {
      icon: CheckCircle2,
      title: 'Compliant',
      description: 'GDPR and SOC 2 Type II certified',
    },
  ];

  return (
    <div className="container px-4 py-12 md:py-24">
      <div className="grid gap-8 lg:grid-cols-2 items-center max-w-6xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Sign in to
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                GTX Smart Draft
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Access your dashboard and unlock powerful draft analysis tools
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Secure Sign In</CardTitle>
              <CardDescription>
                Sign in with your Auth0 account to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleLogin}
                size="lg"
                className="w-full"
              >
                <Lock className="mr-2 h-4 w-4" />
                Sign In with Auth0
              </Button>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-600" />
                Security & Privacy
              </CardTitle>
              <CardDescription>
                Your security is our top priority
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityFeatures.map((feature, index) => (
                <SecurityFeature
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> This is a public route. 
                If you're already authenticated, you'll be automatically redirected to your dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
