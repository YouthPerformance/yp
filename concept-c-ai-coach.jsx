import React, { useState, useEffect } from 'react';

// CONCEPT C: "The AI Coach" - Conversation-first interface
// Philosophy: The coach relationship is primary. Drills emerge from dialogue.

const coachMessages = [
  {
    type: 'coach',
    text: "What's up! I watched your crossover video from yesterday. Your hand placement is solid, but I noticed you're looking down too much. Want to work on that today?",
    time: '2 min ago',
  },
  {
    type: 'user',
    text: "Yeah I keep losing the ball when I try to go faster",
    time: '1 min ago',
  },
  {
    type: 'coach',
    text: "That's actually super common. Speed comes from confidence, and confidence comes from reps. I've got a 10-minute drill that'll help. It's the same one I used with Jayson Tatum when he was coming up.",
    time: 'Just now',
    hasDrill: true,
    drill: {
      name: 'Eyes Up Crossover',
      duration: '10 min',
      xp: 75,
      difficulty: 2,
    }
  },
];

const DrillCard = ({ drill }) => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(0,212,170,0.15) 0%, rgba(0,212,170,0.05) 100%)',
    border: '1px solid rgba(0,212,170,0.3)',
    borderRadius: '16px',
    padding: '16px',
    marginTop: '12px',
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
    }}>
      <div>
        <div style={{
          color: '#00D4AA',
          fontSize: '10px',
          fontFamily: 'system-ui',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '4px',
        }}>Recommended Drill</div>
        <div style={{
          color: '#fff',
          fontSize: '18px',
          fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
        }}>{drill.name}</div>
      </div>
      <div style={{
        background: 'rgba(0,212,170,0.2)',
        padding: '6px 12px',
        borderRadius: '8px',
      }}>
        <span style={{ color: '#00D4AA', fontSize: '14px', fontWeight: 'bold' }}>+{drill.xp} XP</span>
      </div>
    </div>

    <div style={{
      display: 'flex',
      gap: '12px',
      marginBottom: '16px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        <span style={{ fontSize: '14px' }}>⏱</span>
        <span style={{ color: '#9CA3AF', fontSize: '13px', fontFamily: 'system-ui' }}>{drill.duration}</span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        <span style={{ fontSize: '14px' }}>🔥</span>
        <span style={{ color: '#9CA3AF', fontSize: '13px', fontFamily: 'system-ui' }}>
          {'🔥'.repeat(drill.difficulty)}
        </span>
      </div>
    </div>

    <button style={{
      width: '100%',
      padding: '14px',
      background: '#00D4AA',
      border: 'none',
      borderRadius: '10px',
      color: '#000',
      fontSize: '14px',
      fontWeight: 'bold',
      fontFamily: "'Archivo Black', sans-serif",
      letterSpacing: '1px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    }}>
      <span>▶</span>
      <span>START DRILL</span>
    </button>
  </div>
);

const VoiceWave = ({ active }) => (
  <div style={{
    display: 'flex',
    gap: '3px',
    alignItems: 'center',
    height: '24px',
  }}>
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        style={{
          width: '4px',
          height: active ? `${12 + Math.random() * 12}px` : '4px',
          background: active ? '#00D4AA' : 'rgba(255,255,255,0.3)',
          borderRadius: '2px',
          transition: 'height 0.1s ease',
        }}
      />
    ))}
  </div>
);

export default function AICoachApp() {
  const [messages, setMessages] = useState(coachMessages);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showStats, setShowStats] = useState(false);

  return (
    <div style={{
      width: '375px',
      height: '812px',
      background: '#0A0A0A',
      borderRadius: '40px',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Source Sans Pro', system-ui, sans-serif",
      border: '8px solid #1a1a1a',
    }}>
      {/* Header */}
      <div style={{
        padding: '50px 20px 16px',
        background: 'linear-gradient(180deg, #0F1419 0%, #0A0A0A 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          {/* Coach Avatar */}
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00D4AA 0%, #00A388 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#000',
            position: 'relative',
          }}>
            AH
            <div style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '14px',
              height: '14px',
              background: '#22C55E',
              borderRadius: '50%',
              border: '2px solid #0A0A0A',
            }} />
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{
              color: '#fff',
              margin: '0 0 2px 0',
              fontSize: '18px',
              fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
            }}>Coach Adam Harrington</h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ color: '#22C55E', fontSize: '12px' }}>● Online</span>
              <span style={{ color: '#6B7280', fontSize: '12px' }}>• NBA Skills Coach</span>
            </div>
          </div>

          {/* Stats Button */}
          <div
            onClick={() => setShowStats(!showStats)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '18px' }}>📊</span>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ color: '#00D4AA', fontSize: '18px', fontWeight: 'bold' }}>12</div>
            <div style={{ color: '#6B7280', fontSize: '11px' }}>Day Streak</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ color: '#00D4AA', fontSize: '18px', fontWeight: 'bold' }}>2,450</div>
            <div style={{ color: '#6B7280', fontSize: '11px' }}>Total XP</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ color: '#00D4AA', fontSize: '18px', fontWeight: 'bold' }}>47</div>
            <div style={{ color: '#6B7280', fontSize: '11px' }}>Drills Done</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        height: 'calc(100% - 280px)',
      }}>
        {/* Today's Focus */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.05)',
            padding: '8px 16px',
            borderRadius: '20px',
          }}>
            <span style={{ color: '#6B7280', fontSize: '12px' }}>Today's Focus: </span>
            <span style={{ color: '#00D4AA', fontSize: '12px', fontWeight: '600' }}>Ball Handling</span>
          </div>
        </div>

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: msg.type === 'user' ? 'row-reverse' : 'row',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            {msg.type === 'coach' && (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00D4AA 0%, #00A388 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#000',
                flexShrink: 0,
              }}>AH</div>
            )}

            <div style={{
              maxWidth: '75%',
            }}>
              <div style={{
                background: msg.type === 'user'
                  ? 'linear-gradient(135deg, #00D4AA 0%, #00A388 100%)'
                  : 'rgba(255,255,255,0.1)',
                padding: '14px 16px',
                borderRadius: msg.type === 'user'
                  ? '18px 18px 4px 18px'
                  : '18px 18px 18px 4px',
              }}>
                <p style={{
                  color: msg.type === 'user' ? '#000' : '#fff',
                  margin: 0,
                  fontSize: '15px',
                  lineHeight: '1.5',
                }}>{msg.text}</p>
              </div>

              {msg.hasDrill && <DrillCard drill={msg.drill} />}

              <div style={{
                marginTop: '6px',
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <span style={{ color: '#6B7280', fontSize: '11px' }}>{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        padding: '0 20px 12px',
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}>
          {[
            { icon: '🎯', text: "Today's workout" },
            { icon: '📹', text: 'Review my form' },
            { icon: '💪', text: 'I want harder drills' },
            { icon: '⏰', text: 'Quick 5 min drill' },
          ].map((action, i) => (
            <button key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}>
              <span>{action.icon}</span>
              <span>{action.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div style={{
        padding: '12px 20px 40px',
        background: '#0A0A0A',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
        }}>
          {/* Video Upload */}
          <button style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '20px' }}>📹</span>
          </button>

          {/* Text Input */}
          <div style={{
            flex: 1,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Coach Adam anything..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
              }}
            />
          </div>

          {/* Voice Button */}
          <button
            onMouseDown={() => setIsRecording(true)}
            onMouseUp={() => setIsRecording(false)}
            onMouseLeave={() => setIsRecording(false)}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: isRecording
                ? 'linear-gradient(135deg, #00D4AA 0%, #00A388 100%)'
                : 'rgba(255,255,255,0.1)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s ease',
              transform: isRecording ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {isRecording ? (
              <VoiceWave active={true} />
            ) : (
              <span style={{ fontSize: '20px' }}>🎤</span>
            )}
          </button>
        </div>

        {isRecording && (
          <div style={{
            textAlign: 'center',
            marginTop: '12px',
          }}>
            <span style={{ color: '#00D4AA', fontSize: '13px' }}>
              Listening... Release to send
            </span>
          </div>
        )}
      </div>

      {/* Stats Modal */}
      {showStats && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.95)',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '60px 20px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h3 style={{
              color: '#fff',
              margin: 0,
              fontSize: '24px',
              fontFamily: "'Archivo Black', sans-serif",
            }}>YOUR PROGRESS</h3>
            <span onClick={() => setShowStats(false)} style={{ color: '#fff', fontSize: '28px', cursor: 'pointer' }}>×</span>
          </div>

          <div style={{ padding: '0 20px', flex: 1, overflowY: 'auto' }}>
            {/* Streak Calendar */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
            }}>
              <h4 style={{ color: '#fff', margin: '0 0 16px 0', fontSize: '14px', letterSpacing: '1px' }}>
                12 DAY STREAK 🔥
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '8px',
              }}>
                {[...Array(14)].map((_, i) => (
                  <div key={i} style={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    background: i < 12 ? '#00D4AA' : 'rgba(255,255,255,0.1)',
                    opacity: i < 12 ? 0.3 + (i * 0.05) : 0.3,
                  }} />
                ))}
              </div>
            </div>

            {/* Skill Breakdown */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
            }}>
              <h4 style={{ color: '#fff', margin: '0 0 16px 0', fontSize: '14px', letterSpacing: '1px' }}>
                SKILL BREAKDOWN
              </h4>
              {[
                { name: 'Ball Handling', progress: 72 },
                { name: 'Shooting Form', progress: 45 },
                { name: 'Footwork', progress: 60 },
                { name: 'Court Vision', progress: 30 },
              ].map((skill, i) => (
                <div key={i} style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}>
                    <span style={{ color: '#fff', fontSize: '14px' }}>{skill.name}</span>
                    <span style={{ color: '#00D4AA', fontSize: '14px' }}>{skill.progress}%</span>
                  </div>
                  <div style={{
                    height: '8px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${skill.progress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #00D4AA 0%, #00FFD1 100%)',
                      borderRadius: '4px',
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '20px',
            }}>
              <h4 style={{ color: '#fff', margin: '0 0 16px 0', fontSize: '14px', letterSpacing: '1px' }}>
                RECENT SESSIONS
              </h4>
              {[
                { date: 'Today', drills: 3, xp: 150 },
                { date: 'Yesterday', drills: 5, xp: 275 },
                { date: 'Monday', drills: 4, xp: 200 },
              ].map((session, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}>
                  <span style={{ color: '#fff', fontSize: '14px' }}>{session.date}</span>
                  <div>
                    <span style={{ color: '#6B7280', fontSize: '13px' }}>{session.drills} drills • </span>
                    <span style={{ color: '#00D4AA', fontSize: '13px', fontWeight: '600' }}>+{session.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
