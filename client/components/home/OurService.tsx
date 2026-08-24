import Image from "next/image";
import Button from "../ui/custom/Button";
import Subtitle from "../ui/custom/Subtitle";

const serviceList = [
    {title: "Property Sales & Marketing",icon:"/images/home/si-1.svg",bgImageSrc:"/images/home/ss-bg-1.webp"},
    {title: "Residential & Commercial Leasing",icon:"/images/home/si-2.svg",bgImageSrc:"/images/home/ss-bg-2.webp"},
    {title: "Construction Management",icon:"/images/home/si-3.svg",bgImageSrc:"/images/home/ss-bg-3.webp"},
    {title: "Property Valuation & Appraisal",icon:"/images/home/si-4.svg",bgImageSrc:"/images/home/ss-bg-4.webp"},
]

export default function OurService(){
    return(
        <div className="bg-black relative flex flex-col pb-14 sm:pb-18 md:pb-22 lg:pb-25">
            <div className="section-container section-padding flex flex-col gap-15 h-full">
                <div className="flex flex-col lg:flex-row gap-scale-md-8 justify-between items-start lg:items-center">
                    <Subtitle text="Our Services" variant="white"/>
                    <h2 className="text-white! max-w-[612px]">We offer more than quality services we focus on trusted relationships</h2>
                    <Button variant="secondary" text="See Our Services" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {serviceList.map((item, index)=>(
                       <div key={index} className="group overflow-hidden relative w-auto md:max-w-[473px] lg:max-w-[410px] xl:max-w-[410px] 2xl:max-w-[419px] min-h-[360px] sm:min-h-[400px] md:min-h-[430px] lg:min-h-[500px] 2xl:min-h-[700px]">
                      {/* Background Image */}
                      <Image
                        src={item.bgImageSrc}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />

                      {/* Overlay Content */}
                      <div className="relative z-10 px-scale-md-12 py-scale-sm-17 flex flex-col items-center justify-between h-full">
                        <Image
                          src={item.icon}
                          alt={`${item.title} Image`}
                          width={100}
                          height={100}
                          className="w-18 h-18 md:w-20 md:h-20 lg:w-25 lg:h-25 object-contain"
                        />
                        <h5 className="text-white! text-center">{item.title}</h5>
                      </div>
                    </div>
                    ))}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-14 sm:h-18 md:h-22 lg:h-25 bg-white z-50 rounded-t-[80px]"></div>
        </div>
    )
}