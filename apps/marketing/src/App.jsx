import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { OnboardingProvider } from './context/OnboardingContext'
import Layout from './components/Layout'
import StartHereModal from './components/StartHereModal'

// Critical path - load immediately
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// Lazy load all other pages for code splitting
const Library = lazy(() => import('./pages/Library'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const Instructor = lazy(() => import('./pages/Instructor'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))
const FAQ = lazy(() => import('./pages/FAQ'))
const BulletproofAnkles = lazy(() => import('./pages/BulletproofAnkles'))
const Quiz = lazy(() => import('./pages/Quiz'))
const QuizResults = lazy(() => import('./pages/QuizResults'))
const Offer = lazy(() => import('./pages/Offer'))
const Start = lazy(() => import('./pages/Start'))
const PlanReady = lazy(() => import('./pages/PlanReady'))
const SaveProfile = lazy(() => import('./pages/SaveProfile'))
const StackRunner = lazy(() => import('./pages/app/StackRunner'))
const AppHome = lazy(() => import('./pages/app/AppHome'))
const ProgramHome = lazy(() => import('./pages/app/ProgramHome'))
const LessonPlayer = lazy(() => import('./pages/app/LessonPlayer'))
const MeetWolf = lazy(() => import('./pages/MeetWolf'))
const WolfChat = lazy(() => import('./pages/WolfChat'))
const WolfGrow = lazy(() => import('./pages/WolfGrow'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Mission = lazy(() => import('./pages/Mission'))

// Test pages - only loaded when visiting test routes
const OilSpill = lazy(() => import('./pages/test/OilSpill'))
const FogNoise = lazy(() => import('./pages/test/FogNoise'))
const PortalFrameTest = lazy(() => import('./pages/test/PortalFrameTest'))
const GlobeTest = lazy(() => import('./tests/GlobeTest'))

// Loading fallback for lazy components
function PageLoader() {
  return (
    <div className="min-h-screen bg-wolf-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-500 text-sm uppercase tracking-wider">Loading...</span>
      </div>
    </div>
  )
}

function App() {
  return (
    <OnboardingProvider>
      <StartHereModal />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Standalone pages - no Layout wrapper */}
          <Route path="/grow" element={<WolfGrow />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/mission" element={<Mission />} />

          {/* Test pages for Iridescence backgrounds */}
          <Route path="/test/oil-spill" element={<OilSpill />} />
          <Route path="/test/fog-noise" element={<FogNoise />} />
          <Route path="/test/portal-frame" element={<PortalFrameTest />} />
          <Route path="/test/globe" element={<GlobeTest />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="library" element={<Library />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="instructors/:id" element={<Instructor />} />
            <Route path="coaches" element={<Library />} />
            <Route path="campus" element={<Library />} />
            <Route path="pricing" element={<Offer />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="bulletproof-ankles" element={<BulletproofAnkles />} />
            <Route path="quiz/athlete-type" element={<Quiz />} />
            <Route path="quiz/results" element={<QuizResults />} />
            <Route path="offer/barefoot-reset" element={<Offer />} />
            <Route path="start" element={<Start />} />
            <Route path="plan-ready" element={<PlanReady />} />
            <Route path="save-profile" element={<SaveProfile />} />
            <Route path="meet-wolf" element={<MeetWolf />} />
            <Route path="wolf-chat" element={<WolfChat />} />
            <Route path="app/stacks/:id/run" element={<StackRunner />} />
            <Route path="app" element={<AppHome />} />
            <Route path="app/programs/:id" element={<ProgramHome />} />
            <Route path="app/lessons/:id" element={<LessonPlayer />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </OnboardingProvider>
  )
}

export default App
