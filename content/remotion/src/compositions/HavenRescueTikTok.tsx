/**
 * HavenRescueTikTok.tsx
 * Remotion composition — Haven Rescue 15-second TikTok hook
 * Brand: #5221C3, 9:16 @ 1080×1920, 30fps, 450 frames
 *
 * Story arc (pure urgency → relief):
 *   0–60    HOOK — "Your host just cancelled." (black card, accent red)
 *   61–180  PROBLEM — panic stat overlay
 *   181–330 SOLUTION — Haven Engine kicks in
 *   331–450 RESOLUTION — CTA + logo
 */

import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from "remotion";
import React from "react";

const BRAND = {
  primary: "#5221C3",
  primaryLight: "#7B4FE8",
  primaryDark: "#3A177F",
  accent: "#FF6B6B",
  neutral900: "#1A1A2E",
  neutral100: "#F7F5FF",
  white: "#FFFFFF",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fadeIn = (frame: number, start: number, dur = 15) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

const shake = (frame: number, intensity = 8) =>
  Math.sin(frame * 2.4) * intensity * Math.max(0, 1 - frame / 30);

// ─── Scene 1: HOOK ────────────────────────────────────────────────────────────

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  const shakeX = frame < 30 ? shake(frame) : 0;

  return (
    <AbsoluteFill
      style={{
        background: BRAND.neutral900,
        transform: `translateX(${shakeX}px)`,
      }}
    >
      {/* Red urgency stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 12,
          background: BRAND.accent,
          opacity: fadeIn(frame, 5),
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          padding: "0 80px",
        }}
      >
        {/* Emoji alert */}
        <div
          style={{
            fontSize: 120,
            transform: `scale(${scale})`,
            lineHeight: 1,
          }}
        >
          🚨
        </div>

        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: 76,
            color: BRAND.white,
            textAlign: "center",
            lineHeight: 1.1,
            opacity: fadeIn(frame, 10),
          }}
        >
          Your host just{" "}
          <span style={{ color: BRAND.accent }}>cancelled.</span>
        </div>

        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: 36,
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            opacity: fadeIn(frame, 25),
          }}
        >
          You start your assignment in{" "}
          <span style={{ color: BRAND.accent, fontWeight: 700 }}>48 hours.</span>
        </div>
      </AbsoluteFill>

      {/* Bottom label */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: 28,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          opacity: fadeIn(frame, 40),
        }}
      >
        This actually happens.
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: PROBLEM STATS ───────────────────────────────────────────────────

const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stat1Scale = spring({ frame, fps, config: { damping: 14 } });
  const stat2Scale = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 14 } });
  const stat3Scale = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 14 } });

  const stats = [
    { value: "1 in 4", label: "travel nurses face a last-minute cancellation" },
    { value: "72hrs", label: "average time wasted finding a replacement" },
    { value: "$0", label: "compensation from traditional booking platforms" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        padding: "0 72px",
      }}
    >
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: 36,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: fadeIn(frame, 5),
        }}
      >
        The housing crisis is real.
      </div>

      {stats.map((s, i) => {
        const scales = [stat1Scale, stat2Scale, stat3Scale];
        return (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: "36px 56px",
              width: "100%",
              transform: `scale(${scales[i]})`,
              borderLeft: `6px solid ${i === 2 ? BRAND.accent : BRAND.primaryLight}`,
            }}
          >
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: 72,
                color: i === 2 ? BRAND.accent : BRAND.white,
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: 30,
                color: "rgba(255,255,255,0.7)",
                marginTop: 8,
              }}
            >
              {s.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Scene 3: SOLUTION — Haven Engine ─────────────────────────────────────────

const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const step1Opacity = fadeIn(frame, 20);
  const step2Opacity = fadeIn(frame, 55);
  const step3Opacity = fadeIn(frame, 90);

  const steps = [
    { icon: "📍", text: "You trigger Haven Rescue in the app." },
    { icon: "⚙️", text: "The Haven Engine scans 1,000+ verified hosts." },
    { icon: "🏠", text: "You're matched — in under 2 hours." },
  ];

  return (
    <AbsoluteFill
      style={{
        background: BRAND.neutral100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: "0 72px",
      }}
    >
      {/* Brand badge */}
      <div
        style={{
          background: BRAND.primary,
          borderRadius: 100,
          padding: "20px 56px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: 36,
          color: BRAND.white,
          letterSpacing: "0.05em",
          transform: `scale(${logoScale})`,
        }}
      >
        HAVEN RESCUE ⚡
      </div>

      {steps.map((s, i) => {
        const opacities = [step1Opacity, step2Opacity, step3Opacity];
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              opacity: opacities[i],
              width: "100%",
            }}
          >
            <span style={{ fontSize: 64 }}>{s.icon}</span>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 36,
                color: BRAND.neutral900,
                margin: 0,
                lineHeight: 1.35,
                flex: 1,
              }}
            >
              {s.text}
            </p>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Scene 4: RESOLUTION / CTA ────────────────────────────────────────────────

const ResolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heroScale = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const ctaOpacity = fadeIn(frame, 30, 25);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 60%, ${BRAND.primaryLight} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        padding: "0 80px",
      }}
    >
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: 80,
          color: BRAND.white,
          textAlign: "center",
          lineHeight: 1.1,
          transform: `scale(${heroScale})`,
        }}
      >
        Crisis averted. Assignment saved.
      </div>

      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: 36,
          color: "rgba(255,255,255,0.75)",
          textAlign: "center",
          opacity: ctaOpacity,
        }}
      >
        Download Subletly — free for travel nurses.
      </div>

      <div
        style={{
          background: BRAND.accent,
          borderRadius: 100,
          padding: "28px 72px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: 36,
          color: BRAND.white,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          opacity: ctaOpacity,
        }}
      >
        GET THE APP FREE
      </div>

      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: 28,
          color: "rgba(255,255,255,0.5)",
          textAlign: "center",
          opacity: ctaOpacity,
        }}
      >
        #HavenRescue #TravelNurseLife #SubletlyApp
      </div>
    </AbsoluteFill>
  );
};

// ─── Root composition ─────────────────────────────────────────────────────────

export const HavenRescueTikTok: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={60}>
      <HookScene />
    </Sequence>
    <Sequence from={60} durationInFrames={120}>
      <ProblemScene />
    </Sequence>
    <Sequence from={180} durationInFrames={150}>
      <SolutionScene />
    </Sequence>
    <Sequence from={330} durationInFrames={120}>
      <ResolutionScene />
    </Sequence>
  </AbsoluteFill>
);
