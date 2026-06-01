import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
  head: () => ({
    meta: [
      { title: "Фотоальбом — Наша жизнь в фотографиях — FECG Dresden" },
      { name: "description", content: "Фотографии из жизни общины FECG Dresden: пение гимнов, изучение Библии, воскресная школа, праздник Жатвы и совместный отдых." },
    ],
  }),
});

const photos = [
  { src: "https://propovednik.my1.ru/_ph/2/929144416.jpg", caption: "Пение гимнов" },
  { src: "https://propovednik.my1.ru/_ph/2/265012383.jpg", caption: "Слово Божие" },
  { src: "https://propovednik.my1.ru/_ph/2/938507766.jpg", caption: "Воскресная школа" },
  { src: "https://propovednik.my1.ru/_ph/2/156270282.jpg", caption: "Братское приветствие" },
  { src: "https://propovednik.my1.ru/_ph/1/828782037.jpg", caption: "Совместный отдых" },
  { src: "https://propovednik.my1.ru/_ph/2/279078373.jpg", caption: "Праздник Жатвы" },
];

function Gallery() {
  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">Главная</Link>
          <span>›</span>
          <span className="crumb-here">Фотографии</span>
        </div>
      </div>
      <section className="section section-bg">
        <div className="container">
          <div className="label" style={{ marginBottom: 8 }}>Фотоальбом</div>
          <h1 className="section-h">Наша жизнь в фотографиях</h1>
          <div className="gallery-grid">
            {photos.map((p) => (
              <div className="gallery-item" key={p.src}>
                <img src={p.src} alt={`${p.caption} — FECG Dresden`} loading="lazy" />
                <div className="gallery-caption">{p.caption}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <a href="https://propovednik.my1.ru/photo" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              Все фотографии →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
