/**
 * HavenRescueExplainer.tsx
 * Remotion composition — Haven Engine 60s Explainer (landscape 16:9)
 * Brand: #5221C3, Inter, 1920×1080, 30fps, 1800 frames
 *
 * Structure mirrors the 2-column script in /scripts/haven-engine-explainer.md
 *   0–120    Title card
 *   121–480  Chapter 1: The Problem (12s)
 *   481–840  Chapter 2: The Engine (12s)
 *   841–1200 Chapter 3: The Match (12s)
 *   1201–1560 Chapter 4: Crisis Averted (12s)
 *   1561–1800 Outro + CTA (8s)
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

const fadeIn = (frame: number, start: number, dur = 20) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

// ─── Title Card ───────────────────────────────────────────────────────────────

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 32,
      }}
    >
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: 96,
          color: BRAND.white,
          textAlign: "center",
          lineHeight: 1.1,
          transform: `scale(${scale})`,
        }}
      >
        Haven Rescue
      </div>
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: 40,
          color: "rgba(255,255,255,0.7)",
          opacity: fadeIn(frame, 20),
        }}
      >
        How Subletly saves your assignment in 2 hours.
      </div>
      <div
        style={{
          width: 120,
          height: 6,
          borderRadius: 3,
          background: BRAND.accent,
          opacity: fadeIn(frame, 35),
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Chapter layout ───────────────────────────────────────────────────────────

interface ChapterProps {
  chapterNum: number;
  label: string;
  visual: React.ReactNode;
  body: string;
  accent?: boolean;
}

const Chapter: React.FC<ChapterProps> = ({
  chapterNum,
  label,
  visual,
  body,
  accent = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftSlide = spring({ frame, fps, config: { damping: 16 } });
  const rightOpacity = fadeIn(frame, 20, 30);

  return (
    <AbsoluteFill
      style={{
        background: accent ? BRAND.neutral100 : BRAND.white,
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      {/* Left visual panel */}
      <div
        style={{
          flex: 1,
          background: `linear-gradient(160deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 24,
          padding: 64,
          transform: `translateX(${(leftSlide - 1) * -200}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          CHAPTER {chapterNum}
        </div>
        {visual}
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: 36,
            color: BRAND.white,
            textAlign: "center",
          }}
        >
          {label}
        </div>
      </div>

      {/* Right copy panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          opacity: rightOpacity,
        }}
      >
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: 36,
            color: BRAND.neutral900,
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {body}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ─── Outro ────────────────────────────────────────────────────────────────────

const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 14 } });
  const ctaOp = fadeIn(frame, 25, 30);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: 80,
          color: BRAND.white,
          textAlign: "center",
          transform: `scale(${scale})`,
        }}
      >
        SUBLETLY
      </div>
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: 36,
          color: "rgba(255,255,255,0.7)",
          opacity: ctaOp,
        }}
      >
        Your home, wherever work takes you.
      </div>
      <div
        style={{
          background: BRAND.accent,
          borderRadius: 100,
          padding: "24px 80px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: 32,
          color: BRAND.white,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          opacity: ctaOp,
        }}
      >
        DOWNLOAD FREE — iOS & ANDROID
      </div>
    </AbsoluteFill>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────

export const HavenRescueExplainer: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={120}>
      <TitleCard />
    </Sequence>

    <Sequence from={120} durationInFrames={360}>
      <Chapter
        chapterNum={1}
        label="The Problem"
        visual={<span style={{ fontSize: 120 }}>🚨</span>}
        body="Late-stage cancellations leave travel nurses stranded — sometimes 48 hours before an assignment starts. Traditional platforms offer no safety net. You're on your own."
      />
    </Sequence>

    <Sequence from={480} durationInFrames={360}>
      <Chapter
        chapterNum={2}
        label="The Haven Engine"
        visual={<span style={{ fontSize: 120 }}>⚙️</span>}
        body="The Haven Engine is Subletly's real-time matching algorithm. The moment you trigger Haven Rescue, it scans over 1,000 verified nurse-friendly hosts within your commute radius and budget."
        accent
      />
    </Sequence>

    <Sequence from={840} durationInFrames={360}>
      <Chapter
        chapterNum={3}
        label="The Match"
        visual={<span style={{ fontSize: 120 }}>🤝</span>}
        body="Within 2 hours, you receive a curated shortlist — not a spam wall of unverified listings. Each host has a Haven score: a composite of response time, nurse reviews, and cancellation history."
      />
    </Sequence>

    <Sequence from={1200} durationInFrames={360}>
      <Chapter
        chapterNum={4}
        label="Crisis Averted"
        visual={<span style={{ fontSize: 120 }}>🏠✅</span>}
        body="You message, confirm, and move in — all inside the Subletly app. Haven Rescue has a 94% same-day resolution rate. Your assignment continues. Your patient care continues."
        accent
      />
    </Sequence>

    <Sequence from={1560} durationInFrames={240}>
      <OutroCard />
    </Sequence>
  </AbsoluteFill>
);
