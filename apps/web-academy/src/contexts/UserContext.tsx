// ═══════════════════════════════════════════════════════════
// USER CONTEXT
// Provides user data from Convex throughout the app
// ═══════════════════════════════════════════════════════════

'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useUser as useClerkUser, useAuth } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type Role = 'athlete' | 'parent';
export type Rank = 'pup' | 'hunter' | 'alpha' | 'apex';
export type WolfColor = 'cyan' | 'gold' | 'purple' | 'green' | 'red';
export type SubscriptionStatus = 'free' | 'pro';

export interface ConvexUser {
  _id: Id<'users'>;
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
  linkedParentId?: Id<'users'>;
  linkedAthleteIds?: Id<'users'>[];
  onboardingCompletedAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Enrollment {
  _id: Id<'enrollments'>;
  userId: Id<'users'>;
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
  createUser: (data: CreateUserData) => Promise<Id<'users'> | null>;
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
  | 'loading'
  | 'signed-out'
  | 'signed-in-no-user'
  | 'signed-in-with-user'
  | 'error';

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

export function UserProvider({ children }: UserProviderProps) {
  const { isLoaded: clerkLoaded, isSignedIn, user: clerkUser } = useClerkUser();
  const { userId: clerkId } = useAuth();

  const [authState, setAuthState] = useState<AuthState>('loading');

  // Fetch user from Convex
  const convexUser = useQuery(
    api.users.getByClerkId,
    clerkId ? { clerkId } : 'skip'
  );

  // Fetch current enrollment
  const enrollment = useQuery(
    api.users.getCurrentEnrollment,
    convexUser?._id ? { userId: convexUser._id } : 'skip'
  );

  // Create user mutation
  const createUserMutation = useMutation(api.users.create);

  // ─────────────────────────────────────────────────────────
  // AUTH STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!clerkLoaded) {
      setAuthState('loading');
      console.log('[UserContext] Auth state: loading (Clerk not loaded)');
      return;
    }

    if (!isSignedIn) {
      setAuthState('signed-out');
      console.log('[UserContext] Auth state: signed-out');
      return;
    }

    if (convexUser === undefined) {
      // Query still loading
      setAuthState('loading');
      console.log('[UserContext] Auth state: loading (Convex query pending)');
      return;
    }

    if (convexUser === null) {
      setAuthState('signed-in-no-user');
      console.log('[UserContext] Auth state: signed-in-no-user (needs onboarding)');
      return;
    }

    setAuthState('signed-in-with-user');
    console.log('[UserContext] Auth state: signed-in-with-user', {
      userId: convexUser._id,
      name: convexUser.name,
      role: convexUser.role,
    });
  }, [clerkLoaded, isSignedIn, convexUser]);

  // ─────────────────────────────────────────────────────────
  // CREATE USER
  // ─────────────────────────────────────────────────────────

  const createUser = async (data: CreateUserData): Promise<Id<'users'> | null> => {
    if (!clerkId || !clerkUser?.primaryEmailAddress?.emailAddress) {
      console.error('[UserContext] Cannot create user: no Clerk ID or email');
      return null;
    }

    try {
      console.log('[UserContext] Creating user:', data);

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

      console.log('[UserContext] User created:', userId);
      return userId;
    } catch (error) {
      console.error('[UserContext] Error creating user:', error);
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
  const xpInLevel = xp % 1000;
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
      console.log('[UserContext] Manual refetch triggered');
    },
    authState,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
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
  return user?.subscriptionStatus ?? 'free';
}

export function useIsProUser() {
  const status = useSubscriptionStatus();
  return status === 'pro';
}

export default UserContext;
