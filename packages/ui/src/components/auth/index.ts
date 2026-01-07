/**
 * Auth Components - Unified auth UI for YP ecosystem
 *
 * These components provide the visual design for auth flows.
 * Wire them up with Clerk Elements (Academy) or Clerk React (Marketing).
 */

export {
  AuthCard,
  AuthLogo,
  AuthHeading,
  AuthDivider,
  AuthFooter,
  AuthTerms,
} from "./AuthCard";
export type {
  AuthCardProps,
  AuthLogoProps,
  AuthHeadingProps,
  AuthDividerProps,
  AuthFooterProps,
  AuthTermsProps,
} from "./AuthCard";

export {
  AuthInput,
  EmailIcon,
  PasswordIcon,
  UserIcon,
  CodeIcon,
} from "./AuthInput";
export type { AuthInputProps } from "./AuthInput";

export {
  AuthSubmitButton,
  SocialButton,
  SocialButtons,
} from "./AuthButton";
export type {
  AuthSubmitButtonProps,
  SocialButtonProps,
  SocialButtonsProps,
} from "./AuthButton";

export { AuthBackground } from "./AuthBackground";
export type { AuthBackgroundProps } from "./AuthBackground";
