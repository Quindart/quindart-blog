---
name: Velocity Dark
colors:
  surface: '#111317'
  surface-dim: '#111317'
  surface-bright: '#37393d'
  surface-container-lowest: '#0c0e12'
  surface-container-low: '#1a1c1f'
  surface-container: '#1e2023'
  surface-container-high: '#282a2e'
  surface-container-highest: '#333539'
  on-surface: '#e2e2e7'
  on-surface-variant: '#c8c8ab'
  inverse-surface: '#e2e2e7'
  inverse-on-surface: '#2e3034'
  outline: '#929277'
  outline-variant: '#474832'
  surface-tint: '#c3d000'
  primary: '#ffffff'
  on-primary: '#2f3300'
  primary-container: '#deed00'
  on-primary-container: '#626900'
  inverse-primary: '#5c6300'
  secondary: '#bfc5e4'
  on-secondary: '#292f48'
  secondary-container: '#424862'
  on-secondary-container: '#b1b7d6'
  tertiary: '#ffffff'
  on-tertiary: '#262f4c'
  tertiary-container: '#dbe1ff'
  on-tertiary-container: '#5a6383'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#deed00'
  primary-fixed-dim: '#c3d000'
  on-primary-fixed: '#1b1d00'
  on-primary-fixed-variant: '#454a00'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#bfc5e4'
  on-secondary-fixed: '#141a32'
  on-secondary-fixed-variant: '#3f465f'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#bdc5e9'
  on-tertiary-fixed: '#111a36'
  on-tertiary-fixed-variant: '#3d4664'
  background: '#111317'
  on-background: '#e2e2e7'
  surface-variant: '#333539'
typography:
  display-metrics:
    fontFamily: Anybody
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Anybody
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Anybody
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  stats-value:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin-mobile: 20px
---

## Brand & Style

The design system is engineered for high-performance athletic environments. It targets runners who require immediate data legibility while in motion, prioritizing high-contrast visuals and an energetic, forward-leaning aesthetic.

The style is **Modern Athletic**, blending elements of **Minimalism** with **High-Contrast** accents. The interface relies on deep, immersive backgrounds to reduce eye strain during night runs, punctuated by aggressive, vibrant highlights that command attention for critical actions and performance metrics. The emotional response is one of momentum, precision, and urgency.

## Colors

The palette is optimized for a dark-mode-first mobile experience:

- **Primary (Vibrant Yellow):** Used exclusively for primary actions, progress indicators, and critical performance data. It is designed to "pop" against the dark background.
- **Secondary (Deep Navy):** The foundational canvas color. It provides a sophisticated, high-performance feel that distinguishes the interface from standard black-themed apps.
- **Tertiary (Midnight Blue):** Used for surface elevations, cards, and container backgrounds to create subtle depth.
- **Neutral:** Pure whites and cool greys are used for secondary text and icons to maintain a clear hierarchy.
- **Status Colors:** Use a saturated "Electric Green" for success/completion and "Pulse Red" for heart rate zones or stopping a workout.

## Typography

Typography is the core of the performance experience. 

- **Display Metrics:** Use *Anybody* for large numeric readouts (pace, distance, time). Its variable nature allows for a condensed, aggressive look that remains legible at high speeds.
- **Body Text:** *Lexend* is chosen for its specific design intent of improving reading speed and accessibility, critical for users glancing at their phones while running.
- **Labels:** *Space Grotesk* provides a technical, futuristic edge for secondary data labels and system information.

All numeric data should use tabular lining figures to ensure that timers and distances don't "jump" as numbers change.

## Layout & Spacing

This design system utilizes a **Fluid Grid** model optimized for thumb-reachability on mobile devices. 

- **The 8pt Rhythm:** All spatial relationships are multiples of 8px (or 4px for tight clusters). 
- **Touch Targets:** Minimum touch targets for interactive elements (Play/Pause/Lap) must be at least 56x56px to accommodate sweaty or moving hands.
- **Safe Zones:** Maintain a 20px lateral margin on all mobile screens. 
- **Performance View:** Use a "Stacked Metric" layout for active runs, where the primary metric occupies the top 40% of the screen, followed by a 2x2 grid of secondary stats.

## Elevation & Depth

In this dark-themed system, depth is achieved through **Tonal Layers** rather than heavy shadows.

- **Level 0 (Base):** Deep Navy (#0A1128).
- **Level 1 (Cards/Tiles):** Midnight Blue (#1C2541). These surfaces should have a subtle 1px border of #FFFFFF at 10% opacity to define edges.
- **Level 2 (Modals/Pop-ups):** Slightly lighter navy with a 20% background blur (Glassmorphism) if overlaid on the map view.
- **Interactive State:** Elements should "glow" rather than drop shadows. Use a subtle outer glow of the Primary Yellow for active states or focused buttons.

## Shapes

The shape language is **Rounded**, balancing the aggressive typography with approachable, modern UI containers.

- **Buttons & Cards:** Use a 0.5rem (8px) radius as the standard.
- **Data Chips:** Use "Pill-shaped" (Full Rounding) for small status tags or filter chips to distinguish them from actionable buttons.
- **Progress Bars:** Should have fully rounded end-caps to emphasize the fluid nature of movement and progress.

## Components

- **Action Buttons:** The primary "Start Run" button is a full-width yellow block with navy text. Secondary buttons use an outlined style with yellow borders.
- **Metric Cards:** Use the Level 1 surface color. Headlines are Space Grotesk labels in light grey, and values are Anybody bold in white or yellow.
- **Active State Toggle:** Use high-contrast switches. When "On," the track should be Vibrant Yellow.
- **Navigation:** A bottom bar using translucent Midnight Blue with icons that transition from grey to Yellow when active.
- **The "Pulse" Indicator:** A specialized component for heart rate monitoring, featuring a micro-animation of a yellow line stroke against a dark grid.
- **Interactive Maps:** Use a custom dark-mode map style with the run path rendered in the Primary Yellow for maximum visibility.
