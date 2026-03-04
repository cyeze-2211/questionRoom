import { FaClock, FaUserCheck, FaBookOpen } from 'react-icons/fa';

export default function AboutUs() {
    return (
        <section
            className="bg-white text-black py-20 px-6 md:px-12"
            id="aboutUs"
            data-aos="fade-up"
        >
            <div className="max-w-5xl mx-auto text-center">
                <h2
                    className="text-3xl md:text-4xl font-extrabold mb-6"
                    data-aos="zoom-in"
                >
                    Biz haqimizda
                </h2>
                <p
                    className="text-lg text-gray-700 mb-10"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    Bizning platformamiz orqali siz har qanday fandan bilim darajangizni
                    tez va oson aniqlashingiz mumkin. Testlarimiz zamonaviy algoritmlar asosida ishlab chiqilgan
                    bo'lib, aniq va ishonchli natijalarni taqdim etadi.
                </p>

                <div className="grid md:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="300">
                    <div className="bg-black text-white p-6 rounded-xl shadow hover:scale-105 transition text-left">
                        <FaClock className="text-3xl text-white mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Tez va qulay</h3>
                        <p className="text-gray-300">
                            Testlarni bir necha daqiqada yechib, natijani darhol ko'rishingiz mumkin.
                        </p>
                    </div>
                    <div className="bg-black text-white p-6 rounded-xl shadow hover:scale-105 transition text-left">
                        <FaUserCheck className="text-3xl text-white mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Ro'yxatdan o'tish shart emas</h3>
                        <p className="text-gray-300">
                            Testlarni yechish uchun akkaunt yaratish shart emas
                        </p>
                    </div>
                    <div className="bg-black text-white p-6 rounded-xl shadow hover:scale-105 transition text-left">
                        <FaBookOpen className="text-3xl text-white mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Fanlar bo'yicha testlar</h3>
                        <p className="text-gray-300">
                            Matematika, fizika, til, tarix va boshqa ko'plab fanlar siz uchun mavjud.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
