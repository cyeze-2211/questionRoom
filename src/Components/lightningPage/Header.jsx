import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Logo from '../../img/logo2.png';
import { NavLink } from 'react-router-dom';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 800 });

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 shadow-md ${isScrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-white'
                }`}
            data-aos="fade-down"
        >
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Логотип */}
                <div
                    className="text-2xl font-bold tracking-wide"
                    data-aos="zoom-in"
                    data-aos-delay="200"
                >
                    <img className="w-[110px]" src={Logo} alt="Logo" />
                </div>

                {/* Навигация (отображается только при экране > 640px) */}
                <div
                    className="hidden sm:flex space-x-6 items-center"
                    data-aos="fade-left"
                    data-aos-delay="300"
                >
                    <button
                        onClick={() => {
                            const section = document.getElementById('aboutUs');
                            section?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-black hover:text-gray-600 transition"
                    >
                        Biz haqimizda
                    </button>

                    <button
                        onClick={() => {
                            const section = document.getElementById('TrustedBy');
                            section?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-black hover:text-gray-600 transition"
                    >
                        Hamkorlar
                    </button>

                    <button
                        onClick={() => {
                            const section = document.getElementById('faq');
                            section?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-black hover:text-gray-600 transition"
                    >
                        FAQ
                    </button>

                    <NavLink to="/login">
                        <button className="border duration-500 border-black text-black hover:bg-black hover:text-white font-medium px-5 py-2 rounded-full transition">
                            Boshlash
                        </button>
                    </NavLink>
                </div>

                {/* Только кнопка на мобильной версии */}
                <div className="sm:hidden">
                    <NavLink to="/login">
                        <button
                            className="border border-black duration-500 text-black hover:bg-black hover:text-white font-medium px-5 py-2 rounded-full transition text-sm"
                            data-aos="zoom-in-left"
                            data-aos-delay="300"
                        >
                            Boshlash
                        </button>
                    </NavLink>
                </div>
            </div>
        </header>
    );
}
