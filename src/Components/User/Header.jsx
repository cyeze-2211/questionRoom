import { Button } from "@material-tailwind/react";
import { useState, useEffect } from "react";

export default function Header({ timeLeft, setOpenModal }) {
    const [scrolled, setScrolled] = useState(false);

    // следим за скроллом
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // форматируем минуты и секунды
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    return (
        <div
            className={`fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[98%] sm:w-[97%] 
                  transition-all duration-300 backdrop-blur-md
                  rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 
                  flex justify-between items-center z-50
                  ${scrolled
                    ? "bg-white/70 shadow-xl"
                    : "bg-white shadow-md"}`}
        >
            {/* Таймер */}
            <div className="text-sm sm:text-lg font-semibold text-gray-800">
                <span className="hidden sm:inline">Qolgan vaqt: </span>
                <span className="sm:hidden">Vaqt: </span>
                <span className="font-bold text-blue-600">{formatTime(timeLeft)}</span>
            </div>

            {/* Кнопка */}
            <Button
                onClick={() => setOpenModal(true)}
                color="red"
                className="rounded-lg sm:rounded-xl shadow-md px-3 py-1.5 sm:px-4 sm:py-2 
                          text-sm sm:text-base font-medium"
                size="sm"
            >
                <span className="hidden sm:inline">Tugatish</span>
                <span className="sm:hidden">Tugatish</span>
            </Button>
        </div>
    );
}