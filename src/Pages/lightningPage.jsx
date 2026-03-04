import AboutUs from "../Components/lightningPage/AboutUs";
import CallToAction from "../Components/lightningPage/CallToAction";
import FAQ from "../Components/lightningPage/FAQ";
import Footer from "../Components/lightningPage/Footer";
import Header from "../Components/lightningPage/Header";
import Hero from "../Components/lightningPage/Hero";
import TrustedBy from "../Components/lightningPage/TrustedBy";

export default function LightningPage() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <AboutUs />
                <TrustedBy />
                <CallToAction />
                <FAQ />
            </main>
            <Footer />
        </>
    );
}