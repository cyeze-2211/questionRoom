import { useState } from "react";

const CONTACT_EMAIL = "jurabek99899@gmail.com";
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorText, setErrorText] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorText("");
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorText("Iltimos, barcha maydonlarni to‘ldiring.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(FORMSUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          _subject: "Savol-xona — yangi aloqa xabari",
          _template: "table",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Yuborishda xatolik yuz berdi.");
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("idle");
      setErrorText(err instanceof Error ? err.message : "Yuborib bo‘lmadi. Keyinroq urinib ko‘ring.");
    }
  };

  return (
    <section
      className="py-20 md:py-28 bg-gradient-to-b from-exam-grey via-white to-exam-cream/30 text-exam-ink"
      id="contact"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
        <div className="reveal space-y-8">
          <span className="inline-flex rounded-full bg-exam-teal/10 text-exam-teal text-xs font-bold uppercase tracking-widest px-4 py-1.5">
            Aloqa
          </span>
          <h2 className="font-display font-extrabold text-exam-teal text-4xl md:text-5xl lg:text-[3.25rem] leading-tight tracking-tight">
            Savollaringiz <span className="text-exam-teal-mid">yoki takliflaringiz</span> bormi?
          </h2>
          <p className="text-exam-muted text-base md:text-lg leading-relaxed max-w-md">
            Formani to‘ldiring — xabaringiz to‘g‘ridan-to‘g‘ri elektron pochtamizga yetib boradi. Tez orada javob beramiz.
          </p>
          <div className="space-y-5 pt-2">
            <div className="flex items-start gap-4 rounded-2xl border border-exam-teal/10 bg-white/80 p-5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-exam-mint/25 flex items-center justify-center text-exam-teal shrink-0">
                <span className="material-symbols-outlined text-xl">schedule</span>
              </div>
              <div>
                <p className="font-display font-bold text-exam-teal text-sm">24 soat ichida</p>
                <p className="text-exam-muted text-sm leading-relaxed mt-1">
                  Arizangizni ko‘rib chiqamiz va bog‘lanamiz.
                </p>
              </div>
            </div>
         
          </div>
        </div>

        <div className="reveal rounded-[2rem] border-[3px] border-sky-200/70 bg-white p-8 md:p-10 lg:p-12 shadow-[0_20px_50px_-15px_rgba(0,47,54,0.12)]">
          <form className="space-y-8" onSubmit={onSubmit} noValidate>
            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs font-bold uppercase tracking-widest text-exam-teal/70 mb-2"
              >
                Ismingiz
              </label>
              <input
                id="contact-name"
                className="w-full rounded-xl border border-exam-grey bg-exam-grey/30 px-4 py-3.5 text-exam-ink placeholder:text-exam-muted/60 focus:outline-none focus:ring-2 focus:ring-exam-teal/25 focus:border-exam-teal/30 transition-shadow"
                placeholder="Ismingizni kiriting"
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === "sending"}
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs font-bold uppercase tracking-widest text-exam-teal/70 mb-2"
              >
                Elektron pochta
              </label>
              <input
                id="contact-email"
                className="w-full rounded-xl border border-exam-grey bg-exam-grey/30 px-4 py-3.5 text-exam-ink placeholder:text-exam-muted/60 focus:outline-none focus:ring-2 focus:ring-exam-teal/25 focus:border-exam-teal/30 transition-shadow"
                placeholder="pochta@sizningdomen.uz"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "sending"}
              />
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-bold uppercase tracking-widest text-exam-teal/70 mb-2"
              >
                Xabaringiz
              </label>
              <textarea
                id="contact-message"
                className="w-full rounded-xl border border-exam-grey bg-exam-grey/30 px-4 py-3.5 text-exam-ink placeholder:text-exam-muted/60 focus:outline-none focus:ring-2 focus:ring-exam-teal/25 focus:border-exam-teal/30 transition-shadow resize-y min-h-[140px]"
                placeholder="Savolingiz, taklifingiz yoki xabaringizni yozing..."
                rows={5}
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === "sending"}
              />
            </div>

            {errorText ? (
              <p className="text-sm text-red-600 font-medium" role="alert">
                {errorText}
              </p>
            ) : null}
            {status === "success" ? (
              <p className="text-sm text-exam-teal font-display font-bold" role="status">
                Xabar yuborildi. Rahmat!
              </p>
            ) : null}

            <button
              className="w-full md:w-auto min-w-[200px] px-10 py-4 bg-exam-teal text-white rounded-full font-display font-bold text-sm uppercase tracking-wider hover:bg-exam-teal-mid transition-colors shadow-md disabled:opacity-60 disabled:pointer-events-none"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Yuborilmoqda…" : "Yuborish"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
