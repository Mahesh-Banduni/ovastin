import HeroSection from "./components/home/Hero";
import OurCommitment from "./components/home/OurCommitment";
import OurProjects from "./components/home/OurProjects";
import OurService from "./components/home/OurService";
import Testimonials from "./components/home/Testimonials";
import WhoWeAre from "./components/home/WhoWeAre";
import OurAwards from "./components/home/OurAwards";
import Contact from "./components/home/Contact";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhoWeAre />
      <OurService />
      <OurProjects />
      <OurCommitment />
      <Testimonials />
      <OurAwards />
      <Contact />
    </>
  );
}
