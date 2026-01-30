"use client";

interface CredentialsDossierProps {
  subject: string;
  role: string;
  affiliation: string;
  education: string;
  specialization: string;
  media: string;
  signature: string;
}

export function CredentialsDossier({
  subject,
  role,
  affiliation,
  education,
  specialization,
  media,
  signature,
}: CredentialsDossierProps) {
  return (
    <section className="credentials-section">
      <div className="credentials-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="header-line" />
          <h2 className="section-label">DECLASSIFIED DOSSIER</h2>
          <span className="header-line" />
        </div>

        {/* Dossier Block */}
        <dl className="dossier-block" aria-label="Credentials File">
          {/* Corner Ticks */}
          <div className="tick tick-tl" />
          <div className="tick tick-tr" />
          <div className="tick tick-bl" />
          <div className="tick tick-br" />

          <div className="dossier-row">
            <dt className="dossier-label">SUBJECT:</dt>
            <dd className="dossier-value">{subject}</dd>
          </div>
          <div className="dossier-row">
            <dt className="dossier-label">ROLE:</dt>
            <dd className="dossier-value">{role}</dd>
          </div>
          <div className="dossier-row">
            <dt className="dossier-label">AFFILIATION:</dt>
            <dd className="dossier-value">{affiliation}</dd>
          </div>
          <div className="dossier-row">
            <dt className="dossier-label">EDUCATION:</dt>
            <dd className="dossier-value">{education}</dd>
          </div>
          <div className="dossier-row">
            <dt className="dossier-label">SPECIALIZATION:</dt>
            <dd className="dossier-value">{specialization}</dd>
          </div>
          <div className="dossier-row">
            <dt className="dossier-label">MEDIA:</dt>
            <dd className="dossier-value">{media}</dd>
          </div>
          <div className="dossier-row">
            <dt className="dossier-label">SIGNATURE:</dt>
            <dd className="dossier-value highlight">[{signature}]</dd>
          </div>
        </dl>

        {/* File Stamp */}
        <div className="file-stamp">
          <span className="stamp-text">FILE STATUS: ACTIVE</span>
          <span className="stamp-divider">//</span>
          <span className="stamp-text">ACCESS LEVEL: PUBLIC</span>
        </div>
      </div>

      <style jsx>{`
        .credentials-section {
          padding: 80px 24px;
          background: #000;
          position: relative;
        }

        .credentials-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.15) 2px,
            rgba(0, 0, 0, 0.15) 4px
          );
          pointer-events: none;
          opacity: 0.5;
        }

        .credentials-container {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 48px;
        }

        .header-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 246, 224, 0.3),
            transparent
          );
        }

        .section-label {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 4px;
          color: #00f6e0;
          margin: 0;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .dossier-block {
          position: relative;
          padding: 32px;
          background: rgba(0, 246, 224, 0.02);
          border: 1px solid rgba(0, 246, 224, 0.2);
          margin: 0;
        }

        /* Corner Ticks */
        .tick {
          position: absolute;
          width: 12px;
          height: 12px;
        }

        .tick-tl {
          top: 0;
          left: 0;
          border-top: 2px solid #00f6e0;
          border-left: 2px solid #00f6e0;
        }

        .tick-tr {
          top: 0;
          right: 0;
          border-top: 2px solid #00f6e0;
          border-right: 2px solid #00f6e0;
        }

        .tick-bl {
          bottom: 0;
          left: 0;
          border-bottom: 2px solid #00f6e0;
          border-left: 2px solid #00f6e0;
        }

        .tick-br {
          bottom: 0;
          right: 0;
          border-bottom: 2px solid #00f6e0;
          border-right: 2px solid #00f6e0;
        }

        .dossier-row {
          display: flex;
          align-items: baseline;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .dossier-row:last-child {
          border-bottom: none;
        }

        .dossier-label {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          letter-spacing: 2px;
          color: #00f6e0;
          min-width: 140px;
          flex-shrink: 0;
        }

        .dossier-value {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 15px;
          color: #aaa;
          letter-spacing: 0.3px;
        }

        .dossier-value.highlight {
          color: #ffd700;
          font-weight: 600;
        }

        .file-stamp {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .stamp-text {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 10px;
          letter-spacing: 2px;
          color: #333;
        }

        .stamp-divider {
          color: #222;
        }

        @media (max-width: 768px) {
          .credentials-section {
            padding: 48px 16px;
          }

          .dossier-block {
            padding: 24px 16px;
          }

          .dossier-row {
            flex-direction: column;
            gap: 4px;
          }

          .dossier-label {
            min-width: auto;
          }

          .file-stamp {
            flex-direction: column;
            gap: 8px;
          }

          .stamp-divider {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
