import { Composition } from "remotion";
import { TravelNurseTips } from "./compositions/TravelNurseTips";
import { HavenRescueExplainer } from "./compositions/HavenRescueExplainer";
import { HavenRescueTikTok } from "./compositions/HavenRescueTikTok";

export const RemotionRoot = () => {
  return (
    <>
      {/* 9:16 vertical — TikTok / Reels (15s @ 30fps = 450 frames) */}
      <Composition
        id="HavenRescueTikTok"
        component={HavenRescueTikTok}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 9:16 vertical — Travel Nurse Tips carousel (60s @ 30fps = 1800 frames) */}
      <Composition
        id="TravelNurseTips"
        component={TravelNurseTips}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          tips: [
            "Book housing BEFORE you sign your contract.",
            "Filter by 'Nurse-Verified' hosts on Subletly.",
            "Use Haven Rescue if your host cancels last-minute.",
            "Always message the host 48hrs before arrival.",
            "Subletly's Haven Engine matches you in under 2 hours.",
          ],
        }}
      />

      {/* 16:9 landscape — Haven Engine Explainer (60s @ 30fps = 1800 frames) */}
      <Composition
        id="HavenRescueExplainer"
        component={HavenRescueExplainer}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
