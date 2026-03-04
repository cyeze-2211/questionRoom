import Logo from '../../img/logo2Light.png';

export default function Footer() {
  const handleScrollTo = (id) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white py-10 px-6 md:px-12 mt-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left" data-aos="fade-up">
        {/* Логотип и описание */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <img src={Logo} alt="Logo" className="w-40" />
          <p className="text-gray-400 text-sm">
            Testlar orqali bilim darajangizni aniqlang. Har qanday fan bo‘yicha tezkor va bepul testlar.
          </p>
        </div>

        {/* Навигация */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold mb-2">Navigatsiya</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <button
                onClick={() => handleScrollTo('home')}
                className="hover:text-white transition"
              >
                Bosh sahifa
              </button>
            </li>
            <li>
              <button
                onClick={() => handleScrollTo('aboutUs')}
                className="hover:text-white transition"
              >
                Biz haqimizda
              </button>
            </li>
            <li>
              <button
                onClick={() => handleScrollTo('login')}
                className="hover:text-white transition"
              >
                Kirish
              </button>
            </li>
          </ul>
        </div>

        {/* Kontakt va ijtimoiy tarmoqlar */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold mb-2">Kontakt</h3>
          <p className="text-gray-400 text-sm">Email: info@testplatforma.uz</p>
          <p className="text-gray-400 text-sm">Tel: +998 90 123 45 67</p>
        </div>
      </div>
    </footer>
  );
}
