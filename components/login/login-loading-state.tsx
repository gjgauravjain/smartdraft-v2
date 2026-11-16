import { BrandWordmark } from "@/components/brand/BrandLogo";
import { Spinner } from "@/components/ui/spinner";

export const LoginLoadingState = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <BrandWordmark tone="adaptive" />
      <Spinner className="size-6 text-muted-foreground" />
    </main>
  );
};
