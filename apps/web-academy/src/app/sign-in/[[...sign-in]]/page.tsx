"use client";

/**
 * Unified Auth Page - "Sign In or Join Now"
 *
 * Clean, minimal design inspired by Efferd.
 * Social auth first, email below.
 * Clerk Elements handles the flow.
 */

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4 py-12">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-neutral-900" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00f6e0]/10 via-transparent to-transparent" />
      </div>

      <SignIn.Root>
        {/* ═══════════════════════════════════════════════════════════════
            STEP 1: START - Social buttons + Email input
        ═══════════════════════════════════════════════════════════════ */}
        <SignIn.Step name="start">
          <div className="w-full max-w-sm mx-auto">
            {/* Card */}
            <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 shadow-2xl">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#00f6e0">
                    <path d="M2.535 11.916c0 5.267 4.238 9.537 9.465 9.537s9.465-4.27 9.465-9.537a9.54 9.54 0 0 0-5.335-8.584a.776.776 0 0 1-.355-1.033a.765.765 0 0 1 1.026-.358A11.09 11.09 0 0 1 23 11.916C23 18.038 18.075 23 12 23S1 18.038 1 11.916C1 6.548 4.787 2.073 9.815 1.051c1.689-.343 2.952 1.104 2.952 2.617v2.134c1.894.364 3.326 2.05 3.326 4.076V14c0 2.291-1.832 4.148-4.093 4.148c-2.26 0-4.093-1.857-4.093-4.148V9.878c0-2.025 1.432-3.711 3.326-4.075V3.668c0-.766-.588-1.208-1.115-1.101c-4.326.879-7.583 4.732-7.583 9.35" opacity=".5"/>
                    <path d="M7.907 13.954c0 2.29 1.833 4.148 4.093 4.148s4.093-1.857 4.093-4.148v-3.37H7.907zm4.861-4.616h3.253c-.312-1.667-1.608-3.292-3.253-3.609zm-1.535 0V5.73c-1.645.317-2.942 1.942-3.254 3.61z"/>
                  </svg>
                </div>
              </div>

              {/* Heading */}
              <div className="text-center mb-8">
                <h1 className="text-xl font-semibold text-white mb-1">
                  Sign In or Join Now!
                </h1>
                <p className="text-sm text-neutral-400">
                  Train smarter. Play better. Every day.
                </p>
              </div>

              {/* Social Buttons */}
              <div className="space-y-3 mb-6">
                <Clerk.Connection name="google" asChild>
                  <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-white font-medium transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>
                </Clerk.Connection>

                <Clerk.Connection name="apple" asChild>
                  <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-white font-medium transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Continue with Apple
                  </button>
                </Clerk.Connection>

                <Clerk.Connection name="discord" asChild>
                  <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-white font-medium transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#5865F2">
                      <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.2 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09 0 .11a13.1 13.1 0 0 1-1.64.78c-.04.01-.05.06-.04.09c.31.61.66 1.19 1.07 1.74c.03.01.06.02.09.01c1.67-.53 3.4-1.33 5.2-2.65c.02-.01.03-.03.03-.05c.44-4.52-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12z"/>
                    </svg>
                    Continue with Discord
                  </button>
                </Clerk.Connection>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-neutral-800" />
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">or</span>
                <div className="h-px flex-1 bg-neutral-800" />
              </div>

              {/* Email Section */}
              <div className="space-y-4">
                <p className="text-sm text-neutral-400">
                  Enter your email to sign in or create an account
                </p>

                <Clerk.GlobalError className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm" />

                <Clerk.Field name="identifier">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <Clerk.Input
                      type="email"
                      placeholder="your.email@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#00f6e0] focus:ring-1 focus:ring-[#00f6e0]/50 transition-colors"
                    />
                  </div>
                  <Clerk.FieldError className="text-xs text-red-400 mt-1" />
                </Clerk.Field>

                <SignIn.Action submit asChild>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00f6e0] hover:bg-[#00dcc8] rounded-xl text-neutral-900 font-semibold transition-colors shadow-lg shadow-[#00f6e0]/20">
                    Continue With Email
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                    </svg>
                  </button>
                </SignIn.Action>
              </div>

              {/* Terms */}
              <p className="mt-6 text-xs text-neutral-500 text-center leading-relaxed">
                By clicking continue, you agree to our{" "}
                <Link href="/terms" className="text-neutral-300 hover:text-[#00f6e0] underline underline-offset-2">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-neutral-300 hover:text-[#00f6e0] underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </SignIn.Step>

        {/* ═══════════════════════════════════════════════════════════════
            STEP 2: VERIFICATIONS - Password or Code
        ═══════════════════════════════════════════════════════════════ */}
        <SignIn.Step name="verifications">
          <div className="w-full max-w-sm mx-auto">
            <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 shadow-2xl">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#00f6e0">
                    <path d="M2.535 11.916c0 5.267 4.238 9.537 9.465 9.537s9.465-4.27 9.465-9.537a9.54 9.54 0 0 0-5.335-8.584a.776.776 0 0 1-.355-1.033a.765.765 0 0 1 1.026-.358A11.09 11.09 0 0 1 23 11.916C23 18.038 18.075 23 12 23S1 18.038 1 11.916C1 6.548 4.787 2.073 9.815 1.051c1.689-.343 2.952 1.104 2.952 2.617v2.134c1.894.364 3.326 2.05 3.326 4.076V14c0 2.291-1.832 4.148-4.093 4.148c-2.26 0-4.093-1.857-4.093-4.148V9.878c0-2.025 1.432-3.711 3.326-4.075V3.668c0-.766-.588-1.208-1.115-1.101c-4.326.879-7.583 4.732-7.583 9.35" opacity=".5"/>
                    <path d="M7.907 13.954c0 2.29 1.833 4.148 4.093 4.148s4.093-1.857 4.093-4.148v-3.37H7.907zm4.861-4.616h3.253c-.312-1.667-1.608-3.292-3.253-3.609zm-1.535 0V5.73c-1.645.317-2.942 1.942-3.254 3.61z"/>
                  </svg>
                </div>
              </div>

              {/* Email Code Verification */}
              <SignIn.Strategy name="email_code">
                <div className="text-center mb-6">
                  <h1 className="text-xl font-semibold text-white mb-1">
                    Check your email
                  </h1>
                  <p className="text-sm text-neutral-400">
                    We sent a code to <SignIn.SafeIdentifier className="text-white" />
                  </p>
                </div>

                <div className="space-y-4">
                  <Clerk.GlobalError className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm" />

                  <Clerk.Field name="code">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                        </svg>
                      </div>
                      <Clerk.Input
                        placeholder="Enter code"
                        className="w-full pl-11 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-center tracking-[0.3em] placeholder:tracking-normal placeholder:text-neutral-500 focus:outline-none focus:border-[#00f6e0] focus:ring-1 focus:ring-[#00f6e0]/50 transition-colors"
                      />
                    </div>
                    <Clerk.FieldError className="text-xs text-red-400 mt-1" />
                  </Clerk.Field>

                  <SignIn.Action submit asChild>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00f6e0] hover:bg-[#00dcc8] rounded-xl text-neutral-900 font-semibold transition-colors shadow-lg shadow-[#00f6e0]/20">
                      Verify
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </button>
                  </SignIn.Action>

                  <SignIn.Action resend asChild>
                    <button className="w-full text-sm text-neutral-400 hover:text-white transition-colors">
                      Didn&apos;t receive a code? Resend
                    </button>
                  </SignIn.Action>
                </div>
              </SignIn.Strategy>

              {/* Password Verification */}
              <SignIn.Strategy name="password">
                <div className="text-center mb-6">
                  <h1 className="text-xl font-semibold text-white mb-1">
                    Welcome back!
                  </h1>
                  <p className="text-sm text-neutral-400">
                    Enter your password for <SignIn.SafeIdentifier className="text-white" />
                  </p>
                </div>

                <div className="space-y-4">
                  <Clerk.GlobalError className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm" />

                  <Clerk.Field name="password">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                        </svg>
                      </div>
                      <Clerk.Input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full pl-11 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#00f6e0] focus:ring-1 focus:ring-[#00f6e0]/50 transition-colors"
                      />
                    </div>
                    <Clerk.FieldError className="text-xs text-red-400 mt-1" />
                  </Clerk.Field>

                  <SignIn.Action submit asChild>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00f6e0] hover:bg-[#00dcc8] rounded-xl text-neutral-900 font-semibold transition-colors shadow-lg shadow-[#00f6e0]/20">
                      Sign In
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                      </svg>
                    </button>
                  </SignIn.Action>

                  <SignIn.Action navigate="forgot-password" asChild>
                    <button className="w-full text-sm text-neutral-400 hover:text-white transition-colors">
                      Forgot password?
                    </button>
                  </SignIn.Action>
                </div>
              </SignIn.Strategy>

              {/* Back button */}
              <div className="mt-6 pt-4 border-t border-neutral-800">
                <SignIn.Action navigate="start" asChild>
                  <button className="w-full text-sm text-neutral-400 hover:text-white transition-colors flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                    Use a different method
                  </button>
                </SignIn.Action>
              </div>
            </div>
          </div>
        </SignIn.Step>

        {/* ═══════════════════════════════════════════════════════════════
            STEP 3: FORGOT PASSWORD
        ═══════════════════════════════════════════════════════════════ */}
        <SignIn.Step name="forgot-password">
          <div className="w-full max-w-sm mx-auto">
            <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#00f6e0">
                    <path d="M2.535 11.916c0 5.267 4.238 9.537 9.465 9.537s9.465-4.27 9.465-9.537a9.54 9.54 0 0 0-5.335-8.584a.776.776 0 0 1-.355-1.033a.765.765 0 0 1 1.026-.358A11.09 11.09 0 0 1 23 11.916C23 18.038 18.075 23 12 23S1 18.038 1 11.916C1 6.548 4.787 2.073 9.815 1.051c1.689-.343 2.952 1.104 2.952 2.617v2.134c1.894.364 3.326 2.05 3.326 4.076V14c0 2.291-1.832 4.148-4.093 4.148c-2.26 0-4.093-1.857-4.093-4.148V9.878c0-2.025 1.432-3.711 3.326-4.075V3.668c0-.766-.588-1.208-1.115-1.101c-4.326.879-7.583 4.732-7.583 9.35" opacity=".5"/>
                    <path d="M7.907 13.954c0 2.29 1.833 4.148 4.093 4.148s4.093-1.857 4.093-4.148v-3.37H7.907zm4.861-4.616h3.253c-.312-1.667-1.608-3.292-3.253-3.609zm-1.535 0V5.73c-1.645.317-2.942 1.942-3.254 3.61z"/>
                  </svg>
                </div>
              </div>

              <div className="text-center mb-6">
                <h1 className="text-xl font-semibold text-white mb-1">
                  Reset password
                </h1>
                <p className="text-sm text-neutral-400">
                  We&apos;ll send you a code to reset your password.
                </p>
              </div>

              <div className="space-y-4">
                <Clerk.GlobalError className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm" />

                <SignIn.SupportedStrategy name="reset_password_email_code">
                  <SignIn.Action navigate="forgot-password" asChild>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00f6e0] hover:bg-[#00dcc8] rounded-xl text-neutral-900 font-semibold transition-colors shadow-lg shadow-[#00f6e0]/20">
                      Send reset code
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </button>
                  </SignIn.Action>
                </SignIn.SupportedStrategy>

                <SignIn.Action navigate="start" asChild>
                  <button className="w-full text-sm text-neutral-400 hover:text-white transition-colors flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                    Back to sign in
                  </button>
                </SignIn.Action>
              </div>
            </div>
          </div>
        </SignIn.Step>

        {/* ═══════════════════════════════════════════════════════════════
            STEP 4: RESET PASSWORD
        ═══════════════════════════════════════════════════════════════ */}
        <SignIn.Step name="reset-password">
          <div className="w-full max-w-sm mx-auto">
            <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#00f6e0">
                    <path d="M2.535 11.916c0 5.267 4.238 9.537 9.465 9.537s9.465-4.27 9.465-9.537a9.54 9.54 0 0 0-5.335-8.584a.776.776 0 0 1-.355-1.033a.765.765 0 0 1 1.026-.358A11.09 11.09 0 0 1 23 11.916C23 18.038 18.075 23 12 23S1 18.038 1 11.916C1 6.548 4.787 2.073 9.815 1.051c1.689-.343 2.952 1.104 2.952 2.617v2.134c1.894.364 3.326 2.05 3.326 4.076V14c0 2.291-1.832 4.148-4.093 4.148c-2.26 0-4.093-1.857-4.093-4.148V9.878c0-2.025 1.432-3.711 3.326-4.075V3.668c0-.766-.588-1.208-1.115-1.101c-4.326.879-7.583 4.732-7.583 9.35" opacity=".5"/>
                    <path d="M7.907 13.954c0 2.29 1.833 4.148 4.093 4.148s4.093-1.857 4.093-4.148v-3.37H7.907zm4.861-4.616h3.253c-.312-1.667-1.608-3.292-3.253-3.609zm-1.535 0V5.73c-1.645.317-2.942 1.942-3.254 3.61z"/>
                  </svg>
                </div>
              </div>

              <div className="text-center mb-6">
                <h1 className="text-xl font-semibold text-white mb-1">
                  Set new password
                </h1>
                <p className="text-sm text-neutral-400">
                  Choose a strong password for your account.
                </p>
              </div>

              <div className="space-y-4">
                <Clerk.GlobalError className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm" />

                <Clerk.Field name="password">
                  <Clerk.Label className="block text-sm text-neutral-400 mb-1">New password</Clerk.Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                      </svg>
                    </div>
                    <Clerk.Input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full pl-11 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#00f6e0] focus:ring-1 focus:ring-[#00f6e0]/50 transition-colors"
                    />
                  </div>
                  <Clerk.FieldError className="text-xs text-red-400 mt-1" />
                </Clerk.Field>

                <Clerk.Field name="confirmPassword">
                  <Clerk.Label className="block text-sm text-neutral-400 mb-1">Confirm password</Clerk.Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                      </svg>
                    </div>
                    <Clerk.Input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full pl-11 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#00f6e0] focus:ring-1 focus:ring-[#00f6e0]/50 transition-colors"
                    />
                  </div>
                  <Clerk.FieldError className="text-xs text-red-400 mt-1" />
                </Clerk.Field>

                <SignIn.Action submit asChild>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00f6e0] hover:bg-[#00dcc8] rounded-xl text-neutral-900 font-semibold transition-colors shadow-lg shadow-[#00f6e0]/20">
                    Reset password
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </button>
                </SignIn.Action>
              </div>
            </div>
          </div>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
}
