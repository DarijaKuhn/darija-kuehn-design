import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/i18n";

// Reconstruction / community life by year
import y2005 from "@/assets/gallery/2005.jpg.asset.json";
import y2011bratja from "@/assets/gallery/2011_bratja.jpg.asset.json";
import y2011god from "@/assets/gallery/2011god.jpg.asset.json";
import y2012 from "@/assets/gallery/2012_poeydka.jpg.asset.json";
import y2012cerkov from "@/assets/gallery/2012god_cerkov.jpg.asset.json";
import y2012ostern from "@/assets/gallery/2012god.jpg.asset.json";
import y2013ernte from "@/assets/gallery/2013_god.jpg.asset.json";
import y2016jungs from "@/assets/gallery/2016_Jungs.jpg.asset.json";
import y2016frauen from "@/assets/gallery/2016.jpg.asset.json";
import bau1 from "@/assets/gallery/153690537.jpg.asset.json";
import bau2 from "@/assets/gallery/348388832.jpg.asset.json";
import bau3 from "@/assets/gallery/344038905.jpg.asset.json";
import bau4 from "@/assets/gallery/158234614.jpg.asset.json";
import saechsSchweiz from "@/assets/gallery/284503246.jpg.asset.json";
import bau5 from "@/assets/gallery/378726301.jpg.asset.json";
import bau6 from "@/assets/gallery/518386920.jpg.asset.json";
import bau7 from "@/assets/gallery/754727280.jpg.asset.json";
import bau8 from "@/assets/gallery/876534121.jpg.asset.json";
import bau9 from "@/assets/gallery/952761995.jpg.asset.json";
import ausflug1 from "@/assets/gallery/389301007.jpg.asset.json";
import ausflug2 from "@/assets/gallery/763711679.jpg.asset.json";
import gemeinde1 from "@/assets/gallery/844894809.jpg.asset.json";
import gemeinde2 from "@/assets/gallery/860500204.jpg.asset.json";
import gemeinde3 from "@/assets/gallery/964078192.jpg.asset.json";

// Weddings
import alinaArtur1 from "@/assets/gallery/Alina_und_Artur.jpg.asset.json";
import alinaArtur2 from "@/assets/gallery/Alina_und_Artur_2.jpg.asset.json";
import arturAlina from "@/assets/gallery/Artur_und_Alina.jpg.asset.json";
import angelinaAnton1 from "@/assets/gallery/Angelina_und_Anton.jpg.asset.json";
import angelinaAnton2 from "@/assets/gallery/AngelinaundAnton.jpg.asset.json";
import andreasMarina1 from "@/assets/gallery/Andreas_und_Marina.jpg.asset.json";
import andreasMarina2 from "@/assets/gallery/Andreas_und_MarinaIks.jpg.asset.json";
import andreasMarina3 from "@/assets/gallery/AndreasundMarinaIks2.jpg.asset.json";
import andreasMarina4 from "@/assets/gallery/AndreajundMarina.jpg.asset.json";
import andrejMarina from "@/assets/gallery/AndrejMarina.jpg.asset.json";
import darijaAndreas from "@/assets/gallery/Darija_und_Andreas.jpg.asset.json";
import viktorijaValdemar1 from "@/assets/gallery/Viktorija_und_Valdemar.jpg.asset.json";
import viktorijaValdemar2 from "@/assets/gallery/Viktorija_und_Valdemar2.jpg.asset.json";
import vladOlga1 from "@/assets/gallery/Vlad_und_Olga.jpg.asset.json";
import vladOlga2 from "@/assets/gallery/vlad_olga.jpg.asset.json";
import vladOlga3 from "@/assets/gallery/vlad_olga2.jpg.asset.json";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
  head: () => ({
    meta: [
      { title: "Fotos — FECG Dresden" },
      { name: "description", content: "Fotos aus dem Gemeindeleben der FECG Dresden: Bau und Renovierung des Kirchengebäudes, Gemeindeveranstaltungen und Hochzeiten." },
    ],
  }),
});

type Photo = { src: string; caption: string; alt: string };
type Group = { title: string; subtitle?: string; photos: Photo[] };

const timeline: Group[] = [
  {
    title: "2005 — Bau und Renovierung",
    subtitle: "Anfänge des Kirchengrundstücks",
    photos: [
      { src: y2005.url, caption: "Baustelle, Frühjahr 2005", alt: "Baustelle auf dem Grundstück der FECG Dresden, 2005" },
      { src: bau1.url, caption: "Vorbereitung des Geländes", alt: "Erdarbeiten auf dem Grundstück der FECG Dresden" },
      { src: bau6.url, caption: "Gemeinsame Arbeit auf dem Grundstück", alt: "Schwestern helfen bei den Arbeiten auf dem Gemeindegelände" },
      { src: bau9.url, caption: "Подготовка щебня", alt: "Gemeindemitglieder bereiten Material für die Bauarbeiten vor" },
      { src: bau2.url, caption: "Junge Helfer beim Bau", alt: "Kinder und Jugendliche helfen beim Bau auf dem Grundstück der Gemeinde" },
      { src: bau8.url, caption: "Работа всей семьёй", alt: "Jugendliche helfen beim Verteilen der Erde auf dem Grundstück" },
    ],
  },
  {
    title: "Verlegung der Rasengittersteine",
    subtitle: "Gemeinsame Arbeit auf dem Gemeindegelände",
    photos: [
      { src: bau3.url, caption: "Vorbereitung der Fläche", alt: "Mitglieder der Gemeinde bereiten die Fläche für Rasengittersteine vor" },
      { src: bau4.url, caption: "Verlegen der Rasengittersteine", alt: "Bruder beim Verlegen der Rasengittersteine auf dem Gemeindegelände" },
      { src: bau5.url, caption: "Начало укладки", alt: "Die ersten Reihen der Rasengittersteine werden verlegt" },
      { src: bau7.url, caption: "Почти готовая площадка", alt: "Fast fertig verlegte Fläche mit Rasengittersteinen" },
    ],
  },
  {
    title: "2011 — Erntedankfest und Gottesdienst",
    photos: [
      { src: y2011god.url, caption: "Predigt am Erntedankfest, 25.09.2011", alt: "Prediger an der Kanzel beim Erntedankfest in der FECG Dresden, 25.09.2011" },
      { src: y2011bratja.url, caption: "Brüder der Gemeinde, 25.09.2011", alt: "Brüder der Gemeinde beim Erntedankfest in der FECG Dresden, 25.09.2011" },
    ],
  },
  {
    title: "2012 — Ostern und Gemeindeleben",
    photos: [
      { src: y2012cerkov.url, caption: "Gemeindefoto im Gottesdienstsaal, 2012", alt: "Gemeindemitglieder der FECG Dresden im Gottesdienstsaal, 2012" },
      { src: y2012ostern.url, caption: "Osterfeier – Christus ist auferstanden", alt: "Gemeinsames Osteressen in der FECG Dresden, 2012" },
      { src: gemeinde3.url, caption: "Праздничная трапеза", alt: "Festliche gemeinsame Mahlzeit der Gemeinde im Gottesdienstsaal" },
    ],
  },
  {
    title: "2012 — Gemeindeausflug",
    photos: [
      { src: y2012.url, caption: "Ausflug in die Sächsische Schweiz", alt: "Gemeindeausflug der FECG Dresden in die Sächsische Schweiz, 2012" },
      { src: saechsSchweiz.url, caption: "Blick auf die Basteifelsen", alt: "Aussicht auf die Felsen der Sächsischen Schweiz" },
      { src: ausflug1.url, caption: "В пещере среди скал", alt: "Teilnehmer des Gemeindeausflugs in einer Felsenhöhle der Sächsischen Schweiz" },
      { src: ausflug2.url, caption: "Вид на Эльбу", alt: "Panoramablick auf die Elbe während des Gemeindeausflugs" },
      { src: gemeinde2.url, caption: "Дорога после поездки", alt: "Gemeindemitglieder spazieren gemeinsam während des Ausflugs" },
    ],
  },
  {
    title: "Gemeinschaft im Hof",
    photos: [
      { src: gemeinde1.url, caption: "Общение после служения", alt: "Gemeindemitglieder sitzen zusammen im Hof der Gemeinde" },
    ],
  },
  {
    title: "2013 — Erntedankfest",
    photos: [
      { src: y2013ernte.url, caption: "Schwestern am Erntedankaltar, 2013", alt: "Schwestern der Gemeinde am Erntedankaltar in der FECG Dresden, 2013" },
    ],
  },
  {
    title: "2016 — Erntedankfest",
    photos: [
      { src: y2016jungs.url, caption: "Jungen mit dem Prediger am Erntedankaltar", alt: "Prediger mit Jungen der Gemeinde am Erntedankaltar in der FECG Dresden, 2016" },
      { src: y2016frauen.url, caption: "Schwestern der Gemeinde am Erntedankaltar", alt: "Schwestern der Gemeinde am Erntedankaltar in der FECG Dresden, 2016" },
    ],
  },
];

const weddings: Group[] = [
  {
    title: "Vlad und Olga",
    photos: [
      { src: vladOlga3.url, caption: "Studio-Aufnahme", alt: "Vlad und Olga – Hochzeit, Studio-Porträt" },
      { src: vladOlga2.url, caption: "An der Festtafel, 19.10.2013", alt: "Vlad und Olga an der Hochzeitstafel in der Gemeinde, 19.10.2013" },
      { src: vladOlga1.url, caption: "Mit den Gästen in Dresden", alt: "Vlad und Olga mit Gästen vor dem Fürstenzug in Dresden" },
    ],
  },
  {
    title: "Viktorija und Valdemar",
    photos: [
      { src: viktorijaValdemar1.url, caption: "Am Dresdner Residenzschloss", alt: "Viktorija und Valdemar – Hochzeitsfoto am Dresdner Residenzschloss" },
      { src: viktorijaValdemar2.url, caption: "Mit der Hochzeitsgesellschaft", alt: "Viktorija und Valdemar mit Hochzeitsgästen am Theaterplatz Dresden" },
    ],
  },
  {
    title: "Darija und Andreas",
    photos: [
      { src: darijaAndreas.url, caption: "Trauung in der Gemeinde", alt: "Darija und Andreas bei der Trauung in der FECG Dresden" },
    ],
  },
  {
    title: "Andreas und Marina",
    photos: [
      { src: andreasMarina3.url, caption: "Studio-Aufnahme", alt: "Andreas und Marina – Hochzeit, Studio-Porträt" },
      { src: andreasMarina4.url, caption: "Mit Trauzeugen", alt: "Andreas und Marina mit Trauzeugen in der Gemeinde" },
      { src: andrejMarina.url, caption: "Mit einer Rose", alt: "Andreas und Marina – Hochzeit, fröhlicher Moment mit Rose" },
      { src: andreasMarina1.url, caption: "Hochzeitsfeier", alt: "Andreas und Marina an der Hochzeitstafel" },
      { src: andreasMarina2.url, caption: "Brautpaar an der Tafel", alt: "Andreas und Marina an der Hochzeitstafel, Porträt" },
    ],
  },
  {
    title: "Alina und Artur",
    photos: [
      { src: alinaArtur1.url, caption: "Vor der Trauung", alt: "Alina und Artur vor dem Hochzeitsauto" },
      { src: arturAlina.url, caption: "Mit Familie", alt: "Alina und Artur mit Familienangehörigen" },
      { src: alinaArtur2.url, caption: "Über den Elbwiesen", alt: "Alina und Artur mit Blick über Dresden" },
    ],
  },
  {
    title: "Angelina und Anton",
    photos: [
      { src: angelinaAnton1.url, caption: "Im Park", alt: "Angelina und Anton – Hochzeit, Händchen haltend im Park" },
      { src: angelinaAnton2.url, caption: "Auf Händen getragen", alt: "Angelina und Anton – Hochzeit, fröhlicher Moment" },
    ],
  },
];

function GroupBlock({ g, onOpen }: { g: Group; onOpen: (p: Photo) => void }) {
  return (
    <div style={{ marginTop: 40 }}>
      <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>{g.title}</h3>
      {g.subtitle && <div style={{ color: "#777", fontSize: 14, marginBottom: 10 }}>{g.subtitle}</div>}
      <div className="gallery-grid">
        {g.photos.map((p) => (
          <button
            key={p.src}
            type="button"
            className="gallery-item"
            onClick={() => onOpen(p)}
            style={{ border: "none", padding: 0, cursor: "zoom-in" }}
            aria-label={p.alt}
          >
            <img src={p.src} alt={p.alt} loading="lazy" />
            <div className="gallery-caption">{p.caption}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Gallery() {
  const { t } = useI18n();
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">{t("legal.breadcrumbHome")}</Link>
          <span>›</span>
          <span className="crumb-here">Fotos</span>
        </div>
      </div>

      <section className="section section-bg">
        <div className="container">
          <div className="label" style={{ marginBottom: 8 }}>Galerie</div>
          <h1 className="section-h">Fotos aus dem Gemeindeleben</h1>
          <p style={{ maxWidth: 720, color: "var(--muted-fg, #555)", marginBottom: 8 }}>
            Eine Chronik unserer Gemeinde — vom Bau des Kirchengebäudes bis zu Festen, Ausflügen und Hochzeiten.
          </p>

          <h2 style={{ fontSize: 28, fontWeight: 700, marginTop: 48, marginBottom: 4 }}>
            Bau, Gottesdienste und Gemeindeleben
          </h2>
          <div style={{ height: 3, width: 56, background: "var(--primary, #2a6df4)", borderRadius: 2 }} />
          {timeline.map((g) => <GroupBlock key={g.title} g={g} onOpen={setLightbox} />)}

          <h2 style={{ fontSize: 28, fontWeight: 700, marginTop: 72, marginBottom: 4 }}>
            Hochzeiten unserer Gemeinde
          </h2>
          <div style={{ height: 3, width: 56, background: "var(--primary, #2a6df4)", borderRadius: 2 }} />
          {weddings.map((g) => <GroupBlock key={g.title} g={g} onOpen={setLightbox} />)}
        </div>
      </section>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.88)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20, cursor: "zoom-out",
          }}
        >
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            style={{ maxWidth: "95vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,.5)" }}
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
            aria-label="Schließen"
            style={{
              position: "absolute", top: 16, right: 20, background: "rgba(255,255,255,.15)",
              color: "#fff", border: "1px solid rgba(255,255,255,.3)", borderRadius: 999,
              width: 40, height: 40, fontSize: 22, cursor: "pointer",
            }}
          >×</button>
        </div>
      )}
    </div>
  );
}
