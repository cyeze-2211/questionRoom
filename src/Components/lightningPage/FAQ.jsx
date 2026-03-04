export default function FAQ() {
    const faqs = [
        {
            question: "Qanday qilib testlarni topshirishim mumkin?",
            answer: "Sahifaning boshida joylashgan 'Testni boshlash' tugmasini bosish orqali siz istalgan fanga oid testni tanlab, darhol topshirishni boshlashingiz mumkin.",
        },
        {
            question: "Hisob yaratishim shartmi?",
            answer: "Yo‘q, testni hisob yaratmasdan ham topshirishingiz mumkin. Ammo natijalarni saqlash va kuzatib borish uchun hisobga kirish tavsiya etiladi.",
        },
        {
            question: "Test natijalarimni qayerdan ko‘rishim mumkin?",
            answer: "Agar siz tizimga kirgan bo‘lsangiz, shaxsiy profilingizda barcha test natijalaringiz saqlanadi.",
        },
        {
            question: "Bu platforma tekinmi?",
            answer: "Ha, barcha testlar mutlaqo tekin va hech qanday to‘lov talab qilinmaydi.",
        },
    ];

    return (
        <section id="faq" className="bg-white text-black py-20 px-6 md:px-12" data-aos="fade-up">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4" data-aos="zoom-in">
                    Tez-tez so‘raladigan savollar
                </h2>
                <p className="text-gray-600" data-aos="fade-up" data-aos-delay="200">
                    Quyidagi savollar orqali platforma haqida ko‘proq bilib oling.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2" data-aos="fade-up" data-aos-delay="400">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition duration-300"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                        <p className="text-gray-700">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
