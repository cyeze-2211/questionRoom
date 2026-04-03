const FEATURES = [
  { bar: "bg-[#c4b5fd]", icon: "quiz", title: "Onlayn testlar", text: "Turli formatdagi savollar va vaqt rejimi." },
  { bar: "bg-sky-400/80", icon: "auto_awesome", title: "Avtomatik tekshiruv", text: "Darhol ball va aniq natija." },
  { bar: "bg-exam-mint", icon: "shield", title: "Xavfsizlik", text: "Ma'lumotlaringiz himoyalangan." },
  { bar: "bg-rose-300/90", icon: "analytics", title: "Hisobotlar", text: "Natijalar va dinamika grafigi." },
  { bar: "bg-exam-yellow", icon: "school", title: "Ko'p fanlar", text: "Bitta joyda turli yo'nalishlar." },
  { bar: "bg-exam-teal/30", icon: "smartphone", title: "Mobil qulay", text: "Telefon va planshetda ishlaydi." },
];

const TEAM_IMG =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1100&q=80&auto=format&fit=crop";

export default function AboutUs() {
  return (
    <>
      <section className="py-20 md:py-28 bg-gradient-to-b from-white via-exam-cream/40 to-exam-lavender/30" id="about">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-7 space-y-6 reveal">
              <span className="inline-flex items-center rounded-full bg-white/80 border border-exam-teal/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-exam-teal">
                Biz haqimizda
              </span>
              <h2 className="font-display font-extrabold text-exam-teal text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] leading-[1.08] tracking-tight">
                Savol-xona bilan o&apos;qish jarayoni{" "}
                <span className="text-exam-teal-mid">sodda va shaffof</span>
              </h2>
              <p className="text-exam-muted text-lg md:text-xl leading-relaxed max-w-2xl">
                Biz akademik sifat va zamonaviy texnologiyani birlashtiramiz — har bir foydalanuvchi o&apos;z bilimini
                obyektiv baholashi, o&apos;qituvchi esa natijalarni bir qarashda ko&apos;rishi uchun.
              </p>
            </div>
            <div className="lg:col-span-5 reveal">
              <div className="rounded-[1.75rem] border border-exam-teal/10 bg-white p-6 md:p-8 shadow-[0_16px_40px_-12px_rgba(0,47,54,0.12)] space-y-4">
                <div className="h-1.5 w-16 rounded-full bg-exam-yellow" />
                <p className="font-display font-bold text-exam-teal text-xl leading-snug">Bir joyda boshqaruv</p>
                <p className="text-exam-muted text-sm leading-relaxed">
                  Test yaratish, topshirish va tahlil — alohida vositalarsiz, bitta panel orqali.
                </p>
                <ul className="space-y-2.5 text-sm text-exam-ink">
                  <li className="flex gap-2">
                    <span className="material-symbols-outlined text-exam-mint text-xl shrink-0">check_circle</span>
                    Tezkor ishga tushirish
                  </li>
                  <li className="flex gap-2">
                    <span className="material-symbols-outlined text-exam-mint text-xl shrink-0">check_circle</span>
                    Talabalar va guruhlar uchun moslashgan
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white" id="features">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 reveal">
            <h3 className="font-display font-bold text-exam-teal text-3xl md:text-4xl lg:text-[2.5rem] leading-tight mb-4">
              Barcha ehtiyojlaringiz uchun yagona platforma
            </h3>
            <p className="text-exam-muted text-base md:text-lg leading-relaxed">
              Har bir vazifa uchun alohida kartalar — dashboard uslubida, aniq va tartibli.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-exam-grey bg-white p-6 md:p-7 shadow-[0_8px_30px_-12px_rgba(0,47,54,0.1)] hover:shadow-[0_14px_40px_-12px_rgba(0,47,54,0.14)] transition-shadow reveal"
              >
                <div className={`h-1 w-12 rounded-full mb-5 ${f.bar}`} />
                <div className="w-11 h-11 rounded-xl bg-exam-grey flex items-center justify-center text-exam-teal mb-4">
                  <span className="material-symbols-outlined text-2xl">{f.icon}</span>
                </div>
                <h4 className="font-display font-bold text-exam-ink text-lg mb-2">{f.title}</h4>
                <p className="text-exam-muted text-sm leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-exam-cream via-[#fff3cc] to-exam-yellow/50">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 order-2 lg:order-1 reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-exam-teal/80">Jamoa va hamkorlik</span>
            <h3 className="font-display font-bold text-exam-teal text-3xl md:text-4xl leading-tight">
              Birga o&apos;rganing, birga o&apos;sing
            </h3>
            <p className="text-exam-muted text-base md:text-lg leading-relaxed">
              Guruh testlari, o&apos;qituvchi nazorati va real vaqt rejimida natijalar — jamoa bilan ishlash uchun
              platforma ichida barcha vositalar tayyor. Talabalar bir-biridan yashirinmay, maqsadga yo&apos;naltirilgan
              mashg&apos;ulotlarda qatnashadi.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="#contact"
                className="inline-flex bg-exam-teal text-white font-bold font-display px-6 py-3 rounded-full text-sm hover:bg-exam-teal-mid transition-colors shadow-md"
              >
                Bog&apos;lanish
              </a>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center reveal">
            <div className="w-full max-w-xl rounded-[2rem] border-[3px] border-white/90 bg-white/60 p-2 shadow-[0_16px_40px_-12px_rgba(0,47,54,0.12)]">
              <div className="oval-mask-h w-full shadow-inner border border-exam-teal/10">
                <img src={TEAM_IMG} alt="Talabalar jamoasi" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
