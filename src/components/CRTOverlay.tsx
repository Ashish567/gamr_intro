import "./CRTOverlay.css";

export function CRTOverlay() {
  return (
    <div className="crt-overlay" aria-hidden>
      <div className="crt-overlay__scanlines" />
      <div className="crt-overlay__vignette" />
    </div>
  );
}
