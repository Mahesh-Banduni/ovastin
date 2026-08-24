import Image from "next/image"
import Button from "../ui/custom/Button"
import Subtitle from "../ui/custom/Subtitle"
import { title } from "process"

const commitmentList = [
    {title:"Thoughtful Design",description:"Every Estalane project is thoughtfully designed to be visually striking, functional, and enhance everyday living.",icon:"/images/home/cm-1.svg"},
    {title:"Client-Centered Approach",description:"Your vision guides us—from first meeting to final delivery, we ensure clear, transparent, and thoughtful service.",icon:"/images/home/cm-2.svg"},
    {title:"Sustainable Development", description:"We build with the future in mind, using smart, sustainable practices to create long-term value for you and the environment.",icon:"/images/home/cm-3.svg"}
]

export default function OurCommitment(){
    return(
        <div className="bg-[#f6f3ec] section-padding">
            <div className="section-container space-y-scale-sm-15">
                <div className="flex flex-col lg:flex-row gap-scale-md-8 justify-between items-start lg:items-center">
                  <Subtitle text="Our Commitments" />
                  <h2 className="max-w-[612px]">We deliver more than promises we build with purpose and precision</h2>
                  <Button variant="secondary" text="Know More" />
                </div>
                <div className="flex flex-col lg:flex-row relative w-full gap-7">
                    <div className="relative overflow-hidden w-full lg:min-w-[550px] xl:min-w-[750px] 2xl:min-w-[900px] min-h-[300px] max-[400px]:min-h-[340px] sm:min-h-[400px] md:min-h-[550px] lg:min-h-[672px]">
                        <Image src="/images/home/commitment-bg.webp" alt="Section Image" fill className="object-cover hero-image-reveal" />
                    </div>
                    <div className="p-scale-md-15 flex flex-col gap-scale-md-10 bg-white">
                        {commitmentList.map((item, index)=>(
                            <div key={index} className="flex flex-col gap-2 sm:gap-3 lg:gap-2 items-start">
                                <div className="flex flex-row gap-scale-sm-7 items-center justify-center">
                                    <Image src={item.icon} alt={`Item ${index}`} width={48} height={48} className="object-cover w-[32px] h-[32px] md:w-[38px] md:h-[38px] lg:w-[48px] lg:h-[48px]" />
                                    <h4 className="pt-1">{item.title}</h4>
                                </div>
                                <div className="flex pl-scale-md-19">
                                    <p className="para-text-md text-text-primary!">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    </div>
            </div>
        </div>
    )
}