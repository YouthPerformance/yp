/**
 * @yp/ui - The Design System
 *
 * Shared UI components and tokens for the YP ecosystem.
 * "NeoBall" aesthetics: dark, neon, premium.
 */

// Components
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";

export { Header } from "./components/Header";
export type { HeaderProps, NavLink } from "./components/Header";

// Auth Components
export {
  AuthCard,
  AuthLogo,
  AuthHeading,
  AuthDivider,
  AuthFooter,
  AuthTerms,
  AuthInput,
  EmailIcon,
  PasswordIcon,
  UserIcon,
  CodeIcon,
  AuthSubmitButton,
  SocialButton,
  SocialButtons,
  AuthBackground,
} from "./components/auth";
export type {
  AuthCardProps,
  AuthLogoProps,
  AuthHeadingProps,
  AuthDividerProps,
  AuthFooterProps,
  AuthTermsProps,
  AuthInputProps,
  AuthSubmitButtonProps,
  SocialButtonProps,
  SocialButtonsProps,
  AuthBackgroundProps,
} from "./components/auth";

// Tokens
export * from "./tokens";
