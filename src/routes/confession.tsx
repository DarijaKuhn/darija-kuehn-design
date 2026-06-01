import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/confession")({
  component: Confession,
  head: () => ({
    meta: [
      { title: "Наше вероисповедание — FECG Dresden" },
      { name: "description", content: "Основы веры Евангельских Христиан-Баптистов: Святое Писание, Триединый Бог, спасение по благодати, крещение верующих, Вечеря Господня, Второе пришествие Христа." },
    ],
  }),
});

function Confession() {
  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">Главная</Link>
          <span>›</span>
          <span className="crumb-here">Наше вероисповедание</span>
        </div>
      </div>
      <section className="section section-white">
        <div className="container">
          <div className="label" style={{ marginBottom: 12 }}>Вероисповедание</div>
          <h1 className="section-h" style={{ marginBottom: 20 }}>Наше вероисповедание</h1>
          <div className="confession-body">
            <p>Мы являемся евангельскими христианами-баптистами, которые верят в Библию как единственный авторитет в вопросах веры и жизни.</p>
            <h2>Основные положения нашей веры</h2>
            <ul className="confession-list">
              <li><span className="mark">✦</span><span><strong>Святое Писание</strong> — Библия является Словом Божьим, богодухновенной, непогрешимой и авторитетной.</span></li>
              <li><span className="mark">✦</span><span><strong>Триединый Бог</strong> — Мы верим в одного Бога, существующего вечно в трёх Лицах: Отца, Сына и Святого Духа.</span></li>
              <li><span className="mark">✦</span><span><strong>Спасение по благодати</strong> — Спасение достигается только верой во Иисуса Христа, умершего и воскресшего ради нашего искупления.</span></li>
              <li><span className="mark">✦</span><span><strong>Крещение верующих</strong> — Крещение совершается через погружение для тех, кто сознательно принял Христа.</span></li>
              <li><span className="mark">✦</span><span><strong>Вечеря Господня</strong> — Регулярно отмечается в память о жертве Христа.</span></li>
              <li><span className="mark">✦</span><span><strong>Второе пришествие Христа</strong> — Мы ожидаем буквального, личного возвращения Иисуса Христа.</span></li>
            </ul>
            <div className="quote-box">
              <p className="q">«Так возлюбил Бог мир, что отдал Сына Своего Единородного, дабы всякий верующий в Него не погиб, но имел жизнь вечную.»</p>
              <p className="r">Иоанна 3:16</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
