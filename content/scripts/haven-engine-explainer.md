# Haven Engine — 60s Explainer Script
**Format:** 2-Column (Visual | Audio)
**Duration:** 60 seconds
**Channel:** YouTube Shorts, LinkedIn Video
**CTA:** Download Subletly

---

## Production Notes
- VO: Warm, authoritative female voice. Calm urgency — never panicked.
- Music: Lo-fi ambient, builds to resolution at Chapter 4. Fade out during CTA.
- Color palette: #5221C3 primary, #FF6B6B accent for crisis moments.
- All text overlays: Inter Bold, white on primary, or neutral900 on light backgrounds.
- Captions: Required. Auto-generated + reviewed. Font: Inter 600.

---

## Script

| # | TIMECODE | VISUAL | AUDIO (VO + On-Screen Text) |
|---|----------|--------|-----------------------------|
| 1 | 00:00–02:00 | **Title card** — gradient background (#3A177F → #5221C3). "Haven Rescue" in 96px white. Accent bar (#FF6B6B) slides in below. | *(Music swells in)* |
| 2 | 00:02–04:00 | On-screen text: *"It's 10 PM. You start your assignment at 7 AM."* Red push notification mockup slides in from top. | **VO:** "It's 10 PM. You start your assignment tomorrow at seven AM." |
| 3 | 00:04–08:00 | Notification reads: *"Your host has cancelled your booking."* Screen shakes. Red accent border pulses on screen edge. Map icon shows distance to hospital: 30-min commute. | **VO:** "And your host just cancelled. No explanation. No backup. Just a notification — and a shift that starts in nine hours." |
| 4 | 00:08–10:00 | **Stat card** appears: *"1 in 4 travel nurses face a last-minute cancellation."* Source: Subletly 2024 Housing Survey. Secondary stat: *"Average resolution time without Haven: 72 hours."* | **VO:** "This isn't rare. One in four travel nurses hit a last-minute cancellation. Without help, resolution takes — on average — seventy-two hours." |
| 5 | 00:10–14:00 | Screen transitions to Subletly app. User taps a red button: *"⚡ TRIGGER HAVEN RESCUE"*. Button pulses. Loading indicator replaced by: *"Haven Engine activated — scanning 1,247 verified hosts."* | **VO:** "With Subletly, you tap one button. Haven Rescue activates the Haven Engine — our real-time matching algorithm." |
| 6 | 00:14–22:00 | Animated map fills screen. Purple pins drop within commute radius. Three pins highlight gold: host photos appear with a **Haven Score** badge (⭐ 4.9 / "Nurse-Verified"). Timeline at bottom shows: *"T+0: Rescue triggered → T+45min: Shortlist generated → T+2hr: Confirmed."* | **VO:** "The Engine scans over a thousand nurse-verified hosts within your commute range and budget. Not a flood of listings — a curated shortlist. In under two hours." |
| 7 | 00:22–30:00 | Chat mockup: nurse messages top host. Host replies instantly. Green "Confirmed" badge appears. App screen shows: *"Move-in: Tomorrow, 6:00 AM — 3.2 miles from your hospital."* | **VO:** "You message the top match. They respond. You confirm — all inside the app. Move-in set for six AM. You're eight minutes from your unit." |
| 8 | 00:30–38:00 | Animation: nurse in scrubs walks into a clean, bright apartment. Morning light. Coffee mug. A calming moment. Text overlay: *"94% same-day resolution rate."* | **VO:** "Haven Rescue has a ninety-four percent same-day resolution rate. Crisis averted. Assignment intact. Patient care — uninterrupted." |
| 9 | 00:38–46:00 | Split screen: left = nurse at hospital, confident. Right = host smiling at phone. Both connected by a subtle Subletly bridge graphic. | **VO:** "Subletly doesn't just find you housing. It finds you a host who *gets* what you do — and shows up when it matters." |
| 10 | 00:46–52:00 | Return to dark gradient background. Logo animates in: "SUBLETLY" in white. Tagline fades: *"Your home, wherever work takes you."* | **VO:** "Subletly. Your home, wherever work takes you." |
| 11 | 00:52–60:00 | CTA card: Accent red button — *"DOWNLOAD FREE — iOS & Android"*. QR code in corner. Hashtags: `#HavenRescue #TravelNurseLife #SubletlyApp`. Music fades. | **VO:** "Download free. Available now on iOS and Android." *(Music out)* |

---

## Director's Notes

**Pacing:** The tension in scenes 2–4 should feel like a held breath. Don't rush. Let the notification sit for 1.5 seconds before the shake.

**Scene 5 UI Mockup:** Use real Subletly app screen recording (approved by product team). Replace with high-fidelity Figma prototype if not available.

**Scene 6 Map Animation:** Render in Remotion (`HavenRescueExplainer.tsx`). Pins should drop with a spring animation (`config: { damping: 14 }`).

**Scene 8 B-roll:** Use approved lifestyle photography. No stock photos. Subject must be a real travel nurse (or convincing actor in proper scrubs).

**CTA:** A/B test two versions:
- Version A: "DOWNLOAD FREE"
- Version B: "RESCUE YOUR NEXT ASSIGNMENT"

Track conversion by UTM parameter on app store link.
