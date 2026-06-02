import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/datenschutz")({
  component: Datenschutz,
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung — FECG Dresden" },
      { name: "description", content: "Datenschutzerklärung gemäß DSGVO / BDSG der Freien Evangeliums-Christen-Gemeinde Dresden e.V." },
      { name: "robots", content: "index, follow" },
    ],
  }),
});

function Datenschutz() {
  const { t, lang } = useI18n();
  const isGerman = lang === "de";
  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner">
          <Link to="/">{t("legal.breadcrumbHome")}</Link> <span>/</span>{" "}
          <span className="crumb-here">{t("legal.datenschutzTitle")}</span>
        </div>
      </div>
      <section className="section section-white">
        <div className="container">
          <p className="label">DSGVO / BDSG</p>
          <h1 className="section-h" style={{ marginTop: 8, marginBottom: 24 }}>
            {t("legal.datenschutzTitle")}
          </h1>

          {!isGerman && (
            <div className="legal-translation-notice">
              {t("legal.translationNotice")}
            </div>
          )}

          {/* Legally binding text — must remain in German per DSGVO / BDSG */}
          <div className="confession-body" lang="de">
            <h2>1. Verantwortlicher</h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br />
              <strong>Freie Evangeliums-Christen-Gemeinde Dresden e.V.</strong><br />
              Altenberger Strasse 87, 01279 Dresden, Deutschland<br />
              E-Mail: <a href="mailto:info@fecg-dresden.de">info@fecg-dresden.de</a> · Tel.: <a href="tel:+493512530403">+49 351 253 04 03</a>
            </p>

            <h2>2. Allgemeines zur Datenverarbeitung</h2>
            <p>
              Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte erforderlich ist. Die Verarbeitung erfolgt regelmäßig nur nach Einwilligung des Nutzers (Art. 6 Abs. 1 lit. a DSGVO) oder soweit eine gesetzliche Grundlage besteht (Art. 6 Abs. 1 lit. b, c, f DSGVO).
            </p>

            <h2>3. Server-Log-Dateien</h2>
            <p>
              Der Provider der Seiten erhebt und speichert automatisch Informationen in Server-Log-Dateien, die Ihr Browser automatisch übermittelt: Browsertyp und -version, verwendetes Betriebssystem, Referrer-URL, Hostname, Uhrzeit der Serveranfrage, IP-Adresse. Eine Zusammenführung mit anderen Datenquellen erfolgt nicht. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
            </p>

            <h2>4. Cookies und Einwilligung (TTDSG / § 25)</h2>
            <p>
              Unsere Website setzt nicht-notwendige Cookies und vergleichbare Technologien nur nach ausdrücklicher Einwilligung des Nutzers über unseren Consent-Banner (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TTDSG). Technisch notwendige Cookies (z. B. zur Speicherung der Spracheinstellung und der Cookie-Einwilligung) werden auf Grundlage von § 25 Abs. 2 Nr. 2 TTDSG ohne Einwilligung verwendet. Sie können Ihre Einwilligung jederzeit für die Zukunft widerrufen, indem Sie die Cookie-Einstellungen erneut öffnen.
            </p>

            <h2>5. Kontaktformular und E-Mail-Kontakt</h2>
            <p>
              Bei Nutzung des Kontaktformulars oder einer E-Mail-Anfrage werden die übermittelten Daten (Name, E-Mail-Adresse, Nachricht) zur Bearbeitung Ihres Anliegens gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. b bzw. f DSGVO. Eine Weitergabe an Dritte erfolgt nicht.
            </p>

            <h2>6. Eingebundene Karten (OpenStreetMap)</h2>
            <p>
              Auf der Seite „Wie finden Sie uns" binden wir Karten von OpenStreetMap (OSMF, St John's Innovation Centre, Cowley Road, Cambridge CB4 0WS, UK) ein. Beim Aufruf werden technische Daten (u. a. IP-Adresse) an OSMF übertragen. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
            </p>

            <h2>7. Schriftarten (Bunny Fonts)</h2>
            <p>
              Wir setzen Bunny Fonts (BunnyWay d.o.o., Slowenien, EU) als datenschutzfreundliche, DSGVO-konforme Alternative zu Google Fonts ein. Schriftarten werden über einen EU-Server geladen; eine Profilbildung findet nicht statt.
            </p>

            <h2>8. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Außerdem steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu (Sächsischer Datenschutzbeauftragter).
            </p>

            <h2>9. SSL-Verschlüsselung</h2>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen eine SSL-/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie am „https://" in der Adresszeile Ihres Browsers.
            </p>

            <h2>10. Änderungen dieser Erklärung</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht.
            </p>
          </div>

          {!isGerman && (
            <p className="legal-binding-footer">{t("legalDisclaimer")}</p>
          )}
        </div>
      </section>
    </div>
  );
}
