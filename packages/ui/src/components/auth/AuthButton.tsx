/**
 * AuthButton - Button components for auth flows
 *
 * Includes primary submit button and social auth buttons
 * with the YP cyan accent color
 */

import * as React from "react";

export interface AuthSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export function AuthSubmitButton({
  loading = false,
  children,
  disabled,
  className = "",
  ...props
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={`
        mt-2
        inline-flex
        w-full
        items-center
        justify-center
        rounded-full
        bg-[#00f6e0]
        px-4 py-2.5
        text-sm
        font-semibold
        text-neutral-900
        shadow-[0_14px_35px_rgba(0,246,224,0.3)]
        hover:bg-[#00f6e0]/90
        focus:outline-none
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Processing...
        </span>
      ) : (
        <>
          {children}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-2">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </>
      )}
    </button>
  );
}

export interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: "apple" | "google" | "discord";
}

const socialIcons = {
  apple: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#00f6e0">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  ),
  google: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path fill="#00f6e0" d="M12 5a7 7 0 1 0 6.93 8H13a1 1 0 1 1 0-2h7a1 1 0 0 1 1 1a9 9 0 1 1-2.654-6.381a1 1 0 0 1-1.41 1.418A6.98 6.98 0 0 0 12 5"/>
    </svg>
  ),
  discord: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#00f6e0">
      <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.2 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09 0 .11a13.1 13.1 0 0 1-1.64.78c-.04.01-.05.06-.04.09c.31.61.66 1.19 1.07 1.74c.03.01.06.02.09.01c1.67-.53 3.4-1.33 5.2-2.65c.02-.01.03-.03.03-.05c.44-4.52-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12z"/>
    </svg>
  ),
};

export function SocialButton({ provider, className = "", ...props }: SocialButtonProps) {
  return (
    <button
      type="button"
      className={`
        flex
        items-center
        justify-center
        rounded-xl
        border border-neutral-800
        bg-neutral-900
        px-2 py-2.5
        text-xs
        font-medium
        text-neutral-200
        hover:border-neutral-700
        hover:bg-neutral-800/80
        transition
        ${className}
      `}
      {...props}
    >
      {socialIcons[provider]}
    </button>
  );
}

export interface SocialButtonsProps {
  onApple?: () => void;
  onGoogle?: () => void;
  onDiscord?: () => void;
}

export function SocialButtons({ onApple, onGoogle, onDiscord }: SocialButtonsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {onApple && <SocialButton provider="apple" onClick={onApple} />}
      {onDiscord && <SocialButton provider="discord" onClick={onDiscord} />}
      {onGoogle && <SocialButton provider="google" onClick={onGoogle} />}
    </div>
  );
}
