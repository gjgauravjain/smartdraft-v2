import { cn } from "@/lib/utils";

const WORDMARK_WIDTH = 120;

const Wordmark = ({ src, className }: { src: string; className?: string }) => {
  return (
    <img
      src={src}
      alt="SmartDraft"
      width={WORDMARK_WIDTH}
      className={cn("h-auto w-30", className)}
    />
  );
};

export const BrandWordmark = ({
  tone,
  className,
}: {
  tone: "white" | "navy" | "adaptive";
  className?: string;
}) => {
  if (tone === "white") {
    return (
      <Wordmark
        src="/brand/smartdraft-wordmark-white.svg"
        className={className}
      />
    );
  }

  if (tone === "navy") {
    return (
      <Wordmark
        src="/brand/smartdraft-wordmark-navy.svg"
        className={className}
      />
    );
  }

  return (
    <span className={cn("inline-flex items-center", className)}>
      <Wordmark
        src="/brand/smartdraft-wordmark-navy.svg"
        className="dark:hidden"
      />
      <Wordmark
        src="/brand/smartdraft-wordmark-white.svg"
        className="hidden dark:block"
      />
    </span>
  );
};

export const BrandMark = ({ className }: { className?: string }) => {
  return (
    <img
      src="/brand/smartdraft-mark.svg"
      alt="SmartDraft"
      width={24}
      height={24}
      className={cn("size-6", className)}
    />
  );
};
