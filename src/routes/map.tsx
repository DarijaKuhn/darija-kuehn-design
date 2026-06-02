import { createFileRoute, Link } from "@tanstack/react-router";
import churchBuilding from "@/assets/church-building.jpg.asset.json";
import { MapEmbed } from "@/components/MapEmbed";


export const Route = createFileRoute("/map")({
  component: MapPage,
  head: () => ({
    meta: [
      { title: "Как нас найти — FECG Dresden, Altenberger Str. 87" },
      { name: "description", content: "Адрес церкви: Altenberger Strasse 87, 01279 Dresden. Bus 87 (Liebenauer Strasse), Tram 1 & 2 (Marienberger Strasse), бесплатная парковка." },
    ],
  }),
});

function MapPage() {
  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">Главная</Link>
          <span>›</span>
          <span className="crumb-here">Как нас найти</span>
        </div>
      </div>

      <section className="map-section">
        <div className="map-section-content">
          <div className="container">
            <div className="label" style={{ color: "rgba(255,255,255,.7)", marginBottom: 12 }}>Как добраться</div>
            <h1 className="map-heading">Мы в Дрездене</h1>
            <p className="map-subhead">Altenberger Strasse 87 · 01279 Dresden</p>
            <figure className="map-building">
              <img src={churchBuilding.url} alt="Здание FECG Dresden — Altenberger Strasse 87" loading="lazy" />
              <figcaption>Freie Evangeliums-Christen-Gemeinde · Altenberger Str. 87</figcaption>
            </figure>
            <div className="map-grid">

              <div>
                <MapEmbed />
              </div>
              <div className="transport-list">
                <div className="transport-item">
                  <div className="transport-num">87</div>
                  <div>
                    <div className="transport-detail-label">Автобус</div>
                    <div className="transport-detail-val">Linie 87</div>
                    <div className="transport-detail-stop">Liebenauer Strasse</div>
                  </div>
                </div>
                <div className="transport-item">
                  <div className="transport-num" style={{ fontSize: 11 }}>1·2</div>
                  <div>
                    <div className="transport-detail-label">Трамвай</div>
                    <div className="transport-detail-val">Linie 1 &amp; 2</div>
                    <div className="transport-detail-stop">Marienberger Strasse</div>
                  </div>
                </div>
                <div className="transport-item">
                  <div className="transport-num" style={{ fontSize: 18 }}>P</div>
                  <div>
                    <div className="transport-detail-label">На машине</div>
                    <div className="transport-detail-val">Бесплатная парковка</div>
                    <div className="transport-detail-stop">Рядом с церковью</div>
                  </div>
                </div>
                <div className="transport-item">
                  <div className="transport-num" style={{ fontSize: 16 }}>☎</div>
                  <div>
                    <div className="transport-detail-label">Телефон</div>
                    <div className="transport-detail-val"><a href="tel:+493512530403" style={{ color: "var(--green)" }}>+49 351 253 04 03</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg></div>
              <div className="info-label">Адрес</div>
              <div className="info-val">Altenberger Strasse 87</div>
              <div className="info-sub">01279 Dresden, Sachsen</div>
            </div>
            <div className="info-card">
              <div className="info-icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></div>
              <div className="info-label">Телефон</div>
              <div className="info-val"><a href="tel:+493512530403">+49 351 253 04 03</a></div>
              <div className="info-sub">Звоните в любое время</div>
            </div>
            <div className="info-card">
              <div className="info-icon"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
              <div className="info-label">E-mail</div>
              <div className="info-val"><a href="mailto:info@fecg-dresden.de">info@fecg-dresden.de</a></div>
              <div className="info-sub">Напишите нам напрямую</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
