/**
 * @yp/ui - The Design System
 *
 * Shared UI components and tokens for the YP ecosystem.
 * "NeoBall" aesthetics: dark, neon, premium.
 */

// Components
export type { BetaBadgeProps, BetaBadgeVariant } from "./components/BetaBadge";
export { BetaBadge } from "./components/BetaBadge";
export type { ButtonProps } from "./components/Button";
export { Button } from "./components/Button";

export type { HeaderProps, NavLink } from "./components/Header";
export { Header } from "./components/Header";

export type { FooterProps } from "./components/Footer";
export { Footer } from "./components/Footer";
export { FooterSchema } from "./components/FooterSchema";

export type { VelocityLogoProps } from "./components/VelocityLogo";
export { VelocityLogo } from "./components/VelocityLogo";

export type { WolfLoaderProps } from "./components/WolfLoader";
export { WolfLoader, useUnicornStudio } from "./components/WolfLoader";

// Hooks
export { useScrollVelocity, useScrollSpeed } from "./hooks/useScrollVelocity";

// Tokens
export * from "./tokens";
