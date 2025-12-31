# Peterson Academy - Pixel-Perfect Design Specification

## Typography

### Fonts (Load from Google Fonts + Adobe Fonts)
```css
/* Primary Fonts */
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

/* Font Stacks */
--font-serif: "EB Garamond", "garamond-premier-pro-subhead", Georgia, serif;
--font-sans: "futura-pt", "Montserrat", "Inter", system-ui, sans-serif;
```

### Heading Styles
| Element | Font | Size | Weight | Line Height | Letter Spacing | Color |
|---------|------|------|--------|-------------|----------------|-------|
| H1 (Hero) | EB Garamond | 60px | 400 | 63.6px (1.06) | -1.4px | #E8E8E8 |
| H2 | EB Garamond | 56px | 400 | 70px (1.25) | -1.4px | #E8E8E8 |
| H3 | EB Garamond | 36px | 400 | 45px | -0.9px | #E8E8E8 |
| H4 | EB Garamond | 24px | 400 | 32px | -0.6px | #E8E8E8 |

### Body Text Styles
| Element | Font | Size | Weight | Line Height | Letter Spacing | Color |
|---------|------|------|--------|-------------|----------------|-------|
| Body Large | Futura PT | 20px | 300 | 25px (1.25) | 1px | #A3A3A3 |
| Body | Futura PT | 16px | 300 | 24px (1.5) | 0.19px | #A6A6A6 |
| Body Small | Futura PT | 14px | 300 | 20px | 0.15px | #A6A6A6 |
| Caption | Futura PT | 12px | 400 | 16px | 0.1px | #808080 |

---

## Color Palette

### Primary Colors
```css
:root {
  /* Backgrounds */
  --color-bg-primary: #071520;      /* rgb(7, 21, 32) - Main dark background */
  --color-bg-secondary: #262626;    /* rgb(38, 38, 38) - Secondary dark */
  --color-bg-dark: #040c0e;         /* Theme color - Darkest */
  --color-bg-surface: #1A1A1A;      /* Card backgrounds */
  --color-bg-elevated: #2A2A2A;     /* Elevated surfaces */

  /* Text Colors */
  --color-text-primary: #E8E8E8;    /* rgb(232, 232, 232) - Primary text */
  --color-text-secondary: #A3A3A3;  /* rgb(163, 163, 163) - Secondary text */
  --color-text-tertiary: #A6A6A6;   /* rgb(166, 166, 166) - Muted text */
  --color-text-muted: #808080;      /* Disabled/placeholder text */

  /* Accent Colors */
  --color-brand-primary: #2C3957;   /* rgb(44, 57, 87) - Navy blue buttons */
  --color-brand-secondary: #3D4F6F; /* Lighter navy for hover */
  --color-gold: #C9A227;            /* Gold accent (pricing) */
  --color-gold-light: #D4A853;      /* Light gold */

  /* Borders & Dividers */
  --color-border: #333333;          /* Default border */
  --color-border-light: #404040;    /* Light border */
  --color-divider: rgba(255, 255, 255, 0.1); /* Subtle dividers */
}
```

### Gradient Definitions
```css
/* Hero gradient overlay */
--gradient-hero: linear-gradient(to bottom, rgba(7, 21, 32, 0.3), rgba(7, 21, 32, 0.8));

/* Card hover gradient */
--gradient-card: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.6) 100%);

/* Gold shimmer */
--gradient-gold: linear-gradient(135deg, #C9A227 0%, #D4A853 50%, #C9A227 100%);
```

---

## Components

### Buttons

#### Primary CTA (JOIN THE ACADEMY)
```css
.btn-primary {
  background-color: #2C3957;
  color: #FFFFFF;
  font-family: "futura-pt", sans-serif;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 1.68px;
  text-transform: uppercase;
  padding: 16px 30px;
  border-radius: 9999px; /* Fully rounded pill */
  border: none;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #3D4F6F;
}
```

#### Secondary Button (Outline)
```css
.btn-secondary {
  background-color: transparent;
  color: #E8E8E8;
  font-family: "futura-pt", sans-serif;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 1.68px;
  text-transform: uppercase;
  padding: 14px 28px;
  border-radius: 9999px;
  border: 1px solid #E8E8E8;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
```

#### Sign In Link
```css
.link-signin {
  font-family: "garamond-premier-pro", "EB Garamond", serif;
  font-size: 20px;
  font-weight: 400;
  color: #E8E8E8;
  letter-spacing: -0.5px;
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

---

### Header/Navigation
```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: transparent; /* Transparent over hero */
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
.logo {
  height: 50px;
  width: auto;
}

/* Nav Links */
.nav-link {
  font-family: "garamond-premier-pro", serif;
  font-size: 20px;
  font-weight: 400;
  color: #E8E8E8;
  letter-spacing: -0.5px;
}
```

---

### Course Card
```css
.course-card {
  position: relative;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  background-color: #1A1A1A;
  transition: transform 0.3s ease;
}

.course-card:hover {
  transform: scale(1.02);
}

.course-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.8) 100%);
}

.course-card-title {
  font-family: "EB Garamond", serif;
  font-size: 20px;
  font-weight: 400;
  color: #E8E8E8;
  line-height: 1.3;
}

.course-card-instructor {
  font-family: "futura-pt", sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #A6A6A6;
}

.course-card-disciplines {
  font-family: "futura-pt", sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: #A6A6A6;
  letter-spacing: 0.19px;
}
```

---

### Discipline Tabs
```css
.discipline-tab {
  font-family: "EB Garamond", serif;
  font-size: 24px;
  font-weight: 400;
  color: #808080;
  padding: 12px 24px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.discipline-tab:hover {
  color: #E8E8E8;
}

.discipline-tab.active {
  color: #E8E8E8;
  border-bottom-color: #E8E8E8;
}
```

---

### Instructor Carousel Card
```css
.instructor-card {
  text-align: center;
  padding: 24px;
}

.instructor-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.instructor-card:hover .instructor-image {
  filter: grayscale(0%);
}

.instructor-name {
  font-family: "EB Garamond", serif;
  font-size: 24px;
  font-weight: 400;
  color: #E8E8E8;
  margin-bottom: 8px;
}

.instructor-title {
  font-family: "futura-pt", sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #A6A6A6;
}

.view-profile-link {
  font-family: "futura-pt", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #E8E8E8;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

---

### Statistics Section
```css
.stat-item {
  text-align: center;
  padding: 12px 24px;
  border-right: 1px solid rgba(255, 255, 255, 0.3);
}

.stat-item:last-child {
  border-right: none;
}

.stat-value {
  font-family: "EB Garamond", serif;
  font-size: 24px;
  font-weight: 400;
  color: #E8E8E8;
  line-height: 1.3;
  letter-spacing: -0.72px;
}

/* Mobile: 18px */
@media (max-width: 1024px) {
  .stat-value {
    font-size: 18px;
    letter-spacing: 0;
  }
}
```

---

### Pricing Section
```css
.pricing-card {
  background: linear-gradient(135deg, #1A1A1A 0%, #262626 100%);
  border: 1px solid #333333;
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  max-width: 400px;
}

.pricing-amount {
  font-family: "EB Garamond", serif;
  font-size: 72px;
  font-weight: 400;
  color: #E8E8E8;
}

.pricing-period {
  font-family: "futura-pt", sans-serif;
  font-size: 20px;
  font-weight: 300;
  color: #A6A6A6;
}

.pricing-currency {
  font-family: "futura-pt", sans-serif;
  font-size: 24px;
  font-weight: 400;
  color: #E8E8E8;
  vertical-align: super;
}
```

---

### FAQ Accordion
```css
.faq-item {
  border-bottom: 1px solid #333333;
  padding: 24px 0;
}

.faq-question {
  font-family: "EB Garamond", serif;
  font-size: 24px;
  font-weight: 400;
  color: #E8E8E8;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-answer {
  font-family: "futura-pt", sans-serif;
  font-size: 16px;
  font-weight: 300;
  color: #A6A6A6;
  line-height: 1.6;
  padding-top: 16px;
}
```

---

### Input Fields
```css
.input {
  background: transparent;
  border: none;
  border-bottom: 1px solid #333333;
  color: #E8E8E8;
  font-family: "futura-pt", sans-serif;
  font-size: 22px;
  font-weight: 300;
  padding: 12px 0;
  width: 100%;
  transition: border-color 0.2s ease;
}

.input::placeholder {
  color: #808080;
}

.input:focus {
  outline: none;
  border-bottom-color: #E8E8E8;
}
```

---

## Layout Specifications

### Container Widths
```css
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
}
```

### Section Spacing
```css
.section {
  padding: 80px 0;
}

@media (max-width: 768px) {
  .section {
    padding: 48px 0;
  }
}
```

### Grid System
```css
/* Course grid */
.course-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

@media (max-width: 1200px) {
  .course-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .course-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .course-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Animations & Transitions

### Default Transitions
```css
--transition-fast: 150ms ease;
--transition-normal: 200ms ease;
--transition-slow: 300ms ease;
```

### Hover Effects
```css
/* Card lift */
.card-hover {
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}
.card-hover:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* Button glow */
.btn-glow:hover {
  box-shadow: 0 0 20px rgba(44, 57, 87, 0.5);
}
```

### Page Transitions (Framer Motion)
```javascript
// Fade in up
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Stagger children
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

---

## Z-Index Scale
```css
--z-dropdown: 100;
--z-sticky: 200;
--z-fixed: 300;
--z-modal-backdrop: 400;
--z-modal: 500;
--z-tooltip: 600;
```

---

## Breakpoints
```css
/* Tailwind-compatible */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1440px;
```

---

## Asset References

### Logo
- `/icons/crest_logo_beta.svg` - Main logo with crest
- Size: 50px height on desktop, 40px on mobile

### Hero Video
- `/landing-page/hero-poster.webp` - Hero background
- Autoplay, muted, loop
- Overlay gradient: `linear-gradient(to bottom, rgba(7, 21, 32, 0.3), rgba(7, 21, 32, 0.8))`

### Instructor Images
- Circular crop, 200x200px desktop
- Grayscale by default, color on hover
- Source: ImageKit CDN
