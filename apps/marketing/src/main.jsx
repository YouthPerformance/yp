import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'
import { UIProvider } from './context/UIContext'
import App from './App.jsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL

const convex = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

// YouthPerformance Design System - Dark Mode Theme
const clerkAppearance = {
  variables: {
    colorPrimary: '#00F6E0',
    colorBackground: '#0A0A0A',
    colorInputBackground: '#222222',
    colorInputText: '#FFFFFF',
    colorText: '#FFFFFF',
    colorTextSecondary: '#A0A0A0',
    colorDanger: '#EF4444',
    colorSuccess: '#10B981',
    colorWarning: '#FBBF24',
    borderRadius: '12px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  },
  elements: {
    // Modal/Card
    card: 'bg-[#0A0A0A] border border-[#2A2A2A] shadow-xl',
    modalContent: 'bg-[#0A0A0A]',
    modalBackdrop: 'bg-black/80 backdrop-blur-sm',

    // Header
    headerTitle: 'text-white font-semibold',
    headerSubtitle: 'text-[#A0A0A0]',

    // Form
    formButtonPrimary: 'bg-[#00F6E0] hover:bg-[#00DCCE] text-black font-semibold transition-all duration-200 shadow-[0_0_24px_rgba(0,246,224,0.3)] hover:shadow-[0_0_32px_rgba(0,246,224,0.5)]',
    formFieldLabel: 'text-[#A0A0A0] text-sm',
    formFieldInput: 'bg-[#222222] border-[#2A2A2A] text-white placeholder:text-[#666666] focus:border-[#00F6E0] focus:ring-[#00F6E0]/40 rounded-lg',
    formFieldInputShowPasswordButton: 'text-[#A0A0A0] hover:text-white',

    // Divider
    dividerLine: 'bg-[#2A2A2A]',
    dividerText: 'text-[#666666]',

    // Social buttons
    socialButtonsBlockButton: 'bg-[#141414] border-[#2A2A2A] text-white hover:bg-[#1A1A1A] transition-colors',
    socialButtonsBlockButtonText: 'text-white',

    // Footer
    footerActionText: 'text-[#A0A0A0]',
    footerActionLink: 'text-[#00F6E0] hover:text-[#00DCCE]',

    // Identity preview
    identityPreviewText: 'text-white',
    identityPreviewEditButton: 'text-[#00F6E0] hover:text-[#00DCCE]',

    // User button
    userButtonPopoverCard: 'bg-[#0A0A0A] border border-[#2A2A2A]',
    userButtonPopoverActionButton: 'text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A]',
    userButtonPopoverActionButtonText: 'text-inherit',
    userButtonPopoverFooter: 'border-t border-[#2A2A2A]',

    // Alerts
    alertText: 'text-white',

    // Logo
    logoBox: 'hidden',
  }
}

// Wrapper component to conditionally include Convex
function AppProviders({ children }) {
  if (convex) {
    return (
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    )
  }
  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={clerkAppearance}>
      <AppProviders>
        <BrowserRouter>
          <UIProvider>
            <App />
          </UIProvider>
        </BrowserRouter>
      </AppProviders>
    </ClerkProvider>
  </React.StrictMode>,
)
