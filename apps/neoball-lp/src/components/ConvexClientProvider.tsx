import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

interface ConvexClientProviderProps {
  children: ReactNode;
}

// Get Convex URL from environment
const convexUrl = import.meta.env.PUBLIC_CONVEX_URL;

// Create client if URL is available
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export default function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  if (!convex) {
    console.warn("[Convex] PUBLIC_CONVEX_URL not set");
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
