import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import { z } from "zod";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Kontakt — FECG Dresden" },
      { name: "description", content: "Kontakt zur FECG Dresden: info@fecg-dresden.de, +49 351 253 04 03, Altenberger Str. 87, 01279 Dresden." },
    ],
  }),
});

function Contact() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedAt = useRef<number>(Date.now());
  const [captcha, setCaptcha] = useState<{ a: number; b: number }>({ a: 0, b: 0 });

  useEffect(() => {
    mountedAt.current = Date.now();
    setCaptcha({ a: Math.floor(Math.random() * 8) + 2, b: Math.floor(Math.random() * 8) + 1 });
  }, []);

  const captchaAnswer = useMemo(() => captcha.a + captcha.b, [captcha]);

  const contactSchema = useMemo(() => z.object({
    name: z.string().trim().min(2, t("pages.contact.errName")).max(100),
    email: z.string().trim().email(t("pages.contact.errEmail")).max(255),
    msg: z.string().trim().min(10, t("pages.contact.errMsg")).max(2000),
  }), [t]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    if ((fd.get("website") as string)?.length) {
      setError(t("pages.contact.errSend"));
      return;
    }
    if (Date.now() - mountedAt.current < 3000) {
      setError(t("pages.contact.errSlow"));
      return;
    }
    if (Number(fd.get("captcha")) !== captchaAnswer) {
      setError(t("pages.contact.errCaptcha"));
      return;
    }

    const parsed = contactSchema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      msg: fd.get("msg"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t("pages.contact.errCheck"));
      return;
    }

    const subject = encodeURIComponent(t("pages.contact.subject").replace("{name}", parsed.data.name));
    const body = encodeURIComponent(`${parsed.data.msg}\n\n${t("pages.contact.from")}: ${parsed.data.name} (${parsed.data.email})`);
    window.location.href = `mailto:info@fecg-dresden.de?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const captchaQ = t("pages.contact.captcha")
    .replace("{a}", String(captcha.a))
    .replace("{b}", String(captcha.b));

  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">{t("legal.breadcrumbHome")}</Link>
          <span>›</span>
          <span className="crumb-here">{t("pages.contact.crumb")}</span>
        </div>
      </div>
      <section className="section section-bg">
        <div className="container">
          <div className="form-grid">
            <div>
              <div className="label" style={{ marginBottom: 8 }}>{t("pages.contact.eyebrow")}</div>
              <h1 className="section-h" style={{ marginBottom: 14 }}>{t("pages.contact.h1")}</h1>
              <p className="body" style={{ marginBottom: 24 }}>{t("pages.contact.intro")}</p>
              <div className="form-ways">
                <a className="form-way" href="mailto:info@fecg-dresden.de">
                  <div className="form-way-icon"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                  <div><div className="form-way-label">{t("pages.contact.email")}</div><div className="form-way-val">info@fecg-dresden.de</div></div>
                </a>
                <a className="form-way" href="tel:+493512530403">
                  <div className="form-way-icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></div>
                  <div><div className="form-way-label">{t("pages.contact.phone")}</div><div className="form-way-val">+49 351 253 04 03</div></div>
                </a>
                <Link className="form-way" to="/map">
                  <div className="form-way-icon"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg></div>
                  <div><div className="form-way-label">{t("pages.contact.address")}</div><div className="form-way-val">{t("pages.contact.addressVal")}</div></div>
                </Link>
              </div>
            </div>
            <div className="form-card">
              <h3>{t("pages.contact.cardTitle")}</h3>
              <p className="form-card-sub">{t("pages.contact.cardSub")}</p>
              <form className="form-fields" onSubmit={onSubmit} noValidate>
                <div className="field-row">
                  <div>
                    <div className="field-label">{t("pages.contact.fName")} <span className="req">*</span></div>
                    <input className="field-input" type="text" name="name" placeholder={t("pages.contact.fNamePh")} autoComplete="given-name" maxLength={100} required />
                  </div>
                  <div>
                    <div className="field-label">{t("pages.contact.email")} <span className="req">*</span></div>
                    <input className="field-input" type="email" name="email" placeholder={t("pages.contact.fEmailPh")} autoComplete="email" maxLength={255} required />
                  </div>
                </div>
                <div>
                  <div className="field-label">{t("pages.contact.fMsg")} <span className="req">*</span></div>
                  <textarea className="field-input" name="msg" placeholder={t("pages.contact.fMsgPh")} maxLength={2000} required />
                </div>

                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                  <label>{t("pages.contact.hpLabel")}<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div className="field-label">
                    {captchaQ} <span className="req">*</span>
                  </div>
                  <input
                    className="field-input"
                    type="number"
                    name="captcha"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={t("pages.contact.captchaPh")}
                    required
                    style={{ maxWidth: 200 }}
                  />
                </div>

                <div className="form-footer-row">
                  <button type="submit" className="btn btn-primary">{t("pages.contact.btn")}</button>
                  <p className="form-privacy">{t("pages.contact.privacy")}</p>
                </div>
                {error && <p style={{ marginTop: 12, fontSize: 13, color: "#c4392a" }}>{error}</p>}
                {sent && !error && <p style={{ marginTop: 12, fontSize: 13, color: "var(--green)" }}>{t("pages.contact.sent")}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
