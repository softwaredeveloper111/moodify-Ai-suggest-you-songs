import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Props (from Home):
//   songs, moodColors        — data
//   idx, setIdx              — which song is active
//   playing, setPlaying      — play/pause state
//   imgErr, setImgErr        — broken image tracking
// ─────────────────────────────────────────────────────────────────────────────
const PlayListItem = ({ songs, moodColors, idx, setIdx, playing, setPlaying, imgErr, setImgErr }) => {
  return (
    <>
      <style>{`
        .pl * { box-sizing: border-box; font-family: 'Outfit', sans-serif; }
        .pl-header { font-size:14px;font-weight:600;color:#111827;margin-bottom:10px;display:flex;align-items:center;gap:6px; }
        .pl-spark { color:#0794AD;font-size:18px; }
        .pl-item { display:flex;align-items:center;gap:10px;padding:5px 6px;border-radius:8px;cursor:pointer;transition:background .15s; }
        .pl-item:hover { background:rgba(0,0,0,0.07); }
        .pl-item.act { background:rgba(7,148,173,0.12); }
        .pl-num { font-size:11px;color:rgba(0,0,0,0.28);width:16px;text-align:center;flex-shrink:0; }
        .pl-thumb { width:32px;height:32px;border-radius:6px;object-fit:cover;flex-shrink:0;background:#ccc; }
        .pl-info { flex:1;min-width:0; }
        .pl-name { font-size:12px;font-weight:500;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .pl-item.act .pl-name { color:#0794AD; }
        .pl-artist { font-size:11px;color:rgba(0,0,0,0.38);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .pl-bars { display:flex;gap:2px;align-items:flex-end;height:14px;flex-shrink:0; }
        .pl-bar { width:3px;background:#0794AD;border-radius:2px;animation:plb .7s ease infinite alternate; }
        .pl-bar:nth-child(1){height:5px;animation-delay:0s}
        .pl-bar:nth-child(2){height:11px;animation-delay:.2s}
        .pl-bar:nth-child(3){height:7px;animation-delay:.4s}
        @keyframes plb { from{transform:scaleY(0.35)} to{transform:scaleY(1)} }
      `}</style>

      <div
        className="playlist pl"
        style={{ width:"490px", height:"80vh", background:"#e4e4e7", borderRadius:"10px", padding:"16px 28px", overflowY:"auto", scrollbarWidth:"thin" }}
      >
        <div className="pl-header">
          <span className="pl-spark">✦</span>
          AI Recommended Playlist for you
        </div>

        {songs.map((s, i) => (
          <div
            key={s._id}
            className={`pl-item${i === idx ? " act" : ""}`}
            onClick={() => { setIdx(i); setPlaying(true); }}
          >
            <span className="pl-num">{i + 1}</span>

            {!imgErr[s._id] ? (
              <img
                src={s.posterUrl}
                className="pl-thumb"
                alt={s.title}
                onError={() => setImgErr(p => ({ ...p, [s._id]: true }))}
              />
            ) : (
              <div
                className="pl-thumb"
                style={{ background: `linear-gradient(135deg,${moodColors[s.mood]?.from || "#999"},${moodColors[s.mood]?.to || "#555"})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}
              >
                🎵
              </div>
            )}

            <div className="pl-info">
              <div className="pl-name">{s.title}</div>
              <div className="pl-artist">{s.artist.split(",")[0]}</div>
            </div>

            {/* Animated bars only when this song is active AND playing */}
            {i === idx && playing && (
              <div className="pl-bars">
                <div className="pl-bar" />
                <div className="pl-bar" />
                <div className="pl-bar" />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default PlayListItem;