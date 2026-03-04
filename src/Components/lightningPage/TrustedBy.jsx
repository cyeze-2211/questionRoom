import Logo1 from "../../img/hm1.jpg";
import Logo2 from "../../img/hm2.png";
import Logo3 from "../../img/hm3.png";
import Logo4 from "../../img/hm4.png";

export default function TrustedBy() {
    const companies = [
        { name: "Google", logo: Logo1 },
        { name: "Microsoft", logo: Logo2 },
        { name: "Uzbektelecom", logo: Logo3 },
        { name: "Yandex", logo: Logo4 },
    ];

    return (
        <section
            id="TrustedBy"
            className="bg-white text-black py-20 px-6 md:px-12"
            data-aos="fade-up"
        >
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6" data-aos="zoom-in">
                    Bizga ishonishadi
                </h2>
                <p className="text-lg text-gray-700 mb-10" data-aos="fade-up" data-aos-delay="200">
                    Quyidagi kompaniyalar bizning xizmatlarimizdan foydalanishadi.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {companies.map((company, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 bg-gray-50 shadow-sm rounded-lg flex items-center justify-center h-32 p-4 hover:shadow-md transition"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            {company.logo ? (
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="w-28 grayscale hover:grayscale-0 transition"
                                />
                            ) : (
                                <span className="text-gray-500 font-medium text-sm">
                                    {company.name}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
