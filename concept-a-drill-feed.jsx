import React, { useState } from 'react';

// CONCEPT A: "The Feed" - TikTok-native vertical drill experience
// Philosophy: Kids already spend hours swiping. Make drills feel like content, not homework.

const drills = [
  { id: 1, title: "Crossover Killer", coach: "Adam Harrington", duration: "45 sec", xp: 50, difficulty: "🔥", video: "crossover.mp4", completed: false },
  { id: 2, title: "Between the Legs Flow", coach: "Adam Harrington", duration: "60 sec", xp: 75, difficulty: "🔥🔥", video: "btl.mp4", completed: true },
  { id: 3, title: "Hesitation Step", coach: "Adam Harrington", duration: "30 sec", xp: 40, difficulty: "🔥", video: "hesi.mp4", completed: false },
];

export default function DrillFeed() {
  const [currentDrill, setCurrentDrill] = useState(0);
  const [showCoach, setShowCoach] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const drill = drills[currentDrill];

  return (
    <div style={{
      width: '375px',
      height: '812px',
      background: '#0A0A0A',
      borderRadius: '40px',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
      border: '8px solid #1a1a1a',
    }}>
      {/* Status Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '44px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
      }}>
        <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'system-ui' }}>9:41</span>
      </div>

      {/* Video Background (simulated) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          linear-gradient(180deg, transparent 0%, transparent 60%, rgba(0,0,0,0.9) 100%),
          radial-gradient(circle at 50% 30%, #1a3a4a 0%, #0A0A0A 70%)
        `,
      }}>
        {/* Play indicator */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(0,212,170,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: isPlaying ? 0 : 1,
          transition: 'opacity 0.2s',
        }} onClick={() => setIsPlaying(!isPlaying)}>
          <div style={{
            width: 0,
            height: 0,
            borderLeft: '24px solid #00D4AA',
            borderTop: '14px solid transparent',
            borderBottom: '14px solid transparent',
            marginLeft: '6px',
          }} />
        </div>

        {/* Silhouette of player doing drill */}
        <svg viewBox="0 0 200 300" style={{ position: 'absolute', bottom: '25%', left: '50%', transform: 'translateX(-50%)', width: '200px', opacity: 0.3 }}>
          <ellipse cx="100" cy="280" rx="60" ry="15" fill="#00D4AA" opacity="0.3" />
          <circle cx="100" cy="60" r="25" fill="#00D4AA" />
          <path d="M100 85 L100 180 M100 110 L60 150 M100 110 L140 130 M100 180 L70 260 M100 180 L130 250"
                stroke="#00D4AA" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="75" cy="240" r="20" fill="none" stroke="#00D4AA" strokeWidth="3" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Right Side Actions */}
      <div style={{
        position: 'absolute',
        right: '12px',
        bottom: '180px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
      }}>
        {/* Coach Avatar */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00D4AA 0%, #00A388 100%)',
            border: '2px solid #00D4AA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}>AH</div>
          <div style={{
            background: '#00D4AA',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            margin: '-10px auto 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}>+</div>
        </div>

        {/* XP */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '18px' }}>⚡</span>
          </div>
          <span style={{ color: '#fff', fontSize: '12px', fontFamily: 'system-ui' }}>{drill.xp} XP</span>
        </div>

        {/* Ask Coach */}
        <div style={{ textAlign: 'center' }} onClick={() => setShowCoach(true)}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <span style={{ fontSize: '18px' }}>💬</span>
          </div>
          <span style={{ color: '#fff', fontSize: '12px', fontFamily: 'system-ui' }}>Ask</span>
        </div>

        {/* Save */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '18px' }}>🔖</span>
          </div>
          <span style={{ color: '#fff', fontSize: '12px', fontFamily: 'system-ui' }}>Save</span>
        </div>

        {/* Share */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '18px' }}>↗</span>
          </div>
          <span style={{ color: '#fff', fontSize: '12px', fontFamily: 'system-ui' }}>Share</span>
        </div>
      </div>

      {/* Bottom Content */}
      <div style={{
        position: 'absolute',
        bottom: '90px',
        left: '16px',
        right: '80px',
      }}>
        {/* Coach Name */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}>
          <span style={{ color: '#fff', fontSize: '16px', fontFamily: 'system-ui', fontWeight: '600' }}>
            @{drill.coach.replace(' ', '').toLowerCase()}
          </span>
          <span style={{
            background: '#00D4AA',
            color: '#000',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'system-ui',
            fontWeight: '700',
          }}>PRO</span>
        </div>

        {/* Drill Title */}
        <h2 style={{
          color: '#fff',
          fontSize: '28px',
          margin: '0 0 8px 0',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}>{drill.title}</h2>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            fontSize: '12px',
            padding: '4px 10px',
            borderRadius: '12px',
            fontFamily: 'system-ui',
          }}>{drill.difficulty} {drill.duration}</span>
          <span style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            fontSize: '12px',
            padding: '4px 10px',
            borderRadius: '12px',
            fontFamily: 'system-ui',
          }}>#handles</span>
          <span style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            fontSize: '12px',
            padding: '4px 10px',
            borderRadius: '12px',
            fontFamily: 'system-ui',
          }}>#foundation</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        left: 0,
        right: 0,
        height: '3px',
        background: 'rgba(255,255,255,0.2)',
      }}>
        <div style={{
          width: '35%',
          height: '100%',
          background: '#00D4AA',
        }} />
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: '#0A0A0A',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '20px',
      }}>
        <div style={{ textAlign: 'center', cursor: 'pointer' }}>
          <span style={{ fontSize: '24px' }}>🏠</span>
          <div style={{ color: '#fff', fontSize: '10px', fontFamily: 'system-ui', marginTop: '2px' }}>Feed</div>
        </div>
        <div style={{ textAlign: 'center', cursor: 'pointer', opacity: 0.5 }}>
          <span style={{ fontSize: '24px' }}>🎯</span>
          <div style={{ color: '#fff', fontSize: '10px', fontFamily: 'system-ui', marginTop: '2px' }}>Skills</div>
        </div>
        <div style={{
          textAlign: 'center',
          cursor: 'pointer',
          marginTop: '-30px',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #00D4AA 0%, #00A388 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,212,170,0.4)',
          }}>
            <span style={{ fontSize: '28px' }}>▶</span>
          </div>
          <div style={{ color: '#00D4AA', fontSize: '10px', fontFamily: 'system-ui', marginTop: '4px', fontWeight: '600' }}>START</div>
        </div>
        <div style={{ textAlign: 'center', cursor: 'pointer', opacity: 0.5 }}>
          <span style={{ fontSize: '24px' }}>🏆</span>
          <div style={{ color: '#fff', fontSize: '10px', fontFamily: 'system-ui', marginTop: '2px' }}>Ranks</div>
        </div>
        <div style={{ textAlign: 'center', cursor: 'pointer', opacity: 0.5 }}>
          <span style={{ fontSize: '24px' }}>👤</span>
          <div style={{ color: '#fff', fontSize: '10px', fontFamily: 'system-ui', marginTop: '2px' }}>Profile</div>
        </div>
      </div>

      {/* Coach Modal */}
      {showCoach && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.9)',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '60px 20px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h3 style={{ color: '#fff', margin: 0, fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', letterSpacing: '1px' }}>
              ASK COACH ADAM
            </h3>
            <span onClick={() => setShowCoach(false)} style={{ color: '#fff', fontSize: '24px', cursor: 'pointer' }}>×</span>
          </div>

          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            <div style={{
              background: 'rgba(0,212,170,0.1)',
              border: '1px solid rgba(0,212,170,0.3)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00D4AA 0%, #00A388 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}>AH</div>
                <div>
                  <p style={{ color: '#fff', margin: 0, fontSize: '14px', fontFamily: 'system-ui', lineHeight: '1.5' }}>
                    Hey! I see you're working on the Crossover Killer. The key here is keeping your eyes up while your hands do the work. Want me to break down the footwork?
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '20px', paddingBottom: '40px' }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px',
            }}>
              {['Show me slower', 'Footwork tips', 'Common mistakes'].map(q => (
                <button key={q} style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '12px',
                  fontFamily: 'system-ui',
                  cursor: 'pointer',
                }}>{q}</button>
              ))}
            </div>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}>
              <input
                type="text"
                placeholder="Ask anything..."
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '24px',
                  padding: '14px 20px',
                  color: '#fff',
                  fontSize: '16px',
                  fontFamily: 'system-ui',
                  outline: 'none',
                }}
              />
              <button style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#00D4AA',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <span style={{ fontSize: '20px' }}>🎤</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Swipe Hint */}
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '8px',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        opacity: 0.3,
      }}>
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#fff' }} />
        <div style={{ width: '4px', height: '8px', borderRadius: '2px', background: '#00D4AA' }} />
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#fff' }} />
      </div>
    </div>
  );
}
