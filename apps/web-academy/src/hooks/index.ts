// ═══════════════════════════════════════════════════════════
// Hooks Barrel Export
// ═══════════════════════════════════════════════════════════

export {
  useViewportMode,
  getLayoutType,
  type ViewportMode,
  type Orientation,
  type ViewportState,
} from "./useViewportMode";

export {
  useDualVideoSync,
  type DualVideoSyncOptions,
  type DualVideoSyncState,
  type DualVideoSyncReturn,
} from "./useDualVideoSync";

export {
  useCastSession,
  useCastReceiver,
  type CastState,
  type CastType,
  type CastSessionState,
  type CastSessionReturn,
  type CastCommand,
} from "./useCastSession";
