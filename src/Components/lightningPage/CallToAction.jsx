import { NavLink } from "react-router-dom";

const STEPS = [
  {
    title: "Test",
    subtitle: "Bir nechta savol, aniq vaqt",
    bar: "w-[72%] bg-[#c4b5fd]",
  },
  {
    title: "Quiz",
    subtitle: "Qisqa tekshiruv, darhol javob",
    bar: "w-[55%] bg-sky-400/80",
  },
  {
    title: "Imtihon",
    subtitle: "Rasmiy format, to'liq hisobot",
    bar: "w-[88%] bg-exam-mint",
  },
];

export default function CallToAction() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-exam-teal via-exam-teal to-exam-teal-mid border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-stretch reveal">
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <h2 className="font-display font-bold text-white text-3xl md:text-4xl leading-tight">
              Birinchi onlayn testingizni yarating —{" "}
              <span className="text-exam-yellow">test, quiz yoki imtihon</span>
            </h2>
            <p className="text-white/80 text-base md:text-lg leading-relaxed">
              Bir necha daqiqada shablon tanlang, savollar qo&apos;shing va havola orqali ishtirokchilarni taklif qiling —
              natijalar avtomatik yig&apos;iladi.
            </p>
            <div>
              <NavLink to="/login">
                <button
                  type="button"
                  className="bg-exam-yellow text-exam-teal font-bold font-display px-8 py-3.5 rounded-full hover:brightness-105 transition-all shadow-lg"
                >
                  Boshlash
                </button>
              </NavLink>
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-3 gap-4">
            {STEPS.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-white bg-white p-5 md:p-6 shadow-[0_10px_35px_-10px_rgba(0,47,54,0.12)] flex flex-col"
              >
                <div className="h-2 w-10 rounded-full bg-exam-yellow/90 mb-4" />
                <p className="font-display font-bold text-exam-teal text-lg mb-1">{s.title}</p>
                <p className="text-exam-muted text-xs md:text-sm leading-relaxed mb-5 flex-1">{s.subtitle}</p>
                <div className="space-y-2 mt-auto">
                  <div className="h-2 rounded-full bg-exam-grey overflow-hidden">
                    <div className={`h-full rounded-full ${s.bar}`} />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-1.5 flex-1 rounded bg-exam-grey" />
                    <div className="h-1.5 flex-1 rounded bg-exam-grey/70" />
                    <div className="h-1.5 flex-1 rounded bg-exam-grey/50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
