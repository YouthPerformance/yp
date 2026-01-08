/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as campaigns from "../campaigns.js";
import type * as emails from "../emails.js";
import type * as gamification from "../gamification.js";
import type * as http from "../http.js";
import type * as learningModules from "../learningModules.js";
import type * as memory_ingest from "../memory/ingest.js";
import type * as memory_retrieve from "../memory/retrieve.js";
import type * as programs from "../programs.js";
import type * as progress from "../progress.js";
import type * as tickets from "../tickets.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  campaigns: typeof campaigns;
  emails: typeof emails;
  gamification: typeof gamification;
  http: typeof http;
  learningModules: typeof learningModules;
  "memory/ingest": typeof memory_ingest;
  "memory/retrieve": typeof memory_retrieve;
  programs: typeof programs;
  progress: typeof progress;
  tickets: typeof tickets;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
