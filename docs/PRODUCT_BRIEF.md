# Product Brief

## Senlay in One Sentence

Senlay provides physical-world intelligence for autonomous systems and AI applications, using available environmental observations and model context with provenance and uncertainty. The current product is an MVP for evaluation.

## The Problem

Most AI agents can reason about the world, but they cannot sense it. They may describe wind, waves, storms, air quality, or terrain from memory, but they do not know what is happening now at a real coordinate.

That gap matters whenever the answer touches safety, movement, equipment, outdoor work, travel, coastal conditions, or field operations.

## The Product

Senlay converts live physical signals into AI-ready context:

- current conditions at a coordinate
- hardware sensor readings where available
- model-backed fallbacks where hardware is sparse
- terrain and coastal modifiers
- concise context strings for LLMs and agents
- public pages for developers and AI agent onboarding
- location-aware observation and archived-forecast charts, with explicit gaps and coverage limitations

## Why It Is Different

Senlay is built from a hardware-first outdoor background, not just from a weather API wrapper. Its product direction draws on the founder’s experience in kitesurfing, hydrofoiling, paragliding, rope access and hardware prototyping; this does not establish deployed robot field trials.

The result is a product that treats physical reality as a first-class input for AI.

## Public Surface

The public website is designed to answer three questions quickly:

- What is Senlay?
- Why should AI agents need senses?
- How can a developer or agent start using it?

## Current demo and evidence boundaries

The Live Demo shows environmental evidence, a separate AI explanation and structured JSON for the same location snapshot. Drone context includes wind observations and available model rain/thunderstorm indications; local rainfall and lightning are not directly measured.

Current model agreement, archived observation/forecast comparisons and historical forecast trust are distinct. The chart calculates no historical trust score. Place Memory describes historical baselines, not a trained local forecast. Mission/route evaluation remains planned.
