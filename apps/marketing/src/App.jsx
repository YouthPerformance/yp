import { Routes, Route } from 'react-router-dom'
import { OnboardingProvider } from './context/OnboardingContext'
import Layout from './components/Layout'
import StartHereModal from './components/StartHereModal'
import Home from './pages/Home'
import Library from './pages/Library'
import CourseDetail from './pages/CourseDetail'
import Instructor from './pages/Instructor'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import FAQ from './pages/FAQ'
import NotFound from './pages/NotFound'
import BulletproofAnkles from './pages/BulletproofAnkles'
import Quiz from './pages/Quiz'
import QuizResults from './pages/QuizResults'
import Offer from './pages/Offer'
import Start from './pages/Start'
import PlanReady from './pages/PlanReady'
import SaveProfile from './pages/SaveProfile'
import StackRunner from './pages/app/StackRunner'
import AppHome from './pages/app/AppHome'
import ProgramHome from './pages/app/ProgramHome'
import LessonPlayer from './pages/app/LessonPlayer'
import MeetWolf from './pages/MeetWolf'
import WolfChat from './pages/WolfChat'
import WolfGrow from './pages/WolfGrow'
import AuthPage from './pages/AuthPage'
import OilSpill from './pages/test/OilSpill'
import FogNoise from './pages/test/FogNoise'
import PortalFrameTest from './pages/test/PortalFrameTest'
import GlobeTest from './tests/GlobeTest'

function App() {
  return (
    <OnboardingProvider>
      <StartHereModal />
      <Routes>
        {/* Standalone pages - no Layout wrapper */}
        <Route path="/grow" element={<WolfGrow />} />
        <Route path="/login" element={<AuthPage />} />

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
    </OnboardingProvider>
  )
}

export default App
