/** Tiny wrapper around the Web Speech API (speech synthesis). */
export function speak(text: string, lang = "en-US") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel(); // stop anything currently playing
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 0.95;
  utter.pitch = 1;

  // Prefer a natural-sounding English voice when available.
  const voices = synth.getVoices();
  const preferred = voices.find(
    (v) => v.lang.startsWith("en") && /natural|google|samantha|aria/i.test(v.name),
  );
  if (preferred) utter.voice = preferred;

  synth.speak(utter);
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
