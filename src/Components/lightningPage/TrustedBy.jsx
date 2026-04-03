import Logo1 from "../../img/hm1.jpg";
import Logo2 from "../../img/hm2.png";
import Logo3 from "../../img/hm3.png";
import Logo4 from "../../img/hm4.png";

const companies = [
  { name: "Guliston davlat pedagogika instituti", logo: Logo1 },
  { name: "Guliston davlat universiteti", logo: Logo2 },
  { name: "Coursera", logo: Logo3 },
  { name: "Peng Sheng", logo: Logo4 },
];

export default function TrustedBy() {
  return (
    <section id="partners" className="bg-white text-exam-ink py-16 md:py-20 px-5 md:px-8 border-b border-exam-grey">
      <div className="max-w-[1280px] mx-auto text-center">
        <h2 className="font-display font-extrabold text-exam-teal text-3xl md:text-4xl mb-4 reveal">
          Bizga ishonishadi
        </h2>
        <p className="text-base md:text-lg text-exam-muted mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed reveal">
          Quyidagi tashkilotlar bizning xizmatlarimizdan foydalanishadi.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-6">
          {companies.map((company) => (
            <div
              key={company.name}
              className="border border-exam-grey bg-exam-grey/40 shadow-sm rounded-xl flex items-center justify-center h-32 p-4 hover:shadow-md hover:border-exam-teal/15 transition-all reveal"
            >
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="max-h-20 w-auto max-w-[7rem] object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              ) : (
                <span className="text-exam-muted font-medium text-sm">{company.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
