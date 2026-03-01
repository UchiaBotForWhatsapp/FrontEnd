import type React from "react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  loading: boolean;
}

export function LoadingButton({
  children,
  loading,
  className,
  disabled,
  variant,
  size,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={loading || disabled}
      className={cn("gap-2 disabled:opacity-60", className)}
      {...props}
    >
      {loading ? (
        <div className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </Button>
  );
}