// ═══════════════════════════════════════════════════════════
// V7 PILLAR COMPONENTS - BARREL EXPORT
// Nike Training Club meets Cyberpunk 2077
// ═══════════════════════════════════════════════════════════

// Core Structure
export { PillarTopBar, type Breadcrumb, type XPProgress, type PillarTopBarProps } from "./PillarTopBar";
export { PillarHero, type Expert, type PillarHeroProps } from "./PillarHero";
export { MetricsStrip, type Metric, type MetricsStripProps } from "./MetricsStrip";

// TRAIN Layer
export { SessionBuilder, type SessionBuilderConfig, type SessionBuilderOption, type SessionBuilderState, type SessionBuilderProps } from "./SessionBuilder";
export { ProtocolSummary, type ProtocolDrill, type ProtocolSummaryProps } from "./ProtocolSummary";
export { ProgressionPath, type ProgressionNode, type ProgressionPathProps } from "./ProgressionPath";
export { KeyIntelGrid, type IntelCard, type KeyIntelGridProps } from "./KeyIntelGrid";
export { DrillCard, type DrillData, type DrillCardProps } from "./DrillCard";
export { DrillInventory, type FilterValue, type DrillInventoryProps } from "./DrillInventory";
export { TextListFallback, type TextListFallbackProps } from "./TextListFallback";

// GUIDE Layer
export { GuideSection, type GuideSectionProps } from "./GuideSection";
export { TacticalBriefing, type TacticalBriefingProps } from "./TacticalBriefing";
export { TakeawaysList, type TakeawaysListProps } from "./TakeawaysList";
export { MistakesFixes, type MistakeFix, type MistakesFixesProps } from "./MistakesFixes";
export { FAQAccordion, type FAQItem, type FAQAccordionProps } from "./FAQAccordion";
export { SafetyBox, type SafetyBoxProps } from "./SafetyBox";

// Footer + Navigation
export { PillarFooter, type RelatedPillar, type PillarFooterProps } from "./PillarFooter";
export { StickyBottomBar, type StickyBottomBarProps } from "./StickyBottomBar";
export { StickyTOC, type StickyTOCProps } from "./StickyTOC";
