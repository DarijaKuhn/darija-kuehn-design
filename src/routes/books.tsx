import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/books")({
  component: Books,
  head: () => ({
    meta: [
      { title: "Empfohlene christliche Bücher — FECG Dresden" },
      {
        name: "description",
        content:
          "Empfohlene Bücher zu Theologie, Bibelauslegung, Kirchengeschichte, Apologetik und Reformation aus dem Bücher-Verzeichnis von propovednik.my1.ru.",
      },
    ],
  }),
});

type Cat =
  | "hermeneutics"
  | "apologetics"
  | "homiletics"
  | "early"
  | "nt"
  | "reformation"
  | "ot";

type Book = {
  id: string;
  img: string;
  author: string;
  cat: Cat;
  link: string;
};

const BOOKS: Book[] = [
  {
    id: "history2",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Istorija_Hristianstva-2.jpg",
    author: "Justo L. González",
    cat: "early",
    link: "https://propovednik.my1.ru/dir/rannjaja_cerkov_i_srednevekovje/istorija_khristianstva_tom_2_istorija_khristianstva_tom_2_ot_ehpokhi_reformacii_do_nashego_vremeni/6-1-0-25",
  },
  {
    id: "history1",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Istorija_Hristianstva-1.jpg",
    author: "Justo L. González",
    cat: "early",
    link: "https://propovednik.my1.ru/dir/rannjaja_cerkov_i_srednevekovje/istorija_khristianstva_tom_1_ot_osnovanija_cerkvi_do_ehpokhi_reformacii/6-1-0-10",
  },
  {
    id: "answers",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Kniga_otwetow.jpg",
    author: "Ken Ham, Andrew Snelling, Carl Wieland",
    cat: "apologetics",
    link: "https://propovednik.my1.ru/dir/apologetika/kniga_otvetov/11-1-0-24",
  },
  {
    id: "cults",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Kulti_i_mirovie_religii.jpg",
    author: "Nikolai Porublev",
    cat: "apologetics",
    link: "https://propovednik.my1.ru/dir/apologetika/kulty_i_mirovye_religii/11-1-0-23",
  },
  {
    id: "twobabylons",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Dva_Vavilona.jpg",
    author: "Alexander Hislop",
    cat: "apologetics",
    link: "https://propovednik.my1.ru/dir/apologetika/dva_vavilona_ili_papskoe_poklonenie/11-1-0-22",
  },
  {
    id: "antiquities",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Iudejskie_drevnosti-tom_1.jpg",
    author: "Flavius Josephus",
    cat: "early",
    link: "https://propovednik.my1.ru/dir/rannjaja_cerkov_i_srednevekovje/iudejskie_drevnosti/6-1-0-19",
  },
  {
    id: "jewishwar",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Iudejskaya_vojna-1.jpg",
    author: "Flavius Josephus",
    cat: "early",
    link: "https://propovednik.my1.ru/dir/rannjaja_cerkov_i_srednevekovje/iudejskaja_vojna/6-1-0-18",
  },
  {
    id: "homiletics",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Gomiletika_1.jpg",
    author: "",
    cat: "homiletics",
    link: "https://propovednik.my1.ru/dir/gomiletika/gomiletika/10-1-0-16",
  },
  {
    id: "prophets",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Ostorozhno_proroki.jpg",
    author: "Wolfgang Bühne",
    cat: "apologetics",
    link: "https://propovednik.my1.ru/dir/apologetika/ostorozhno_proroki/11-1-0-13",
  },
  {
    id: "fire",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Igra_s_ognjom-1.jpg",
    author: "Wolfgang Bühne",
    cat: "apologetics",
    link: "https://propovednik.my1.ru/dir/apologetika/igra_s_ognjom/11-1-0-12",
  },
  {
    id: "luther",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Na_sem_stoju.jpg",
    author: "Roland Bainton",
    cat: "reformation",
    link: "https://propovednik.my1.ru/dir/reformacija/na_sjom_stoju_zhizn_martina_ljutera/9-1-0-11",
  },
  {
    id: "otspeaks",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Vethij_Savet_govorit.jpg",
    author: "Samuel J. Schultz",
    cat: "ot",
    link: "https://propovednik.my1.ru/dir/isuchenie_vetkhogo_zaveta/vetkhij_zavet_govorit/4-1-0-9",
  },
  {
    id: "ntsurvey",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Obsor_Novogo-Zaveta.jpg",
    author: "Merrill C. Tenney",
    cat: "nt",
    link: "https://propovednik.my1.ru/dir/isuchenie_novogo_zaveta/obzor_novogo_zaveta/2-1-0-8",
  },
  {
    id: "hermeneutics",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Germenewtika.jpg",
    author: "Henry A. Virkler",
    cat: "hermeneutics",
    link: "https://propovednik.my1.ru/dir/germenevtika_i_ekzegetika/germenevtika/1-1-0-7",
  },
  {
    id: "howtoread",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Kak_zitaty_Bibliju.png",
    author: "Gordon D. Fee, Douglas Stuart",
    cat: "hermeneutics",
    link: "https://propovednik.my1.ru/dir/germenevtika_i_ekzegetika/kak_chitat_bibliju_i_videt_vsju_ejo_cennost/1-1-0-6",
  },
  {
    id: "ntexegesis",
    img: "https://propovednik.my1.ru/Buch-Titel/Buch_Ekzegetika_Novogo_Zaveta.jpg",
    author: "Gordon D. Fee",
    cat: "hermeneutics",
    link: "https://propovednik.my1.ru/dir/germenevtika_i_ekzegetika/ekzegetika_novogo_zaveta/1-1-0-4",
  },
];

type TxtByLang = Record<string, Record<string, { title: string; desc: string }>>;

// Titles + short descriptions localized for DE / EN / RU.
// Other languages fall back to DE (German is the master language of the site).
const TXT: TxtByLang = {
  de: {
    history2: { title: "Geschichte des Christentums, Bd. 2 — Von der Reformation bis zur Gegenwart", desc: "Der zweite Band beschreibt das kirchliche Leben vom 16. Jahrhundert bis heute — Persönlichkeiten, Konfessionen und theologische Entwicklungen." },
    history1: { title: "Geschichte des Christentums, Bd. 1 — Von der Urgemeinde bis zur Reformation", desc: "Die Ausbreitung des christlichen Glaubens in der Welt und die Entstehung nationaler kirchlicher Traditionen." },
    answers: { title: "Das Antwort-Buch", desc: "Verständliche Antworten auf 12 häufig gestellte Fragen zum Buch Genesis, zur Schöpfung und zur Evolution." },
    cults: { title: "Sekten und Weltreligionen im Licht der Bibel", desc: "Kurzer Überblick der bekanntesten Sekten und Religionen mit einer biblischen Beurteilung." },
    twobabylons: { title: "Die zwei Babylons", desc: "1853 erschienenes Werk über die heidnischen Wurzeln zahlreicher religiöser Bräuche — historisch reich belegt." },
    antiquities: { title: "Jüdische Altertümer", desc: "Die Geschichte des jüdischen Volkes von der Schöpfung bis Herodes dem Großen — von Flavius Josephus." },
    jewishwar: { title: "Der Jüdische Krieg", desc: "Belagerung und Zerstörung Jerusalems und die dramatischen Ereignisse des Jüdischen Krieges." },
    homiletics: { title: "Homiletik — Lehrbuch", desc: "Einführung in Vorbereitung und Halten biblischer Predigten, damit das Wort in den Herzen der Hörer Frucht bringt." },
    prophets: { title: "Vorsicht: Propheten!", desc: "Kritische Betrachtung endzeitlicher Verführungen (Fortsetzung von „Spiel mit dem Feuer“)." },
    fire: { title: "Spiel mit dem Feuer", desc: "Entstehung und Entwicklung der Pfingst- und charismatischen Bewegung sowie des „Power-Evangelism“." },
    luther: { title: "Hier stehe ich — Das Leben Martin Luthers", desc: "Klassische Biographie über Martin Luther und die Reformation." },
    otspeaks: { title: "Das Alte Testament spricht", desc: "Warum das Alte Testament weit mehr ist als ein historisches oder literarisches Denkmal." },
    ntsurvey: { title: "Überblick über das Neue Testament", desc: "Politischer, sozialer, kultureller und religiöser Hintergrund der Zeit des Neuen Testaments." },
    hermeneutics: { title: "Hermeneutik", desc: "Grundsätze und Prozess der Auslegung der Bibel." },
    howtoread: { title: "Die Bibel lesen und ihren ganzen Reichtum entdecken", desc: "Ein tiefes Verständnis der Bibel ist keinem Elitezirkel vorbehalten — sie ist für jeden zugänglich." },
    ntexegesis: { title: "Exegese des Neuen Testaments", desc: "Der Prozess der Auslegung: historische Erforschung dessen, was der biblische Autor sagen wollte." },
  },
  en: {
    history2: { title: "The Story of Christianity, Vol. 2 — The Reformation to the Present Day", desc: "The second volume covers church life from the 16th century to our time — key figures, confessions, theological developments." },
    history1: { title: "The Story of Christianity, Vol. 1 — The Early Church to the Reformation", desc: "How the Christian faith spread across the world and how national church traditions took shape." },
    answers: { title: "The Answers Book", desc: "Clear and detailed answers to 12 of the most frequently asked questions about Genesis, creation and evolution." },
    cults: { title: "Cults and World Religions in the Light of the Bible", desc: "A brief overview of the most widespread cults and religious movements with a biblical assessment." },
    twobabylons: { title: "The Two Babylons", desc: "First published in 1853, this work presents extensive historical evidence for the pagan roots of many religious rites." },
    antiquities: { title: "Antiquities of the Jews", desc: "The history of the Jewish people from creation to Herod the Great, by Flavius Josephus." },
    jewishwar: { title: "The Jewish War", desc: "The siege and destruction of Jerusalem and the dramatic events of the Jewish War of AD 66–71." },
    homiletics: { title: "Homiletics — A Textbook", desc: "A branch of theology on preparing and delivering sermons so that preaching bears fruit in listeners' hearts." },
    prophets: { title: "Beware: Prophets!", desc: "A critical look at end-time deceptions — a sequel to “Playing with Fire.”" },
    fire: { title: "Playing with Fire", desc: "The origin and development of the Pentecostal and charismatic movements and so-called “power evangelism.”" },
    luther: { title: "Here I Stand — A Life of Martin Luther", desc: "A classic biography of Martin Luther and the history of the Reformation." },
    otspeaks: { title: "The Old Testament Speaks", desc: "Why the Old Testament is far more than a historical or national literary monument." },
    ntsurvey: { title: "New Testament Survey", desc: "The political, social, cultural and religious background against which the New Testament emerged." },
    hermeneutics: { title: "Hermeneutics", desc: "Principles and process of interpreting the Bible." },
    howtoread: { title: "How to Read the Bible for All Its Worth", desc: "A deep understanding of the Bible is not reserved for scholars — it is accessible to every reader." },
    ntexegesis: { title: "New Testament Exegesis", desc: "The interpretive process: historical study of what the biblical author intended to convey." },
  },
  ru: {
    history2: { title: "История христианства. Том 2. От эпохи Реформации до нашего времени", desc: "Второй том охватывает события церковной жизни с XVI века по наше время — служители Церкви, конфессии, богословские изменения." },
    history1: { title: "История христианства. Том 1. От основания Церкви до эпохи Реформации", desc: "Как распространялось христианское учение по всему миру и как складывались национальные особенности церковных традиций." },
    answers: { title: "Книга ответов", desc: "Доходчивые и подробные ответы на 12 наиболее часто задаваемых вопросов о книге Бытия, творении и эволюции." },
    cults: { title: "Культы и мировые религии в свете Библии", desc: "Краткий обзор самых распространённых культов и религиозных течений с оценкой в свете Священного Писания." },
    twobabylons: { title: "Два Вавилона", desc: "Книга 1853 года с обширным историческим материалом о языческих корнях многих религиозных обрядов." },
    antiquities: { title: "Иудейские древности", desc: "История еврейского народа от сотворения мира до правления Ирода Великого — труд Иосифа Флавия." },
    jewishwar: { title: "Иудейская война", desc: "Осада и разрушение Иерусалима и ключевые события Иудейской войны 66–71 гг." },
    homiletics: { title: "Гомилетика. Учебное пособие", desc: "Раздел богословия, посвящённый подготовке и произнесению проповедей — чтобы слово приносило плод в сердцах слушателей." },
    prophets: { title: "Осторожно: пророки!", desc: "Размышления об обольщениях последнего времени; продолжение книги «Игра с огнём»." },
    fire: { title: "Игра с огнём", desc: "История возникновения и развития пятидесятнического и харизматического движений и так называемого «пауэр-ивэнжелизма»." },
    luther: { title: "На сём стою. Жизнь Мартина Лютера", desc: "Классическая биография Мартина Лютера и история Реформации." },
    otspeaks: { title: "Ветхий Завет говорит", desc: "Почему Ветхий Завет — нечто большее, чем историческое повествование или памятник национальной литературы." },
    ntsurvey: { title: "Обзор Нового Завета", desc: "Политический, социальный, культурный и религиозный фон, на котором появился Новый Завет." },
    hermeneutics: { title: "Герменевтика", desc: "Принципы и процесс толкования Библии." },
    howtoread: { title: "Как читать Библию и видеть всю её ценность", desc: "Глубокое понимание Библии доступно любому читателю — от домохозяйки до преподавателя семинарии." },
    ntexegesis: { title: "Экзегетика Нового Завета", desc: "Процесс толкования: историческое исследование того, что хотел выразить библейский автор." },
  },
};

function Books() {
  const { t, lang } = useI18n();
  const items = TXT[lang] ?? TXT.de;
  const fallbackNotice = lang !== "de" && lang !== "en" && lang !== "ru";

  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">{t("legal.breadcrumbHome")}</Link>
          <span>›</span>
          <span className="crumb-here">{t("pages.books.crumb")}</span>
        </div>
      </div>

      <section className="section section-white">
        <div className="container">
          <div style={{ maxWidth: 720, marginBottom: 32 }}>
            <div className="label" style={{ marginBottom: 8 }}>
              {t("pages.books.eyebrow")}
            </div>
            <h1 className="section-h" style={{ marginBottom: 14 }}>
              {t("pages.books.h1")}
            </h1>
            <p className="body-lg">{t("pages.books.intro")}</p>
            {fallbackNotice && (
              <p style={{ marginTop: 10, fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>
                {t("pages.books.note")}
              </p>
            )}
          </div>

          <div className="books-grid">
            {BOOKS.map((b) => {
              const info = items[b.id] ?? TXT.de[b.id];
              return (
                <a
                  key={b.id}
                  href={b.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="book-card"
                >
                  <div className="book-cover">
                    <img src={b.img} alt={info.title} loading="lazy" />
                  </div>
                  <div className="book-body">
                    <div className="book-cat">{t(`pages.books.categories.${b.cat}`)}</div>
                    <h3 className="book-title">{info.title}</h3>
                    {b.author && (
                      <div className="book-author">
                        <span className="book-author-label">{t("pages.books.by")}</span>{" "}
                        <em>{b.author}</em>
                      </div>
                    )}
                    <p className="book-desc">{info.desc}</p>
                    <span className="book-more">{t("pages.books.readMore")} →</span>
                  </div>
                </a>
              );
            })}
          </div>

          <p style={{ marginTop: 32, fontSize: 13, color: "var(--muted)" }}>
            {t("pages.books.source")}{" "}
            <a
              href="https://propovednik.my1.ru/dir/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2a5c27", textDecoration: "underline" }}
            >
              propovednik.my1.ru/dir
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
