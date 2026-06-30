import { ImageResponse } from "next/og";
import { ConversationTreeGlyph } from "@/lib/icon-glyph";

// iOS "Add to Home Screen" icon (apple-touch-icon).
// iOS applies its own squircle mask, so we render a full-bleed background.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
        }}
      >
        <ConversationTreeGlyph size={120} />
      </div>
    ),
    { ...size },
  );
}
