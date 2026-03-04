import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function WarningModal({ startExam, data }) {
    const [show, setShow] = useState(true);
    const [agreed, setAgreed] = useState(false);
    const Divays = localStorage.getItem("isTelegram");
    const navigate = useNavigate();

    const handleTelegramFlow = async () => {
        const result = await Swal.fire({
            title: "Tasdiqlash",
            text: `Imtihonni boshlash va balansdan ${data?.price} yechib olishni tasdiqlaysizmi?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ha, boshlash",
            cancelButtonText: "Bekor qilish",
        });

        if (result.isConfirmed) {
            try {
                await axios.put(
                    `/users/update/balance?balance=${-data?.price}&userId=${localStorage.getItem("userId")}`
                );
                startExam(true);
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Xatolik!",
                    text: "Sizda mablag‘ yetarli emas!",
                    confirmButtonText: "OK",
                }).then(() => {
                    navigate("/user/tests");
                });
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // ❗️ Agar Bekor qilish bosilsa → oldingi sahifaga qaytaramiz
            navigate(-1);
        }
    };


    // 🚀 Agar telegram bo‘lsa → darrov Swal chiqsin
    useEffect(() => {
        if (Divays === "telegram") {
            handleTelegramFlow();
        }
    }, []);

    const handleContinue = () => {
        if (!agreed) {
            return Swal.fire({
                icon: "warning",
                title: "Diqqat!",
                text: "Iltimos, shartlarga rozilik bildiring.",
                confirmButtonText: "OK",
            });
        }
        setShow(false);
        startExam(true);
    };

    // 🚫 Telegram bo‘lsa → umuman modal qaytarmaymiz
    if (Divays === "telegram") return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
        >
            <div
                className={`bg-white rounded-2xl shadow-xl w-[95%] sm:w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto transition-transform duration-300 ${show ? "scale-100" : "scale-95"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <h1 className="text-xl font-bold mb-4">Eslatma !!!</h1>
                    <p className="font-medium mb-4">Imtihon Shartlari</p>
                    <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base">
                        <li>Imtihon tashkilotchilari tomonidan taqdim etilgan kompyuterda ishlash shart.</li>
                        <li>Imtihon boshlanishidan oldin shaxsni tasdiqlovchi hujjat taqdim etilishi shart.</li>
                        <li>Imtihon davomida faqat tashkilotchilar tomonidan ruxsat etilgan materiallar va qurilmalardan foydalanish shart.</li>
                        <li>Imtihon vaqtida brauzerda savol-xona.uz dan boshqa tabga o‘tish man etiladi.</li>
                        <li>Imtihon vaqtida tashqaridan yordam olish qat’iyan taqiqlanadi.</li>
                        <li>Test savollarini va ularga javoblarni hech qanday shaklda nusxalash, ulashish yoki tarqatish man etiladi.</li>
                        <li>Imtihon vaqtida xona ichida tartib va sukunatni saqlash shart.</li>
                        <li>Imtihon tashkilotchilari tomonidan belgilangan vaqtga qat’iy rioya qilish shart.</li>
                        <li>Imtihon davomida monitoring qilish uchun kamera yoki boshqa kuzatuv tizimlaridan foydalanish mumkin.</li>
                        <li>Qoidalarni buzgan holda ishtirokchi imtihondan chetlatilishi va natijalari bekor qilinishi mumkin.</li>
                        <li>Imtihon tugaganidan keyin barcha natijalar tashkilotchilar tomonidan avtomatik ravishda qabul qilinadi.</li>
                    </ol>

                    <div className="flex items-center mt-6">
                        <input
                            type="checkbox"
                            id="agreement"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="agreement" className="text-sm sm:text-base">
                            Shartlar bilan tanishib chiqdim
                        </label>
                    </div>

                    <button
                        onClick={handleContinue}
                        className={`mt-4 w-full sm:w-auto px-5 py-2 text-white rounded-lg transition-colors duration-200 ${agreed
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-blue-400 cursor-not-allowed"
                            }`}
                        disabled={!agreed}
                    >
                        Imtihonni boshlash
                    </button>
                </div>
            </div>
        </div>
    );
}
