import Image from "next/image";
import Subtitle from "../ui/website/Subtitle";
import Button from "../ui/website/Button";

const counterList = [
  {
    title: "Global Reach",
    value: 40,
    suffix: "+",
    description: "Office Worldwide",
    bgSrc: '/images/home/ac-1.svg'
  },
  {
    title: "Local Expertise",
    value: 200,
    suffix: "+",
    description: "Global Employees",
    bgSrc: '/images/home/ac-2.svg'
  },
  {
    title: "Our Impact",
    value: 120,
    suffix: "+",
    description: "Project Done",
    bgSrc: '/images/home/ac-3.svg'
  },
  {
    title: "Experience",
    value: "08",
    suffix: "+",
    description: "Office Worldwide",
    bgSrc: '/images/home/ac-4.svg'
  },
];

const iconList = [
    {name: 'Our Vision', icon: '/images/about/about-icon-1.gif', description: "Enabling brands to thrive online with innovative web solutions that elevate visibility and accelerate growth."},
    {name: 'Our Mission', icon: '/images/about/about-icon-2.gif', description: "Empowering brands to lead digitally through smart, scalable web solutions that spark visibility and drive lasting growth."}
]

export default function WhoWeAre() {
    return(
        <div className="container flex items-center justify-center relative py-15 md:py-18 lg:py-20 xl:py-25 pt-0!">
            <div className="max-w-7xl flex flex-col lg:flex-col items-start justify-center gap-7 sm:gap-8 md:gap-10 lg:gap-13 xl:gap-15">
                <div className="w-full lg:min-w-xl h-full xl:min-w-3xl flex flex-col lg:flex-row items-start justify-center gap-6 sm:gap-7 md:gap-8 lg:gap-50 xl:gap-60">
                    <div className="flex flex-col items-start justify-center w-full lg:min-w-xl">
                        <Subtitle text="Who We Are" className="mb-4" />
                        <h2 className="mb-5 sm:mb-6 md:mb-7 lg:mb-8">Building dreams one <br/> home at a time</h2>
                        <p className="para-text-sm">At Estalane, we create thoughtful spaces that blend design, innovation, and lasting value. Every project reflects our commitment to quality, sustainability, and better living.</p>
                    </div>
                    <div className="gap-4 lg:gap-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 w-auto lg:max-w-[340px]">
                        {iconList.map((item, index)=>(
                            <div key={index} className="flex flex-col gap-2 md:gap-3 w-full">
                                <span className="flex gap-1.25 md:gap-2.5 items-center w-full">
                                    <Image src={item.icon} alt={item.name} width={50} height={50} className="object-cover" />
                                    <h5>{item.name}</h5>
                                </span>
                                <p className="para-text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full h-full flex flex-col md:flex-row items-start justify-center gap-5 sm:gap-6 md:gap-7 lg:gap-8 xl:gap-10">
                    <div className="relative w-full md:min-w-[540px] lg:min-w-[800px] xl:min-w-[1000px] h-[320px] sm:h-[380px] md:h-[563px] lg:h-[563px] xl:h-[580px] flex items-center">
                        <Image src="/images/home/whowearebg.webp" alt='Section Image' fill className="object-cover"></Image>
                    </div>
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-1 items-center justify-center gap-0 w-full h-full">
                        {counterList.map((item, index)=>(
                            <div key={index} className="flex flex-col items-center justify-center gap-2 md:gap-3 p-5 sm:p-6 md:p-8 border border-gray-300 first:rounded-t-2xl last:rounded-b-2xl w-full">
                                <h2 className="text-gray-200! flex items-start">{item.value}
                                    <span
                                      className={`para-text-sm text-gray-200!`}
                                    >
                                      {item.suffix}
                                    </span>
                                </h2>
                                <p className="para-text-sm text-gray-500! flex-nowrap w-full text-center">{item.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}