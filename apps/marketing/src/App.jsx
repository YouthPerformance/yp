import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import StartHereModal from "./components/StartHereModal";
import { OnboardingProvider } from "./context/OnboardingContext";
import AuthPage from "./pages/AuthPage";
import AppHome from "./pages/app/AppHome";
import LessonPlayer from "./pages/app/LessonPlayer";
import ProgramHome from "./pages/app/ProgramHome";
import StackRunner from "./pages/app/StackRunner";
import BulletproofAnkles from "./pages/BulletproofAnkles";
import CourseDetail from "./pages/CourseDetail";
import Dashboard from "./pages/Dashboard";
import FAQ from "./pages/FAQ";
import Home from "./pages/Home";
import Instructor from "./pages/Instructor";
import JamesScott from "./pages/JamesScott";
import Library from "./pages/Library";
import LP from "./pages/LP";
import MeetWolf from "./pages/MeetWolf";
import Manifesto from "./pages/Manifesto";
import NotFound from "./pages/NotFound";
import Offer from "./pages/Offer";
import PlanReady from "./pages/PlanReady";
import Privacy from "./pages/Privacy";
import Quiz from "./pages/Quiz";
import QuizResults from "./pages/QuizResults";
import SaveProfile from "./pages/SaveProfile";
import Settings from "./pages/Settings";
import Start from "./pages/Start";
import Terms from "./pages/Terms";
import FogNoise from "./pages/test/FogNoise";
import OilSpill from "./pages/test/OilSpill";
import PortalFrameTest from "./pages/test/PortalFrameTest";
import Waitlist from "./pages/Waitlist";
import WolfChat from "./pages/WolfChat";
import WolfGrow from "./pages/WolfGrow";
import GlobeTest from "./tests/GlobeTest";

function App() {
  return (
    <OnboardingProvider>
      <StartHereModal />
      <Routes>
        {/* Standalone pages - no Layout wrapper */}
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/grow" element={<WolfGrow />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/manifesto" element={<Manifesto />} />
        <Route path="/lp" element={<LP />} />

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
          <Route path="james" element={<JamesScott />} />
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
  );
}

export default App;
