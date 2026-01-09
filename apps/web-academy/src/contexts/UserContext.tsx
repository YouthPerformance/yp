// ===================================================================
// USER CONTEXT
// Provides user data from Convex throughout the app
// Now powered by BetterAuth (replacing Clerk)
// ===================================================================

"use client";

import { api } from "@yp/alpha/convex/_generated/api";
import type { Id } from "@yp/alpha/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { useSession } from "@/lib/auth";

// ---------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------

export type Role = "athlete" | "parent";
export type Rank = "pup" | "hunter" | "alpha" | "apex";
export type WolfColor = "cyan" | "gold" | "purple" | "green" | "red";
export type SubscriptionStatus = "free" | "pro";

export interface ConvexUser {
  _id: Id<"users">;
  authUserId?: string;
  clerkId?: string; // Deprecated: kept for migration
  email: string;
  name: string;
  role: Role;
  avatarColor: WolfColor;
  sport?: string;
  age?: number;
  xpTotal: number;
  crystals: number;
  rank: Rank;
  streakCurrent: number;
  streakBest: number;
  lastWorkoutAt?: number;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt?: number;
  parentCode?: string;
  linkedParentId?: Id<"users">;
  linkedAthleteIds?: Id<"users">[];
  onboardingCompletedAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Enrollment {
  _id: Id<"enrollments">;
  userId: Id<"users">;
  programSlug: string;
  currentDay: number;
  isActive: boolean;
  startedAt: number;
  completedAt?: number;
  totalWorkoutsCompleted: number;
  totalXpEarned: number;
}

export interface UserContextValue {
  // Auth state
  isLoaded: boolean;
  isSignedIn: boolean;

  // User data
  user: ConvexUser | null;
  enrollment: Enrollment | null;

  // Auth session (from BetterAuth)
  session: { user: { id: string; email: string; name?: string } } | null;

  // Derived values
  currentDay: number;
  level: number;
  xpToNextLevel: number;

  // Actions
  createUser: (data: CreateUserData) => Promise<Id<"users"> | null>;
  refetch: () => void;

  // Debug
  authState: AuthState;
}

export interface CreateUserData {
  name: string;
  role: Role;
  avatarColor: WolfColor;
  sport?: string;
  age?: number;
  parentCode?: string;
}

export type AuthState =
  | "loading"
  | "signed-out"
  | "signed-in-no-user"
  | "signed-in-with-user"
  | "error";

// ---------------------------------------------------------------
// CONTEXT
// ---------------------------------------------------------------

const UserContext = createContext<UserContextValue | null>(null);

// ---------------------------------------------------------------
// PROVIDER
// ---------------------------------------------------------------

interface UserProviderProps {
  children: ReactNode;
}

// SSR-safe default context value
const defaultContextValue: UserContextValue = {
  isLoaded: false,
  isSignedIn: false,
  user: null,
  enrollment: null,
  session: null,
  currentDay: 1,
  level: 1,
  xpToNextLevel: 1000,
  createUser: async () => null,
  refetch: () => {},
  authState: "loading",
};

export function UserProvider({ children }: UserProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Set mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR/SSG, render with default context
  if (!mounted) {
    return <UserContext.Provider value={defaultContextValue}>{children}</UserContext.Provider>;
  }

  // Client-side rendering with BetterAuth hooks
  return <UserProviderClient>{children}</UserProviderClient>;
}

// Separate component that uses BetterAuth hooks - only rendered on client
function UserProviderClient({ children }: UserProviderProps) {
  const [authState, setAuthState] = useState<AuthState>("loading");

  // BetterAuth session hook
  const { data: session, isPending: sessionLoading } = useSession();

  // Get authUserId from session
  const authUserId = session?.user?.id ?? null;
  const authEmail = session?.user?.email ?? null;

  // PERFORMANCE: Use getOrCreateFromAuth - single mutation handles lookup + migration + linking
  const getOrCreateUser = useMutation(api.users.getOrCreateFromAuth);
  const createUserMutation = useMutation(api.users.createFromAuth);

  // User lookup by email (fallback for migration)
  const convexUserByEmail = useQuery(
    api.users.getByEmail,
    authEmail ? { email: authEmail } : "skip",
  );

  // State for the resolved user
  const [convexUser, setConvexUser] = useState<ConvexUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch user when session changes
  useEffect(() => {
    async function resolveUser() {
      if (!authUserId || !authEmail) {
        setConvexUser(null);
        setUserLoading(false);
        return;
      }

      try {
        // This single call handles:
        // 1. Lookup by authUserId (fastest)
        // 2. Fallback lookup by email (migration)
        // 3. Auto-link if found by email
        const result = await getOrCreateUser({
          authUserId,
          email: authEmail,
          name: session?.user?.name,
        });

        setConvexUser(result as ConvexUser | null);
      } catch (error) {
        console.error("[UserContext] Failed to resolve user:", error);
        setConvexUser(null);
      } finally {
        setUserLoading(false);
      }
    }

    if (sessionLoading) {
      setUserLoading(true);
    } else {
      resolveUser();
    }
  }, [authUserId, authEmail, sessionLoading, getOrCreateUser, session?.user?.name]);

  // Fetch current enrollment
  const enrollment = useQuery(
    api.users.getCurrentEnrollment,
    convexUser?._id ? { userId: convexUser._id } : "skip",
  );

  // ---------------------------------------------------------------
  // AUTH STATE MANAGEMENT
  // ---------------------------------------------------------------

  useEffect(() => {
    if (sessionLoading || userLoading) {
      setAuthState("loading");
      return;
    }

    if (!session) {
      setAuthState("signed-out");
      return;
    }

    if (convexUser === null) {
      setAuthState("signed-in-no-user");
      return;
    }

    setAuthState("signed-in-with-user");
  }, [sessionLoading, userLoading, session, convexUser]);

  // ---------------------------------------------------------------
  // CREATE USER
  // ---------------------------------------------------------------

  const createUser = async (data: CreateUserData): Promise<Id<"users"> | null> => {
    if (!authUserId || !authEmail) {
      return null;
    }

    try {
      const userId = await createUserMutation({
        authUserId,
        email: authEmail,
        name: data.name,
        role: data.role,
        avatarColor: data.avatarColor,
        sport: data.sport,
        age: data.age,
        parentCode: data.parentCode,
      });

      // Refetch user
      const result = await getOrCreateUser({
        authUserId,
        email: authEmail,
      });
      setConvexUser(result as ConvexUser | null);

      return userId;
    } catch (error) {
      console.error("[UserContext] Failed to create user:", error);
      return null;
    }
  };

  // ---------------------------------------------------------------
  // DERIVED VALUES
  // ---------------------------------------------------------------

  const currentDay = enrollment?.currentDay ?? 1;

  // Level calculation (1000 XP per level)
  const xp = convexUser?.xpTotal ?? 0;
  const level = Math.floor(xp / 1000) + 1;
  const xpToNextLevel = 1000;

  // ---------------------------------------------------------------
  // CONTEXT VALUE
  // ---------------------------------------------------------------

  const value: UserContextValue = {
    isLoaded: !sessionLoading && !userLoading,
    isSignedIn: !!session,
    user: convexUser,
    enrollment: enrollment ?? null,
    session: session as UserContextValue["session"],
    currentDay,
    level,
    xpToNextLevel,
    createUser,
    refetch: async () => {
      if (authUserId && authEmail) {
        const result = await getOrCreateUser({ authUserId, email: authEmail });
        setConvexUser(result as ConvexUser | null);
      }
    },
    authState,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// ---------------------------------------------------------------
// HOOKS
// ---------------------------------------------------------------

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
}

// Convenience hooks
export function useCurrentUser() {
  const { user } = useUserContext();
  return user;
}

export function useSubscriptionStatus() {
  const { user } = useUserContext();
  return user?.subscriptionStatus ?? "free";
}

export function useIsProUser() {
  const status = useSubscriptionStatus();
  return status === "pro";
}

export default UserContext;
