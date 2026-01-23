import React, { useState } from 'react';

// CONCEPT B: "The Skill Tree" - RPG-style progression
// Philosophy: Kids love leveling up in games. Make training feel like character progression.

const skillTree = {
  foundation: {
    name: "FOUNDATION",
    level: 3,
    maxLevel: 5,
    skills: [
      { id: 'dribble', name: 'Ball Control', progress: 85, unlocked: true, icon: '🏀' },
      { id: 'stance', name: 'Athletic Stance', progress: 100, unlocked: true, icon: '🦵', complete: true },
      { id: 'eyes', name: 'Eyes Up', progress: 60, unlocked: true, icon: '👀' },
    ]
  },
  handles: {
    name: "HANDLES",
    level: 2,
    maxLevel: 5,
    skills: [
      { id: 'cross', name: 'Crossover', progress: 45, unlocked: true, icon: '↔️' },
      { id: 'btl', name: 'Between Legs', progress: 20, unlocked: true, icon: '🦿' },
      { id: 'behind', name: 'Behind Back', progress: 0, unlocked: false, icon: '🔒' },
    ]
  },
  finishing: {
    name: "FINISHING",
    level: 1,
    maxLevel: 5,
    skills: [
      { id: 'layup', name: 'Basic Layup', progress: 30, unlocked: true, icon: '🎯' },
      { id: 'floater', name: 'Floater', progress: 0, unlocked: false, icon: '🔒' },
      { id: 'eurostep', name: 'Euro Step', progress: 0, unlocked: false, icon: '🔒' },
    ]
  }
};

const SkillNode = ({ skill, onSelect, isSelected }) => (
  <div
    onClick={() => skill.unlocked && onSelect(skill)}
    style={{
      width: '80px',
      height: '80px',
      borderRadius: '16px',
      background: skill.complete
        ? 'linear-gradient(135deg, #00D4AA 0%, #00A388 100%)'
        : skill.unlocked
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(255,255,255,0.03)',
      border: isSelected
        ? '3px solid #00D4AA'
        : skill.unlocked
          ? '2px solid rgba(255,255,255,0.2)'
          : '2px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: skill.unlocked ? 'pointer' : 'default',
      opacity: skill.unlocked ? 1 : 0.4,
      position: 'relative',
      transition: 'all 0.2s ease',
      transform: isSelected ? 'scale(1.1)' : 'scale(1)',
    }}
  >
    <span style={{ fontSize: '28px' }}>{skill.icon}</span>
    {skill.unlocked && !skill.complete && (
      <div style={{
        position: 'absolute',
        bottom: '-8px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '50px',
        height: '6px',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${skill.progress}%`,
          height: '100%',
          background: '#00D4AA',
          borderRadius: '3px',
        }} />
      </div>
    )}
    {skill.complete && (
      <div style={{
        position: 'absolute',
        top: '-6px',
        right: '-6px',
        width: '20px',
        height: '20px',
        background: '#FFD700',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
      }}>✓</div>
    )}
  </div>
);

export default function SkillTreeApp() {
  const [selectedSkill, setSelectedSkill] = useState(skillTree.handles.skills[0]);
  const [showDrills, setShowDrills] = useState(false);

  const totalXP = 2450;
  const level = 12;
  const xpToNext = 550;
  const xpNeeded = 1000;

  return (
    <div style={{
      width: '375px',
      height: '812px',
      background: '#0A0A0A',
      borderRadius: '40px',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Oswald', 'Arial Black', sans-serif",
      border: '8px solid #1a1a1a',
    }}>
      {/* Header */}
      <div style={{
        padding: '50px 20px 16px',
        background: 'linear-gradient(180deg, rgba(0,212,170,0.15) 0%, transparent 100%)',
      }}>
        {/* Player Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
        }}>
          <div>
            <h1 style={{
              color: '#fff',
              margin: '0 0 4px 0',
              fontSize: '24px',
              letterSpacing: '2px',
            }}>YOUR JOURNEY</h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                padding: '2px 10px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}>LVL {level}</span>
              <span style={{ color: '#6B7280', fontSize: '14px', fontFamily: 'system-ui' }}>
                {totalXP.toLocaleString()} XP
              </span>
            </div>
          </div>

          {/* Coach Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            padding: '8px 12px',
            borderRadius: '12px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00D4AA 0%, #00A388 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
            }}>AH</div>
            <div>
              <div style={{ color: '#fff', fontSize: '12px', fontFamily: 'system-ui', fontWeight: '600' }}>Coach</div>
              <div style={{ color: '#00D4AA', fontSize: '10px', fontFamily: 'system-ui' }}>Adam H.</div>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}>
            <span style={{ color: '#6B7280', fontSize: '11px', fontFamily: 'system-ui' }}>Next Level</span>
            <span style={{ color: '#6B7280', fontSize: '11px', fontFamily: 'system-ui' }}>{xpToNext}/{xpNeeded} XP</span>
          </div>
          <div style={{
            height: '8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${(xpToNext / xpNeeded) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00D4AA 0%, #00FFD1 100%)',
              borderRadius: '4px',
              boxShadow: '0 0 10px rgba(0,212,170,0.5)',
            }} />
          </div>
        </div>
      </div>

      {/* Skill Tree */}
      <div style={{
        padding: '20px',
        height: 'calc(100% - 280px)',
        overflowY: 'auto',
      }}>
        {Object.entries(skillTree).map(([key, category]) => (
          <div key={key} style={{ marginBottom: '32px' }}>
            {/* Category Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              <h2 style={{
                color: '#fff',
                margin: 0,
                fontSize: '16px',
                letterSpacing: '3px',
              }}>{category.name}</h2>
              <div style={{
                display: 'flex',
                gap: '3px',
              }}>
                {[...Array(category.maxLevel)].map((_, i) => (
                  <div key={i} style={{
                    width: '16px',
                    height: '6px',
                    borderRadius: '3px',
                    background: i < category.level ? '#00D4AA' : 'rgba(255,255,255,0.1)',
                  }} />
                ))}
              </div>
            </div>

            {/* Skills Row */}
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'flex-start',
            }}>
              {category.skills.map((skill, index) => (
                <React.Fragment key={skill.id}>
                  <SkillNode
                    skill={skill}
                    onSelect={setSelectedSkill}
                    isSelected={selectedSkill?.id === skill.id}
                  />
                  {index < category.skills.length - 1 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      {[...Array(3)].map((_, i) => (
                        <div key={i} style={{
                          width: '6px',
                          height: '3px',
                          borderRadius: '1px',
                          background: skill.complete ? '#00D4AA' : 'rgba(255,255,255,0.2)',
                        }} />
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Skill Panel */}
      {selectedSkill && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '16px',
          right: '16px',
          background: 'linear-gradient(180deg, rgba(20,30,40,0.95) 0%, rgba(10,15,20,0.98) 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(0,212,170,0.3)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '12px',
          }}>
            <div>
              <h3 style={{
                color: '#fff',
                margin: '0 0 4px 0',
                fontSize: '20px',
                letterSpacing: '1px',
              }}>{selectedSkill.name.toUpperCase()}</h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ color: '#00D4AA', fontSize: '14px', fontFamily: 'system-ui' }}>
                  {selectedSkill.progress}% Complete
                </span>
                <span style={{ color: '#6B7280', fontSize: '12px', fontFamily: 'system-ui' }}>
                  • 8 drills
                </span>
              </div>
            </div>
            <span style={{ fontSize: '36px' }}>{selectedSkill.icon}</span>
          </div>

          {/* Progress Bar */}
          <div style={{
            height: '8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}>
            <div style={{
              width: `${selectedSkill.progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00D4AA 0%, #00FFD1 100%)',
              borderRadius: '4px',
            }} />
          </div>

          {/* Action Button */}
          <button
            onClick={() => setShowDrills(true)}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #00D4AA 0%, #00A388 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#000',
              fontSize: '16px',
              fontWeight: 'bold',
              fontFamily: "'Oswald', sans-serif",
              letterSpacing: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>TRAIN NOW</span>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>+50 XP</span>
          </button>
        </div>
      )}

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
        <div style={{ textAlign: 'center', cursor: 'pointer', opacity: 0.5 }}>
          <span style={{ fontSize: '24px' }}>🏠</span>
          <div style={{ color: '#fff', fontSize: '10px', fontFamily: 'system-ui', marginTop: '2px' }}>Home</div>
        </div>
        <div style={{ textAlign: 'center', cursor: 'pointer' }}>
          <span style={{ fontSize: '24px' }}>🌳</span>
          <div style={{ color: '#00D4AA', fontSize: '10px', fontFamily: 'system-ui', marginTop: '2px', fontWeight: '600' }}>Skills</div>
        </div>
        <div style={{ textAlign: 'center', cursor: 'pointer', opacity: 0.5 }}>
          <span style={{ fontSize: '24px' }}>📹</span>
          <div style={{ color: '#fff', fontSize: '10px', fontFamily: 'system-ui', marginTop: '2px' }}>Drills</div>
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

      {/* Drills Modal */}
      {showDrills && (
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
            <div>
              <h3 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '24px', letterSpacing: '2px' }}>
                {selectedSkill.name.toUpperCase()}
              </h3>
              <span style={{ color: '#6B7280', fontSize: '14px', fontFamily: 'system-ui' }}>8 drills • 45 min total</span>
            </div>
            <span onClick={() => setShowDrills(false)} style={{ color: '#fff', fontSize: '28px', cursor: 'pointer' }}>×</span>
          </div>

          <div style={{ flex: 1, padding: '0 20px', overflowY: 'auto' }}>
            {[
              { name: 'Stationary Crosses', time: '2 min', xp: 20, done: true },
              { name: 'Walking Crosses', time: '3 min', xp: 30, done: true },
              { name: 'Jog Crosses', time: '3 min', xp: 30, done: true },
              { name: 'Sprint Crosses', time: '5 min', xp: 50, done: false, current: true },
              { name: 'Defender Reaction', time: '5 min', xp: 50, done: false },
              { name: 'Game Speed Combo', time: '8 min', xp: 75, done: false },
              { name: 'Pressure Situations', time: '10 min', xp: 100, done: false },
              { name: 'Full Court Application', time: '10 min', xp: 100, done: false },
            ].map((drill, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: drill.current ? 'rgba(0,212,170,0.1)' : 'transparent',
                borderRadius: '12px',
                marginBottom: '8px',
                border: drill.current ? '1px solid rgba(0,212,170,0.3)' : '1px solid transparent',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: drill.done
                    ? 'linear-gradient(135deg, #00D4AA 0%, #00A388 100%)'
                    : drill.current
                      ? 'rgba(0,212,170,0.2)'
                      : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: drill.done ? '#000' : '#fff',
                  fontWeight: 'bold',
                  fontFamily: 'system-ui',
                }}>
                  {drill.done ? '✓' : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontSize: '16px', fontFamily: 'system-ui', fontWeight: '500' }}>
                    {drill.name}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: '12px', fontFamily: 'system-ui' }}>
                    {drill.time} • +{drill.xp} XP
                  </div>
                </div>
                {drill.current && (
                  <button style={{
                    padding: '8px 16px',
                    background: '#00D4AA',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: "'Oswald', sans-serif",
                    letterSpacing: '1px',
                    cursor: 'pointer',
                  }}>START</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
