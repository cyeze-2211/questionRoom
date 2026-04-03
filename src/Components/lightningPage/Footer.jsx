export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-exam-teal via-exam-teal to-exam-teal-mid border-t border-white/10 pt-14 pb-10 px-5 md:px-8 text-white">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
        <div className="space-y-4">
          <div className="font-display font-extrabold text-white text-xl">Savol-xona</div>
          <p className="text-white/75 text-sm leading-relaxed max-w-xs">
            Zamonaviy bilim va baholash platformasi. Har bir savol — rivojlanishga qadam.
          </p>
          <div className="flex gap-3 text-white/90">
            <span className="material-symbols-outlined text-xl cursor-default" aria-hidden>
              public
            </span>
            <span className="material-symbols-outlined text-xl cursor-default" aria-hidden>
              mail
            </span>
          </div>
        </div>
        <div>
          <h4 className="font-display font-bold text-white/90 text-xs uppercase tracking-widest mb-4">
            Bo&apos;limlar
          </h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li>
              <a href="#about" className="hover:text-exam-yellow transition-colors">
                Biz haqimizda
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-exam-yellow transition-colors">
                Imkoniyatlar
              </a>
            </li>
            <li>
              <a href="#partners" className="hover:text-exam-yellow transition-colors">
                Hamkorlar
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-exam-yellow transition-colors">
                Savollar
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-white/90 text-xs uppercase tracking-widest mb-4">
            Huquqiy
          </h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li>
              <a href="#" className="hover:text-exam-yellow transition-colors">
                Maxfiylik
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-exam-yellow transition-colors">
                Foydalanish shartlari
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-white/90 text-xs uppercase tracking-widest mb-4">
            Aloqa
          </h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li>info@savol-xona.uz</li>
            <li>+998 90 123 45 67</li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-white/15 flex flex-col md:flex-row justify-between items-center gap-4 text-white/65 text-xs">
        <span>© {new Date().getFullYear()} Savol-xona. Barcha huquqlar himoyalangan.</span>
        <span>Dizayn Savol-xona jamoasi</span>
      </div>
    </footer>
  );
}
