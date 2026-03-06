// ExpressionCapture.jsx
// SETUP: npm install @mediapipe/tasks-vision

import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";

const MOOD_META = {
  happy:     { emoji: "😄", label: "Happy",     color: "#facc15", glow: "rgba(250,204,21,0.35)"  },
  sad:       { emoji: "😢", label: "Sad",        color: "#60a5fa", glow: "rgba(96,165,250,0.35)"  },
  surprised: { emoji: "😲", label: "Surprised",  color: "#a78bfa", glow: "rgba(167,139,250,0.35)" },
  Neutral:   { emoji: "😐", label: "Neutral",    color: "#34d399", glow: "rgba(52,211,153,0.35)"  },
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
    @keyframes ecFadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes ecPulse {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.35; }
    }
    @keyframes ecCornerPulse {
      0%, 100% { opacity: 0.4; }
      50%      { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
};

const S = {
  wrapper: {
    minHeight: "60vh",
    width:"500px",
    background: "linear-gradient(135deg, #080d1a 0%, #0f1629 50%, #0a1020 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: 16,
    borderRadius: "12px",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 24,
    padding: "36px 28px 28px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  topLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "#22d3ee",
    textTransform: "uppercase",
    margin: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: "#f1f5f9",
    margin: "6px 0 0",
    textAlign: "center",
  },
  // The ONE box that wraps everything — idle animation + real webcam
  camBox: {
    width: "100%",
    aspectRatio: "4/3",
    borderRadius: 16,
    background: "#050a14",
    border: "1px solid rgba(34,211,238,0.15)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  // Video is ALWAYS in this box — shown or hidden via opacity/zIndex only
  video: (visible) => ({
    position: "absolute",
    top: 0, left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scaleX(-1)",
    opacity: visible ? 1 : 0,
    transition: "opacity 0.3s ease",
    zIndex: visible ? 2 : 0,
  }),
  scanLine: {
    position: "absolute",
    top: 0, left: 0,
    width: "100%",
    height: 2,
    background: "linear-gradient(90deg, transparent 0%, #22d3ee 50%, transparent 100%)",
    animation: "ecScanDown 1.6s linear infinite",
    pointerEvents: "none",
    zIndex: 3,
  },
  corner: (pos, pulse) => {
    const base = {
      position: "absolute",
      width: 18, height: 18,
      pointerEvents: "none",
      zIndex: 4,
      animation: pulse ? "ecCornerPulse 2s ease-in-out infinite" : "none",
    };
    const borders = {
      tl: { top: 8,    left: 8,  borderTop: "2px solid #22d3ee",    borderLeft:   "2px solid #22d3ee", borderRadius: "4px 0 0 0" },
      tr: { top: 8,    right: 8, borderTop: "2px solid #22d3ee",    borderRight:  "2px solid #22d3ee", borderRadius: "0 4px 0 0" },
      bl: { bottom: 8, left: 8,  borderBottom: "2px solid #22d3ee", borderLeft:   "2px solid #22d3ee", borderRadius: "0 0 0 4px" },
      br: { bottom: 8, right: 8, borderBottom: "2px solid #22d3ee", borderRight:  "2px solid #22d3ee", borderRadius: "0 0 4px 0" },
    };
    return { ...base, ...borders[pos] };
  },
  idleText: (visible) => ({
    color: "rgba(34,211,238,0.25)",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    animation: "ecPulse 2s ease-in-out infinite",
    textAlign: "center",
    userSelect: "none",
    zIndex: 1,
    opacity: visible ? 1 : 0,
    transition: "opacity 0.3s ease",
    position: "absolute",
  }),
  countdownBadge: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: "translateX(-50%)",
    color: "#22d3ee",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.06em",
    background: "rgba(8,13,26,0.75)",
    padding: "4px 14px",
    borderRadius: 20,
    whiteSpace: "nowrap",
    animation: "ecPulse 1s ease-in-out infinite",
    zIndex: 5,
  },
  resultBox: (moodKey) => ({
    width: "100%",
    padding: "18px 20px",
    background: "linear-gradient(135deg, rgba(8,13,26,0.95), rgba(15,22,41,0.9))",
    border: `1px solid ${MOOD_META[moodKey] ? MOOD_META[moodKey].color + "44" : "transparent"}`,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    gap: 16,
    boxShadow: MOOD_META[moodKey] ? `0 0 36px ${MOOD_META[moodKey].glow}` : "none",
    animation: "ecFadeIn 0.45s ease",
  }),
  resultEmoji: {
    fontSize: 52,
    lineHeight: 1,
    filter: "drop-shadow(0 0 10px rgba(255,255,255,0.25))",
  },
  resultMeta: { display: "flex", flexDirection: "column", gap: 3 },
  resultSmallLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "#475569",
    textTransform: "uppercase",
    margin: 0,
  },
  resultMoodName: (moodKey) => ({
    fontSize: 28,
    fontWeight: 800,
    color: MOOD_META[moodKey] ? MOOD_META[moodKey].color : "#f1f5f9",
    margin: 0,
  }),
  btn: (disabled) => ({
    width: "100%",
    padding: "13px 0",
    background: disabled
      ? "rgba(255,255,255,0.04)"
      : "linear-gradient(90deg, #0ea5e9 0%, #22d3ee 100%)",
    border: "none",
    borderRadius: 12,
    color: disabled ? "#334155" : "#080d1a",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.07em",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "opacity 0.2s, box-shadow 0.2s",
    boxShadow: disabled ? "none" : "0 4px 20px rgba(34,211,238,0.3)",
  }),
  resetBtn: {
    background: "none",
    border: "none",
    color: "#334155",
    fontSize: 12,
    cursor: "pointer",
    textDecoration: "underline",
    padding: 0,
    marginTop: -8,
  },
};

// phases: "idle" | "loading" | "detecting" | "result"
export default function ExpressionCapture({ onMoodDetected }) {
  const videoRef      = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef     = useRef(null);

  const [phase, setPhase]           = useState("idle");
  const [expression, setExpression] = useState(null);

  useEffect(() => {
    injectKeyframes();
    return () => {
      if (landmarkerRef.current) landmarkerRef.current.close();
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function handleClick() {
    if (phase === "loading" || phase === "detecting") return;

    setExpression(null);
    setPhase("loading");

    // init() will attach stream to videoRef.current
    // videoRef is ALWAYS mounted so this is safe
    await init({ landmarkerRef, videoRef, streamRef });

    setPhase("detecting");

    // Give browser one frame to paint the video feed before we snapshot
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    const result = detect({ landmarkerRef, videoRef, setExpression });

    // Stop camera after snapshot
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;

    if (result) {
      setExpression(result);
      if (onMoodDetected) onMoodDetected(result);
    }

    setPhase("result");
  }

  function handleReset() {
    setExpression(null);
    setPhase("idle");
  }

  const isIdle      = phase === "idle";
  const isLoading   = phase === "loading";
  const isDetecting = phase === "detecting";
  const isResult    = phase === "result";
  const camVisible  = isDetecting; // video element is always in DOM, just shown here
  const moodData    = expression ? MOOD_META[expression] : null;

  const btnLabel = isLoading   ? "Starting camera…"
                 : isDetecting ? "Detecting…"
                 : isResult    ? "Detect Again"
                 :               "Detect My Mood";

  return (
    <div style={S.wrapper}>
      <div style={S.card}>

        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <p style={S.topLabel}>Moodify</p>
          <h1 style={S.title}>Expression Capture</h1>
        </div>

        {/*
          ── SINGLE BOX, SINGLE VIDEO ──────────────────────────
          The <video> is ALWAYS in the DOM here.
          We never conditionally render it — only toggle opacity.
          This guarantees videoRef.current is valid when init() runs.
        */}
        <div style={S.camBox}>

          {/* Real webcam — always mounted, visible only when detecting */}
          <video
            ref={videoRef}
            style={S.video(camVisible)}
            playsInline
            muted
          />

          {/* Idle / Loading center text */}
          <p style={S.idleText(!camVisible)}>
            {isLoading ? "Initialising camera…" : "Ready to scan"}
          </p>

          {/* Corner brackets — always shown, pulse when idle */}
          <div style={S.corner("tl", !camVisible)} />
          <div style={S.corner("tr", !camVisible)} />
          <div style={S.corner("bl", !camVisible)} />
          <div style={S.corner("br", !camVisible)} />

          {/* Scan line — idle, loading, and detecting */}
          {!isResult && <div style={S.scanLine} />}

          {/* Analysing badge — only while detecting */}
          {isDetecting && (
            <div style={S.countdownBadge}>Analysing…</div>
          )}
        </div>

        {/* Result card */}
        {isResult && expression && moodData && (
          <div style={S.resultBox(expression)}>
            <span style={S.resultEmoji}>{moodData.emoji}</span>
            <div style={S.resultMeta}>
              <p style={S.resultSmallLabel}>Current Mood Analysis</p>
              <h2 style={S.resultMoodName(expression)}>{moodData.label}</h2>
            </div>
          </div>
        )}

        {/* Main button */}
        <button
          onClick={handleClick}
          disabled={isLoading || isDetecting}
          style={S.btn(isLoading || isDetecting)}
        >
          {btnLabel}
        </button>

        {/* Reset */}
        {isResult && (
          <button onClick={handleReset} style={S.resetBtn}>
            Reset
          </button>
        )}

      </div>
    </div>
  );
}