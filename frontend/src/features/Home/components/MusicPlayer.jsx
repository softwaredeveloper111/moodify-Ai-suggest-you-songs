import { useState, useRef, useEffect, useCallback } from "react";


// ─── Icons ────────────────────────────────────────────────────────────────────
const Play  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M8 5v14l11-7z"/></svg>;
const Pause = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;
const Prev  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>;
const Next  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 18l8.5-6L6 6v12zM16 6h2v12h-2z"/></svg>;
const Shuffle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="15" height="15">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
  </svg>
);
const Repeat = ({ mode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="15" height="15">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"/>
    {mode === "one" && <text x="8.5" y="14" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">1</text>}
  </svg>
);
const Heart = ({ on }) => (
  <svg viewBox="0 0 24 24" fill={on ? "#ef4444" : "none"} stroke={on ? "#ef4444" : "currentColor"} strokeWidth="2" width="16" height="16">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);
const VolIcon = ({ muted, v }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    {muted || v === 0
      ? <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>
      : v < 0.5
      ? <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
      : <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    }
  </svg>
);

function formatTime(s) {
  if (isNaN(s) || s === Infinity) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}



// ─────────────────────────────────────────────────────────────────────────────
// Props (from Home):
//   songs, moodColors        — data
//   idx, setIdx              — which song is active
//   playing, setPlaying      — play/pause state
//   imgErr, setImgErr        — broken image tracking
// ─────────────────────────────────────────────────────────────────────────────
export default function MusicPlayer({ songs, moodColors, idx, setIdx, playing, setPlaying, imgErr, setImgErr }) {

  // Audio-only state — PlayListItem doesn't need any of these
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume]     = useState(0.8);
  const [muted, setMuted]       = useState(false);
  const [shuffle, setShuffle]   = useState(false);
  const [repeat, setRepeat]     = useState("none"); // "none" | "all" | "one"
  const [liked, setLiked]       = useState({});
  const [loading, setLoading]   = useState(false);
  const [hoverT, setHoverT]     = useState(null);

  const audioRef = useRef(null);
  const seekRef  = useRef(null);
  const volRef   = useRef(null);

  const song   = songs[idx];
const colors = moodColors[song.mood] || moodColors.nutural;

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    setLoading(true); setProgress(0); setDuration(0);
    a.src = song.url; a.load();
    if (playing) a.play().catch(() => {});
  }, [idx]);

  const onTime  = useCallback(() => { if (audioRef.current) setProgress(audioRef.current.currentTime); }, []);
  const onMeta  = useCallback(() => { setDuration(audioRef.current.duration); setLoading(false); if (playing) audioRef.current.play().catch(() => {}); }, [playing]);
  const onEnded = useCallback(() => {
    if (repeat === "one") { audioRef.current.currentTime = 0; audioRef.current.play(); return; }
    const n = shuffle ? Math.floor(Math.random() * songs.length) : (idx + 1) % songs.length;
    setIdx(n); setPlaying(true);
  }, [repeat, idx, shuffle, songs.length, setIdx, setPlaying]);

  useEffect(() => {
    const a = audioRef.current;
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnded);
    };
  }, [onTime, onMeta, onEnded]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().catch(() => {}); setPlaying(true); }
  };
  const goPrev = () => {
    if (audioRef.current?.currentTime > 3) { audioRef.current.currentTime = 0; return; }
    setIdx(p => (p - 1 + songs.length) % songs.length); setPlaying(true);
  };
  const goNext = () => {
    setIdx(shuffle ? Math.floor(Math.random() * songs.length) : (idx + 1) % songs.length);
    setPlaying(true);
  };
  const seek = (e) => {
    const r = seekRef.current.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * duration;
    audioRef.current.currentTime = t; setProgress(t);
  };
  const changeVol = (e) => {
    const r = volRef.current.getBoundingClientRect();
    setVolume(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))); setMuted(false);
  };

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        .mp * { box-sizing: border-box; font-family: 'Outfit', sans-serif; }

        /* ── Glass container: row on desktop, column on mobile ── */
        .mp-glass {
          width: 100%; height: 100%;
          background: rgba(5,5,18,0.32);
          backdrop-filter: blur(3px);
          border-radius: 16px;
          display: flex;
          flex-direction: row;
          align-items: stretch;
          padding: clamp(12px, 3vw, 18px) clamp(14px, 3.5vw, 22px);
          gap: clamp(12px, 3vw, 18px);
        }

        /* ── Cover: fixed width on desktop, full-width square on mobile ── */
        .mp-cover {
          width: clamp(100px, 28%, 210px);
          flex-shrink: 0;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 8px 28px rgba(0,0,0,0.45);
          /* keep it square */
          aspect-ratio: 1 / 1;
          align-self: center;
        }
        .mp-cover img { width:100%;height:100%;object-fit:cover;display:block;transition:transform 7s ease; }
        .mp-cover img.spin { transform:scale(1.07); }
        .mp-cover-fb { width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:clamp(32px,8vw,52px); }
        .mp-load-ov { position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center; }
        .mp-spin { width:26px;height:26px;border:3px solid rgba(255,255,255,0.15);border-top-color:white;border-radius:50%;animation:mps 0.7s linear infinite; }
        @keyframes mps { to { transform:rotate(360deg); } }

        /* ── Right panel ── */
        .mp-right { flex:1;display:flex;flex-direction:column;justify-content:space-between;min-width:0;padding:2px 0;gap: clamp(6px, 1.5vw, 0px); }
        .mp-toprow { display:flex;align-items:center;justify-content:space-between;gap:8px; }
        .mp-badge { font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:3px 10px;border-radius:100px;background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.25); }
        .mp-like { background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.55);padding:3px;display:flex;align-items:center;transition:transform .2s,color .2s; }
        .mp-like:hover { transform:scale(1.25);color:#ef4444; }
        .mp-title { font-size:clamp(13px, 3.5vw, 15px);font-weight:600;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 8px rgba(0,0,0,0.4); }
        .mp-artist { font-size:clamp(11px, 2.8vw, 12px);color:rgba(255,255,255,0.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px; }

        /* ── Seek bar ── */
        .mp-seek { cursor:pointer; }
        .mp-seektrack { height:4px;background:rgba(255,255,255,0.18);border-radius:100px;position:relative;transition:height .15s; }
        .mp-seek:hover .mp-seektrack { height:6px; }
        .mp-seekfill { height:100%;border-radius:100px;background:white;position:relative;transition:width .1s linear; }
        .mp-seekthumb { position:absolute;right:-5px;top:50%;transform:translateY(-50%);width:11px;height:11px;background:white;border-radius:50%;opacity:0;transition:opacity .15s;box-shadow:0 0 6px rgba(0,0,0,0.3); }
        .mp-seek:hover .mp-seekthumb { opacity:1; }
        .mp-seektip { position:absolute;bottom:9px;transform:translateX(-50%);background:rgba(0,0,0,0.72);color:white;font-size:10px;padding:2px 6px;border-radius:5px;pointer-events:none;white-space:nowrap; }
        .mp-seektimes { display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,0.45);margin-top:4px;font-variant-numeric:tabular-nums; }

        /* ── Controls ── */
        .mp-controls { display:flex;align-items:center;justify-content:space-between; }
        .mp-ic { background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.5);display:flex;align-items:center;justify-content:center;padding:5px;border-radius:50%;transition:color .15s,transform .15s;position:relative; }
        .mp-ic:hover { color:white;transform:scale(1.1); }
        .mp-ic.on { color:white; }
        .mp-ic.on::after { content:'';position:absolute;bottom:-2px;left:50%;transform:translateX(-50%);width:4px;height:4px;background:white;border-radius:50%; }
        .mp-nav { background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;padding:7px;border-radius:50%;transition:color .15s,transform .15s; }
        .mp-nav:hover { color:white;transform:scale(1.1); }
        .mp-nav:active { transform:scale(0.93); }
        .mp-playbtn { width:clamp(40px,10vw,48px);height:clamp(40px,10vw,48px);border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;background:white;color:#111827;box-shadow:0 4px 18px rgba(0,0,0,0.35);transition:transform .15s,box-shadow .15s; }
        .mp-playbtn:hover { transform:scale(1.07);box-shadow:0 6px 26px rgba(0,0,0,0.45); }
        .mp-playbtn:active { transform:scale(0.95); }

        /* ── Volume ── */
        .mp-vol { display:flex;align-items:center;gap:8px; }
        .mp-volic { background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.5);display:flex;align-items:center;transition:color .15s;flex-shrink:0; }
        .mp-volic:hover { color:white; }
        .mp-voltrack { flex:1;height:3px;background:rgba(255,255,255,0.18);border-radius:100px;cursor:pointer;transition:height .15s; }
        .mp-voltrack:hover { height:5px; }
        .mp-volfill { height:100%;border-radius:100px;background:rgba(255,255,255,0.65); }
        .mp-volnum { font-size:11px;color:rgba(255,255,255,0.4);min-width:26px;text-align:right; }

        /* ── Mobile: stack vertically ── */
        @media (max-width: 480px) {
          .mp-glass {
            flex-direction: column;
            align-items: center;
            padding: 16px;
            gap: 14px;
          }
          .mp-cover {
            width: 56%;
            max-width: 180px;
            align-self: center;
          }
          .mp-right {
            width: 100%;
            gap: 10px;
          }
          .mp-vol {
            /* hide vol number on very small screens to save space */
          }
        }

        /* ── Narrow but not tiny (481–600px) ── */
        @media (min-width: 481px) and (max-width: 600px) {
          .mp-cover {
            width: clamp(90px, 22%, 130px);
          }
        }
      `}</style>

      <audio ref={audioRef} />

      <div
        className="upper music-player current-mood mp w-full "
        style={{ background:"linear-gradient(to right, #c4b5fd, #67e8f9)", opacity:0.9, borderRadius:"16px", position:"relative", overflow:"hidden", flexShrink:0 }}
      >
        <div className="mp-glass">
          <div className="mp-cover">
            {!imgErr[song._id] ? (
              <img key={song._id} src={song.posterUrl} className={playing ? "spin" : ""} alt={song.title}
                onError={() => setImgErr(p => ({ ...p, [song._id]: true }))} />
            ) : (
              <div className="mp-cover-fb" style={{ background: `linear-gradient(135deg,${colors.from},${colors.to})` }}>🎵</div>
            )}
            {loading && <div className="mp-load-ov"><div className="mp-spin" /></div>}
          </div>

          <div className="mp-right">
            <div className="mp-toprow">
              <span className="mp-badge">{song.mood}</span>
              <button className="mp-like" onClick={() => setLiked(p => ({ ...p, [song._id]: !p[song._id] }))}>
                <Heart on={!!liked[song._id]} />
              </button>
            </div>
            <div>
              <div className="mp-title" title={song.title}>{song.title}</div>
              <div className="mp-artist">{song.artist}</div>
            </div>
            <div className="mp-seek" ref={seekRef}
              onClick={seek}
              onMouseMove={e => { const r = seekRef.current.getBoundingClientRect(); setHoverT(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * duration); }}
              onMouseLeave={() => setHoverT(null)}
            >
              <div className="mp-seektrack">
                <div className="mp-seekfill" style={{ width: `${pct}%` }}>
                  <div className="mp-seekthumb" />
                </div>
                {hoverT !== null && <div className="mp-seektip" style={{ left: `${(hoverT / duration) * 100}%` }}>{formatTime(hoverT)}</div>}
              </div>
              <div className="mp-seektimes"><span>{formatTime(progress)}</span><span>{formatTime(duration)}</span></div>
            </div>
            <div className="mp-controls">
              <button className={`mp-ic${shuffle ? " on" : ""}`} onClick={() => setShuffle(s => !s)}><Shuffle /></button>
              <button className="mp-nav" onClick={goPrev}><Prev /></button>
              <button className="mp-playbtn" onClick={togglePlay}>{playing ? <Pause /> : <Play />}</button>
              <button className="mp-nav" onClick={goNext}><Next /></button>
              <button className={`mp-ic${repeat !== "none" ? " on" : ""}`} onClick={() => setRepeat(r => r === "none" ? "all" : r === "all" ? "one" : "none")}><Repeat mode={repeat} /></button>
            </div>
            <div className="mp-vol">
              <button className="mp-volic" onClick={() => setMuted(m => !m)}><VolIcon muted={muted} v={volume} /></button>
              <div className="mp-voltrack" ref={volRef} onClick={changeVol}>
                <div className="mp-volfill" style={{ width: `${muted ? 0 : volume * 100}%` }} />
              </div>
              <span className="mp-volnum">{muted ? 0 : Math.round(volume * 100)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}