# YP Conversion Engine — Linear Tickets (200+)

## Epic 0: Infrastructure & Setup (INF)

### INF-001: Initialize Convex backend
- Set up Convex project
- Configure environment variables
- AC: `npx convex dev` runs without errors

### INF-002: Create Convex schema file
- Define all tables from data model
- Add validators for each field
- AC: Schema deploys successfully

### INF-003: Set up Clerk authentication
- Install @clerk/clerk-react
- Configure Clerk provider
- Add environment variables
- AC: Clerk dashboard shows app connected

### INF-004: Configure Clerk for 13+ age compliance
- Enable age verification settings
- Configure COPPA compliance options
- AC: Under-13 users blocked at signup

### INF-005: Set up Stripe account connection
- Add Stripe publishable key
- Add Stripe secret key to Convex
- AC: Stripe dashboard shows test mode active

### INF-006: Create Stripe product for Barefoot Reset
- Create $37 one-time product
- Set up price ID
- AC: Product visible in Stripe dashboard

### INF-007: Create Stripe product for Academy subscription
- Create $29/mo recurring product
- Set up price ID
- AC: Subscription product visible in Stripe

### INF-008: Set up PostHog analytics
- Install posthog-js
- Configure project API key
- AC: Events appear in PostHog dashboard

### INF-009: Create analytics event constants file
- Define all event names as constants
- Add TypeScript types for event properties
- AC: No magic strings in analytics calls

### INF-010: Set up Tailwind config with YP design tokens
- Add custom colors (cyan, gold, blacks)
- Add custom fonts
- Add shadow-glow utilities
- AC: Design tokens available in classes

### INF-011: Configure custom fonts
- Add YP display font
- Add Inter for body
- Configure font-face declarations
- AC: Fonts render correctly

### INF-012: Set up environment variable management
- Create .env.example
- Document all required variables
- AC: New devs can set up quickly

### INF-013: Configure CORS for API routes
- Allow localhost origins
- Allow production domain
- AC: No CORS errors in console

### INF-014: Set up error boundary component
- Create ErrorBoundary wrapper
- Add fallback UI
- AC: Errors don't crash entire app

### INF-015: Configure React Router routes
- Set up route structure
- Add lazy loading for routes
- AC: All routes accessible

---

## Epic 1: Design System & Components (DSN)

### DSN-001: Create Button component - primary variant
- Cyan background, black text
- Hover state with glow
- AC: Matches design spec

### DSN-002: Create Button component - secondary variant
- Border style, transparent bg
- Hover state
- AC: Matches design spec

### DSN-003: Create Button component - ghost variant
- Text only
- Underline on hover
- AC: Matches design spec

### DSN-004: Create Button component - disabled state
- Greyed out appearance
- Cursor not-allowed
- AC: Visually distinct

### DSN-005: Create Button component - loading state
- Spinner icon
- Disabled interaction
- AC: Shows loading feedback

### DSN-006: Create Card component - base
- Dark background
- Subtle border
- Padding variants
- AC: Reusable across app

### DSN-007: Create Card component - hover variant
- Scale transform on hover
- Border color change
- AC: Interactive feedback

### DSN-008: Create Card component - locked variant
- Greyed overlay
- Lock icon
- AC: Indicates gated content

### DSN-009: Create Modal component - base
- Overlay backdrop
- Centered content
- Close button
- AC: Accessible modal

### DSN-010: Create Modal component - animations
- Fade in backdrop
- Scale in content
- AC: Smooth transitions

### DSN-011: Create Modal component - mobile fullscreen
- Full height on mobile
- Slide up animation
- AC: Mobile-optimized

### DSN-012: Create Input component - text
- Dark background
- Focus ring cyan
- Label above
- AC: Consistent styling

### DSN-013: Create Input component - email
- Email validation
- Error state
- AC: Validates email format

### DSN-014: Create Input component - error state
- Red border
- Error message below
- AC: Clear error feedback

### DSN-015: Create Checkbox component
- Custom styled checkbox
- Cyan checkmark
- AC: Accessible

### DSN-016: Create Radio component
- Custom styled radio
- Cyan fill
- AC: Accessible

### DSN-017: Create RadioGroup component
- Manages selection state
- Keyboard navigation
- AC: ARIA compliant

### DSN-018: Create Select component
- Custom dropdown
- Dark theme
- AC: Accessible

### DSN-019: Create ProgressBar component
- Horizontal bar
- Cyan fill
- Percentage label option
- AC: Shows progress visually

### DSN-020: Create ProgressRing component
- Circular progress
- SVG-based
- AC: Smooth animation

### DSN-021: Create Badge component
- Small pill shape
- Color variants
- AC: Status indicators

### DSN-022: Create Avatar component
- Image with fallback
- Size variants
- AC: User profile display

### DSN-023: Create Icon component system
- SVG icon wrapper
- Size prop
- Color prop
- AC: Consistent icons

### DSN-024: Create Accordion component
- Expandable sections
- Smooth animation
- AC: FAQ sections

### DSN-025: Create AccordionItem component
- Header + content
- Open/close state
- AC: Individual items

### DSN-026: Create Toast component
- Success/error/info variants
- Auto-dismiss
- AC: User feedback

### DSN-027: Create ToastProvider component
- Context for toasts
- Stack management
- AC: Multiple toasts

### DSN-028: Create Skeleton component
- Loading placeholder
- Pulse animation
- AC: Content loading states

### DSN-029: Create Spinner component
- Loading indicator
- Size variants
- AC: Async feedback

### DSN-030: Create Divider component
- Horizontal/vertical
- With label option
- AC: Visual separation

### DSN-031: Create Container component
- Max-width constraint
- Responsive padding
- AC: Layout consistency

### DSN-032: Create Stack component
- Vertical/horizontal layout
- Gap prop
- AC: Flex layout helper

### DSN-033: Create Grid component
- Responsive columns
- Gap prop
- AC: Grid layout helper

### DSN-034: Create Heading component
- H1-H6 variants
- YP display font
- AC: Typography consistency

### DSN-035: Create Text component
- Size variants
- Color variants
- AC: Body text consistency

### DSN-036: Create Link component
- Internal/external handling
- Hover states
- AC: Navigation consistency

### DSN-037: Create Tooltip component
- Hover trigger
- Position variants
- AC: Additional context

### DSN-038: Create Tabs component
- Tab list + panels
- Keyboard navigation
- AC: Content organization

### DSN-039: Create TabPanel component
- Content container
- Show/hide logic
- AC: Tab content

### DSN-040: Create Chip component
- Selectable pill
- Active state
- AC: Filter/tag selection

---

## Epic 2: Landing Page (LND)

### LND-001: Update hero headline text
- "THE PRO SPORTS ACADEMY IN YOUR POCKET."
- Cyan accent on second line
- AC: Matches spec exactly

### LND-002: Update hero subhead text
- "Elite training, democratized..."
- AC: Matches spec exactly

### LND-003: Update primary CTA to "Join the Pack"
- Link to pricing/signup
- AC: Button text correct

### LND-004: Add secondary CTA "Get Bulletproof Ankles (Free)"
- Opens Start Here modal
- AC: Triggers modal

### LND-005: Add under-button microcopy
- "8 minutes. Simple steps..."
- Smaller text below CTAs
- AC: Visible on landing

### LND-006: Create StartHereModal component shell
- Modal wrapper
- Open/close state
- AC: Modal opens/closes

### LND-007: Wire "Get Bulletproof Ankles" to modal
- onClick handler
- AC: Click opens modal

### LND-008: Add UTM parameter capture on landing
- Read UTM from URL
- Store in state/context
- AC: UTMs captured

### LND-009: Persist UTMs through navigation
- Pass UTMs to next pages
- AC: UTMs available in funnel

### LND-010: Update trust line copy
- "Short sessions • Clear coaching..."
- AC: Matches spec

### LND-011: Add social proof counter
- "Join X athletes"
- Placeholder number
- AC: Social proof visible

### LND-012: Create hero background gradient
- Radial gradient effect
- Subtle animation option
- AC: Visual depth

### LND-013: Optimize hero for mobile
- Stack CTAs vertically
- Adjust font sizes
- AC: Mobile responsive

### LND-014: Add scroll indicator
- Chevron down icon
- Bounce animation
- AC: Encourages scroll

### LND-015: Update nav CTA "Join the Campus"
- Keep as tertiary nav option
- AC: Nav unchanged

### LND-016: Add analytics: landing_page_view
- Fire on mount
- Include UTM props
- AC: Event in PostHog

### LND-017: Add analytics: cta_click_join_pack
- Fire on primary CTA click
- AC: Event tracked

### LND-018: Add analytics: cta_click_bulletproof_ankles
- Fire on secondary CTA click
- AC: Event tracked

### LND-019: Update problem strip section copy
- Keep or adjust as needed
- AC: Messaging aligned

### LND-020: Update R3 method section
- Ensure copy matches strategy
- AC: Consistent messaging

---

## Epic 3: Start Here Onboarding (ONB)

### ONB-001: Create onboarding state machine
- Track current step (1-5)
- Store answers
- AC: State managed correctly

### ONB-002: Create OnboardingContext provider
- Share state across steps
- Persist to localStorage
- AC: State persists

### ONB-003: Create Step 1: Role selection UI
- Parent / Athlete / Coach options
- Radio or card selection
- AC: Role selectable

### ONB-004: Add role icons
- Icon for each role
- AC: Visual clarity

### ONB-005: Create Step 2: Age verification (Athlete)
- "Are you 13+?" yes/no
- AC: Age captured

### ONB-006: Create Step 2: Age band selection (Parent)
- Under 8 / 8-12 / 13+ options
- AC: Child age captured

### ONB-007: Handle under-13 athlete redirect
- Show parent flow message
- "Have a parent set this up"
- AC: Compliance enforced

### ONB-008: Create Step 3: Sport selection UI
- Basketball / Barefoot / Both / Other
- AC: Sport captured

### ONB-009: Add sport icons
- Icon for each sport
- AC: Visual clarity

### ONB-010: Create Step 4: Space selection UI
- Apartment / Driveway / Gym / Field
- AC: Space captured

### ONB-011: Add space icons
- Icon for each space
- AC: Visual clarity

### ONB-012: Create Step 5: Pain check UI
- No / Foot-ankle / Knee-hip-back / Not sure
- AC: Pain flag captured

### ONB-013: Add pain check helper text
- "If anything feels sharp..."
- AC: Safety messaging

### ONB-014: Create progress indicator
- "Step X of 5"
- Progress bar
- AC: User knows progress

### ONB-015: Create "Continue" button for each step
- Disabled until selection made
- AC: Validation enforced

### ONB-016: Create "Back" button for steps 2-5
- Navigate to previous step
- AC: Can go back

### ONB-017: Create completion screen
- "Your starter plan is ready"
- AC: Completion feedback

### ONB-018: Create "Continue to Bulletproof Ankles" CTA
- Routes to /bulletproof-ankles
- AC: Navigation works

### ONB-019: Save onboarding data to Convex
- Create leadProfile record
- AC: Data persisted

### ONB-020: Create leadProfiles Convex table
- Define schema
- AC: Table exists

### ONB-021: Create createLeadProfile mutation
- Validate inputs
- Insert record
- AC: Mutation works

### ONB-022: Generate anonymous ID for leads
- UUID or similar
- Store in localStorage
- AC: Trackable anonymous user

### ONB-023: Add analytics: onboarding_start
- Fire when modal opens
- AC: Event tracked

### ONB-024: Add analytics: onboarding_step_complete
- Fire for each step
- Include step number
- AC: Funnel trackable

### ONB-025: Add analytics: onboarding_complete
- Fire on completion
- Include all answers
- AC: Conversion tracked

### ONB-026: Create /start fallback page
- Same flow as modal
- For blocked modal cases
- AC: Fallback works

### ONB-027: Handle modal close without completing
- Save partial progress
- AC: Progress not lost

### ONB-028: Add keyboard navigation
- Tab between options
- Enter to select
- AC: Accessible

### ONB-029: Mobile optimize modal
- Full screen on mobile
- Large touch targets
- AC: Mobile friendly

### ONB-030: Add transition animations
- Slide between steps
- AC: Smooth UX

---

## Epic 4: Bulletproof Ankles Page (BPA)

### BPA-001: Create /bulletproof-ankles route
- Add to router
- AC: Route accessible

### BPA-002: Create BulletproofAnklesPage component
- Page layout shell
- AC: Page renders

### BPA-003: Add H1 "Bulletproof Ankles"
- YP display font
- AC: Title visible

### BPA-004: Add answer-first paragraph
- "This is a short starter protocol..."
- AC: AEO content

### BPA-005: Create key takeaways section
- Bullet list
- AC: Scannable info

### BPA-006: Create safety accordion
- "Safety / Stop Rules" header
- Expandable content
- AC: Safety info accessible

### BPA-007: Add stop rule content
- When to stop
- Warning signs
- AC: Safety covered

### BPA-008: Create age band toggle
- Show age-appropriate content
- Based on onboarding data
- AC: Personalized content

### BPA-009: Create "Start the 8-Minute Stack" CTA
- Primary button
- Links to Stack Runner
- AC: CTA visible

### BPA-010: Create "Save your streak" locked CTA
- Greyed/locked state
- Lock icon
- AC: Gated visibility

### BPA-011: Add lock tooltip
- "Create profile to save"
- AC: Explains lock

### BPA-012: Load onboarding context
- Read from localStorage/Convex
- AC: Personalization works

### BPA-013: Add page metadata
- Title, description
- OG tags
- AC: SEO ready

### BPA-014: Add structured data (JSON-LD)
- HowTo schema
- AC: AEO optimized

### BPA-015: Mobile optimize layout
- Single column
- Appropriate spacing
- AC: Mobile friendly

### BPA-016: Add analytics: bulletproof_page_view
- Fire on mount
- AC: Event tracked

### BPA-017: Add analytics: cta_click_start_stack
- Fire on Start Stack click
- AC: Event tracked

### BPA-018: Preload Stack Runner on hover
- Prefetch route
- AC: Faster navigation

### BPA-019: Add breadcrumb navigation
- Home > Bulletproof Ankles
- AC: Navigation context

### BPA-020: Create related content section
- Links to other resources
- AC: Engagement hooks

---

## Epic 5: Stack Runner (STK)

### STK-001: Create /app/stacks/:id/run route
- Dynamic route
- AC: Route accessible

### STK-002: Create StackRunner component shell
- Full screen layout
- AC: Component renders

### STK-003: Create stack data model
- Exercises, duration, cues
- AC: Data structure defined

### STK-004: Create Bulletproof Ankles stack content
- All exercises
- Timing/reps
- AC: Content complete

### STK-005: Create exercise display UI
- Exercise name
- Instructions
- AC: Clear display

### STK-006: Create timer component
- Countdown display
- AC: Time tracking

### STK-007: Add timer controls
- Start/pause/reset
- AC: User control

### STK-008: Create audio cues
- Start/stop sounds
- AC: Audio feedback

### STK-009: Add vibration feedback (mobile)
- On exercise change
- AC: Haptic feedback

### STK-010: Create progress indicator
- Exercise X of Y
- Progress bar
- AC: Progress visible

### STK-011: Create "Next Exercise" button
- Manual advance option
- AC: User control

### STK-012: Create "Previous Exercise" button
- Go back option
- AC: User control

### STK-013: Handle stack completion
- Completion screen
- AC: End state

### STK-014: Create completion celebration
- Animation/confetti
- Success message
- AC: Positive feedback

### STK-015: Create "Take Quiz" CTA on completion
- Link to /quiz/athlete-type
- AC: Next step clear

### STK-016: Create "Save Streak" CTA on completion
- Gated if no profile
- AC: Conversion point

### STK-017: Show lock state for Save Streak
- If anonymous user
- AC: Gate visible

### STK-018: Create profile creation prompt
- Inline form or modal
- AC: Conversion flow

### STK-019: Create stackRuns Convex table
- Define schema
- AC: Table exists

### STK-020: Create saveStackRun mutation
- Save completion record
- AC: Data persisted

### STK-021: Handle anonymous completion
- Store in localStorage
- AC: Can convert later

### STK-022: Add analytics: stack_start
- Fire on first exercise
- AC: Event tracked

### STK-023: Add analytics: stack_complete
- Fire on completion
- AC: Event tracked

### STK-024: Add analytics: stack_abandon
- Fire on exit before complete
- Include progress
- AC: Drop-off tracked

### STK-025: Mobile optimize Stack Runner
- Large touch targets
- Clear visibility
- AC: Mobile first

### STK-026: Add exercise images/animations
- Visual demo
- AC: Clear instruction

### STK-027: Create rest period UI
- Between exercises
- AC: Pacing clear

### STK-028: Add "Skip Rest" option
- For faster pace
- AC: User control

### STK-029: Handle browser back during stack
- Confirm exit
- AC: Prevent accidental exit

### STK-030: Add offline support
- Cache stack content
- AC: Works offline

---

## Epic 6: Quiz (QIZ)

### QIZ-001: Create /quiz/athlete-type route
- Add to router
- AC: Route accessible

### QIZ-002: Create QuizPage component shell
- Quiz layout
- AC: Component renders

### QIZ-003: Create quiz state machine
- Track current question
- Store answers
- AC: State managed

### QIZ-004: Design quiz questions (6-8)
- Movement pattern questions
- AC: Questions defined

### QIZ-005: Create Question 1 UI
- Question text
- Answer options
- AC: Q1 works

### QIZ-006: Create Question 2 UI
- Question text
- Answer options
- AC: Q2 works

### QIZ-007: Create Question 3 UI
- Question text
- Answer options
- AC: Q3 works

### QIZ-008: Create Question 4 UI
- Question text
- Answer options
- AC: Q4 works

### QIZ-009: Create Question 5 UI
- Question text
- Answer options
- AC: Q5 works

### QIZ-010: Create Question 6 UI
- Question text
- Answer options
- AC: Q6 works

### QIZ-011: Create Question 7 UI (optional)
- Question text
- Answer options
- AC: Q7 works

### QIZ-012: Create Question 8 UI (optional)
- Question text
- Answer options
- AC: Q8 works

### QIZ-013: Create quiz progress indicator
- Question X of Y
- Progress bar
- AC: Progress visible

### QIZ-014: Create answer selection UI
- Tap to select
- Visual feedback
- AC: Clear selection

### QIZ-015: Auto-advance on selection
- Move to next question
- AC: Smooth flow

### QIZ-016: Create identity calculation logic
- Score answers
- Determine type
- AC: Correct identity

### QIZ-017: Map scores to identity types
- Force Leaker threshold
- Elasticity Block threshold
- Absorption Deficit threshold
- Control Gap threshold
- AC: Mapping correct

### QIZ-018: Create /quiz/results route
- Add to router
- AC: Route accessible

### QIZ-019: Create QuizResultsPage component
- Results layout
- AC: Component renders

### QIZ-020: Display identity name prominently
- Large heading
- AC: Identity visible

### QIZ-021: Create Force Leaker result content
- Cold reading text
- Sage explanation
- AC: Content complete

### QIZ-022: Create Elasticity Block result content
- Cold reading text
- Sage explanation
- AC: Content complete

### QIZ-023: Create Absorption Deficit result content
- Cold reading text
- Sage explanation
- AC: Content complete

### QIZ-024: Create Control Gap result content
- Cold reading text
- Sage explanation
- AC: Content complete

### QIZ-025: Create "What it means" section
- Visible to all
- AC: Free content

### QIZ-026: Create "Fix Plan" section - locked state
- Blurred content
- Lock overlay
- AC: Gate visible

### QIZ-027: Create email capture form
- "Where should we send your fix?"
- Email input
- Submit button
- AC: Form works

### QIZ-028: Validate email format
- Client-side validation
- AC: Invalid emails rejected

### QIZ-029: Create emailCaptures Convex table
- Define schema
- AC: Table exists

### QIZ-030: Create captureEmail mutation
- Save email record
- Link to leadProfile
- AC: Email saved

### QIZ-031: Unlock fix plan on email submit
- Show full content
- AC: Gate opens

### QIZ-032: Create quizResults Convex table
- Define schema
- AC: Table exists

### QIZ-033: Create saveQuizResult mutation
- Save identity type
- Link to leadProfile
- AC: Result saved

### QIZ-034: Show "Unlock Barefoot Reset" CTA
- After email captured
- Link to offer page
- AC: Upsell visible

### QIZ-035: Add analytics: quiz_start
- Fire on first question
- AC: Event tracked

### QIZ-036: Add analytics: quiz_complete
- Fire on completion
- Include identity type
- AC: Event tracked

### QIZ-037: Add analytics: identity_viewed
- Fire on results page
- AC: Event tracked

### QIZ-038: Add analytics: fix_plan_unlock_email_submitted
- Fire on email submit
- AC: Event tracked

### QIZ-039: Mobile optimize quiz
- Large touch targets
- Easy scrolling
- AC: Mobile friendly

### QIZ-040: Add share result option
- Copy link or social share
- AC: Virality hook

---

## Epic 7: Offer & Checkout (OFR)

### OFR-001: Create /offer/barefoot-reset route
- Add to router
- AC: Route accessible

### OFR-002: Create OfferPage component shell
- Offer layout
- AC: Component renders

### OFR-003: Add offer headline
- "Barefoot Reset — Lifetime access"
- AC: Headline visible

### OFR-004: Add offer subhead
- "Short sessions. Clear cues..."
- AC: Subhead visible

### OFR-005: Create price display
- "$37 one-time"
- Large, prominent
- AC: Price clear

### OFR-006: Add anchor pricing
- "Normally in $29/mo Academy"
- Strikethrough style
- AC: Value clear

### OFR-007: Create benefits list
- What's included
- Checkmark icons
- AC: Value props clear

### OFR-008: Create "Unlock Barefoot Reset" CTA
- Primary button
- Triggers checkout
- AC: CTA works

### OFR-009: Add trust badges
- Secure payment
- Money-back guarantee
- AC: Trust signals

### OFR-010: Add testimonial snippet
- Quick social proof
- AC: Social proof

### OFR-011: Create Stripe checkout session (backend)
- Convex action
- Create session with price
- AC: Session created

### OFR-012: Create initiateCheckout mutation
- Call Stripe API
- Return session URL
- AC: Checkout starts

### OFR-013: Redirect to Stripe Checkout
- Window.location or redirect
- AC: User at Stripe

### OFR-014: Create success return URL
- /app/programs/barefoot-reset
- With session_id param
- AC: Return URL set

### OFR-015: Create cancel return URL
- /offer/barefoot-reset
- AC: Cancel returns

### OFR-016: Handle Stripe webhook
- checkout.session.completed
- AC: Webhook received

### OFR-017: Create purchases Convex table
- Define schema
- AC: Table exists

### OFR-018: Create recordPurchase mutation
- Save purchase record
- AC: Purchase saved

### OFR-019: Create entitlements Convex table
- Define schema
- AC: Table exists

### OFR-020: Create grantEntitlement mutation
- Create entitlement record
- AC: Entitlement granted

### OFR-021: Check entitlement on app routes
- Query user entitlements
- AC: Access controlled

### OFR-022: Add analytics: offer_viewed
- Fire on mount
- AC: Event tracked

### OFR-023: Add analytics: checkout_start
- Fire on CTA click
- AC: Event tracked

### OFR-024: Add analytics: purchase_complete
- Fire on success return
- AC: Event tracked

### OFR-025: Handle payment failure
- Show error message
- AC: Error handled

### OFR-026: Mobile optimize offer page
- Single column
- Clear CTA
- AC: Mobile friendly

### OFR-027: Add urgency element (optional)
- "X athletes started today"
- AC: Urgency visible

### OFR-028: Add FAQ section
- Common questions
- AC: Objections handled

### OFR-029: Create exit-intent popup
- On mouse leave (desktop)
- AC: Recapture attention

### OFR-030: Add Stripe test mode handling
- Use test keys in dev
- AC: Testing works

---

## Epic 8: Velvet Rope Entry (VRP)

### VRP-001: Create VelvetRopeOverlay component
- Full screen overlay
- AC: Component renders

### VRP-002: Create step 1 animation
- "Building your Athlete Profile..."
- Loading animation
- AC: Step 1 shows

### VRP-003: Create step 2 animation
- "Locking in Week 1 Protocol..."
- Loading animation
- AC: Step 2 shows

### VRP-004: Create step 3 animation
- "Calibrating your Barefoot Reset plan..."
- Loading animation
- AC: Step 3 shows

### VRP-005: Create step 4 reveal
- "Welcome to the Pack."
- Celebration effect
- AC: Welcome shows

### VRP-006: Add timing between steps
- ~1.5s per step
- AC: Paced correctly

### VRP-007: Add skip button after 2s
- For accessibility
- AC: Skippable

### VRP-008: Track velvet rope shown state
- In user profile
- AC: Only shows once

### VRP-009: Create updateUserProfile mutation
- Set velvetRopeShown: true
- AC: State persisted

### VRP-010: Route to program home on complete
- /app/programs/barefoot-reset
- AC: Navigation works

### VRP-011: Add analytics: velvet_rope_shown
- Fire on mount
- AC: Event tracked

### VRP-012: Add analytics: velvet_rope_skipped
- Fire if skipped
- AC: Event tracked

### VRP-013: Add analytics: velvet_rope_complete
- Fire on completion
- AC: Event tracked

### VRP-014: Mobile optimize overlay
- Full screen
- Centered content
- AC: Mobile friendly

### VRP-015: Add background music/sound (optional)
- Subtle audio
- Mute option
- AC: Audio enhancement

---

## Epic 9: Academy App Core (APP)

### APP-001: Create /app route
- App home
- AC: Route accessible

### APP-002: Create AppLayout component
- Shared layout for app routes
- AC: Layout works

### APP-003: Create app navigation
- Bottom nav on mobile
- Side nav on desktop
- AC: Navigation works

### APP-004: Create Home nav item
- Links to /app
- AC: Nav item works

### APP-005: Create Programs nav item
- Links to programs list
- AC: Nav item works

### APP-006: Create Profile nav item
- Links to profile
- AC: Nav item works

### APP-007: Create AppHomePage component
- Continue watching
- Programs overview
- AC: Home renders

### APP-008: Create "Continue" section
- Resume last lesson
- AC: Continue works

### APP-009: Create programs list section
- Cards for each program
- AC: Programs visible

### APP-010: Create /app/programs/barefoot-reset route
- Program home
- AC: Route accessible

### APP-011: Create ProgramHomePage component
- Program details
- Week grid
- AC: Component renders

### APP-012: Create program header
- Title, description
- Progress overview
- AC: Header visible

### APP-013: Create WeekGrid component
- Week 1, 2, 3, 4
- AC: Grid renders

### APP-014: Create WeekCard component
- Week number
- Lessons count
- Completion status
- AC: Card renders

### APP-015: Create LessonList component
- Lessons for selected week
- AC: List renders

### APP-016: Create LessonCard component
- Lesson title
- Duration
- Complete status
- AC: Card renders

### APP-017: Create lesson lock states
- Locked if previous incomplete
- AC: Progression enforced

### APP-018: Create /app/lessons/:id route
- Lesson player
- AC: Route accessible

### APP-019: Create LessonPage component
- Video player
- Lesson content
- AC: Component renders

### APP-020: Create video player component
- HTML5 video
- Custom controls
- AC: Video plays

### APP-021: Add play/pause control
- Click or button
- AC: Control works

### APP-022: Add progress bar
- Seek support
- AC: Seeking works

### APP-023: Add volume control
- Slider
- Mute button
- AC: Volume works

### APP-024: Add fullscreen toggle
- Enter/exit fullscreen
- AC: Fullscreen works

### APP-025: Add playback speed control
- 0.5x to 2x
- AC: Speed works

### APP-026: Track video progress
- Save position
- AC: Progress saved

### APP-027: Create lesson content section
- Steps/instructions
- Below video
- AC: Content visible

### APP-028: Create "Mark Complete" button
- Manual completion
- AC: Completion works

### APP-029: Auto-complete on video end
- If watched 90%+
- AC: Auto-complete works

### APP-030: Create programProgress Convex table
- Define schema
- AC: Table exists

### APP-031: Create updateLessonProgress mutation
- Save progress
- AC: Progress saved

### APP-032: Create markLessonComplete mutation
- Mark complete
- Update program progress
- AC: Completion saved

### APP-033: Show completion celebration
- Animation on complete
- AC: Celebration shows

### APP-034: Navigate to next lesson
- CTA on completion
- AC: Navigation works

### APP-035: Create lesson completion query
- Get completed lessons
- AC: Query works

### APP-036: Calculate program progress
- Percentage complete
- AC: Calculation correct

### APP-037: Add analytics: lesson_start
- Fire on video play
- AC: Event tracked

### APP-038: Add analytics: lesson_complete
- Fire on completion
- AC: Event tracked

### APP-039: Add analytics: week1_complete
- Fire when week 1 done
- AC: Event tracked

### APP-040: Create upsell trigger after Day 3
- Show upgrade prompt
- AC: Upsell shows

### APP-041: Create /app/upgrade route
- Upgrade page
- AC: Route accessible

### APP-042: Create UpgradePage component
- Academy benefits
- Pricing
- AC: Page renders

### APP-043: Mobile optimize app
- Touch-friendly
- Responsive layout
- AC: Mobile friendly

### APP-044: Add offline video caching (PWA)
- Service worker
- AC: Offline works

### APP-045: Add push notification setup
- Streak reminders
- AC: Notifications work

---

## Epic 10: Coach Virality (VIR)

### VIR-001: Create coach flow detection
- If role === 'coach'
- AC: Coach identified

### VIR-002: Create coach challenge code generator
- Format: COACH-NAME-YEAR
- AC: Code generated

### VIR-003: Create referrals Convex table
- Define schema
- AC: Table exists

### VIR-004: Create generateCoachCode mutation
- Save code to profile
- AC: Code saved

### VIR-005: Create coach dashboard section
- Show code
- Share stats
- AC: Dashboard visible

### VIR-006: Create share message generator
- Pre-written message
- AC: Message ready

### VIR-007: Create copy code button
- Copy to clipboard
- AC: Copy works

### VIR-008: Create share via SMS button
- Native share
- AC: Share works

### VIR-009: Create share via email button
- Mailto link
- AC: Share works

### VIR-010: Track referral code usage
- On quiz completion
- AC: Referral tracked

### VIR-011: Create trackReferral mutation
- Link quiz to coach
- AC: Referral saved

### VIR-012: Query referral count
- Count completed quizzes
- AC: Count accurate

### VIR-013: Display referral progress
- "X of 5 to unlock"
- AC: Progress visible

### VIR-014: Check unlock threshold
- If count >= 5
- AC: Threshold checked

### VIR-015: Grant durability pack reward
- Unlock content
- AC: Reward granted

### VIR-016: Send coach reward email
- Notification email
- AC: Email sent

### VIR-017: Add analytics: coach_code_generated
- Fire on generation
- AC: Event tracked

### VIR-018: Add analytics: referral_quiz_complete
- Fire on referral
- Include coach code
- AC: Event tracked

### VIR-019: Add analytics: coach_reward_unlocked
- Fire on unlock
- AC: Event tracked

### VIR-020: Mobile optimize coach flow
- Easy sharing
- AC: Mobile friendly

---

## Epic 11: Authentication & Profiles (AUT)

### AUT-001: Create Clerk SignIn component wrapper
- Styled to match app
- AC: Sign in works

### AUT-002: Create Clerk SignUp component wrapper
- Styled to match app
- AC: Sign up works

### AUT-003: Create UserButton component wrapper
- Profile dropdown
- AC: User menu works

### AUT-004: Create useAuth hook
- Wrap Clerk hooks
- AC: Auth accessible

### AUT-005: Create protected route wrapper
- Redirect if not authed
- AC: Protection works

### AUT-006: Sync Clerk user to Convex
- On sign in
- AC: User synced

### AUT-007: Create users Convex table
- Define schema
- AC: Table exists

### AUT-008: Create syncUser mutation
- Create/update user record
- AC: Sync works

### AUT-009: Link leadProfile to user
- On account creation
- AC: Link created

### AUT-010: Create /app/profile route
- Profile page
- AC: Route accessible

### AUT-011: Create ProfilePage component
- User info
- Settings
- AC: Page renders

### AUT-012: Create profile edit form
- Name, avatar
- AC: Edit works

### AUT-013: Create subscription status display
- Current plan
- Renewal date
- AC: Status visible

### AUT-014: Create sign out button
- Clerk sign out
- AC: Sign out works

### AUT-015: Handle auth state loading
- Loading UI
- AC: Loading handled

---

## Epic 12: Email & Notifications (EML)

### EML-001: Set up email provider (Resend/Loops)
- API keys
- AC: Provider connected

### EML-002: Create email template - Fix Plan
- HTML email
- AC: Template ready

### EML-003: Create email template - Purchase Confirmation
- HTML email
- AC: Template ready

### EML-004: Create email template - Coach Reward
- HTML email
- AC: Template ready

### EML-005: Create sendFixPlanEmail action
- Send via provider
- AC: Email sends

### EML-006: Create sendPurchaseConfirmation action
- Send via provider
- AC: Email sends

### EML-007: Create sendCoachReward action
- Send via provider
- AC: Email sends

### EML-008: Create email drip sequence - Day 1
- Welcome email
- AC: Drip 1 ready

### EML-009: Create email drip sequence - Day 3
- Progress check
- AC: Drip 3 ready

### EML-010: Create email drip sequence - Day 7
- Week 1 completion
- AC: Drip 7 ready

### EML-011: Set up email scheduling
- Cron or queue
- AC: Scheduling works

### EML-012: Create unsubscribe handling
- One-click unsubscribe
- AC: Compliance met

---

## Epic 13: Testing (TST)

### TST-001: Set up testing framework
- Vitest or Jest
- AC: Tests run

### TST-002: Create Button component tests
- All variants
- AC: Tests pass

### TST-003: Create Modal component tests
- Open/close
- AC: Tests pass

### TST-004: Create onboarding flow tests
- Happy path
- AC: Tests pass

### TST-005: Create quiz flow tests
- All identity types
- AC: Tests pass

### TST-006: Create checkout flow tests
- Mock Stripe
- AC: Tests pass

### TST-007: Create Stack Runner tests
- Completion
- AC: Tests pass

### TST-008: Create auth flow tests
- Sign in/up
- AC: Tests pass

### TST-009: Set up E2E testing (Playwright)
- Install and configure
- AC: E2E runs

### TST-010: Create E2E: Full funnel test
- Landing to purchase
- AC: E2E passes

### TST-011: Create E2E: Quiz flow test
- Complete quiz
- AC: E2E passes

### TST-012: Create E2E: Mobile viewport tests
- Responsive behavior
- AC: E2E passes

---

## Epic 14: Performance & SEO (PRF)

### PRF-001: Add lazy loading for images
- Below fold images
- AC: Images lazy load

### PRF-002: Add route code splitting
- Dynamic imports
- AC: Bundles split

### PRF-003: Optimize bundle size
- Tree shaking
- AC: Bundle smaller

### PRF-004: Add image optimization
- WebP format
- Responsive sizes
- AC: Images optimized

### PRF-005: Add meta tags to all pages
- Title, description
- AC: SEO tags present

### PRF-006: Add OG tags to all pages
- Social sharing
- AC: OG tags present

### PRF-007: Add structured data to landing
- Organization schema
- AC: Schema present

### PRF-008: Add structured data to bulletproof-ankles
- HowTo schema
- AC: Schema present

### PRF-009: Create sitemap
- All public routes
- AC: Sitemap exists

### PRF-010: Create robots.txt
- Allow/disallow rules
- AC: Robots.txt exists

### PRF-011: Add Core Web Vitals monitoring
- Track LCP, FID, CLS
- AC: Monitoring active

### PRF-012: Optimize first contentful paint
- Critical CSS
- AC: FCP improved

---

## Epic 15: Policies & Compliance (POL)

### POL-001: Create /policy/privacy route
- Privacy policy page
- AC: Route accessible

### POL-002: Create privacy policy content
- Legal content
- AC: Content complete

### POL-003: Create /policy/terms route
- Terms of use page
- AC: Route accessible

### POL-004: Create terms of use content
- Legal content
- AC: Content complete

### POL-005: Create /policy/coppa route
- COPPA compliance page
- AC: Route accessible

### POL-006: Create COPPA policy content
- Under-13 handling
- AC: Content complete

### POL-007: Create /policy/medical route
- Medical disclaimer
- AC: Route accessible

### POL-008: Create medical disclaimer content
- Not medical advice
- AC: Content complete

### POL-009: Add cookie consent banner
- GDPR compliance
- AC: Banner shows

### POL-010: Create cookie preferences modal
- Category toggles
- AC: Preferences work

---

*Total: 217 tickets*
*Last updated: December 2024*
