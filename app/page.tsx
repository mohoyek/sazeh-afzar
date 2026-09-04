import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Stats from "@/components/Stats/Stats";
import AboutIntro from "@/components/AboutIntro/AboutIntro";
import Products from "@/components/Products/Products";
import Services from "@/components/Services/Services";
import ProductionProcess from "@/components/ProductionProcess/ProductionProcess";
import QualityControl from "@/components/QualityControl/QualityControl";
import Projects from "@/components/Projects/Projects";
import WhyUs from "@/components/WhyUs/WhyUs";
import AboutCompany from "@/components/AboutCompany/AboutCompany";
import CTA from "@/components/CTA/CTA";
import Contact from "@/components/Contact/Contact";
import MapSection from "@/components/Map/Map";
import Footer from "@/components/Footer/Footer";
import FloatingContact from "@/components/ui/FloatingContact";
import OrganizationSchema from "@/components/ui/OrganizationSchema";

export default function Home() {
  return (
    <>
      <OrganizationSchema />
      <Header />
      <main id="main-content">
        <Hero />
        <Stats />
        <AboutIntro />
        <Products />
        <Services />
        <ProductionProcess />
        <QualityControl />
        <Projects />
        <WhyUs />
        <AboutCompany />
        <CTA />
        <Contact />
        <MapSection />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
