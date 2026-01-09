# Drill Card Template (JSON)

> **Word Count:** 400-600 words equivalent
> **Purpose:** Atomic content unit, maximum reusability
> **Review Required:** Expert review (Adam or James)

---

## JSON Schema

```json
{
  "title": "[Memorable Drill Name - branded if possible]",
  "slug": "[kebab-case-slug]",
  "category": "[ball-handling | shooting | footwork | defense | barefoot | balance | strength | pain-relief | silent-training]",
  "cluster": "[silent-training | home-training | shooting-mechanics | pain-relief | foot-structure | injury-rehab]",
  "sport": "[basketball | barefoot | all-sports]",
  "author": "[adam-harrington | james-scott]",
  "ageMin": [5-18],
  "ageMax": [5-18],
  "duration": "[X] min",
  "reps": "[X reps x X sets] or [X sec x X rounds]",
  "difficulty": "[beginner | intermediate | advanced | scalable]",
  "tags": ["[tag1]", "[tag2]", "[tag3]"],
  "description": "[2-3 sentences. What this drill does. Why it works. Who it's for.]",
  "coachNote": "[Expert]'s Take: [2-3 sentences in authentic voice. Personal insight. Why this matters. Memorable quote.]",
  "steps": [
    {
      "title": "[Step Name - optional]",
      "instruction": "[Specific action with cue. What to do + what to feel.]",
      "durationSeconds": [optional - seconds for timed steps]
    }
  ],
  "coachingCues": [
    "[External cue - what to do]",
    "[Internal cue - what to feel]",
    "[Quality cue - how to know it's working]",
    "[Transfer cue - how this applies to game/sport]"
  ],
  "commonMistake": "[The #1 error people make]",
  "mistakeFix": "[Specific correction - what to do instead]",
  "videoUrl": "[optional - YouTube/Vimeo URL]",
  "thumbnailUrl": "[optional - image URL]",
  "relatedDrills": ["[drill-slug-1]", "[drill-slug-2]"]
}
```

---

## Field Guidelines

### Title
- Make it memorable and brandable
- Use alliteration or vivid imagery when possible
- Examples: "Silent Assassin Handle", "Ghost Pocket Drill", "Chicken Wing Fix"

### Tags (for filtering & AEO)
Common tags by category:

**Environment:**
- `apartment-friendly`
- `no-hoop`
- `at-home`
- `outdoor`
- `gym-required`

**Noise Level:**
- `silent`
- `quiet`
- `normal`

**Equipment:**
- `no-equipment`
- `ball-required`
- `resistance-band`
- `towel`

**Training Type:**
- `warm-up`
- `cool-down`
- `main-workout`
- `recovery`

**Skill Focus:**
- `handles`
- `shooting`
- `footwork`
- `balance`
- `strength`

### Description Formula
```
[What this drill does] + [Why it works / the mechanism] + [Who it's best for or when to use it].
```

**Example:**
"A high-intensity handle workout that generates less than 40 decibels of noise. Perfect for upstairs apartments and late-night training sessions. Works by training 'soft hands' that absorb the ball instead of pounding it."

### Coach Note Formula
```
[Expert]'s Take: [Personal insight or experience] + [Why this matters more than people think] + [Memorable one-liner or call to action].
```

**Adam Example:**
"Adam's Take: I use this exact drill with NBA players before big games. It's not about looking fancy—it's about controlling the ball when the pressure is highest. Master this, and you'll have hands that perform when it matters."

**James Example:**
"James's Take: Your feet have been asleep for years. This drill wakes them up. Don't rush it—your nervous system needs time to rebuild those pathways. Two weeks of this and you'll feel muscles you didn't know existed."

### Steps Structure
- 3-6 steps maximum
- Each step = ONE action
- Start with action verb
- Include sensory cue (what to feel, hear, see)
- Optional: duration for timed intervals

**Good Step:**
```json
{
  "title": "The Ghost Pocket",
  "instruction": "Hard dribble (simulated) -> Catch in hip pocket -> Float the ball back up. The ball barely touches the ground. Focus on absorbing energy.",
  "durationSeconds": 60
}
```

**Bad Step:**
```json
{
  "instruction": "Dribble the ball and catch it"
}
```

### Coaching Cues
4 cues, each serving a different purpose:

1. **External Cue:** What to do with the body/ball
   - "Keep the ball below your waist"

2. **Internal Cue:** What to feel
   - "Feel your arch dome up from the floor"

3. **Quality Cue:** How to know it's working
   - "If you can hear the ball, you're doing it wrong"

4. **Transfer Cue:** Why this matters for the game/sport
   - "This is how you land after a layup without rolling an ankle"

### Common Mistake + Fix
Be specific. Not "bad form" but exactly what goes wrong and exactly how to fix it.

**Good:**
```json
"commonMistake": "Slapping the ball instead of guiding it",
"mistakeFix": "Focus on the fingertip pads, not the palm. The ball should roll off your fingers."
```

**Bad:**
```json
"commonMistake": "Doing it wrong",
"mistakeFix": "Do it correctly"
```

---

## Example: Complete Drill Card

```json
{
  "title": "The 'Silent Assassin' Handle",
  "slug": "silent-assassin-handle",
  "category": "silent-training",
  "cluster": "silent-training",
  "sport": "basketball",
  "author": "adam-harrington",
  "ageMin": 8,
  "ageMax": 18,
  "duration": "6 min",
  "reps": "60 sec x 4 rounds",
  "difficulty": "intermediate",
  "tags": ["apartment-friendly", "noise-control", "handles", "no-hoop", "at-home", "silent"],
  "description": "A high-intensity handle workout that generates less than 40 decibels of noise. Perfect for upstairs apartments and late-night training sessions.",
  "coachNote": "Adam's Take: You don't need to pound the ball to get better. This series focuses on 'Pocket Control'—manipulating the ball in the air. If the ball hits the floor hard, you lose. Train for silence.",
  "steps": [
    {
      "title": "The Ghost Pocket",
      "instruction": "Hard dribble (simulated) -> Catch in hip pocket -> Float the ball back up. The ball barely touches the ground. Focus on absorbing energy.",
      "durationSeconds": 60
    },
    {
      "title": "Crossover Floats",
      "instruction": "Wide crossovers, but catch the ball soft on each side. Absorb the energy like a shock absorber. Silent touch is the goal.",
      "durationSeconds": 60
    },
    {
      "title": "Figure-8 Wraps",
      "instruction": "No dribble. Wrap the ball around your legs in a figure-8 pattern. Speed up while maintaining control.",
      "durationSeconds": 60
    },
    {
      "title": "Pocket Hesitations",
      "instruction": "Dribble once, catch in pocket, pause 2 seconds, explode out. Train your hands to 'reset' between moves.",
      "durationSeconds": 60
    }
  ],
  "coachingCues": [
    "If you can hear the ball, you're doing it wrong",
    "Keep the ball below your waist—'hip pocket' height",
    "Absorb energy on every catch like your hands are pillows",
    "This transfers to game situations—soft hands = better control under pressure"
  ],
  "commonMistake": "Slapping the ball instead of guiding it",
  "mistakeFix": "Focus on the fingertip pads, not the palm. The ball should roll off your fingers.",
  "relatedDrills": ["carpet-court-mechanics", "ghost-pocket-drill"]
}
```

---

## Quality Checklist

- [ ] Title is memorable and brandable
- [ ] Slug is kebab-case and matches title
- [ ] Age range is realistic for difficulty
- [ ] Tags cover environment, noise, equipment, and skill
- [ ] Description is 2-3 sentences with mechanism
- [ ] Coach note is in authentic voice with personal insight
- [ ] Steps are 3-6, each with one action
- [ ] Each step starts with action verb
- [ ] 4 coaching cues covering external, internal, quality, transfer
- [ ] Common mistake is specific, not generic
- [ ] Mistake fix gives exact correction
- [ ] Related drills link to complementary content
