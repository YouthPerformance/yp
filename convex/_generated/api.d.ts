/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics from "../analytics.js";
import type * as answerEngine from "../answerEngine.js";
import type * as answerEngineInternal from "../answerEngineInternal.js";
import type * as authors from "../authors.js";
import type * as contentPipeline from "../contentPipeline.js";
import type * as drills from "../drills.js";
import type * as embeddings from "../embeddings.js";
import type * as embeddingsInternal from "../embeddingsInternal.js";
import type * as qna from "../qna.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  answerEngine: typeof answerEngine;
  answerEngineInternal: typeof answerEngineInternal;
  authors: typeof authors;
  contentPipeline: typeof contentPipeline;
  drills: typeof drills;
  embeddings: typeof embeddings;
  embeddingsInternal: typeof embeddingsInternal;
  qna: typeof qna;
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
