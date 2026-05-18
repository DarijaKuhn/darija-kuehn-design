import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Евангельские Христиане Дрезден — Freie Evangeliums-Christen-Gemeinde Dresden e.V." },
      { name: "description", content: "Русскоязычная евангельская община в Дрездене. Altenberger Strasse 87, 01279 Dresden. Богослужения, изучение Библии, мероприятия для детей." },
    ],
  }),
});

const CHURCH_PHOTO = "https://propovednik.my1.ru/Foto_Gemeinde_Hausnummer-2.jpg";
const LILY = "https://propovednik.my1.ru/Blumen/Belaja_Lilija_9_ohne_Hintergrund.png";

function Index() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".fade-in").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#top" className="brand">
          <div className="brand-mark">✝</div>
          <div className="brand-name">Евангельские Христиане<small>Dresden · Germany</small></div>
        </a>
        <div className="nav-links">
          <a href="#about">О нас</a>
          <a href="#schedule">Расписание</a>
          <a href="#ministries">Служения</a>
          <a href="#contact">Контакт</a>
        </div>
        <a href="#contact" className="nav-cta">Посетить</a>
      </nav>

      <header id="top" className="hero">
        <div className="fade-in">
          <div className="hero-eyebrow">Freie Evangeliums-Christen-Gemeinde Dresden e.V.</div>
          <h1 className="hero-h1">Дом, где звучит<br/><em>живое</em> Слово.</h1>
          <p className="hero-sub">
            Русскоязычная евангельская община в самом сердце Саксонии. Около 50 братьев и сестёр из России,
            Украины, Казахстана и других стран СНГ — мы собираемся, чтобы молиться, изучать Писание
            и служить ближнему здесь, в Дрездене.
          </p>
          <div className="hero-verse">
            <p>«Ибо всякий, кто призовёт имя Господне, спасётся.»</p>
            <cite>Послание к Римлянам 10:13</cite>
          </div>
          <div className="hero-btns">
            <a href="#schedule" className="btn-primary">Расписание служений →</a>
            <a href="#contact" className="btn-outline">Как добраться</a>
          </div>
        </div>
        <div className="hero-visual fade-in">
          <img src={LILY} alt="" className="hero-lily" loading="lazy" />
          <div className="hero-photo-wrap">
            <img src={CHURCH_PHOTO} alt="Здание общины — Altenberger Strasse 87, Dresden" className="hero-photo" />
            <div className="hero-photo-tag">
              <div className="tag-dot" />
              <div className="tag-text"><strong>Воскресное Богослужение</strong>каждое воскресенье · 10:00</div>
            </div>
          </div>
        </div>
      </header>

      <section id="about" className="about">
        <div className="fade-in">
          <div className="s-eyebrow">О нашей общине</div>
          <h2 className="s-h">Тихая радость <em>совместной</em> веры.</h2>
        </div>
        <div className="about-grid">
          <div className="about-text fade-in">
            <p>
              Здравствуйте, дорогие друзья! Мы — русскоязычные Евангельские Христиане в немецком городе
              Дрездене. Наша община объединяет около пятидесяти членов из разных стран бывшего СНГ,
              нашедших здесь, в Германии, духовный дом и братское общение.
            </p>
            <p>
              Богослужения проходят преимущественно на русском языке; немецкие проповеди переводятся.
              Мы рады каждому — тому, кто уже знает и любит Бога, и тому, кто только ищет Его.
            </p>
            <p>
              На нашем сайте вы найдёте аудио- и видеопроповеди, христианскую литературу, стихи,
              статьи и материалы для детей. Пусть всё это послужит вашему назиданию и духовному росту.
            </p>
          </div>
          <div className="about-stats fade-in">
            <div className="stat"><div className="stat-n">~50</div><div className="stat-l">Членов общины</div></div>
            <div className="stat"><div className="stat-n">4+</div><div className="stat-l">Страны СНГ</div></div>
            <div className="stat"><div className="stat-n">2×</div><div className="stat-l">Языка служения</div></div>
            <div className="stat"><div className="stat-n">10+</div><div className="stat-l">Лет в Дрездене</div></div>
          </div>
        </div>
      </section>

      <section id="schedule" className="schedule">
        <div className="fade-in">
          <div className="s-eyebrow">Расписание</div>
          <h2 className="s-h">Когда мы <em>собираемся</em>.</h2>
          <p className="s-sub">Все служения проходят по адресу Altenberger Strasse 87, 01279 Dresden. Двери открыты для всех.</p>
        </div>
        <div className="sch-grid">
          {[
            ["Среда","18:00","Молитвенное служение","Совместная молитва за общину, город и нужды братьев и сестёр."],
            ["Пятница","18:00","Изучение Библии","Глубокое исследование Священного Писания и обсуждение в кругу."],
            ["Воскресенье","10:00","Воскресное Богослужение","Главное собрание недели — проповедь, пение, причастие, общение."],
          ].map(([d,t,h,p]) => (
            <div className="sch-card fade-in" key={h}>
              <div className="sch-day">{d}</div>
              <div className="sch-time">{t}</div>
              <div className="sch-title">{h}</div>
              <div className="sch-desc">{p}</div>
            </div>
          ))}
        </div>
        <div className="sch-grid" style={{marginTop:24}}>
          <div className="sch-card fade-in">
            <div className="sch-day">Суббота</div>
            <div className="sch-time">14:00</div>
            <div className="sch-title">Молодёжное общение</div>
            <div className="sch-desc">По предварительной договорённости — общение, изучение, совместные мероприятия.</div>
          </div>
          <div className="sch-card fade-in">
            <div className="sch-day">Воскресенье</div>
            <div className="sch-time">10:00</div>
            <div className="sch-title">Библейский урок для детей</div>
            <div className="sch-desc">Старшая группа 10:00–11:00, младшая и средняя группы 11:00–12:00.</div>
          </div>
          <div className="sch-card fade-in">
            <div className="sch-day">Языки</div>
            <div className="sch-time">RU · DE</div>
            <div className="sch-title">Перевод служений</div>
            <div className="sch-desc">Богослужения проходят на русском; немецкие проповеди переводятся на русский.</div>
          </div>
        </div>
      </section>

      <section className="verse-section">
        <div className="fade-in">
          <div className="verse-mark">“</div>
          <p className="verse-body">
            Но как призывать Того, в Кого не уверовали? Как веровать в Того, о Ком не слышали?
            Как слышать без проповедующего? <em>Как прекрасны ноги благовествующих мир, благовествующих благое!</em>
          </p>
          <div className="verse-cite">Послание к Римлянам 10:14–15</div>
        </div>
      </section>

      <section id="ministries" className="ministries">
        <div className="fade-in">
          <div className="s-eyebrow">Наши служения</div>
          <h2 className="s-h">Жизнь общины — <em>больше</em>, чем воскресенье.</h2>
        </div>
        <div className="min-grid">
          {[
            ["♪","Проповеди и музыка","Аудио- и видеоматериалы наших богослужений — для тех, кто далеко, и для тех, кто хочет вернуться к услышанному."],
            ["✦","Дети и семья","Воскресные библейские уроки и сезонные мероприятия — христианский лагерь, праздники, поездки."],
            ["✉","Гостевая и контакт","Напишите нам через контактный формуляр — мы будем рады вашим отзывам и вопросам на христианские темы."],
            ["☘","Чтение","Подборка книг, статей и стихов разных авторов — для самостоятельного изучения и духовного назидания."],
            ["⚘","Молодёжь","Тёплое субботнее общение — по предварительной договорённости с пастором или координатором."],
            ["✝","Воскресное служение","Главное собрание недели: молитва, пение, проповедь, причастие и братский обед."],
          ].map(([i,h,p]) => (
            <div className="min-card fade-in" key={h}>
              <div className="min-icon">{i}</div>
              <div className="min-h">{h}</div>
              <div className="min-p">{p}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="fade-in">
          <div className="s-eyebrow">Контакт</div>
          <h2 className="s-h">Приходите <em>в гости</em>.</h2>
          <p className="s-sub">Будем рады встретить вас на ближайшем богослужении. По любым вопросам — пишите или звоните.</p>
        </div>
        <div className="contact-grid">
          <div className="fade-in">
            <div className="c-info">
              <div className="c-row">
                <div className="c-ico">⌂</div>
                <div>
                  <div className="c-label">Адрес</div>
                  <div className="c-val">Altenberger Strasse 87<small>01279 Dresden · Sachsen · Deutschland</small></div>
                </div>
              </div>
              <div className="c-row">
                <div className="c-ico">☎</div>
                <div>
                  <div className="c-label">Телефон</div>
                  <a className="c-val" href="tel:+4903512530403">+49 (0) 351 253 04 03</a>
                </div>
              </div>
              <div className="c-row">
                <div className="c-ico">✉</div>
                <div>
                  <div className="c-label">Сайт общины</div>
                  <a className="c-val" href="https://propovednik.my1.ru" target="_blank" rel="noreferrer">propovednik.my1.ru</a>
                </div>
              </div>
              <div className="c-row">
                <div className="c-ico">✝</div>
                <div>
                  <div className="c-label">Пастор</div>
                  <div className="c-val">Пётр Икс<small>Peter Iks</small></div>
                </div>
              </div>
            </div>

            <div className="transport">
              <div className="transport-h">Как добраться</div>
              <ul>
                <li><b>Bus 87</b> — Haltestelle <i>Liebenauer Strasse</i></li>
                <li><b>Strassenbahn 1 & 2</b> — Haltestelle <i>Marienberger Strasse</i></li>
                <li><b>PKW</b> — kostenfreie Parkplätze vor Ort</li>
              </ul>
            </div>
          </div>

          <div className="c-map fade-in">
            <iframe
              title="Karte: Altenberger Strasse 87, Dresden"
              src="https://www.openstreetmap.org/export/embed.html?bbox=13.825%2C50.998%2C13.855%2C51.018&layer=mapnik&marker=51.008%2C13.840"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      <footer>
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="brand">
              <div className="brand-mark">✝</div>
              <div className="brand-name">Евангельские Христиане<small>Dresden · Germany</small></div>
            </div>
            <p>Freie Evangeliums-Christen-Gemeinde Dresden e.V. — русскоязычная евангельская община в Саксонии.
              Богослужения, изучение Библии и братское общение в любви Христовой.</p>
          </div>
          <div className="foot-col">
            <h4>Навигация</h4>
            <a href="#about">О нас</a>
            <a href="#schedule">Расписание</a>
            <a href="#ministries">Служения</a>
            <a href="#contact">Контакт</a>
          </div>
          <div className="foot-col">
            <h4>Контакт</h4>
            <p>Altenberger Strasse 87<br/>01279 Dresden, Deutschland</p>
            <a href="tel:+4903512530403">+49 (0) 351 253 04 03</a>
            <a href="https://propovednik.my1.ru" target="_blank" rel="noreferrer">propovednik.my1.ru</a>
          </div>
        </div>
        <div className="foot-bottom">
          <div>© {new Date().getFullYear()} Freie Evangeliums-Christen-Gemeinde Dresden e.V.</div>
          <div>Сделано с любовью · DSGVO-konform · Keine externen Fonts</div>
        </div>
      </footer>
    </>
  );
}
