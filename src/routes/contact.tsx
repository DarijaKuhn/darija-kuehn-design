import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [{ title: "Контакт — Евангельские Христиане Дрезден" }] }),
});

function Contact() {
  return (
    <main className="page-wrap">
      <Link to="/" className="back-home"><span className="ar">←</span> На главную</Link>
      <div className="page-eyebrow">Контакт</div>
      <h1 className="page-h1">Приходите <em>в гости</em></h1>
      <p className="page-lead">
        Будем рады встретить вас на ближайшем богослужении. По любым вопросам — пишите или звоните.
      </p>

      <div className="contact-rows">
        <div className="crow"><div className="ic">⌂</div><div><div className="lab">Адрес</div><div className="val">Altenberger Strasse 87, 01279 Dresden</div></div></div>
        <div className="crow"><div className="ic">☎</div><div><div className="lab">Телефон</div><a className="val" href="tel:+4903512530403">+49 (0) 351 253 04 03</a></div></div>
        <div className="crow"><div className="ic">✉</div><div><div className="lab">Сайт</div><a className="val" href="https://propovednik.my1.ru" target="_blank" rel="noreferrer">propovednik.my1.ru</a></div></div>
        <div className="crow"><div className="ic">🚌</div><div><div className="lab">Транспорт</div><div className="val">Bus 87 · Strassenbahn 1 & 2 · бесплатная парковка</div></div></div>
      </div>

      <div className="map-box">
        <iframe
          title="Karte"
          src="https://www.openstreetmap.org/export/embed.html?bbox=13.825%2C50.998%2C13.855%2C51.018&layer=mapnik&marker=51.008%2C13.840"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
    </main>
  );
}
