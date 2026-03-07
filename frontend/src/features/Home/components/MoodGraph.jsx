import { useEffect, useRef, useState } from "react";

// ─── constants ────────────────────────────────────────────────────────────────

const MOOD_CFG = {
  happy:    { color: "#facc15", glow: "#facc1566", emoji: "😄", label: "Happy"    },
  sad:      { color: "#60a5fa", glow: "#60a5fa66", emoji: "😢", label: "Sad"      },
  surprise: { color: "#a78bfa", glow: "#a78bfa66", emoji: "😲", label: "Surprise" },
  nutural:  { color: "#34d399", glow: "#34d39966", emoji: "😐", label: "Nutural"  },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── localStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = "moodify_history";

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveHistory(history) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch {}
}

// ─── utils ───────────────────────────────────────────────────────────────────

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "2025-01-15"
}

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

// ─── component ───────────────────────────────────────────────────────────────

export default function MoodGraph({ mood }) {
  const [view, setView]       = useState("today"); // "today" | "week"
  const [history, setHistory] = useState(loadHistory);
  const prevMood              = useRef(null);

  // Whenever mood changes — push a new entry
  useEffect(() => {
    if (!mood || mood === prevMood.current) return;
    prevMood.current = mood;

    const entry = { mood, time: new Date().toISOString() };
    const updated = [...loadHistory(), entry].slice(-200); // keep last 200
    saveHistory(updated);
    setHistory(updated);
  }, [mood]);

  // ── Today view data ───────────────────────────────────────────────────────
  const todayEntries = history.filter(e => e.time.slice(0, 10) === todayKey());

  // ── Week view data ────────────────────────────────────────────────────────
  const last7 = getLast7Days();
  const weekData = last7.map(day => {
    const entries = history.filter(e => e.time.slice(0, 10) === day);
    // dominant mood for the day
    const counts = entries.reduce((acc, e) => ({ ...acc, [e.mood]: (acc[e.mood] || 0) + 1 }), {});
    const dominant = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || null;
    const d = new Date(day);
    return { day: DAYS[d.getDay()], date: d.getDate(), dominant, count: entries.length };
  });

  const currentCfg = MOOD_CFG[mood] || MOOD_CFG.nutural;

  return (
    <>
      <style>{`
        .mg { box-sizing:border-box; font-family:'Outfit',sans-serif; }
        .mg * { box-sizing:border-box; }
        .mg-tabs { display:flex; gap:6px; margin-bottom:14px; }
        .mg-tab { flex:1; padding:6px 0; border-radius:8px; border:none; font-size:11px; font-weight:600;
          letter-spacing:.06em; cursor:pointer; transition:all .2s; text-transform:uppercase; }
        .mg-tab.on  { background:rgba(34,211,238,0.15); color:#22d3ee; border:1px solid rgba(34,211,238,0.3); }
        .mg-tab.off { background:rgba(255,255,255,0.04); color:#475569; border:1px solid transparent; }
        .mg-tab.off:hover { color:#94a3b8; background:rgba(255,255,255,0.07); }
        .mg-empty { text-align:center; color:#334155; font-size:12px; padding:28px 0; }

        /* today timeline */
        .mg-timeline { display:flex; flex-direction:column; gap:6px; max-height:168px; overflow-y:auto; scrollbar-width:thin; scrollbar-color:#1e293b transparent; }
        .mg-entry { display:flex; align-items:center; gap:10px; padding:7px 10px; border-radius:10px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); transition:background .15s; }
        .mg-entry:hover { background:rgba(255,255,255,0.06); }
        .mg-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
        .mg-entry-label { font-size:12px; font-weight:600; flex:1; }
        .mg-entry-time { font-size:10px; color:#475569; }

        /* week bars */
        .mg-week { display:flex; align-items:flex-end; justify-content:space-between; gap:6px; height:120px; }
        .mg-daycol { flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; }
        .mg-barwrap { flex:1; width:100%; display:flex; align-items:flex-end; justify-content:center; }
        .mg-bar { width:100%; border-radius:6px 6px 0 0; transition:height .4s ease, background .4s ease; min-height:4px; }
        .mg-dayname { font-size:9px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#334155; }
        .mg-dayemoji { font-size:14px; line-height:1; }
        .mg-today-badge { font-size:8px; color:#22d3ee; font-weight:700; letter-spacing:.1em; text-transform:uppercase; }
      `}</style>

      <div
        className="mg"
        style={{

          width: "100%",
          background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          padding: "18px 20px",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "#22d3ee", textTransform: "uppercase", margin: 0 }}>
              Mood History
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", margin: "3px 0 0" }}>
              {view === "today" ? "Today's Timeline" : "Last 7 Days"}
            </p>
          </div>
          {/* Live indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: currentCfg.color,
              boxShadow: `0 0 8px ${currentCfg.color}`,
              animation: "pulse 2s ease-in-out infinite",
            }} />
            <span style={{ fontSize: 10, color: currentCfg.color, fontWeight: 600 }}>LIVE</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mg-tabs">
          <button className={`mg-tab ${view === "today" ? "on" : "off"}`} onClick={() => setView("today")}>Today</button>
          <button className={`mg-tab ${view === "week"  ? "on" : "off"}`} onClick={() => setView("week")}>7 Days</button>
        </div>

        {/* ── Today view ──────────────────────────────────────────── */}
        {view === "today" && (
          todayEntries.length === 0
            ? <div className="mg-empty">No mood detected today yet</div>
            : <div className="mg-timeline">
                {[...todayEntries].reverse().map((e, i) => {
                  const cfg = MOOD_CFG[e.mood] || MOOD_CFG.nutural;
                  const t   = new Date(e.time);
                  const timeStr = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  return (
                    <div key={i} className="mg-entry">
                      <div className="mg-dot" style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.glow}` }} />
                      <span style={{ fontSize: 16 }}>{cfg.emoji}</span>
                      <span className="mg-entry-label" style={{ color: cfg.color }}>{cfg.label}</span>
                      <span className="mg-entry-time">{timeStr}</span>
                    </div>
                  );
                })}
              </div>
        )}

        {/* ── Week view ───────────────────────────────────────────── */}
        {view === "week" && (
          <div className="mg-week">
            {weekData.map((d, i) => {
              const cfg     = d.dominant ? MOOD_CFG[d.dominant] : null;
              const isToday = i === 6;
              const barH    = d.count > 0 ? Math.min(90, 20 + d.count * 14) : 4;
              return (
                <div key={d.day} className="mg-daycol">
                  <div style={{ fontSize: 10, color: cfg?.color || "#1e293b", fontWeight: 700, minHeight: 16 }}>
                    {d.count > 0 ? `×${d.count}` : ""}
                  </div>
                  <div className="mg-barwrap">
                    <div
                      className="mg-bar"
                      style={{
                        height: barH,
                        background: cfg
                          ? `linear-gradient(to top, ${cfg.color}, ${cfg.glow})`
                          : "rgba(255,255,255,0.06)",
                        boxShadow: cfg ? `0 0 12px ${cfg.glow}` : "none",
                      }}
                    />
                  </div>
                  <div className="mg-dayemoji">{cfg ? cfg.emoji : "·"}</div>
                  <div className="mg-dayname" style={{ color: isToday ? "#22d3ee" : "#334155" }}>{d.day}</div>
                  {isToday && <div className="mg-today-badge">now</div>}
                </div>
              );
            })}
          </div>
        )}

        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      </div>
    </>
  );
}