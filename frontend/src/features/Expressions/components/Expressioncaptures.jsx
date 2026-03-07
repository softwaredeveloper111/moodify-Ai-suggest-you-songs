// ExpressionCapture.jsx
// SETUP: npm install @mediapipe/tasks-vision

import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";

const MOOD_META = {
  happy:     { emoji: "😄", label: "happy",     color: "#facc15", glow: "rgba(250,204,21,0.35)"  },
  sad:       { emoji: "😢", label: "sad",       color: "#60a5fa", glow: "rgba(96,165,250,0.35)"  },
  surprise: { emoji: "😲", label: "surprise", color: "#a78bfa", glow: "rgba(167,139,250,0.35)" },
  nutural:   { emoji: "😐", label: "nutural",   color: "#34d399", glow: "rgba(52,211,153,0.35)"  },
};

const injectKeyframes = () => {
  if (document.getElementById("ec-styles")) return;
  const style = document.createElement("style");
  style.id = "ec-styles";
  style.textContent = `
    @keyframes ecScanDown {
      0%   { top: 0%;   opacity: 1; }
      90%  { top: 100%; opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
    @keyframes ecPulse {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.35; }
    }
    @keyframes ecCornerPulse {
      0%, 100% { opacity: 0.4; }
      50%      { opacity: 1; }
    }
    @keyframes ecResultIn {
      from { opacity: 0; transform: scale(0.85); }
      to   { opacity: 1; transform: scale(1); }
    }

    /* ── Default min-height ── */
    #ec-root-wrapper { min-height: 60vh; }

    /* ── Responsive overrides ── */
    @media (max-width: 480px) {
      #ec-root-wrapper  { padding: 12px !important; min-height: 45vh !important; }
      #ec-card          { padding: 24px 16px 20px !important; border-radius: 18px !important; }
      #ec-title         { font-size: 19px !important; }
    }
  `;
  document.head.appendChild(style);
};

const S = {
  wrapper: {
    width: "100%",
    maxWidth: 500,
    background: "linear-gradient(135deg, #080d1a 0%, #0f1629 50%, #0a1020 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: "clamp(10px, 3vw, 16px)",
    borderRadius: "12px",
    boxSizing: "border-box",
    
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "clamp(16px, 4vw, 24px)",
    padding: "clamp(24px, 5vw, 36px) clamp(16px, 4vw, 28px) clamp(20px, 4vw, 28px)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "clamp(14px, 3vw, 20px)",
    boxSizing: "border-box",
  },
  topLabel: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
    color: "#22d3ee", textTransform: "uppercase", margin: 0,
  },
  title: {
    fontSize: "clamp(18px, 5vw, 24px)", fontWeight: 800, color: "#f1f5f9",
    margin: "6px 0 0", textAlign: "center",
  },
  camBox: (moodKey) => {
    const meta = MOOD_META[moodKey];
    return {
      width: "100%", aspectRatio: "4/3", borderRadius: "clamp(10px, 3vw, 16px)",
      background: "#050a14",
      border: `1px solid ${meta ? meta.color + "55" : "rgba(34,211,238,0.15)"}`,
      boxShadow: meta ? `0 0 40px ${meta.glow}` : "none",
      transition: "border 0.4s ease, box-shadow 0.4s ease",
      position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
    };
  },
  video: (visible) => ({
    position: "absolute", inset: 0, width: "100%", height: "100%",
    objectFit: "cover", transform: "scaleX(-1)",
    opacity: visible ? 1 : 0, transition: "opacity 0.3s ease",
    zIndex: visible ? 2 : 0,
  }),
  scanLine: {
    position: "absolute", top: 0, left: 0, width: "100%", height: 2,
    background: "linear-gradient(90deg, transparent 0%, #22d3ee 50%, transparent 100%)",
    animation: "ecScanDown 1.6s linear infinite", pointerEvents: "none", zIndex: 3,
  },
  corner: (pos, pulse) => {
    const corners = {
      tl: { top: 8,    left: 8,  borderTop: "2px solid #22d3ee",    borderLeft:   "2px solid #22d3ee", borderRadius: "4px 0 0 0" },
      tr: { top: 8,    right: 8, borderTop: "2px solid #22d3ee",    borderRight:  "2px solid #22d3ee", borderRadius: "0 4px 0 0" },
      bl: { bottom: 8, left: 8,  borderBottom: "2px solid #22d3ee", borderLeft:   "2px solid #22d3ee", borderRadius: "0 0 0 4px" },
      br: { bottom: 8, right: 8, borderBottom: "2px solid #22d3ee", borderRight:  "2px solid #22d3ee", borderRadius: "0 0 4px 0" },
    };
    return {
      position: "absolute", width: 18, height: 18,
      pointerEvents: "none", zIndex: 4,
      animation: pulse ? "ecCornerPulse 2s ease-in-out infinite" : "none",
      ...corners[pos],
    };
  },
  idleText: (visible) => ({
    color: "rgba(34,211,238,0.25)", fontSize: "clamp(11px, 2.5vw, 13px)", fontWeight: 600,
    letterSpacing: "0.14em", textTransform: "uppercase",
    animation: "ecPulse 2s ease-in-out infinite", textAlign: "center",
    userSelect: "none", zIndex: 1, position: "absolute",
    opacity: visible ? 1 : 0, transition: "opacity 0.3s ease",
  }),
  countdownBadge: {
    position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
    color: "#22d3ee", fontSize: "clamp(10px, 2.5vw, 12px)", fontWeight: 600, letterSpacing: "0.06em",
    background: "rgba(8,13,26,0.75)", padding: "4px 14px", borderRadius: 20,
    whiteSpace: "nowrap", animation: "ecPulse 1s ease-in-out infinite", zIndex: 5,
  },
  resultOverlay: {
    position: "absolute", inset: 0, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 10,
    zIndex: 6, animation: "ecResultIn 0.4s ease",
    background: "linear-gradient(135deg, rgba(8,13,26,0.92), rgba(15,22,41,0.88))",
  },
  resultEmoji: {
    fontSize: "clamp(48px, 13vw, 72px)", lineHeight: 1,
    filter: "drop-shadow(0 0 16px rgba(255,255,255,0.2))",
  },
  resultSmallLabel: {
    fontSize: 9, fontWeight: 700, letterSpacing: "0.18em",
    color: "#475569", textTransform: "uppercase", margin: 0, textAlign: "center",
  },
  resultMoodName: (moodKey) => ({
    fontSize: "clamp(22px, 7vw, 34px)", fontWeight: 800,
    color: MOOD_META[moodKey]?.color ?? "#f1f5f9",
    margin: 0, textAlign: "center", textTransform: "capitalize",
  }),
  btn: (disabled) => ({
    width: "100%", padding: "clamp(11px, 2.5vw, 13px) 0",
    background: disabled
      ? "rgba(255,255,255,0.04)"
      : "linear-gradient(90deg, #0ea5e9 0%, #22d3ee 100%)",
    border: "none", borderRadius: 12,
    color: disabled ? "#334155" : "#080d1a",
    fontSize: "clamp(13px, 3vw, 14px)", fontWeight: 700, letterSpacing: "0.07em",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "opacity 0.2s, box-shadow 0.2s",
    boxShadow: disabled ? "none" : "0 4px 20px rgba(34,211,238,0.3)",
  }),
};

export default function ExpressionCapture({ onMoodDetected }) {
  const videoRef      = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef     = useRef(null);

  const [phase, setPhase] = useState("idle");
  const [mood,  setMood]  = useState(null);

  useEffect(() => {
    injectKeyframes();
    return () => {
      landmarkerRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  async function handleClick() {
    if (phase === "loading" || phase === "detecting") return;

    setMood(null);
    setPhase("loading");

    // ✅ try-catch guarantees onMoodDetected ALWAYS fires
    // even if camera fails, mediapipe crashes, or anything throws
    try {
      await init({ landmarkerRef, videoRef, streamRef });
      setPhase("detecting");
      await new Promise((r) => requestAnimationFrame(r));

      const detectedMood = detect({ landmarkerRef, videoRef });
      stopCamera();

      setMood(detectedMood);
      onMoodDetected?.(detectedMood);
    } catch (err) {
      console.error("Detection failed:", err);
      stopCamera();
      // Even on total failure — fire callback with nutural
      setMood("nutural");
      onMoodDetected?.("nutural");
    } finally {
      setPhase("result");
    }
  }

  const isLoading   = phase === "loading";
  const isDetecting = phase === "detecting";
  const isResult    = phase === "result";
  const busy        = isLoading || isDetecting;
  const moodData    = mood ? MOOD_META[mood] : null;

  const btnLabel = isLoading   ? "Starting camera…"
                 : isDetecting ? "Detecting…"
                 : isResult    ? "Detect Again"
                 :               "Detect My Mood";

  return (
    <div style={S.wrapper} id="ec-root-wrapper">
      <div style={S.card} id="ec-card">

        <div style={{ textAlign: "center" }}>
          <p style={S.topLabel}>Moodify</p>
          <h1 style={S.title} id="ec-title">Expression Capture</h1>
        </div>

        <div style={S.camBox(isResult ? mood : null)}>

          <video ref={videoRef} style={S.video(isDetecting)} playsInline muted />

          <p style={S.idleText(!isDetecting && !isResult)}>
            {isLoading ? "Initialising camera…" : "Ready to scan"}
          </p>

          {["tl", "tr", "bl", "br"].map((pos) => (
            <div key={pos} style={S.corner(pos, !isDetecting && !isResult)} />
          ))}

          {!isResult && <div style={S.scanLine} />}

          {isDetecting && <div style={S.countdownBadge}>Analysing…</div>}

          {isResult && moodData && (
            <div style={S.resultOverlay}>
              <span style={S.resultEmoji}>{moodData.emoji}</span>
              <p style={S.resultSmallLabel}>Mood Detected</p>
              <h2 style={S.resultMoodName(mood)}>{moodData.label}</h2>
            </div>
          )}

        </div>

        <button onClick={handleClick} disabled={busy} style={S.btn(busy)}>
          {btnLabel}
        </button>

      </div>
    </div>
  );
}