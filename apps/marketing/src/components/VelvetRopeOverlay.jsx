import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  { text: "Building your Athlete Profile...", duration: 1500 },
  { text: "Locking in Week 1 Protocol...", duration: 1500 },
  { text: "Calibrating your Barefoot Reset plan...", duration: 1500 },
  { text: "Welcome to the Pack.", duration: 2000, isFinal: true },
];

function VelvetRopeOverlay({ onComplete }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Show skip button after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Progress through steps
  useEffect(() => {
    if (currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep((s) => s + 1);
      } else {
        // Final step - wait then complete
        setTimeout(() => handleComplete(), 1000);
      }
    }, steps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, handleComplete]);

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) onComplete();
      navigate("/app/programs/barefoot-reset");
    }, 500);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const step = steps[currentStep];

  return (
    <div
      className={`
        fixed inset-0 z-50 bg-black flex items-center justify-center
        transition-opacity duration-500
        ${isExiting ? "opacity-0" : "opacity-100"}
      `}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-md">
        {/* Logo */}
        <div className="mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
            <span className="text-2xl font-yp-display text-cyan-500">YP</span>
          </div>
        </div>

        {/* Step text */}
        <div className="min-h-[80px] flex items-center justify-center">
          <p
            className={`
              text-xl md:text-2xl font-yp-display uppercase tracking-wide
              transition-all duration-500
              ${step.isFinal ? "text-cyan-500 scale-110" : "text-white"}
            `}
            key={currentStep}
          >
            {step.text}
          </p>
        </div>

        {/* Loading indicator */}
        {!step.isFinal && (
          <div className="mt-8">
            <div className="flex justify-center gap-2">
              {steps.slice(0, -1).map((_, idx) => (
                <div
                  key={idx}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${idx <= currentStep ? "bg-cyan-500" : "bg-black-400"}
                    ${idx === currentStep ? "scale-125" : ""}
                  `}
                />
              ))}
            </div>
          </div>
        )}

        {/* Final step celebration */}
        {step.isFinal && (
          <div className="mt-8 animate-fadeIn">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-gold-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-dark-text-secondary">Your journey starts now.</p>
          </div>
        )}

        {/* Skip button */}
        {showSkip && !step.isFinal && (
          <button
            onClick={handleSkip}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-dark-text-tertiary hover:text-dark-text-secondary text-sm transition-colors"
          >
            Skip →
          </button>
        )}
      </div>
    </div>
  );
}

export default VelvetRopeOverlay;
