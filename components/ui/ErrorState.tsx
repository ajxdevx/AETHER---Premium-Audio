"use client";

import { AlertCircle, RefreshCw } from "@/lib/icons";
import { Button } from "./Button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <AlertCircle size={40} className="text-danger" aria-hidden />
      <p className="max-w-md text-secondary">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <RefreshCw size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
}
