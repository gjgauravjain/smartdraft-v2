"use client";

import { BrandWordmark } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import { useLoginWizard } from "./use-login-wizard";

const LoginErrorMessage = () => {
  return (
    <p className="text-sm text-destructive" role="alert">
      Couldn&apos;t log you in. Try again.
    </p>
  );
};

export const LoginContent = () => {
  const { loginFailed, handleLogin } = useLoginWizard();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <BrandWordmark tone="adaptive" />
      <div className="flex flex-col items-center gap-3">
        {loginFailed && <LoginErrorMessage />}
        <Button type="button" size="lg" onClick={handleLogin}>
          Log in
        </Button>
      </div>
    </main>
  );
};
