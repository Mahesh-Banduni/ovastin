import Hero from "../../components/shared/Hero";
import Projects from "../../components/projects/Projects";

export default function About() {
    return(
        <>
        <Hero text="Our Projects" link="/projects"/>
        <Projects />
        </>
    )
}