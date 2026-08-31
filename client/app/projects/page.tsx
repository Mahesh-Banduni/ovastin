import Hero from "../../components/shared/Hero";
import ProjectsSection from "../../components/projects/Projects";

export default function About() {
    return(
        <>
        <Hero text="Our Projects" link="/projects"/>
        <ProjectsSection />
        </>
    )
}