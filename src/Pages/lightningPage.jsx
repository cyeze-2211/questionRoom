import { useEffect } from "react";
import AboutUs from "../Components/lightningPage/AboutUs";
import CallToAction from "../Components/lightningPage/CallToAction";
import Contact from "../Components/lightningPage/Contact";
import FAQ from "../Components/lightningPage/FAQ";
import Footer from "../Components/lightningPage/Footer";
import Header from "../Components/lightningPage/Header";
import Hero from "../Components/lightningPage/Hero";
import ReliableOpen from "../Components/lightningPage/ReliableOpen";
import TrustedBy from "../Components/lightningPage/TrustedBy";
import "../Components/lightningPage/lightning-landing.css";

export default function LightningPage() {
  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");

    const reveal = () => {
      const root = document.getElementById("lightning-landing");
      if (!root) return;
      root.querySelectorAll(".reveal").forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 150) {
          el.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", reveal, { passive: true });
    reveal();
    return () => {
      window.removeEventListener("scroll", reveal);
      document.documentElement.classList.remove("scroll-smooth");
    };
  }, []);

  return (
    <div
      id="lightning-landing"
      className="bg-white text-exam-ink antialiased min-h-screen font-inter selection:bg-exam-yellow/40 selection:text-exam-teal"
    >
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <ReliableOpen />
        <AboutUs />
        <FAQ />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
