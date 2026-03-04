export default function CallToAction() {
    return (
        <section
            id="login"
            className="bg-black text-white py-20 px-6 md:px-12 text-center"
            data-aos="fade-up"
        >
            <div className="max-w-3xl mx-auto">
                <h2
                    className="text-3xl md:text-4xl font-extrabold mb-6"
                    data-aos="zoom-in"
                >
                    Hozirdanoq tizimga kir va testni topshir!
                </h2>
                <p
                    className="text-lg text-gray-300 mb-8"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    Foydalanuvchi hisobing orqali natijalaringni kuzat va bilimlaringni oshir.
                </p>
                <a
                    href="/login"
                    className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-200 transition"
                    data-aos="zoom-in-up"
                    data-aos-delay="400"
                >
                    Tizimga kirish
                </a>
            </div>
        </section>
    );
}
