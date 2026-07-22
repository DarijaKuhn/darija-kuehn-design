import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/barrierefreiheit")({
  component: Barrierefreiheit,
  head: () => ({
    meta: [
      { title: "Barrierefreiheitserklärung — FECG Dresden" },
      {
        name: "description",
        content:
          "Erklärung zur digitalen Barrierefreiheit gemäß Barrierefreiheitsstärkungsgesetz (BFSG) und WCAG 2.1 AA für die Website der Freien Evangeliums-Christen-Gemeinde Dresden e.V.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Barrierefreiheitserklärung — FECG Dresden" },
      {
        property: "og:description",
        content: "Erklärung zur digitalen Barrierefreiheit gemäß BFSG / WCAG 2.1 AA.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://freieevangeliums-dresden.de/barrierefreiheit" },
    ],
  }),
});

function Barrierefreiheit() {
  const { t } = useI18n();
  const lastUpdate = "22. Juli 2026";

  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner">
          <Link to="/">{t("legal.breadcrumbHome")}</Link> <span>/</span>{" "}
          <span className="crumb-here">Barrierefreiheitserklärung</span>
        </div>
      </div>

      <section className="section section-white">
        <div className="container">
          <p className="label">§ 14 BFSG · WCAG 2.1 AA</p>
          <h1 className="section-h" style={{ marginTop: 8, marginBottom: 12 }}>
            Erklärung zur Barrierefreiheit
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: 20 }}>
            Die Freie Evangeliums-Christen-Gemeinde Dresden e.V. ist bemüht, ihre Website
            im Einklang mit dem Barrierefreiheitsstärkungsgesetz (BFSG) und der
            Barrierefreie-Informationstechnik-Verordnung (BITV 2.0) auf Grundlage der
            Web Content Accessibility Guidelines (WCAG) 2.1 Konformitätsstufe AA
            barrierefrei zugänglich zu machen.
          </p>

          <div className="confession-body" lang="de">
            <h2>1. Geltungsbereich</h2>
            <p>
              Diese Erklärung gilt für die unter{" "}
              <a href="https://freieevangeliums-dresden.de">
                https://freieevangeliums-dresden.de
              </a>{" "}
              veröffentlichte Website der Freien Evangeliums-Christen-Gemeinde Dresden e.V.
            </p>

            <h2>2. Stand der Vereinbarkeit mit den Anforderungen</h2>
            <p>
              Die Website ist mit den Anforderungen der WCAG 2.1 Stufe AA{" "}
              <strong>teilweise vereinbar</strong>. Die nachstehend aufgeführten
              Inhalte sind aus den ebenfalls genannten Gründen nicht barrierefrei.
            </p>

            <h2>3. Nicht barrierefreie Inhalte</h2>
            <p>
              Folgende Inhalte sind aus den nachfolgenden Gründen nicht bzw. nicht
              vollständig barrierefrei:
            </p>
            <ul>
              <li>
                <strong>Eingebettete Karte (OpenStreetMap):</strong> Die interaktive
                Karte auf der Seite „Anfahrt" ist für Nutzer von Screenreadern nur
                eingeschränkt bedienbar. Alle relevanten Informationen (Adresse,
                Anfahrt, ÖPNV) sind zusätzlich als Text verfügbar.
              </li>
              <li>
                <strong>PDF-Dokumente und historische Medien:</strong> Ältere
                hochgeladene Dokumente, Predigt-Audiodateien und Fotografien verfügen
                teilweise nicht über vollständige Transkripte, Untertitel oder
                Alternativtexte. Neue Inhalte werden fortlaufend barrierefrei
                aufbereitet.
              </li>
              <li>
                <strong>Video-Hintergrund:</strong> Das dekorative Video im
                Kopfbereich ist stumm, läuft automatisch mit reduzierter
                Wiedergabegeschwindigkeit und ist per <code>aria-hidden</code> vor
                Screenreadern verborgen. Nutzer können in ihren
                Betriebssystem-Einstellungen „reduzierte Bewegung" (prefers-reduced-motion)
                aktivieren.
              </li>
            </ul>

            <h2>4. Umgesetzte Maßnahmen</h2>
            <ul>
              <li>Semantisches HTML5 mit klarer Überschriftenstruktur (H1–H3).</li>
              <li>Sichtbare Fokus-Markierungen für Tastaturnavigation.</li>
              <li>Alternativtexte für inhaltstragende Bilder, <code>aria-label</code> für Icon-Buttons.</li>
              <li>Kontrastverhältnisse gemäß WCAG 2.1 AA (mind. 4,5:1 für Text).</li>
              <li>Responsive Darstellung ab 320 px Breite, Zoom bis 200 % ohne Informationsverlust.</li>
              <li>Formulare mit sichtbaren Labels und Fehlermeldungen.</li>
              <li>Website vollständig ohne Maus bedienbar (Tastatur-Navigation).</li>
              <li>Mehrsprachige Auszeichnung (<code>lang</code>-Attribut) für 12 Sprachen.</li>
              <li>Cookie-Consent-Dialog vor jeglicher Datenverarbeitung, DSGVO-konform.</li>
            </ul>

            <h2>5. Erstellung dieser Erklärung</h2>
            <p>
              Diese Erklärung wurde am <strong>{lastUpdate}</strong> erstellt bzw.
              zuletzt aktualisiert. Die Bewertung beruht auf einer Selbsteinschätzung
              durch den Betreiber sowie einer strukturierten Prüfung des Quellcodes
              anhand der WCAG 2.1 AA Checkliste.
            </p>

            <h2>6. Feedback und Kontaktangaben</h2>
            <p>
              Sind Ihnen Mängel bei der barrierefreien Zugänglichkeit aufgefallen?
              Möchten Sie uns diesbezüglich Informationen zukommen lassen oder
              Inhalte in einer zugänglichen Form anfordern? Dann wenden Sie sich
              bitte an:
            </p>
            <p>
              Freie Evangeliums-Christen-Gemeinde Dresden e.V.<br />
              z. Hd. Vorstand<br />
              Altenberger Straße 87, 01279 Dresden<br />
              E-Mail:{" "}
              <a href="mailto:kontakt@freieevangeliums-dresden.de">
                kontakt@freieevangeliums-dresden.de
              </a>
              <br />
              Telefon: <a href="tel:+4915905316414">+49 159 05316414</a>
            </p>

            <h2>7. Durchsetzungsverfahren</h2>
            <p>
              Sollten auch nach Ihrem Hinweis an den oben genannten Kontakt keine
              zufriedenstellenden Lösungen gefunden werden, können Sie sich an die
              zuständige Durchsetzungs- bzw. Schlichtungsstelle wenden:
            </p>
            <p>
              <strong>Sächsische Landesbeauftragte für Inklusion der Menschen mit Behinderungen</strong>
              <br />
              Albertstraße 10, 01097 Dresden<br />
              E-Mail:{" "}
              <a href="mailto:inklusion@sk.sachsen.de">inklusion@sk.sachsen.de</a>
            </p>
            <p>
              <strong>Schlichtungsstelle nach § 16 BGG</strong>
              <br />
              bei dem Beauftragten der Bundesregierung für die Belange von Menschen
              mit Behinderungen<br />
              Mauerstraße 53, 10117 Berlin<br />
              E-Mail:{" "}
              <a href="mailto:info@schlichtungsstelle-bgg.de">
                info@schlichtungsstelle-bgg.de
              </a>
              <br />
              Web:{" "}
              <a
                href="https://www.schlichtungsstelle-bgg.de"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.schlichtungsstelle-bgg.de
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
