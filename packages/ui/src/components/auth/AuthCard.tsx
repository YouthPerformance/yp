/**
 * AuthCard - Unified auth card design for YP ecosystem
 *
 * A premium dark card with gradient background and YP branding
 * Used as the container for sign-in/sign-up flows
 */

import * as React from "react";

export interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <div
      className={`
        sm:px-10 sm:py-10
        bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-800
        max-w-md
        border-neutral-800 border
        rounded-3xl
        mx-auto
        pt-8 px-6 pb-8
        relative
        shadow-xl
        z-10
        ${className}
      `}
    >
      {/* Top glow bars */}
      <div className="absolute left-10 top-5 hidden h-1.5 w-16 rounded-full bg-neutral-700/60 sm:block" />
      <div className="absolute right-10 top-5 hidden h-1.5 w-10 rounded-full bg-neutral-700/30 sm:block" />

      {children}
    </div>
  );
}

export interface AuthLogoProps {
  className?: string;
}

export function AuthLogo({ className = "" }: AuthLogoProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="flex bg-neutral-900 w-14 h-14 rounded-2xl relative shadow-[0_0_0_1px_rgba(82,82,91,0.7)] items-center justify-center">
        <div className="flex bg-neutral-950 w-10 h-10 rounded-2xl items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#00f6e0">
            <path d="M2.535 11.916c0 5.267 4.238 9.537 9.465 9.537s9.465-4.27 9.465-9.537a9.54 9.54 0 0 0-5.335-8.584a.776.776 0 0 1-.355-1.033a.765.765 0 0 1 1.026-.358A11.09 11.09 0 0 1 23 11.916C23 18.038 18.075 23 12 23S1 18.038 1 11.916C1 6.548 4.787 2.073 9.815 1.051c1.689-.343 2.952 1.104 2.952 2.617v2.134c1.894.364 3.326 2.05 3.326 4.076V14c0 2.291-1.832 4.148-4.093 4.148c-2.26 0-4.093-1.857-4.093-4.148V9.878c0-2.025 1.432-3.711 3.326-4.075V3.668c0-.766-.588-1.208-1.115-1.101c-4.326.879-7.583 4.732-7.583 9.35" opacity=".5"/>
            <path d="M7.907 13.954c0 2.29 1.833 4.148 4.093 4.148s4.093-1.857 4.093-4.148v-3.37H7.907zm4.861-4.616h3.253c-.312-1.667-1.608-3.292-3.253-3.609zm-1.535 0V5.73c-1.645.317-2.942 1.942-3.254 3.61z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export interface AuthHeadingProps {
  title: string;
  subtitle?: string;
}

export function AuthHeading({ title, subtitle }: AuthHeadingProps) {
  return (
    <div className="mt-6 text-center">
      <h1 className="text-[22px] leading-tight tracking-tight font-semibold text-neutral-50">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm font-normal text-neutral-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text = "OR" }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-4 text-xs text-neutral-500">
      <div className="h-px flex-1 bg-neutral-800/80" />
      <span className="font-medium">{text}</span>
      <div className="h-px flex-1 bg-neutral-800/80" />
    </div>
  );
}

export interface AuthFooterProps {
  text: string;
  linkText: string;
  linkHref: string;
}

export function AuthFooter({ text, linkText, linkHref }: AuthFooterProps) {
  return (
    <p className="text-center text-sm text-neutral-400">
      {text}{" "}
      <a href={linkHref} className="font-medium text-[#00f6e0] hover:text-[#00f6e0]/80">
        {linkText}
      </a>
    </p>
  );
}

export interface AuthTermsProps {
  termsHref?: string;
  privacyHref?: string;
}

export function AuthTerms({ termsHref = "/terms", privacyHref = "/privacy" }: AuthTermsProps) {
  return (
    <p className="pt-1 text-[11px] leading-relaxed text-neutral-500 text-center">
      By continuing, you agree to the YP{" "}
      <a href={termsHref} className="font-medium text-neutral-200 hover:text-[#00f6e0]">Terms</a>
      {" "}and{" "}
      <a href={privacyHref} className="font-medium text-neutral-200 hover:text-[#00f6e0]">Privacy Policy</a>.
    </p>
  );
}
