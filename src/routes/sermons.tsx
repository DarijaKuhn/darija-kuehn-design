import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/sermons")({
  component: Sermons,
  head: () => ({
    meta: [
      { title: "Проповеди — Аудиоархив FECG Dresden" },
      { name: "description", content: "Слушайте записи воскресных богослужений и библейских занятий нашей общины на propovednik.my1.ru." },
    ],
  }),
});

function Sermons() {
  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">Главная</Link>
          <span>›</span>
          <span className="crumb-here">Проповеди</span>
        </div>
      </div>
      <section className="section section-white">
        <div className="container">
          <div className="audio-row">
            <div>
              <div className="label" style={{ marginBottom: 8 }}>Аудио</div>
              <h1 className="section-h" style={{ marginBottom: 14 }}>Проповеди</h1>
              <p className="body-lg" style={{ maxWidth: 520, marginBottom: 24 }}>
                Слушайте записи воскресных богослужений и библейских занятий нашей общины на сайте propovednik.my1.ru
              </p>
              <a href="https://propovednik.my1.ru/load" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Слушать проповеди →
              </a>
            </div>
            <div className="audio-right">
              <div className="audio-play-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M10 8l6 4-6 4V8z" fill="#2a5c27" /></svg>
              </div>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 14 }}>
                Архив проповедей<br />на нашем сайте
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
