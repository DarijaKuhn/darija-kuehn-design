import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/impressum")({
  component: Impressum,
  head: () => ({
    meta: [
      { title: "Impressum — FECG Dresden" },
      { name: "description", content: "Impressum / Anbieterkennzeichnung gemäß § 5 TMG für die Freie Evangeliums-Christen-Gemeinde Dresden e.V." },
      { name: "robots", content: "index, follow" },
    ],
  }),
});

function Impressum() {
  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner">
          <Link to="/">Startseite</Link> <span>/</span> <span className="crumb-here">Impressum</span>
        </div>
      </div>
      <section className="section section-white">
        <div className="container">
          <p className="label">§ 5 TMG</p>
          <h1 className="section-h" style={{ marginTop: 8, marginBottom: 24 }}>Impressum</h1>

          <div className="confession-body">
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              <strong>Freie Evangeliums-Christen-Gemeinde Dresden e.V.</strong><br />
              Altenberger Strasse 87<br />
              01279 Dresden<br />
              Deutschland
            </p>

            <h2>Vertreten durch</h2>
            <p>
              Vorstand: <em>[Vorname Nachname, Position]</em><br />
              <em>[Vorname Nachname, Position]</em>
            </p>

            <h2>Kontakt</h2>
            <p>
              Telefon: <a href="tel:+493512530403">+49 351 253 04 03</a><br />
              E-Mail: <a href="mailto:info@fecg-dresden.de">info@fecg-dresden.de</a><br />
              Web: <a href="https://propovednik.my1.ru" target="_blank" rel="noreferrer">propovednik.my1.ru</a>
            </p>

            <h2>Registereintrag</h2>
            <p>
              Eintragung im Vereinsregister.<br />
              Registergericht: <em>[Amtsgericht Dresden]</em><br />
              Registernummer: <em>VR [Nummer eintragen]</em>
            </p>

            <h2>Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
              <em>[falls vorhanden — sonst entfernen]</em>
            </p>

            <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>
              <em>[Vorname Nachname]</em><br />
              Altenberger Strasse 87, 01279 Dresden
            </p>

            <h2>Haftungsausschluss</h2>
            <p>
              <strong>Haftung für Inhalte:</strong> Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
            </p>
            <p>
              <strong>Haftung für Links:</strong> Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
            </p>
            <p>
              <strong>Urheberrecht:</strong> Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
