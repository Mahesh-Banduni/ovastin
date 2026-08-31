import ContactForm from "@/components/contact/Contact-form"
import CTA from "@/components/contact/CTA"
import Hero from "@/components/shared/Hero"

export default function Contact(){
    return(
        <> 
            <Hero text="Contact Us" link="/projects"/>
            <CTA />
            <ContactForm />
        </>
    )
}