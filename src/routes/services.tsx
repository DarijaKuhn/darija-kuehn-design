import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/services")({
  component: Services,
  head: () => ({
    meta: [
      { title: "Богослужения — FECG Dresden" },
      { name: "description", content: "Расписание богослужений и ближайшие события в церкви FECG Dresden. Воскресенье 10:00, среда 18:00, пятница 18:00." },
    ],
  }),
});

const events = [
  { day: "07", mon: "Дек", title: "Воскресное богослужение", time: "Вс · 10:00 · общее собрание" },
  { day: "10", mon: "Дек", title: "Молитвенное служение", time: "Ср · 18:00" },
  { day: "12", mon: "Дек", title: "Изучение Библии", time: "Пт · 18:00" },
  { day: "14", mon: "Дек", title: "Воскресное богослужение", time: "Вс · 10:00 · с причастием" },
  { day: "20", mon: "Дек", title: "Молодёжное общение", time: "Сб · 13:30 · по договорённости" },
  { day: "24", mon: "Дек", title: "Сочельник — праздничное служение", time: "Ср · 18:00" },
];

function Services() {
  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">Главная</Link>
          <span>›</span>
          <span className="crumb-here">Богослужения</span>
        </div>
      </div>

      <section className="section section-bg">
        <div className="container">
          <div className="label" style={{ marginBottom: 8 }}>Расписание</div>
          <h1 className="section-h">Богослужения и события</h1>
          <p className="body-lg" style={{ marginTop: 12, maxWidth: 680 }}>
            Воскресное богослужение — главное собрание недели. В будни проходят молитвенные служения,
            изучение Библии и общение для молодёжи.
          </p>

          <div className="events-grid">
            {events.map((e, i) => (
              <div key={i} className="event-card">
                <div className="event-badge">
                  <div className="event-badge-day">{e.day}</div>
                  <div className="event-badge-mon">{e.mon}</div>
                </div>
                <div>
                  <div className="event-title">{e.title}</div>
                  <div className="event-time">{e.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="quote-block">
        <p className="quote-text">«Как прекрасны ноги благовествующих мир, <em>благовествующих благое!</em>»</p>
        <p className="quote-ref">Послание к Римлянам 10:15</p>
      </div>
    </div>
  );
}
