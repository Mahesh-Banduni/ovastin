import Hero from "../components/shared/Hero";
import OurCommitment from "../components/about/OurCommitment";
import Testimonial from "../components/about/Testimonial";
import WhoWeAre from "../components/about/WhoWeAre";
import OurAwards from "../components/about/OurAwards";

export default function About() {
    return(
        <>
        <Hero text="About Us" link="/about"/>
        <WhoWeAre />
        <OurCommitment />
        <Testimonial />
        <OurAwards />
        </>
    )
}