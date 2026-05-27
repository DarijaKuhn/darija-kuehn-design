import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import churchPhoto from "@/assets/church.jpeg";

function Typewriter({ text, speed = 90 }: { text: string; speed?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= text.length) return;
    const id = setTimeout(() => setN(n + 1), speed);
    return () => clearTimeout(id);
  }, [n, text.length, speed]);
  const done = n >= text.length;
  return (
    <>
      {text.slice(0, n)}
      <span className={`tw-caret ${done ? "tw-caret-stop" : ""}`} aria-hidden>|</span>
    </>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  return (
    <section className="cover">
      <img className="cover-bg" src={churchPhoto} alt="Freie Evangeliums-Christen-Gemeinde Dresden" />
      <div className="cover-tint" />

      <Link to="/schedule" className="cover-menu">
        <span className="cm-icon"><span /><span /></span>
        Menu
      </Link>

      <div className="cover-inner">
        <h1 className="cover-title">
          <span className="ct-line">
            <Typewriter text="Евангельские" speed={80} />
          </span>
          <span className="ct-line ct-script">
            <Typewriter text="Христиане" speed={110} />
          </span>
        </h1>

        <div className="cover-body">
          <div className="cover-kicker">Дом, где звучит живое Слово</div>
          <p className="cover-sub">
            Русскоязычная евангельская община в Дрездене — место молитвы,
            изучения Писания и тёплого общения во Христе. Мы будем рады встретить вас на богослужении.
          </p>

          <button className="cover-cta" onClick={() => navigate({ to: "/contact" })}>
            Как нас найти <span className="arr">➜</span>
          </button>
        </div>
      </div>

      <div className="cover-roles">
        <Link to="/schedule">Богослужения</Link><span>|</span>
        <Link to="/ministries">Служения</Link><span>|</span>
        <Link to="/about">О нас</Link><span>|</span>
        <Link to="/contact">Контакт</Link>
      </div>
    </section>
  );
}
