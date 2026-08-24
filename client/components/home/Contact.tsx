import Image from "next/image"
import Subtitle from "../ui/website/Subtitle"

const contactList = [
    {icon: "/images/home/contact-icon-1.svg", image: "/images/home/contact-user-1.webp", title: "Call Us At", content: ["+88 016 482 459 48","+88 016 482 459 48"]},
    {icon: "/images/home/contact-icon-2.svg", image: "/images/home/contact-user-2.webp", title: "Contact Us At", content: ["info@example.com","info@example.com"]}
]

const contactInquiryType=["Web Development","Mobile App Development","UI/UX Design","Enterprise Application","Digital Marketing","Video and Content Production"];

export default function Contact(){
    return(
        <div className="h-full flex flex-col lg:flex-row">
            <div className="w-full h-auto lg:w-1/2 bg-cover bg-center bg-no-repeat p-scale-md-15 lg:pr-25! flex items-center justify-center lg:justify-end" style={{backgroundImage:`url("/images/home/contact-bg-1.webp")`}}>
                <div className="max-w-lg flex flex-col gap-scale-md-10">
                    <div className="flex flex-col items-start w-full max-w-sm">
                      <Subtitle text="Contact Us" variant="white"/>
                      <h2 className="mt-2 mb-5 text-white!">Let’s Talk About Your Next Real Estate Move</h2>
                      <p className="para-text-sm text-white!">
                        Hear what our clients say about their experience working with us.
                      </p>
                    </div>
                    <div className="flex flex-col gap-scale-md-8">
                        {contactList.map((item, index)=>(
                            <div key={index} className="flex flex-row gap-scale-md-5">
                                <div className="flex flex-row gap-0">
                                    <div className="rounded-full p-4 bg-[var(--color-brand-bright)]">
                                        <Image src={item.icon} alt={item.title} width={30} height={20} className="object-cover" />
                                    </div>
                                    <Image src={item.image} alt={item.title} width={60} height={40} className="object-cover rounded-full" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h6 className="text-white!">{item.title}</h6>
                                    <p className="para-text-sm text-white!">{item.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full h-auto lg:w-1/2 bg-cover bg-center bg-no-repeat py-scale-md-15 px-scale-sm-10 flex items-center justify-center lg:justify-end" style={{backgroundImage:`url("/images/home/contact-bg-2.webp")`}}>
                <div className="bg-white px-scale-sm-11 py-scale-sm-13 h-full flex flex-col gap-scale-md-10">
                    <p className="para-text-lg font-semibold! lg:text-[22px]!">Ready to Take the Next Step? Let’s Talk About Your Real Estate Goals</p>
                    <div className="flex flex-col w-full gap-scale-md-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-scale-md-6">
                            <label>
                                <p className="para-text-sm text-text-primary! font-semibold! gap-0 mb-1.25">First Name<span className="text-red-500">*</span></p>
                                <input type="text" placeholder="Enter your first name" className="w-full h-10 border-b-2 border-gray-400 p-1.5 text-text-primary" />
                            </label>
                            <label>
                                <p className="para-text-sm text-text-primary! font-semibold! gap-0 mb-1.25">Last Name<span className="text-red-500">*</span></p>
                                <input type="text" placeholder="Enter your last name" className="w-full h-10 border-b-2 border-gray-400 p-1.5 text-text-primary" />
                            </label> 
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-scale-sm-6">
                            <label>
                                <p className="para-text-sm text-text-primary! font-semibold! gap-0 mb-1.25">Email<span className="text-red-500">*</span></p>
                                <input type="text" placeholder="Enter your email" className="w-full h-10 border-b-2 border-gray-400 p-1.5 text-text-primary" />
                            </label> 
                            <label>
                                <p className="para-text-sm text-text-primary! font-semibold! gap-0 mb-1.25">Phone Number<span className="text-red-500">*</span></p>
                                <input type="text" placeholder="Enter your phone number" className="w-full h-10 border-b-2 border-gray-400 p-1.5 text-text-primary" />
                            </label> 
                        </div>  
                        <label>
                            <p className="para-text-sm text-text-primary! font-semibold! gap-0 mb-1.25">Address<span className="text-red-500">*</span></p>
                            <input type="text" placeholder="Enter your address" className="w-full h-10 border-b-2 border-gray-400 p-1.5 text-text-primary" />
                        </label>  
                        <label>
                            <p className="para-text-sm text-text-primary! font-semibold! gap-0 mb-1.25">Inquiry Type<span className="text-red-500">*</span></p>
                            <select defaultValue={""} required className="w-full h-10 border-b-2 border-gray-400 p-1.5 text-text-primary">
                                <option className="text-text-primary p-1.25" value="" disabled>Select the inquiry type</option>
                                {contactInquiryType.map((item, index)=>(
                                    <option className="text-text-primary" key={index}>{item}</option>
                                ))}
                            </select>
                        </label>  
                        <label>
                            <p className="para-text-sm text-text-primary! font-semibold! gap-0 mb-1.25">Message<span className="text-red-500">*</span></p>
                            <textarea placeholder="Enter your message" className="w-full h-30 border-b-2 border-gray-400 p-1.5 text-text-primary" />
                        </label>                                         
                    </div>
                    <button className="btn-action">Submit Now</button>
                </div>
            </div>
        </div>
    )
}