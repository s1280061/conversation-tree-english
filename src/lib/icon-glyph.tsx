// Shared brand mark: a chat bubble branching into two replies — a
// "conversation tree". Rendered inside `next/og` ImageResponse for the
// favicon, browser icon, and the iOS home-screen (apple-touch) icon.
export function ConversationTreeGlyph({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Branches (drawn first so the nodes sit on top) */}
      <path
        d="M50 50 L32 76 M50 50 L68 76"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Reply nodes */}
      <circle cx="32" cy="78" r="10" fill="#ffffff" />
      <circle cx="68" cy="78" r="10" fill="#ffffff" />
      {/* Root speech bubble */}
      <rect x="24" y="14" width="52" height="36" rx="13" fill="#ffffff" />
      <path d="M44 48 L50 60 L56 48 Z" fill="#ffffff" />
      {/* Typing dots inside the bubble */}
      <circle cx="38" cy="32" r="4" fill="#6366f1" />
      <circle cx="50" cy="32" r="4" fill="#818cf8" />
      <circle cx="62" cy="32" r="4" fill="#ec4899" />
    </svg>
  );
}
