import OurServices from "../components/services/OurServices"
import Hero from "../components/shared/Hero"

export default function ServicesPage(){
    return(
        <>
        <Hero text="Our Services" link="/services"/>
        <OurServices />
        </>
    )
}