// ═══════════════════════════════════════════════════════════
// USER CONTEXT
// Provides user data from Convex throughout the app
// ═══════════════════════════════════════════════════════════

"use client";

import { useAuth, useUser as useClerkUser } from "@clerk/nextjs";
import { api } from "@yp/alpha/convex/_generated/api";
import type { Id } from "@yp/alpha/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type Role = "athlete" | "parent";
export type Rank = "pup" | "hunter" | "alpha" | "apex";
export type WolfColor = "cyan" | "gold" | "purple" | "green" | "red";
export type SubscriptionStatus = "free" | "pro";

export interface ConvexUser {
  _id: Id<"users">;
  clerkId: string;
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

// ─────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────

const UserContext = createContext<UserContextValue | null>(null);

// ─────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────

interface UserProviderProps {
  children: ReactNode;
}

// SSR-safe default context value
const defaultContextValue: UserContextValue = {
  isLoaded: false,
  isSignedIn: false,
  user: null,
  enrollment: null,
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

  // Client-side rendering with actual Clerk hooks
  return <UserProviderClient>{children}</UserProviderClient>;
}

// Separate component that uses Clerk hooks - only rendered on client
function UserProviderClient({ children }: UserProviderProps) {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const { isLoaded: clerkLoaded, isSignedIn, user: clerkUser } = useClerkUser();
  const { userId: clerkId } = useAuth();

  // Fetch user from Convex
  const convexUser = useQuery(api.users.getByClerkId, clerkId ? { clerkId } : "skip");

  // Fetch current enrollment
  const enrollment = useQuery(
    api.users.getCurrentEnrollment,
    convexUser?._id ? { userId: convexUser._id } : "skip",
  );

  // Create user mutation
  const createUserMutation = useMutation(api.users.create);

  // ─────────────────────────────────────────────────────────
  // AUTH STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!clerkLoaded) {
      setAuthState("loading");
      return;
    }

    if (!isSignedIn) {
      setAuthState("signed-out");
      return;
    }

    if (convexUser === undefined) {
      // Query still loading
      setAuthState("loading");
      return;
    }

    if (convexUser === null) {
      setAuthState("signed-in-no-user");
      return;
    }

    setAuthState("signed-in-with-user");
  }, [clerkLoaded, isSignedIn, convexUser]);

  // ─────────────────────────────────────────────────────────
  // CREATE USER
  // ─────────────────────────────────────────────────────────

  const createUser = async (data: CreateUserData): Promise<Id<"users"> | null> => {
    if (!clerkId || !clerkUser?.primaryEmailAddress?.emailAddress) {
      return null;
    }

    try {
      const userId = await createUserMutation({
        clerkId,
        email: clerkUser.primaryEmailAddress.emailAddress,
        name: data.name,
        role: data.role,
        avatarColor: data.avatarColor,
        sport: data.sport,
        age: data.age,
        parentCode: data.parentCode,
      });

      return userId;
    } catch (_error) {
      // Silently fail - the UI will handle the error state
      return null;
    }
  };

  // ─────────────────────────────────────────────────────────
  // DERIVED VALUES
  // ─────────────────────────────────────────────────────────

  const currentDay = enrollment?.currentDay ?? 1;

  // Level calculation (1000 XP per level)
  const xp = convexUser?.xpTotal ?? 0;
  const level = Math.floor(xp / 1000) + 1;
  const _xpInLevel = xp % 1000;
  const xpToNextLevel = 1000;

  // ─────────────────────────────────────────────────────────
  // CONTEXT VALUE
  // ─────────────────────────────────────────────────────────

  const value: UserContextValue = {
    isLoaded: clerkLoaded && convexUser !== undefined,
    isSignedIn: isSignedIn ?? false,
    user: convexUser ?? null,
    enrollment: enrollment ?? null,
    currentDay,
    level,
    xpToNextLevel,
    createUser,
    refetch: () => {
      // Convex queries auto-refetch on data changes
      // This is a no-op placeholder for future use
    },
    authState,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────

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
