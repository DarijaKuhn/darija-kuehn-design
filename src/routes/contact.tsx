import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Контакт — Свяжитесь с нами — FECG Dresden" },
      { name: "description", content: "Свяжитесь с FECG Dresden: info@fecg-dresden.de, +49 351 253 04 03, Altenberger Str. 87, 01279 Dresden." },
    ],
  }),
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Введите имя").max(100),
  email: z.string().trim().email("Неверный email").max(255),
  msg: z.string().trim().min(10, "Сообщение слишком короткое").max(2000),
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedAt = useRef<number>(Date.now());
  const [captcha, setCaptcha] = useState<{ a: number; b: number }>({ a: 0, b: 0 });

  useEffect(() => {
    mountedAt.current = Date.now();
    setCaptcha({ a: Math.floor(Math.random() * 8) + 2, b: Math.floor(Math.random() * 8) + 1 });
  }, []);

  const captchaAnswer = useMemo(() => captcha.a + captcha.b, [captcha]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    // Honeypot: hidden field that humans never fill
    if ((fd.get("website") as string)?.length) {
      setError("Ошибка отправки.");
      return;
    }
    // Min time-to-submit (bots fill instantly)
    if (Date.now() - mountedAt.current < 3000) {
      setError("Пожалуйста, заполняйте форму внимательно.");
      return;
    }
    // Math captcha
    if (Number(fd.get("captcha")) !== captchaAnswer) {
      setError("Неверный ответ на проверочный вопрос.");
      return;
    }

    const parsed = contactSchema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      msg: fd.get("msg"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Проверьте данные.");
      return;
    }

    const subject = encodeURIComponent(`Сообщение с сайта: ${parsed.data.name}`);
    const body = encodeURIComponent(`${parsed.data.msg}\n\nОт: ${parsed.data.name} (${parsed.data.email})`);
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
                    <input className="field-input" type="text" name="name" placeholder="Иван Петров" autoComplete="given-name" maxLength={100} required />
                  </div>
                  <div>
                    <div className="field-label">E-mail <span className="req">*</span></div>
                    <input className="field-input" type="email" name="email" placeholder="ivan@beispiel.de" autoComplete="email" maxLength={255} required />
                  </div>
                </div>
                <div>
                  <div className="field-label">Сообщение <span className="req">*</span></div>
                  <textarea className="field-input" name="msg" placeholder="Ваш вопрос или комментарий..." maxLength={2000} required />
                </div>

                {/* Honeypot — visually hidden, hidden from screen readers and tab order */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                  <label>Не заполняйте это поле<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
                </div>

                {/* Simple math captcha */}
                <div style={{ marginTop: 12 }}>
                  <div className="field-label">
                    Защита от спама: сколько будет {captcha.a} + {captcha.b}? <span className="req">*</span>
                  </div>
                  <input
                    className="field-input"
                    type="number"
                    name="captcha"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Введите число"
                    required
                    style={{ maxWidth: 200 }}
                  />
                </div>

                <div className="form-footer-row">
                  <button type="submit" className="btn btn-primary">Отправить письмо →</button>
                  <p className="form-privacy">Данные используются только для ответа на ваше сообщение.</p>
                </div>
                {error && <p style={{ marginTop: 12, fontSize: 13, color: "#c4392a" }}>{error}</p>}
                {sent && !error && <p style={{ marginTop: 12, fontSize: 13, color: "var(--green)" }}>Открыт почтовый клиент — отправьте письмо для завершения.</p>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
