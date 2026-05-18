import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import portrait from "@/assets/darija-portrait.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Darija Kühn — UX/UI Designerin & E-Commerce Spezialistin | Dresden" },
      { name: "description", content: "Portfolio von Darija Kühn — UX/UI Designerin und E-Commerce Spezialistin in Dresden. Von Public Health zur digitalen Kreativität." },
    ],
  }),
});

function useScrolled() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const onScroll = () => setS(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return s;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Index() {
  const scrolled = useScrolled();
  useReveal();

  return (
    <>
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#top" className="nav-logo">Darija <span>Kühn</span></a>
        <div className="nav-links">
          <a href="#about">Über mich</a>
          <a href="#projects">Projekte</a>
          <a href="#skills">Skills</a>
          <a href="#cv">Lebenslauf</a>
          <a href="#contact">Kontakt</a>
        </div>
        <a href="#contact" className="nav-cta">Hire me</a>
      </nav>

      <header id="top" className="hero">
        <div className="hero-left">
          <div className="hero-tag">UX/UI Designerin & E-Commerce Spezialistin</div>
          <h1 className="hero-h1">Von Public Health<br/>zur digitalen<br/><em>Kreativität.</em></h1>
          <p className="hero-sub">
            Aus strenger Präzision wird nutzerzentriertes Design. Mein Hintergrund in der Diätetik
            schärft meinen Blick für menschliches Verhalten — mein Projekt <strong>ScanFoodoni.de </strong>
            beweist, wie ich komplexe KI-Technologie in intuitive Interfaces verwandle.
          </p>
          <div className="hero-btns">
            <a href="https://scanfoodoni.de" target="_blank" rel="noreferrer" className="btn-primary">ScanFoodoni.de ansehen ↗</a>
            <a href="#projects" className="btn-outline">Alle Projekte</a>
          </div>
          <div className="hero-stats">
            <div><div className="stat-num">10+</div><div className="stat-label">Jahre in Dresden</div></div>
            <div><div className="stat-num">4</div><div className="stat-label">Sprachen</div></div>
            <div><div className="stat-num">B.Sc.</div><div className="stat-label">Diätetik</div></div>
          </div>
        </div>
        <div className="hero-right">
          <img src={portrait} alt="Darija Kühn" className="hero-photo" width={896} height={1280} />
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            <div className="hero-badge-text"><strong>Verfügbar für Projekte</strong>Dresden · Remote weltweit</div>
          </div>
        </div>
      </header>

      <section id="about" className="about">
        <div className="fade-in">
          <div className="section-label">Über mich</div>
          <h2 className="section-h">Präzision trifft <em>Empathie.</em></h2>
          <p className="section-sub">Ein interdisziplinärer Weg — von der wissenschaftlichen Methodik der Diätetik zur intuitiven Gestaltung digitaler Erlebnisse.</p>
        </div>
        <div className="about-grid">
          <div className="about-text fade-in">
            <p>Ich bin Darija Kühn — Designerin, Beobachterin, Übersetzerin zwischen Komplexität und Klarheit. Seit über zehn Jahren lebe ich in Dresden und gestalte hier digitale Produkte, die Menschen wirklich verstehen.</p>
            <p>Mein Bachelor in Diätetik hat mich gelehrt, sorgfältig hinzuhören, Daten zu interpretieren und individuelle Bedürfnisse ernst zu nehmen. Genau diese Haltung bringe ich heute in jede UX-Recherche, jeden Wireframe und jedes Interface mit.</p>
            <div className="about-highlight"><p>„Gutes Design ist wie eine gute Beratung — es nimmt dich an die Hand, ohne dich zu bevormunden."</p></div>
          </div>
          <div className="about-right fade-in">
            {[
              ["01","Forschung","Qualitative Interviews, Verhaltensanalyse und datengestützte Hypothesen."],
              ["02","Konzeption","Information Architecture, User Flows und klickbare Prototypen in Figma."],
              ["03","Interface","Visuelles Design mit Tiefe — Typografie, Farbe, Bewegung."],
              ["04","E-Commerce","Conversion-orientierte Shopify- und Storefront-Optimierung."],
            ].map(([n,l,t]) => (
              <div className="about-list-item" key={n}>
                <div className="ali-num">{n}</div>
                <div><div className="ali-label">{l}</div><div className="ali-text">{t}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="projects">
        <div className="fade-in">
          <div className="section-label">Ausgewählte Projekte</div>
          <h2 className="section-h">Arbeiten, die <em>Wirkung</em> zeigen.</h2>
        </div>

        <div className="projects-grid">
          <article className="proj-featured fade-in">
            <div className="proj-featured-visual">
              <div className="scanfood-mockup">
                <div className="sf-bar">
                  <div className="sf-dot" style={{background:"#ff5f57"}}/>
                  <div className="sf-dot" style={{background:"#febc2e"}}/>
                  <div className="sf-dot" style={{background:"#28c840"}}/>
                </div>
                <div className="sf-search"><span>🔍</span><span className="sf-search-text">Scanne ein Lebensmittel …</span></div>
                {[
                  ["🥑","Avocado, frisch","160 kcal · 15 g Fett","A"],
                  ["🥣","Haferflocken Bio","370 kcal · 13 g Protein","A"],
                  ["🍫","Schokoriegel","510 kcal · 28 g Zucker","D"],
                ].map(([i,p,k,s]) => (
                  <div className="sf-result-card" key={p}>
                    <div className="sf-icon-box">{i}</div>
                    <div><div className="sf-product">{p}</div><div className="sf-kcal">{k}</div></div>
                    <div className="sf-score">{s}</div>
                  </div>
                ))}
                <div className="sf-label">KI-gestützte Nährwert-Analyse</div>
              </div>
            </div>
            <div className="proj-featured-info">
              <div className="proj-tag">Flagship · UX / UI / Strategy</div>
              <h3 className="proj-h">Scan<em>Foodoni</em>.de</h3>
              <div className="proj-url">scanfoodoni.de ↗</div>
              <p className="proj-desc">Eine KI-gestützte Web-App, die Nährwerte von Lebensmitteln in Echtzeit analysiert und individuelle Empfehlungen ausspricht. Von der Idee über die User Research bis zum finalen Interface — komplett von mir konzipiert und gestaltet.</p>
              <div className="proj-pills">
                {["Figma","UX Research","KI / LLM","Tailwind","Conversion"].map(t => <span className="pill" key={t}>{t}</span>)}
              </div>
              <a href="https://scanfoodoni.de" target="_blank" rel="noreferrer" className="proj-cta">Live ansehen ↗</a>
            </div>
          </article>

          <div className="proj-secondary">
            <article className="proj-card fade-in">
              <div className="proj-card-cover">Shopify</div>
              <div className="proj-card-body">
                <div className="proj-card-tag">E-Commerce · Storefront</div>
                <h4 className="proj-card-h">Boutique Redesign</h4>
                <p className="proj-card-desc">Komplette Überarbeitung eines Shopify-Storefronts mit Fokus auf Conversion und mobiler Performance — +38 % Umsatz in drei Monaten.</p>
                <span className="proj-card-link">Case Study →</span>
              </div>
            </article>
            <article className="proj-card fade-in">
              <div className="proj-card-cover alt">Print</div>
              <div className="proj-card-body">
                <div className="proj-card-tag">Editorial · Brand</div>
                <h4 className="proj-card-h">Kampagnen-Poster</h4>
                <p className="proj-card-desc">Eine Serie editorialer Plakate für eine lokale Dresdner Initiative — von der Idee bis zum druckfertigen PDF.</p>
                <span className="proj-card-link">Mehr ansehen →</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="skills" className="skills">
        <div className="fade-in">
          <div className="section-label">Toolbox</div>
          <h2 className="section-h">Skills & <em>Werkzeuge.</em></h2>
        </div>
        <div className="skills-grid">
          {[
            ["✏️","Design",["Figma","Adobe XD","Photoshop","Illustrator"]],
            ["🧭","UX",["User Research","Wireframing","Prototyping","Usability"]],
            ["🛒","E-Commerce",["Shopify","WooCommerce","Conversion","A/B-Tests"]],
            ["💻","Web",["HTML","CSS","Tailwind","Webflow"]],
            ["🤖","AI",["ChatGPT","Midjourney","Prompt Design"]],
            ["📊","Daten",["Analytics","Hotjar","SEO Basics"]],
          ].map(([icon,h,tags]) => (
            <div className="skill-block fade-in" key={h as string}>
              <div className="skill-block-icon">{icon}</div>
              <div className="skill-block-h">{h}</div>
              <div className="skill-tags">{(tags as string[]).map(t => <span key={t} className="skill-tag">{t}</span>)}</div>
            </div>
          ))}
        </div>
        <div className="transfer-banner fade-in">
          <div>
            <div className="transfer-h">Vom Heilberuf zum Pixel — Transfer der Methodik.</div>
            <div className="transfer-p">Wissenschaftlich strukturiertes Vorgehen, empathisches Zuhören und der Mut zur einfachen Lösung. Diese Prinzipien aus der Diätetik prägen jedes Interface, das ich gestalte.</div>
          </div>
          <div className="transfer-arrow">→</div>
        </div>
      </section>

      <section id="cv" className="cv-section">
        <div className="fade-in">
          <div className="section-label">Lebenslauf</div>
          <h2 className="section-h">Stationen & <em>Sprachen.</em></h2>
        </div>
        <div className="cv-grid">
          <div className="fade-in">
            <div className="cv-col-h">Erfahrung & Bildung</div>
            {[
              ["2023 — heute","UX/UI Designerin (freiberuflich)","Dresden","Konzeption und Gestaltung von Web-Apps, Storefronts und Brand-Erlebnissen. Eigenes Projekt: ScanFoodoni.de."],
              ["2020 — 2023","E-Commerce Specialist","Shopify Agentur, Dresden","Storefront-Optimierung, Conversion-Tests, Theme-Anpassungen."],
              ["2017 — 2020","B.Sc. Diätetik","Hochschule für Angewandte Wissenschaften","Wissenschaftliches Arbeiten, Public Health, Verhaltensforschung."],
            ].map(([d,h,o,desc]) => (
              <div className="cv-entry" key={h}>
                <div className="cv-date">{d}</div>
                <div className="cv-entry-h">{h}</div>
                <div className="cv-entry-org">{o}</div>
                <div className="cv-entry-desc">{desc}</div>
              </div>
            ))}
          </div>
          <div className="fade-in">
            <div className="cv-col-h">Sprachen</div>
            {[
              ["Deutsch","C1 — verhandlungssicher"],
              ["Russisch","Muttersprache"],
              ["Englisch","B2 — fließend"],
              ["Ukrainisch","Muttersprache"],
            ].map(([n,l]) => (
              <div className="cv-lang-item" key={n}>
                <div className="cv-lang-name">{n}</div>
                <div className="cv-lang-level">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="fade-in">
          <div className="section-label">Kontakt</div>
          <h2 className="section-h">Lass uns <em>sprechen.</em></h2>
        </div>
        <div className="contact-grid">
          <div className="contact-info fade-in">
            <p>Ich freue mich auf neue Projekte, spannende Kooperationen oder einfach einen Kaffee in Dresden. Schreib mir — meistens antworte ich innerhalb eines Tages.</p>
            <div className="contact-links">
              <a className="contact-link" href="https://maps.google.com/?q=Altenberger+Strasse+87,+01279+Dresden" target="_blank" rel="noreferrer">
                <div className="cl-icon">📍</div>
                <div>Altenberger Strasse 87 · 01279 Dresden · Sachsen</div>
              </a>
              <a className="contact-link" href="tel:+4903512530403">
                <div className="cl-icon">☎</div>
                <div>+49 (0) 351 253 04 03</div>
              </a>
              <a className="contact-link" href="mailto:hello@darija-kuehn.de">
                <div className="cl-icon">✉</div>
                <div>hello@darija-kuehn.de</div>
              </a>
              <a className="contact-link" href="https://propovednik.my1.ru" target="_blank" rel="noreferrer">
                <div className="cl-icon">↗</div>
                <div>propovednik.my1.ru</div>
              </a>
            </div>
          </div>
          <form className="contact-form fade-in" onSubmit={(e) => { e.preventDefault(); alert("Danke! Ich melde mich."); }}>
            <div className="form-group"><label className="form-label">Name</label><input className="form-input" required /></div>
            <div className="form-group"><label className="form-label">E-Mail</label><input type="email" className="form-input" required /></div>
            <div className="form-group"><label className="form-label">Nachricht</label><textarea className="form-input form-textarea" required /></div>
            <button type="submit" className="form-btn">Nachricht senden →</button>
          </form>
        </div>
      </section>

      <footer>
        <div className="footer-logo">Darija <span>Kühn</span></div>
        <div className="footer-copy">© {new Date().getFullYear()} · Designed & built in Dresden</div>
      </footer>
    </>
  );
}
