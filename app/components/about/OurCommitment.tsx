import Image from "next/image"
import Button from "../ui/website/Button"
import Subtitle from "../ui/website/Subtitle"
import { title } from "process"

const commitmentList = [
    {title:"Thoughtful Design",description:"Every Estalane project is thoughtfully designed to be visually striking, functional, and enhance everyday living."},
    {title:"Client-Centered Approach",description:"Your vision guides us—from first meeting to final delivery, we ensure clear, transparent, and thoughtful service."},
    {title:"Sustainable Development", description:"We build with the future in mind, using smart, sustainable practices to create long-term value for you and the environment."},
    {title:"Proven Expertise",description:"With a proven track record, Estalane brings expertise and skill to every project—delivering quality and lasting impact through our dedicated team."}
]

export default function OurCommitment(){
    return(
        <div className="bg-[#f6f3ec] py-15 md:py-18 lg:py-20 xl:py-25">
            <div className="section-container space-y-9 md:space-y-12 lg:space-y-15">
                <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 md:gap-8 justify-between items-start lg:items-center">
                  <Subtitle text="Our Commitments" />
                  <h2 className="max-w-[612px]">We deliver more than promises we build with purpose and precision</h2>
                  <Button variant="secondary" text="Know More" />
                </div>
                <div className="flex flex-col lg:flex-row relative w-full gap-7">
                    <div className="relative overflow-hidden w-full lg:max-w-[450px] xl:max-w-[450px] 2xl:max-w-[590px] min-h-[300px] max-[400px]:min-h-[340px] sm:min-h-[400px] md:min-h-[550px] lg:min-h-[672px]">
                        <Image src="/images/about/commitment-bg.webp" alt="Section Image" fill className="object-cover hero-image-reveal" />
                    </div>
                    <div className="p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-15 flex flex-col gap-6 md:gap-8 lg:gap-10 bg-transparent">
                        {commitmentList.map((item, index)=>(
                            <>
                                <div key={index} className="flex flex-col gap-2 sm:gap-3 lg:gap-1 items-start border-b border-gray-200 pb-3 sm:pb-4 md:pb-4.5 lg:pb-5">
                                    <div className="flex flex-row gap-5 md:gap-7 items-center justify-center">
                                        <h4>#0{index + 1}.</h4>
                                        <h4 className="pt-1">{item.title}</h4>
                                    </div>
                                    <div className="flex pl-18 sm:pl-18 md:pl-20 lg:pl-20">
                                        <p className="para-text-md text-text-primary!">{item.description}</p>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                    </div>
            </div>
        </div>
    )
}