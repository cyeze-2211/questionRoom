import { NavLink } from "react-router-dom";

export default function Hero() {
    return (
        <section
            id="home"
            className="bg-black mt-[80px] text-white py-20 px-6 md:px-12 text-center"
            data-aos="fade-up"
        >
            <div className="max-w-3xl mx-auto">
                <h1
                    className="text-4xl md:text-5xl font-extrabold leading-tight mb-6"
                    data-aos="zoom-in"
                >
                    Bilimingizni sinab ko'ring<br />
                    <span className="text-gray-400">istalgan fan bo'yicha </span>
                    <br />
                    <span className="text-gray-400"></span>
                </h1>
                <p
                    className="text-lg md:text-xl text-gray-300 mb-8"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    Atigi bir necha daqiqada bilimingiz darajasini aniqlaydigan onlayn testlar. <br />
                    Ro'yxatdan o'tish shart emas, atiga 100 ming so'm evaziga CEFR darajasini aniqlang
                </p>
                <NavLink to={'/login'}>
                    <button
                        className="bg-white text-black font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-200 transition"
                        data-aos="zoom-in-up"
                        data-aos-delay="400"
                    >
                        Testni boshlash
                    </button>
                </NavLink>
            </div>
        </section>
    );
}
