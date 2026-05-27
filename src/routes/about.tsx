import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({ meta: [{ title: "О нас — Евангельские Христиане Дрезден" }] }),
});

function About() {
  return (
    <main className="page-wrap">
      <div className="page-eyebrow">О нашей общине</div>
      <h1 className="page-h1">Тихая радость <em>совместной</em> веры</h1>
      <p className="page-lead">
        Мы — русскоязычные Евангельские Христиане в немецком городе Дрездене.
        Наша община объединяет около пятидесяти членов из разных стран бывшего СНГ,
        нашедших здесь, в Германии, духовный дом и братское общение.
      </p>

      <div className="page-body">
        <p>
          Богослужения проходят преимущественно на русском языке; немецкие проповеди переводятся.
          Мы рады каждому — тому, кто уже знает и любит Бога, и тому, кто только ищет Его.
        </p>
        <p>
          На нашем сайте вы найдёте аудио- и видеопроповеди, христианскую литературу, стихи,
          статьи и материалы для детей. Пусть всё это послужит вашему назиданию и духовному росту.
        </p>
      </div>

      <div className="card-grid">
        <div className="card"><div className="ic">♥</div><h3>~50</h3><p>Членов общины</p></div>
        <div className="card"><div className="ic">✦</div><h3>4+</h3><p>Страны СНГ</p></div>
        <div className="card"><div className="ic">✉</div><h3>2×</h3><p>Языка служения</p></div>
        <div className="card"><div className="ic">✝</div><h3>10+</h3><p>Лет в Дрездене</p></div>
      </div>
    </main>
  );
}
