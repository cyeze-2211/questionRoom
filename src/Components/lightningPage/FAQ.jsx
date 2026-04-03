const FAQS = [
  {
    q: "Qanday qilib testlarni topshirishim mumkin?",
    a: 'Asosiy sahifadagi "Testni boshlash" tugmasi orqali fanni tanlang va darhol boshlang.',
  },
  {
    q: "Hisob yaratishim shartmi?",
    a: "Ko'p testlar uchun shart emas; natijalarni saqlash uchun hisob tavsiya etiladi.",
  },
  {
    q: "Natijalarni qayerdan ko'raman?",
    a: "Test tugagach ekranda ko'rinadi; tizimga kirgan bo'lsangiz, kabinetda saqlanadi.",
  },
  {
    q: "Savol-xona bepulmi?",
    a: "Asosiy funksiyalar va ommaviy testlar foydalanuvchilar uchun bepul.",
  },
];

export default function FAQ() {
  return (
    <section className="py-16 md:py-24 bg-exam-grey" id="faq">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <h2 className="font-display font-bold text-exam-teal text-3xl md:text-4xl text-center mb-10 md:mb-12 reveal">
          Tez-tez so&apos;raladigan savollar
        </h2>
        <div className="space-y-3">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group bg-white rounded-xl border border-exam-teal/10 shadow-sm overflow-hidden reveal"
            >
              <summary className="flex justify-between items-center cursor-pointer list-none p-5 text-exam-ink font-semibold font-display hover:bg-exam-grey/50 transition-colors [&::-webkit-details-marker]:hidden">
                <span className="pr-4">{item.q}</span>
                <span className="material-symbols-outlined text-exam-teal shrink-0 group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <div className="px-5 pb-5 text-exam-muted text-sm leading-relaxed border-t border-exam-grey pt-4">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
