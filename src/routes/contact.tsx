import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Контакт — Свяжитесь с нами — FECG Dresden" },
      { name: "description", content: "Свяжитесь с FECG Dresden: info@fecg-dresden.de, +49 351 253 04 03, Altenberger Str. 87, 01279 Dresden." },
    ],
  }),
});

function Contact() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Сообщение с сайта: ${fd.get("name")}`);
    const body = encodeURIComponent(`${fd.get("msg")}\n\nОт: ${fd.get("name")} (${fd.get("email")})`);
    window.location.href = `mailto:info@fecg-dresden.de?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">Главная</Link>
          <span>›</span>
          <span className="crumb-here">Контакт</span>
        </div>
      </div>
      <section className="section section-bg">
        <div className="container">
          <div className="form-grid">
            <div>
              <div className="label" style={{ marginBottom: 8 }}>Написать нам</div>
              <h1 className="section-h" style={{ marginBottom: 14 }}>Свяжитесь с нами</h1>
              <p className="body" style={{ marginBottom: 24 }}>Вы можете присылать нам отзывы и вопросы на христианские темы.</p>
              <div className="form-ways">
                <a className="form-way" href="mailto:info@fecg-dresden.de">
                  <div className="form-way-icon"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                  <div><div className="form-way-label">E-mail</div><div className="form-way-val">info@fecg-dresden.de</div></div>
                </a>
                <a className="form-way" href="tel:+493512530403">
                  <div className="form-way-icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></div>
                  <div><div className="form-way-label">Телефон</div><div className="form-way-val">+49 351 253 04 03</div></div>
                </a>
                <Link className="form-way" to="/map">
                  <div className="form-way-icon"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg></div>
                  <div><div className="form-way-label">Адрес</div><div className="form-way-val">Altenberger Str. 87, Dresden</div></div>
                </Link>
              </div>
            </div>
            <div className="form-card">
              <h3>Напишите нам письмо</h3>
              <p className="form-card-sub">Ответим в ближайшее время</p>
              <form className="form-fields" onSubmit={onSubmit} noValidate>
                <div className="field-row">
                  <div>
                    <div className="field-label">Имя <span className="req">*</span></div>
                    <input className="field-input" type="text" name="name" placeholder="Иван Петров" autoComplete="given-name" required />
                  </div>
                  <div>
                    <div className="field-label">E-mail <span className="req">*</span></div>
                    <input className="field-input" type="email" name="email" placeholder="ivan@beispiel.de" autoComplete="email" required />
                  </div>
                </div>
                <div>
                  <div className="field-label">Сообщение <span className="req">*</span></div>
                  <textarea className="field-input" name="msg" placeholder="Ваш вопрос или комментарий..." required />
                </div>
                <div className="form-footer-row">
                  <button type="submit" className="btn btn-primary">Отправить письмо →</button>
                  <p className="form-privacy">Данные используются только для ответа на ваше сообщение.</p>
                </div>
                {sent && <p style={{ marginTop: 12, fontSize: 13, color: "var(--green)" }}>Открыт почтовый клиент — отправьте письмо для завершения.</p>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
