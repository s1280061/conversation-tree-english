import { ImageResponse } from "next/og";
import { ConversationTreeGlyph } from "@/lib/icon-glyph";

// Browser tab / high-res app icon. Rounded corners since browsers don't mask.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 112,
          background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
        }}
      >
        <ConversationTreeGlyph size={340} />
      </div>
    ),
    { ...size },
  );
}
