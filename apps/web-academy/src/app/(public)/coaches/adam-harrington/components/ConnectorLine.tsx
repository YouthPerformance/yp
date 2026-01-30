"use client";

export function ConnectorLine() {
  return (
    <div className="connector-section">
      {/* The Connector Line */}
      <div className="connector-line">
        <div className="line-segment" />
        <div className="line-node">
          <span className="node-icon">↓</span>
        </div>
        <div className="line-segment" />
      </div>

      {/* Data Flow Label */}
      <div className="flow-label">
        <span className="flow-text">PROTOCOL OUTPUT</span>
      </div>

      <style jsx>{`
        .connector-section {
          position: relative;
          padding: 0;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .connector-line {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 80px;
        }

        .line-segment {
          width: 1px;
          flex: 1;
          background: linear-gradient(
            180deg,
            rgba(0, 246, 224, 0.6) 0%,
            rgba(0, 246, 224, 0.3) 100%
          );
        }

        .line-node {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 246, 224, 0.1);
          border: 1px solid rgba(0, 246, 224, 0.4);
          position: relative;
        }

        .line-node::before,
        .line-node::after {
          content: "";
          position: absolute;
          width: 6px;
          height: 6px;
        }

        .line-node::before {
          top: -1px;
          left: -1px;
          border-top: 2px solid #00f6e0;
          border-left: 2px solid #00f6e0;
        }

        .line-node::after {
          bottom: -1px;
          right: -1px;
          border-bottom: 2px solid #00f6e0;
          border-right: 2px solid #00f6e0;
        }

        .node-icon {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 14px;
          color: #00f6e0;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.6;
            text-shadow: 0 0 10px rgba(0, 246, 224, 0.3);
          }
          50% {
            opacity: 1;
            text-shadow: 0 0 20px rgba(0, 246, 224, 0.6);
          }
        }

        .flow-label {
          padding: 8px 0 24px;
        }

        .flow-text {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 10px;
          letter-spacing: 3px;
          color: #333;
        }
      `}</style>
    </div>
  );
}
