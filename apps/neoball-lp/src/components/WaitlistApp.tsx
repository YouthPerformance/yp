import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useEffect, useState } from "react";
import WaitlistLeaderboardPreview from "./WaitlistLeaderboardPreview";
import WaitlistModal from "./WaitlistModal";

interface WaitlistAppProps {
  convexUrl: string;
  showLeaderboard?: boolean;
  referrerCode?: string;
}

export default function WaitlistApp({
  convexUrl,
  showLeaderboard = false,
  referrerCode,
}: WaitlistAppProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [convex, setConvex] = useState<ConvexReactClient | null>(null);

  useEffect(() => {
    if (convexUrl) {
      setConvex(new ConvexReactClient(convexUrl));
    }
  }, [convexUrl]);

  // Listen for custom event to open modal
  useEffect(() => {
    const handleOpen = () => {
      setIsModalOpen(true);
    };

    window.addEventListener("open-waitlist-modal", handleOpen as EventListener);
    return () => {
      window.removeEventListener("open-waitlist-modal", handleOpen as EventListener);
    };
  }, []);

  if (!convex) {
    return null;
  }

  return (
    <ConvexProvider client={convex}>
      {/* Leaderboard preview for homepage */}
      {showLeaderboard && <WaitlistLeaderboardPreview onJoinClick={() => setIsModalOpen(true)} />}

      {/* Modal */}
      <WaitlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        referrerCode={referrerCode}
      />
    </ConvexProvider>
  );
}

// Export a function to trigger the modal from outside React
export function openWaitlistModal(referrerCode?: string) {
  window.dispatchEvent(
    new CustomEvent("open-waitlist-modal", {
      detail: { referrerCode },
    }),
  );
}
