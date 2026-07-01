import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/books")({
  component: Books,
  head: () => ({
    meta: [
      { title: "Empfohlene christliche Bücher — FECG Dresden" },
      {
        name: "description",
        content:
          "Empfohlene Bücher zu Theologie, Bibelauslegung, Kirchengeschichte, Apologetik und Reformation — mit ausführlichen Beschreibungen.",
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
};

const BOOKS: Book[] = [
  { id: "history2", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Istorija_Hristianstva-2.jpg", author: "Justo L. González", cat: "early" },
  { id: "history1", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Istorija_Hristianstva-1.jpg", author: "Justo L. González", cat: "early" },
  { id: "answers", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Kniga_otwetow.jpg", author: "Ken Ham, Andrew Snelling, Carl Wieland", cat: "apologetics" },
  { id: "cults", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Kulti_i_mirovie_religii.jpg", author: "Nikolai Porublev", cat: "apologetics" },
  { id: "twobabylons", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Dva_Vavilona.jpg", author: "Alexander Hislop", cat: "apologetics" },
  { id: "antiquities", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Iudejskie_drevnosti-tom_1.jpg", author: "Flavius Josephus", cat: "early" },
  { id: "jewishwar", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Iudejskaya_vojna-1.jpg", author: "Flavius Josephus", cat: "early" },
  { id: "homiletics", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Gomiletika_1.jpg", author: "", cat: "homiletics" },
  { id: "prophets", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Ostorozhno_proroki.jpg", author: "Wolfgang Bühne", cat: "apologetics" },
  { id: "fire", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Igra_s_ognjom-1.jpg", author: "Wolfgang Bühne", cat: "apologetics" },
  { id: "luther", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Na_sem_stoju.jpg", author: "Roland Bainton", cat: "reformation" },
  { id: "otspeaks", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Vethij_Savet_govorit.jpg", author: "Samuel J. Schultz", cat: "ot" },
  { id: "ntsurvey", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Obsor_Novogo-Zaveta.jpg", author: "Merrill C. Tenney", cat: "nt" },
  { id: "hermeneutics", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Germenewtika.jpg", author: "Henry A. Virkler", cat: "hermeneutics" },
  { id: "howtoread", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Kak_zitaty_Bibliju.png", author: "Gordon D. Fee, Douglas Stuart", cat: "hermeneutics" },
  { id: "ntexegesis", img: "https://propovednik.my1.ru/Buch-Titel/Buch_Ekzegetika_Novogo_Zaveta.jpg", author: "Gordon D. Fee", cat: "hermeneutics" },
];

type Info = { title: string; desc: string; long: string };
type TxtByLang = Record<string, Record<string, Info>>;

const TXT: TxtByLang = {
  de: {
    history2: {
      title: "Geschichte des Christentums, Bd. 2 — Von der Reformation bis zur Gegenwart",
      desc: "Der zweite Band beschreibt das kirchliche Leben vom 16. Jahrhundert bis heute.",
      long: "Der zweite Band von Justo L. González' klassischer Kirchengeschichte umfasst die Zeit von der Reformation bis in die Gegenwart. González schildert das Wirken Martin Luthers, Zwinglis, Calvins und der radikalen Reformation, die katholische Gegenreformation, die Ausbreitung des Christentums in die Neue Welt, die Erweckungsbewegungen des 18. und 19. Jahrhunderts, das Zeitalter der Mission, die theologischen Herausforderungen der Moderne sowie das Wachstum der Kirche in Asien, Afrika und Lateinamerika im 20. Jahrhundert. Ein besonderer Wert des Werkes liegt darin, dass es nicht nur Ereignisse und Persönlichkeiten schildert, sondern auch die geistlichen und gesellschaftlichen Bewegungen verständlich einordnet — ein hervorragendes Lehr- und Nachschlagewerk für Prediger, Studenten und alle, die die Kirche in ihrem globalen Kontext verstehen wollen.",
    },
    history1: {
      title: "Geschichte des Christentums, Bd. 1 — Von der Urgemeinde bis zur Reformation",
      desc: "Die Ausbreitung des christlichen Glaubens und die Entstehung nationaler kirchlicher Traditionen.",
      long: "Der erste Band führt vom Neuen Testament über die Urgemeinde, die Verfolgungen der ersten Jahrhunderte, die Konzilien der Alten Kirche, das Mönchtum, die Bildung der lateinischen und griechischen Traditionen, das mittelalterliche Papsttum, die Scholastik und die Vorreformatoren bis an die Schwelle der Reformation. González verbindet gründliche Quellenkenntnis mit einer allgemeinverständlichen Sprache und ordnet die Geschichte der Kirche stets in ihren politischen und kulturellen Rahmen ein. Das Buch eignet sich hervorragend als erste umfassende Einführung in die Kirchengeschichte für Gemeindeleiter, Prediger und interessierte Gemeindeglieder.",
    },
    answers: {
      title: "Das Antwort-Buch",
      desc: "Antworten auf 12 häufig gestellte Fragen zu Schöpfung, Genesis und Evolution.",
      long: "„Das Antwort-Buch\" von Ken Ham, Andrew Snelling und Carl Wieland gibt verständliche, wissenschaftlich fundierte und biblisch begründete Antworten auf zwölf der am häufigsten gestellten Fragen zur Genesis, zur Schöpfung und zur Evolution: Woher kam die Frau Kains? Was ist mit den Dinosauriern? Wie passen Millionen Jahre mit der Bibel zusammen? Ist die Sintflut historisch? Wie erklärt man die Vielfalt der Rassen? Die Autoren zeigen, dass der biblische Bericht in Genesis 1–11 wissenschaftlich glaubwürdig und theologisch grundlegend ist. Das Buch ist ein wertvoller Ratgeber für Eltern, Lehrer, Jugendliche und für jeden, der Fragen von Skeptikern beantworten möchte.",
    },
    cults: {
      title: "Sekten und Weltreligionen im Licht der Bibel",
      desc: "Überblick der bekanntesten Sekten und Religionen mit biblischer Beurteilung.",
      long: "Nikolai Porublev bietet einen sachlichen und übersichtlichen Vergleich der großen Weltreligionen (Islam, Hinduismus, Buddhismus, Judentum) sowie der bekanntesten Sekten und pseudochristlichen Gruppen (Zeugen Jehovas, Mormonen, Christliche Wissenschaft, New Age u. a.). Für jede Bewegung werden Geschichte, Lehren, heilige Schriften und Praxis dargestellt und anschließend im Licht der Heiligen Schrift geprüft. Das Buch hilft Gemeindegliedern, Ähnlichkeiten und entscheidende Unterschiede zum biblischen Evangelium klar zu erkennen und einen freundlichen, aber standhaften Zeugendienst gegenüber Anhängern anderer Religionen zu führen.",
    },
    twobabylons: {
      title: "Die zwei Babylons",
      desc: "Historisch reich belegtes Werk (1853) über die heidnischen Wurzeln religiöser Bräuche.",
      long: "Das 1853 erstmals erschienene Werk von Alexander Hislop untersucht mit einer Fülle historischer Belege den Ursprung vieler religiöser Bräuche und zeigt Parallelen zwischen den altbabylonischen Kulten und späteren religiösen Traditionen auf. Hislop diskutiert Feste, Symbole, Ämter und Zeremonien und stellt sie den Aussagen der Bibel gegenüber. Das Buch war lange Zeit eine der einflussreichsten protestantischen Untersuchungen zu dieser Thematik und wird bis heute als Diskussionsgrundlage gelesen — mit gebotener kritischer Prüfung im Licht der Schrift.",
    },
    antiquities: {
      title: "Jüdische Altertümer",
      desc: "Geschichte des jüdischen Volkes von der Schöpfung bis Herodes dem Großen.",
      long: "Flavius Josephus (37 – ca. 100 n. Chr.), jüdischer Historiker und Priester, verfasste dieses monumentale Werk in 20 Büchern für ein griechisch-römisches Publikum. Er beschreibt die Geschichte des jüdischen Volkes von der Erschaffung der Welt über die Patriarchen, den Auszug aus Ägypten, die Zeit der Richter und Könige, das Exil, die Rückkehr, die Makkabäerzeit bis in die Regierungszeit Herodes' des Großen. Für Bibelleser und Prediger sind die „Jüdischen Altertümer\" eine unschätzbare Quelle für das Verständnis des historischen und kulturellen Hintergrunds beider Testamente.",
    },
    jewishwar: {
      title: "Der Jüdische Krieg",
      desc: "Belagerung Jerusalems und die dramatischen Ereignisse des Jüdischen Krieges.",
      long: "Josephus schildert als Augenzeuge den Aufstand der Juden gegen Rom (66–73 n. Chr.), die verheerende Belagerung Jerusalems durch Titus, die Zerstörung des zweiten Tempels und den heldenhaften Widerstand auf Masada. Das Werk ist eine der wichtigsten außerbiblischen Quellen zur Situation Palästinas im 1. Jahrhundert und hilft, die Aussagen Jesu über den Untergang Jerusalems (Matthäus 24; Lukas 21) und die Umstände der frühen Christenheit besser zu verstehen.",
    },
    homiletics: {
      title: "Homiletik — Lehrbuch",
      desc: "Vorbereitung und Halten biblischer Predigten.",
      long: "Dieses Lehrbuch der Homiletik führt Schritt für Schritt in die Kunst und Wissenschaft der christlichen Predigt ein: Auslegung des Bibeltextes, Aufbau der Predigt, verschiedene Predigtformen (thematisch, textbezogen, expositorisch), Sprache, Illustration, Anwendung, geistliche Vorbereitung des Predigers und praktische Fragen des Vortrags. Ein grundlegendes Werk für Prediger, Bibelschullehrer und alle, die das Wort Gottes klar, treu und lebensnah verkündigen möchten.",
    },
    prophets: {
      title: "Vorsicht: Propheten!",
      desc: "Kritische Betrachtung endzeitlicher Verführungen — Fortsetzung von „Spiel mit dem Feuer\".",
      long: "Wolfgang Bühne setzt in „Vorsicht: Propheten!\" seine Auseinandersetzung mit den charismatischen Strömungen fort und zeigt an konkreten Beispielen, wie moderne „Propheten\", „Apostel\" und Wunderheiler unter biblischen Vorzeichen falsche Erwartungen wecken und die Gemeinden verunsichern. Das Buch ruft zu einer nüchternen, biblisch geprüften Haltung im Blick auf Prophetie und außergewöhnliche Erlebnisse auf und ist eine wertvolle Hilfe zur geistlichen Unterscheidung in der Endzeit.",
    },
    fire: {
      title: "Spiel mit dem Feuer",
      desc: "Entstehung und Entwicklung der Pfingst- und charismatischen Bewegung.",
      long: "Wolfgang Bühne zeichnet in „Spiel mit dem Feuer\" die Geschichte der pfingstlichen und charismatischen Bewegungen vom Anfang des 20. Jahrhunderts bis zur „Dritten Welle\" nach. Er beleuchtet Personen, Lehren, prophetische Ansprüche, Zeichen und Wunder und stellt sie dem Zeugnis der Heiligen Schrift gegenüber. Das Buch ist keine polemische Abrechnung, sondern eine sorgfältig belegte, seelsorgerlich verantwortete Warnung vor unbiblischer Erfahrungssuche und ein Aufruf zur nüchternen Nachfolge Jesu.",
    },
    luther: {
      title: "Hier stehe ich — Das Leben Martin Luthers",
      desc: "Klassische Biographie über Martin Luther und die Reformation.",
      long: "Roland Baintons „Hier stehe ich\" ist die weltweit bekannteste Biographie Martin Luthers. Lebendig und quellennah erzählt Bainton Luthers Weg vom Augustinermönch zum Reformator: die Anfechtungen im Kloster, den Thesenanschlag 1517, den Reichstag zu Worms, die Übersetzung der Bibel auf der Wartburg, die Bauernkriege, die Ordnung der neuen Kirche und die letzten Jahre in Wittenberg. Zugleich vermittelt das Buch die theologischen Grundeinsichten der Reformation — Rechtfertigung allein aus Glauben, allein durch die Gnade, allein aus der Schrift.",
    },
    otspeaks: {
      title: "Das Alte Testament spricht",
      desc: "Warum das Alte Testament weit mehr ist als ein historisches Denkmal.",
      long: "Samuel J. Schultz führt durch das Alte Testament in seinem historischen, geographischen und theologischen Zusammenhang: vom Anfang in Genesis über die Erzväter, den Bund am Sinai, die Zeit der Landnahme, die Königszeit, die Propheten bis zum Ende der Perserzeit. Das Buch zeigt, wie das Alte Testament das Werk und Wort des lebendigen Gottes bezeugt und auf Christus hinweist. Ein hervorragendes Studien- und Lehrbuch für Bibelkurse, Hauskreise und die persönliche Vertiefung.",
    },
    ntsurvey: {
      title: "Überblick über das Neue Testament",
      desc: "Politischer, sozialer, kultureller und religiöser Hintergrund des Neuen Testaments.",
      long: "Merrill C. Tenney bietet einen umfassenden Überblick über alle 27 Schriften des Neuen Testaments: Zeitgeschichte des Judentums und des Römischen Reiches, das Leben Jesu, die Apostelgeschichte, die Paulusbriefe, die katholischen Briefe und die Offenbarung. Für jedes Buch werden Verfasser, Empfänger, Aufbau, theologische Schwerpunkte und Anwendung dargestellt. Das Standardwerk eignet sich für Bibelschulen, Prediger, Hauskreisleiter und alle, die das Neue Testament in seinem Zusammenhang studieren wollen.",
    },
    hermeneutics: {
      title: "Hermeneutik",
      desc: "Grundsätze und Prozess der Auslegung der Bibel.",
      long: "Henry A. Virklers Lehrbuch führt systematisch in die Grundsätze der Bibelauslegung ein: Geschichte der Hermeneutik, historisch-grammatische Methode, Kontext, literarische Gattungen (Erzählung, Poesie, Weisheit, Prophetie, Gleichnisse, Briefe), Typologie, Vorbild und Anwendung. Virkler verbindet wissenschaftliche Gründlichkeit mit einer klaren Struktur und vielen praktischen Übungen. Ein empfehlenswertes Standardwerk für Prediger, Bibelschüler und ernsthafte Bibelleser.",
    },
    howtoread: {
      title: "Die Bibel lesen und ihren ganzen Reichtum entdecken",
      desc: "Ein tiefes Verständnis der Bibel ist keinem Elitezirkel vorbehalten.",
      long: "Gordon D. Fee und Douglas Stuart zeigen in diesem weltweit verbreiteten Klassiker, wie man die verschiedenen Gattungen der Bibel richtig liest — Erzählung, Gesetz, Psalmen, Weisheit, Prophetie, Evangelien, Gleichnisse, Briefe, Offenbarung. Jedes Kapitel ist reich an Beispielen und praktischen Anwendungen und zeigt, wie ein sorgfältiges Lesen zu einer treuen Auslegung und einer relevanten Anwendung in Gemeinde und Leben führt. Ein ideales Buch für den Einstieg in die verantwortete Bibellese.",
    },
    ntexegesis: {
      title: "Exegese des Neuen Testaments",
      desc: "Der Prozess der Auslegung: was der biblische Autor sagen wollte.",
      long: "Gordon D. Fee beschreibt Schritt für Schritt den Weg von der Textbeobachtung zur fertigen Auslegung eines neutestamentlichen Textes: Textkritik, Übersetzungsvergleich, historisch-kultureller Kontext, literarischer Kontext, Grammatik, Wortstudien, biblisch-theologischer Zusammenhang, Sekundärliteratur und Anwendung. Das Buch richtet sich an Prediger, Studenten und alle, die eine solide Grundlage für die Predigt und Lehre aus dem Neuen Testament suchen.",
    },
  },
  en: {
    history2: { title: "The Story of Christianity, Vol. 2 — Reformation to the Present Day", desc: "Church life from the 16th century to our time.", long: "The second volume of Justo L. González's classic covers the Reformation, the Catholic response, the spread of Christianity to the New World, the great revivals, the age of mission, the theological challenges of modernity, and the growth of the church in Asia, Africa and Latin America. A superb overview for pastors, students and lay readers." },
    history1: { title: "The Story of Christianity, Vol. 1 — Early Church to the Reformation", desc: "How the Christian faith spread across the world.", long: "The first volume moves from the New Testament through the early church, the persecutions, the councils, monasticism, the medieval papacy, scholasticism and the forerunners of the Reformation. González combines careful scholarship with accessible language and always sets church history in its political and cultural context." },
    answers: { title: "The Answers Book", desc: "Answers to 12 common questions about Genesis and origins.", long: "Ken Ham, Andrew Snelling and Carl Wieland answer twelve of the most frequently asked questions about Genesis, creation and evolution: where did Cain's wife come from, what about the dinosaurs, how do millions of years fit with the Bible, is the Flood historical, how do we explain the diversity of races. A valuable resource for parents, teachers and young people." },
    cults: { title: "Cults and World Religions in the Light of the Bible", desc: "Overview of major cults and religions with a biblical assessment.", long: "Nikolai Porublev gives a balanced overview of the major world religions (Islam, Hinduism, Buddhism, Judaism) and of well-known cults and pseudo-Christian movements (Jehovah's Witnesses, Mormons, Christian Science, New Age). For each movement he presents history, teachings, scriptures and practices, then evaluates them by Scripture — a helpful guide for lay witness." },
    twobabylons: { title: "The Two Babylons", desc: "1853 study of the pagan roots of many religious rites.", long: "First published in 1853, Alexander Hislop's work uses extensive historical evidence to trace parallels between ancient Babylonian cults and later religious traditions — festivals, symbols, offices and ceremonies. Long one of the most influential Protestant treatments of the subject, still read today with due critical reflection in the light of Scripture." },
    antiquities: { title: "Antiquities of the Jews", desc: "History of the Jewish people from creation to Herod the Great.", long: "Flavius Josephus (AD 37 – c. 100), Jewish historian and priest, wrote this twenty-book history for a Greco-Roman audience: from creation through the patriarchs, the exodus, the judges and kings, the exile and return, the Maccabees, and Herod the Great. An invaluable resource for the historical background of both Testaments." },
    jewishwar: { title: "The Jewish War", desc: "The siege of Jerusalem and the events of the Jewish War.", long: "As an eyewitness Josephus recounts the Jewish revolt against Rome (AD 66–73), the devastating siege of Jerusalem by Titus, the destruction of the Second Temple, and the resistance at Masada. One of the most important non-biblical sources for first-century Palestine and for understanding Jesus' words about the fall of Jerusalem." },
    homiletics: { title: "Homiletics — Textbook", desc: "Preparing and delivering biblical sermons.", long: "This homiletics textbook introduces the art and science of Christian preaching step by step: interpreting the text, structuring the sermon, sermon forms, language, illustration, application, the preacher's spiritual preparation, and practical questions of delivery. A foundational work for preachers and Bible school students." },
    prophets: { title: "Beware: Prophets!", desc: "A critical look at end-time deceptions.", long: "Wolfgang Bühne continues his examination of the charismatic movement, showing with concrete examples how modern 'prophets', 'apostles' and miracle workers create false expectations and unsettle churches. A call to a sober, biblically tested attitude toward prophecy and extraordinary experiences." },
    fire: { title: "Playing with Fire", desc: "Origin and development of the Pentecostal and charismatic movements.", long: "Wolfgang Bühne traces the history of the Pentecostal and charismatic movements from the beginning of the 20th century to the 'Third Wave', examining leaders, teachings, prophetic claims, signs and wonders in the light of Scripture. Not a polemical broadside but a carefully documented, pastorally responsible warning." },
    luther: { title: "Here I Stand — A Life of Martin Luther", desc: "Classic biography of Martin Luther.", long: "Roland Bainton's 'Here I Stand' is the world's best-known biography of Martin Luther, telling his story from Augustinian monk to Reformer: the struggles in the monastery, the 95 Theses, the Diet of Worms, the translation of the Bible at the Wartburg, the peasant wars, the ordering of the new church, and the last years in Wittenberg — while also communicating the theological insights of the Reformation." },
    otspeaks: { title: "The Old Testament Speaks", desc: "Why the Old Testament is far more than a historical monument.", long: "Samuel J. Schultz surveys the Old Testament in its historical, geographical and theological context: from Genesis through the patriarchs, the Sinai covenant, the conquest, the kings, the prophets, to the end of the Persian period, showing how the Old Testament witnesses to the living God and points to Christ." },
    ntsurvey: { title: "New Testament Survey", desc: "Background and books of the New Testament.", long: "Merrill C. Tenney provides a comprehensive overview of the 27 books of the New Testament: the historical setting of Judaism and Rome, the life of Jesus, Acts, the Pauline Epistles, the General Epistles, and Revelation. For each book: author, recipients, structure, theological emphases and application. A standard work for Bible schools and preachers." },
    hermeneutics: { title: "Hermeneutics", desc: "Principles and process of interpreting the Bible.", long: "Henry A. Virkler's textbook is a systematic introduction to biblical interpretation: history of hermeneutics, the historical-grammatical method, context, literary genres (narrative, poetry, wisdom, prophecy, parables, epistles), typology, and application. Scholarly, clearly structured, with many practical exercises." },
    howtoread: { title: "How to Read the Bible for All Its Worth", desc: "A deep understanding of the Bible is accessible to every reader.", long: "Fee and Stuart's international classic shows how to read the different genres of the Bible correctly — narrative, law, psalms, wisdom, prophecy, gospels, parables, epistles, revelation. Each chapter is rich in examples and practical application, showing how careful reading leads to faithful interpretation and relevant application." },
    ntexegesis: { title: "New Testament Exegesis", desc: "Historical study of what the biblical author intended.", long: "Gordon D. Fee describes step by step the path from observation to a finished exegesis of a New Testament text: textual criticism, comparison of translations, historical-cultural context, literary context, grammar, word studies, biblical-theological context, secondary literature and application. For preachers, students and serious Bible readers." },
  },
  ru: {
    history2: { title: "История христианства. Том 2. От Реформации до наших дней", desc: "Церковная жизнь с XVI века до нашего времени.", long: "Второй том классического труда Хусто Л. Гонсалеса охватывает Реформацию, католический ответ, распространение христианства в Новом Свете, великие пробуждения, эпоху миссий, богословские вызовы модерна и рост Церкви в Азии, Африке и Латинской Америке в XX веке. Прекрасный обзор для пасторов, студентов и всех читателей." },
    history1: { title: "История христианства. Том 1. От основания Церкви до Реформации", desc: "Как христианство распространялось по миру.", long: "Первый том ведёт читателя от Нового Завета через раннюю Церковь, гонения, вселенские соборы, монашество, средневековое папство, схоластику и предреформаторов до порога Реформации. Гонсалес соединяет тщательное знание источников с доступным языком и всегда помещает историю Церкви в её политический и культурный контекст." },
    answers: { title: "Книга ответов", desc: "Ответы на 12 частых вопросов о книге Бытия и творении.", long: "Кен Хэм, Эндрю Снеллинг и Карл Виланд отвечают на двенадцать самых частых вопросов о книге Бытия, творении и эволюции: откуда взялась жена Каина, что с динозаврами, как соотнести миллионы лет с Библией, историчен ли потоп, как объяснить разнообразие рас. Ценное пособие для родителей, учителей и молодёжи." },
    cults: { title: "Культы и мировые религии в свете Библии", desc: "Обзор основных культов и религий с оценкой Писания.", long: "Николай Порублев даёт сбалансированный обзор основных мировых религий (ислам, индуизм, буддизм, иудаизм) и известных культов и псевдохристианских движений (Свидетели Иеговы, мормоны, «Христианская наука», Нью Эйдж): их история, учения, священные книги, практика — и их оценка в свете Писания." },
    twobabylons: { title: "Два Вавилона", desc: "Труд 1853 года о языческих корнях религиозных обрядов.", long: "Впервые изданная в 1853 году работа Александра Хислопа приводит обширный исторический материал и прослеживает параллели между древневавилонскими культами и позднейшими религиозными традициями — праздниками, символами, служениями и обрядами. Один из наиболее влиятельных протестантских трудов на эту тему, читаемый и сегодня с должной критической проверкой в свете Писания." },
    antiquities: { title: "Иудейские древности", desc: "История еврейского народа от сотворения мира до Ирода Великого.", long: "Иосиф Флавий (37 — ок. 100 г.), иудейский историк и священник, написал этот монументальный труд в 20 книгах для греко-римского читателя: от сотворения мира через патриархов, исход, эпоху судей и царей, изгнание и возвращение, Маккавеев до правления Ирода Великого. Незаменимый источник для понимания исторического фона обоих Заветов." },
    jewishwar: { title: "Иудейская война", desc: "Осада Иерусалима и события Иудейской войны.", long: "Как очевидец Иосиф Флавий описывает восстание иудеев против Рима (66–73 гг.), опустошительную осаду Иерусалима Титом, разрушение Второго Храма и сопротивление в Масаде. Один из важнейших внебиблейских источников по Палестине I века и по контексту слов Иисуса о падении Иерусалима." },
    homiletics: { title: "Гомилетика. Учебное пособие", desc: "Подготовка и произнесение библейских проповедей.", long: "Учебник гомилетики шаг за шагом вводит в искусство и науку христианской проповеди: истолкование текста, построение проповеди, её виды, язык, иллюстрации, применение, духовная подготовка проповедника и практические вопросы произнесения. Фундаментальный труд для проповедников и студентов библейских школ." },
    prophets: { title: "Осторожно: пророки!", desc: "Критический взгляд на обольщения последнего времени.", long: "Вольфганг Бюне продолжает разбор харизматических течений и на конкретных примерах показывает, как современные «пророки», «апостолы» и чудотворцы порождают ложные ожидания и вносят смуту в общины. Призыв к трезвому, библейски проверенному отношению к пророчеству и необычным переживаниям." },
    fire: { title: "Игра с огнём", desc: "Возникновение и развитие пятидесятнического и харизматического движения.", long: "Вольфганг Бюне прослеживает историю пятидесятнического и харизматического движений с начала XX века до «Третьей волны», рассматривает деятелей, учения, пророческие притязания, знамения и чудеса в свете Писания. Не полемика, а тщательно задокументированное, пастырски ответственное предостережение." },
    luther: { title: "На сём стою. Жизнь Мартина Лютера", desc: "Классическая биография Мартина Лютера.", long: "«На сём стою» Роланда Бейнтона — самая известная в мире биография Мартина Лютера: путь от августинского монаха до реформатора, борения в монастыре, 95 тезисов, Вормсский рейхстаг, перевод Библии на Вартбурге, крестьянские войны, устроение новой Церкви и последние годы в Виттенберге — вместе с богословскими открытиями Реформации." },
    otspeaks: { title: "Ветхий Завет говорит", desc: "Почему Ветхий Завет — больше, чем историческое повествование.", long: "Сэмюэль Дж. Шульц проводит читателя по Ветхому Завету в его историческом, географическом и богословском контексте: от Бытия через патриархов, Синайский завет, завоевание, царей, пророков до конца персидского периода — показывая, как Ветхий Завет свидетельствует о живом Боге и указывает на Христа." },
    ntsurvey: { title: "Обзор Нового Завета", desc: "Фон и книги Нового Завета.", long: "Меррилл Тенни даёт полный обзор 27 книг Нового Завета: исторический фон иудаизма и Рима, жизнь Иисуса, Деяния, Послания Павла, соборные Послания и Откровение. Для каждой книги — автор, адресаты, структура, богословские акценты и применение. Стандартный труд для библейских школ и проповедников." },
    hermeneutics: { title: "Герменевтика", desc: "Принципы и процесс толкования Библии.", long: "Учебник Генри Виркеля — систематическое введение в толкование Библии: история герменевтики, историко-грамматический метод, контекст, литературные жанры (повествование, поэзия, мудрость, пророчество, притчи, послания), типология и применение. Научно основательно, ясно структурировано, с множеством практических упражнений." },
    howtoread: { title: "Как читать Библию и видеть всю её ценность", desc: "Глубокое понимание Библии доступно каждому читателю.", long: "Международный классический труд Гордона Фи и Дугласа Стюарта показывает, как правильно читать разные жанры Библии — повествование, закон, псалмы, мудрость, пророчество, Евангелия, притчи, послания, Откровение. Каждая глава богата примерами и практическим применением." },
    ntexegesis: { title: "Экзегетика Нового Завета", desc: "Историческое исследование замысла библейского автора.", long: "Гордон Фи шаг за шагом описывает путь от наблюдения над текстом до завершённой экзегетики новозаветного отрывка: текстология, сравнение переводов, историко-культурный и литературный контекст, грамматика, изучение слов, библейско-богословский контекст, вторичная литература и применение. Для проповедников и студентов." },
  },
};

function Books() {
  const { t, lang } = useI18n();
  const items = TXT[lang] ?? TXT.de;
  const fallbackNotice = lang !== "de" && lang !== "en" && lang !== "ru";
  const [open, setOpen] = useState<Record<string, boolean>>({});

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
              const isOpen = !!open[b.id];
              return (
                <div key={b.id} className="book-card">
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
                    <p className="book-desc">{isOpen ? info.long : info.desc}</p>
                    <button
                      type="button"
                      className="book-more"
                      onClick={() => setOpen((s) => ({ ...s, [b.id]: !s[b.id] }))}
                      aria-expanded={isOpen}
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit", color: "inherit" }}
                    >
                      {isOpen ? t("pages.books.readLess") : t("pages.books.readMore")} {isOpen ? "↑" : "↓"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
