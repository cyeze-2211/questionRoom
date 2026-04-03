import { NavLink } from "react-router-dom";

export default function Header() {
  const cta = (
    <NavLink to="/login">
      <span className="inline-flex items-center justify-center bg-exam-yellow text-exam-teal px-4 md:px-5 py-2 rounded-full text-sm font-bold font-display hover:brightness-105 transition-all">
        Testni boshlash
      </span>
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 bg-exam-teal border-b border-white/10 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-3.5 md:py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex items-center justify-between gap-4 w-full md:w-auto">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="font-display font-extrabold text-lg md:text-xl text-white tracking-tight"
          >
            Savol-xona
          </a>
          <div className="md:hidden shrink-0">{cta}</div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-5 md:gap-8 text-sm font-medium text-white/90 md:flex-1">
          <a href="#about" className="hover:text-white transition-colors">
            Biz haqimizda
          </a>
          <a href="#partners" className="hover:text-white transition-colors">
            Hamkorlar
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        <div className="hidden md:block shrink-0">{cta}</div>
      </div>
    </header>
  );
}
