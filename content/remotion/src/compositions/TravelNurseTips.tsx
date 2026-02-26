/**
 * TravelNurseTips.tsx
 * Remotion composition — "5 Tips for Travel Nurses" vertical video
 * Brand: #5221C3 primary, Inter font, 9:16 @ 1080×1920
 *
 * Structure (60s total, 30fps, 1800 frames):
 *   0–90    Intro card
 *   91–450  Tip 1 (12s)
 *   451–810 Tip 2 (12s)
 *   811–1170 Tip 3 (12s)
 *   1171–1530 Tip 4 (12s)
 *   1531–1710 Tip 5 (6s — punchier)
 *   1711–1800 Outro + CTA
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

// ─── Brand tokens ────────────────────────────────────────────────────────────
const BRAND = {
  primary: "#5221C3",
  primaryLight: "#7B4FE8",
  primaryDark: "#3A177F",
  accent: "#FF6B6B",
  neutral900: "#1A1A2E",
  neutral100: "#F7F5FF",
  white: "#FFFFFF",
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
const fadeIn = (frame: number, start: number, duration = 20) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

const slideUp = (frame: number, start: number, fps: number) =>
  spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 120 } });

// ─── Sub-components ───────────────────────────────────────────────────────────

const Background: React.FC<{ variant?: "dark" | "light" }> = ({
  variant = "dark",
}) => (
  <AbsoluteFill
    style={{
      background:
        variant === "dark"
          ? `linear-gradient(160deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 60%, ${BRAND.primaryLight} 100%)`
          : BRAND.neutral100,
    }}
  />
);

const Logo: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    style={{
      position: "absolute",
      top: 80,
      left: 0,
      right: 0,
      textAlign: "center",
      opacity,
      fontFamily: "Inter, sans-serif",
      fontWeight: 800,
      fontSize: 48,
      color: BRAND.white,
      letterSpacing: "0.08em",
    }}
  >
    SUBLETLY
  </div>
);

const IntroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = fadeIn(frame, 10);
  const headlineY = slideUp(frame, 20, fps);
  const subtitleOpacity = fadeIn(frame, 35);

  return (
    <AbsoluteFill>
      <Background variant="dark" />
      <Logo opacity={logoOpacity} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          gap: 24,
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
            transform: `translateY(${(1 - headlineY) * 60}px)`,
            opacity: headlineY,
          }}
        >
          5 Tips for{"\n"}Travel Nurses
        </div>

        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: 36,
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            opacity: subtitleOpacity,
          }}
        >
          Housing secrets that save your assignment
        </div>

        {/* Accent bar */}
        <div
          style={{
            width: 80,
            height: 6,
            borderRadius: 3,
            background: BRAND.accent,
            opacity: subtitleOpacity,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TipCard: React.FC<{
  number: number;
  tip: string;
  startFrame: number;
}> = ({ number, tip, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - startFrame;
  const cardScale = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const textOpacity = fadeIn(frame, startFrame + 15, 25);

  return (
    <AbsoluteFill>
      <Background variant="light" />

      {/* Number pill */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 80,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: BRAND.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: 48,
          color: BRAND.white,
          transform: `scale(${cardScale})`,
        }}
      >
        {number}
      </div>

      {/* Tip label */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 200,
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: 28,
          color: BRAND.primary,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity: textOpacity,
          lineHeight: "100px",
        }}
      >
        TIP #{number}
      </div>

      {/* Tip text card */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            background: BRAND.white,
            borderRadius: 32,
            padding: "64px 72px",
            boxShadow: `0 24px 64px rgba(82,33,195,0.15)`,
            borderLeft: `8px solid ${BRAND.primary}`,
            opacity: textOpacity,
            transform: `scale(${0.8 + cardScale * 0.2})`,
          }}
        >
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 52,
              color: BRAND.neutral900,
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {tip}
          </p>
        </div>
      </AbsoluteFill>

      {/* Progress dots */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              width: i === number ? 40 : 16,
              height: 16,
              borderRadius: 8,
              background: i === number ? BRAND.primary : "rgba(82,33,195,0.2)",
              transition: "width 0.3s",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const ctaOpacity = fadeIn(frame, 20, 30);

  return (
    <AbsoluteFill>
      <Background variant="dark" />
      <Logo opacity={1} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: 64,
            color: BRAND.white,
            textAlign: "center",
            lineHeight: 1.2,
            transform: `scale(${scale})`,
          }}
        >
          Your next assignment starts with a home.
        </div>

        {/* CTA Button */}
        <div
          style={{
            background: BRAND.accent,
            borderRadius: 100,
            padding: "32px 80px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: 40,
            color: BRAND.white,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            opacity: ctaOpacity,
          }}
        >
          DOWNLOAD SUBLETLY
        </div>

        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: 28,
            color: "rgba(255,255,255,0.6)",
            opacity: ctaOpacity,
          }}
        >
          #SubletlyApp #TravelNurseLife
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main composition ─────────────────────────────────────────────────────────

interface TravelNurseTipsProps {
  tips: string[];
}

export const TravelNurseTips: React.FC<TravelNurseTipsProps> = ({ tips }) => {
  // Each tip gets ~12s (360 frames), except last (6s = 180 frames)
  const TIP_DURATION = 360;
  const INTRO_DURATION = 90;
  const OUTRO_START = INTRO_DURATION + TIP_DURATION * (tips.length - 1) + 180;

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <IntroCard />
      </Sequence>

      {tips.map((tip, i) => {
        const startFrame =
          INTRO_DURATION +
          i * TIP_DURATION -
          (i === tips.length - 1 ? TIP_DURATION - 180 : 0);

        return (
          <Sequence
            key={i}
            from={INTRO_DURATION + i * TIP_DURATION}
            durationInFrames={i === tips.length - 1 ? 180 : TIP_DURATION}
          >
            <TipCard number={i + 1} tip={tip} startFrame={0} />
          </Sequence>
        );
      })}

      <Sequence from={OUTRO_START} durationInFrames={90}>
        <OutroCard />
      </Sequence>
    </AbsoluteFill>
  );
};
