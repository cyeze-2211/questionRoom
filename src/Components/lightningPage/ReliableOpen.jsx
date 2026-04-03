import { NavLink } from "react-router-dom";

function MiniBar({ label, pct, colorClass }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px] font-semibold text-exam-ink/80">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-exam-grey overflow-hidden">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ReliableOpen() {
  return (
    <section className="py-16 md:py-24 bg-exam-grey">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-6 reveal">
          <p className="text-sm font-bold uppercase tracking-widest text-exam-teal/70">Platforma</p>
          <h2 className="font-display font-bold text-exam-teal text-3xl md:text-4xl lg:text-[2.75rem] leading-tight">
            Bitta platforma — barcha baholash ehtiyojlaringiz uchun
          </h2>
          <p className="text-exam-muted text-base md:text-lg leading-relaxed max-w-xl">
            Testlar, vaqt chegarasi, avtomatik tekshiruv va natijalar tahlili — barchasi bir joyda. O&apos;qituvchilar
            va o&apos;quvchilar uchun sodda boshqaruv paneli.
          </p>
          <NavLink to="/login" className="inline-block">
            <span className="inline-flex items-center gap-2 rounded-full bg-exam-teal text-white font-bold font-display px-6 py-3 text-sm hover:bg-exam-teal-mid transition-colors shadow-md">
              Panelni ko&apos;rish
              <span className="material-symbols-outlined text-lg" aria-hidden>
                arrow_forward
              </span>
            </span>
          </NavLink>
        </div>

        <div className="reveal relative rounded-[2rem] md:rounded-[2.25rem] border-[3px] border-sky-200/80 bg-white p-5 md:p-7 shadow-[0_20px_50px_-15px_rgba(0,47,54,0.18)]">
          <div className="absolute -inset-px rounded-[2rem] md:rounded-[2.25rem] bg-gradient-to-br from-exam-mint/15 via-transparent to-exam-lavender/25 pointer-events-none" />
          <div className="relative space-y-4">
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-exam-grey">
              <span className="text-xs font-bold uppercase tracking-wider text-exam-muted">Test holati</span>
              <span className="text-xs font-bold text-[#00a38a]">100% tayyor</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-exam-grey bg-exam-grey/50 p-4 shadow-sm">
                <p className="text-[11px] font-bold text-exam-muted uppercase tracking-wider mb-2">Natija</p>
                <div className="flex items-center gap-3">
                  <div
                    className="relative w-14 h-14 shrink-0 rounded-full"
                    style={{
                      background: `conic-gradient(#00bfa5 0 97%, #e8ecec 0 100%)`,
                    }}
                  >
                    <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
                      <span className="text-sm font-display font-bold text-exam-teal">97%</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-display font-bold text-exam-teal text-sm">Testdan o&apos;tildi</p>
                    <p className="text-xs text-exam-muted">Avtomatik baholash</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-exam-grey bg-white p-4 shadow-sm">
                <p className="text-[11px] font-bold text-exam-muted uppercase tracking-wider mb-2">Jami vaqt</p>
                <p className="font-display font-bold text-exam-teal text-lg tabular-nums">00:32:05</p>
                <p className="text-xs text-exam-muted mb-2">/ 01:30:00</p>
                <div className="h-2 rounded-full bg-exam-grey overflow-hidden">
                  <div className="h-full w-[36%] rounded-full bg-exam-yellow" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-exam-grey bg-white p-4 md:p-5 shadow-sm space-y-3">
              <p className="text-xs font-bold text-exam-teal uppercase tracking-wider">Kategoriya bo&apos;yicha ball</p>
              <MiniBar label="Mahsulot va jarayonlar" pct={70} colorClass="bg-[#c4b5fd]" />
              <MiniBar label="Savdo" pct={30} colorClass="bg-sky-300" />
              <MiniBar label="Huquq" pct={95} colorClass="bg-exam-mint" />
              <MiniBar label="IT" pct={40} colorClass="bg-rose-200" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
