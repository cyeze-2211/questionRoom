import { NavLink } from "react-router-dom";

const HERO_DASHBOARD = "/hero-dashboard.png";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-exam-teal via-exam-teal to-exam-teal-mid pt-8 pb-12 md:py-16">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 w-full grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="space-y-6 md:space-y-8 text-center lg:text-left">
          <h1 className="font-display font-extrabold text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.15] tracking-tight reveal">
            Testlaringizni <span className="text-exam-yellow">muvaffaqiyat</span> hikoyasiga aylantiring.
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed reveal">
            Savol-xona — barcha fanlar bo&apos;yicha onlayn testlar, darhol natija va qulay interfeys. Bilimingizni
            sinab ko&apos;ring, rivojlanish yo&apos;lida qoling.
          </p>
          <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 justify-center lg:justify-start pt-2 reveal">
            <NavLink to="/login">
              <button
                type="button"
                className="bg-exam-yellow text-exam-teal px-8 py-3.5 rounded-full font-bold font-display text-sm md:text-base hover:brightness-105 transition-all shadow-lg w-full sm:w-auto min-w-[200px]"
              >
                Boshlash
              </button>
            </NavLink>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end reveal">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[85%] h-[85%] hero-mint-glow rounded-full opacity-90" />
          </div>
          <div className="relative z-10 w-full max-w-xl rounded-[1.75rem] md:rounded-[2rem] border-[3px] border-sky-200/90 bg-white/95 shadow-[0_24px_60px_-12px_rgba(0,47,54,0.35)] p-2 md:p-3">
            <img
              src={HERO_DASHBOARD}
              alt="Baholash paneli — natijalar va kategoriyalar"
              className="w-full h-auto rounded-[1.25rem] md:rounded-[1.5rem] object-cover object-top shadow-inner"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
