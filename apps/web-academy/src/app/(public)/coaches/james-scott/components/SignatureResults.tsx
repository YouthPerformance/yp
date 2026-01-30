"use client";

interface Result {
  icon: string;
  text: string;
  proof?: string; // Optional proof link or citation
}

const RESULTS: Result[] = [
  {
    icon: "⚡",
    text: "Reduce lower-limb overuse risk by improving foot/ankle capacity",
    proof: "Based on 20+ years of pro athlete training",
  },
  {
    icon: "🔄",
    text: "Return-to-play progressions for sprains, foot pain, and chronic instability",
    proof: "Used with NBA, NFL, and Premier League athletes",
  },
  {
    icon: "🦶",
    text: "Barefoot integration that builds springs, not breaks Achilles",
    proof: "The R3 Protocol: Release → Restore → Re-engineer",
  },
  {
    icon: "📊",
    text: "Proprioceptive training that transfers to game-speed performance",
    proof: "100K+ youth trained via Nike Rise program",
  },
];

export function SignatureResults() {
  return (
    <section className="results-section">
      <div className="results-container">
        <div className="results-header">
          <span className="header-accent">//</span>
          <span className="header-text">SIGNATURE RESULTS</span>
          <span className="header-accent">//</span>
        </div>

        <div className="results-grid">
          {RESULTS.map((result, index) => (
            <div key={index} className="result-item">
              <span className="result-icon">{result.icon}</span>
              <div className="result-content">
                <p className="result-text">{result.text}</p>
                {result.proof && (
                  <span className="result-proof">{result.proof}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .results-section {
          background: #000;
          padding: 60px 24px;
          border-top: 1px solid rgba(255, 215, 0, 0.1);
        }

        .results-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .results-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 40px;
        }

        .header-accent {
          color: #333;
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
        }

        .header-text {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          letter-spacing: 3px;
          color: #ffd700;
          text-transform: uppercase;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .result-item {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.3s ease;
        }

        .result-item:hover {
          background: rgba(255, 215, 0, 0.03);
          border-color: rgba(255, 215, 0, 0.15);
        }

        .result-icon {
          font-size: 24px;
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 215, 0, 0.08);
          border: 1px solid rgba(255, 215, 0, 0.2);
        }

        .result-content {
          flex: 1;
        }

        .result-text {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 15px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 8px 0;
        }

        .result-proof {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.5px;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .results-section {
            padding: 40px 16px;
          }

          .results-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .result-item {
            padding: 16px;
          }

          .result-text {
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  );
}
