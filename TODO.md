# Redesign CTA / Contact Section

## Plan

- [x] Redesign the Contact/Call-to-Action section in `client/src/Home.jsx`
  - Keep white/light theme
  - Use richer gradient `from-[#0F172A] via-[#1E3A8A] to-[#6D28D9]`
  - Update button text to "Upload Document" / "View Sample Report"
  - Add checklist items (✓ AI Clause Analysis, Risk Detection, etc.)
  - Add floating mini cards around the CTA card
- [x] Add float animation keyframes in `client/src/index.css` (Tailwind v4 `@theme`)
- [x] Verify build — `npm run build` succeeded

## Feedback round 2 applied

- [x] Reduce width to `max-w-[1100px]`, center card with `max-w-4xl mx-auto`
- [x] Add brain/doc icon beside heading badge
- [x] Primary button "Upload Document" with upload icon; secondary "View Sample Report"
- [x] Add small statistics (95% Clause Detection, 30 sec, 10+ types)
- [x] Add 3 floating cards (Analysis Complete, Clause 8 Risk, Secure Upload)
- [x] Green circular checklist icons
- [x] Softer shadow `shadow-[0_25px_60px_rgba(37,99,235,0.18)]`
- [x] Hover animations (buttons lift 3px + shadow, card scale 1.01)
- [x] Improved spacing between heading/description/checklist/buttons
- [x] Heading "AI Legal Analysis" + "Ready to Upload Your Legal Document?" with updated description
