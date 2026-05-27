import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/schedule")({
  component: Schedule,
  head: () => ({ meta: [{ title: "Расписание — Евангельские Христиане Дрезден" }] }),
});

function Schedule() {
  const items = [
    ["Среда", "18:00", "Молитвенное служение", "Совместная молитва за общину, город и нужды братьев и сестёр."],
    ["Пятница", "18:00", "Изучение Библии", "Глубокое исследование Священного Писания и обсуждение в кругу."],
    ["Воскресенье", "10:00", "Воскресное Богослужение", "Главное собрание недели — проповедь, пение, причастие, общение."],
    ["Суббота", "14:00", "Молодёжное общение", "По предварительной договорённости — общение и совместные мероприятия."],
    ["Воскресенье", "10:00", "Библейский урок для детей", "Старшая группа 10:00–11:00, младшая и средняя 11:00–12:00."],
    ["Языки", "RU · DE", "Перевод служений", "Богослужения на русском; немецкие проповеди переводятся."],
  ];
  return (
    <main className="page-wrap">
      <Link to="/" className="back-home"><span className="ar">←</span> На главную</Link>
      <div className="page-eyebrow">Расписание</div>
      <h1 className="page-h1">Когда мы <em>собираемся</em></h1>
      <p className="page-lead">
        Все служения проходят по адресу Altenberger Strasse 87, 01279 Dresden. Двери открыты для всех.
      </p>
      <div className="card-grid">
        {items.map(([d, t, n, p]) => (
          <div className="card" key={n}>
            <div className="ic">⏱</div>
            <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#2f7d4f", fontWeight: 600 }}>{d} · {t}</div>
            <h3 style={{ marginTop: 6 }}>{n}</h3>
            <p>{p}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
