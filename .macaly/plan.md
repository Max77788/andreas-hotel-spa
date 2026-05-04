# Make Hero Text More Visible

## Overview
Add a subtle background behind the hero text to ensure it reads clearly over the video, regardless of what's showing in the video at any moment.

## What I'll Do

Wrap the title block ("Palm Springs, California" label, "The Andreas", "Hotel & Spa", tagline) in a semi-transparent dark backdrop panel — a frosted, elegant card that sits behind the text. This keeps the luxury feel while guaranteeing legibility.

### Specifically:
- Add a `rgba(0,0,0,0.35)` semi-transparent background with a subtle `backdrop-blur` to the text container
- Pad it slightly so the background isn't too tight around the letters
- Keep the buttons outside the backdrop (they already have their own solid borders)

## No-gos
- Will NOT change font sizes, colors, or copy
- Will NOT add a full-width bar (would look like a banner, not luxury)
- Will NOT change button styles

## Todos
- [ ] Wrap hero text elements in a backdrop panel in `app/page.tsx`
