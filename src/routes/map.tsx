import { createFileRoute, Link } from "@tanstack/react-router";
const churchBuilding = { url: "https://freieevangeliums-dresden.de/uploads/assets/___________f306492b.jpg" };
import { MapEmbed } from "@/components/MapEmbed";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/map")({
  component: MapPage,
  head: () => ({
    meta: [
      { title: "Anfahrt — FECG Dresden, Altenberger Str. 87" },
      { name: "description", content: "Adresse: Altenberger Strasse 87, 01279 Dresden. Bus 87 (Liebenauer Strasse), Tram 1 & 2 (Marienberger Strasse), kostenlose Parkplätze." },
    ],
  }),
});

function MapPage() {
  const { t } = useI18n();
  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">{t("legal.breadcrumbHome")}</Link>
          <span>›</span>
          <span className="crumb-here">{t("pages.map.crumb")}</span>
        </div>
      </div>

      <section className="map-section">
        <div className="map-section-content">
          <div className="container">
            <div className="label" style={{ marginBottom: 12 }}>{t("pages.map.eyebrow")}</div>
            <h1 className="map-heading">{t("pages.map.h1")}</h1>
            <p className="map-subhead">{t("pages.map.subhead")}</p>
            <figure className="map-building">
              <img src={churchBuilding.url} alt={t("hero.imgAlt")} loading="lazy" />
              <figcaption>{t("pages.map.figcaption")}</figcaption>
            </figure>
            <div className="map-grid">

              <div>
                <MapEmbed />
              </div>
              <div className="transport-list">
                <div className="transport-item">
                  <div className="transport-num">87</div>
                  <div>
                    <div className="transport-detail-label">{t("pages.map.bus")}</div>
                    <div className="transport-detail-val">Linie 87</div>
                    <div className="transport-detail-stop">{t("pages.map.busStop")}</div>
                  </div>
                </div>
                <div className="transport-item">
                  <div className="transport-num" style={{ fontSize: 11 }}>1·2</div>
                  <div>
                    <div className="transport-detail-label">{t("pages.map.tram")}</div>
                    <div className="transport-detail-val">Linie 1 &amp; 2</div>
                    <div className="transport-detail-stop">{t("pages.map.tramStop")}</div>
                  </div>
                </div>
                <div className="transport-item">
                  <div className="transport-num" style={{ fontSize: 18 }}>P</div>
                  <div>
                    <div className="transport-detail-label">{t("pages.map.car")}</div>
                    <div className="transport-detail-val">{t("pages.map.carVal")}</div>
                    <div className="transport-detail-stop">{t("pages.map.carSub")}</div>
                  </div>
                </div>
                <div className="transport-item">
                  <div className="transport-num"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></div>
                  <div>
                    <div className="transport-detail-label">{t("pages.map.phone")}</div>
                    <div className="transport-detail-val"><a href="tel:+4915905316414" style={{ color: "var(--green)" }}>+49 159 05316414</a></div>
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
              <div className="info-label">{t("pages.map.addressLabel")}</div>
              <div className="info-val">{t("pages.map.addressVal1")}</div>
              <div className="info-sub">{t("pages.map.addressVal2")}</div>
            </div>
            <div className="info-card">
              <div className="info-icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></div>
              <div className="info-label">{t("pages.map.phone")}</div>
              <div className="info-val"><a href="tel:+4915905316414">+49 159 05316414</a></div>
              <div className="info-sub">{t("pages.map.phoneSub")}</div>
            </div>
            <div className="info-card">
              <div className="info-icon"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
              <div className="info-label">{t("pages.map.emailLabel")}</div>
              <div className="info-val"><a href="mailto:kontakt@freieevangeliums-dresden.de">kontakt@freieevangeliums-dresden.de</a></div>
              <div className="info-sub">{t("pages.map.emailSub")}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
