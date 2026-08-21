import Image from "next/image";
import Subtitle from "../ui/website/Subtitle";

const awardsList = [
  {
    iconSrc: "/images/home/award-logo-1.svg",
    name: "Property Awards",
    category: "Best Residential Development",
    year: "2025",
    imageSrc: "/images/home/award-img-1.webp",
  },
  {
    iconSrc: "/images/home/award-logo-2.svg",
    name: "Luxury Awards",
    category: "Top Luxury Living Experience",
    year: "2025",
    imageSrc: "/images/home/award-img-2.webp",
  },
  {
    iconSrc: "/images/home/award-logo-3.svg",
    name: "ArchDaily",
    category: "Outstanding Architectural Design",
    year: "2025",
    imageSrc: "/images/home/award-img-3.webp",
  },
  {
    iconSrc: "/images/home/award-logo-4.svg",
    name: "Dezeen",
    category: "Best Mixed-Use Project",
    year: "2025",
    imageSrc: "/images/home/award-img-4.webp",
  },
  {
    iconSrc: "/images/home/award-logo-5.svg",
    name: "Asia Property Awards",
    category: "Excellence in Sustainable Design",
    year: "2025",
    imageSrc: "/images/home/award-img-5.webp",
  },
  {
    iconSrc: "/images/home/award-logo-6.svg",
    name: "WAF Awards",
    category: "Innovation in Urban Living",
    year: "2025",
    imageSrc: "/images/home/award-img-6.webp",
  },
];

export default function OurAwards(){
    return(
        <div className="section-padding flex flex-col items-center justify-center">
            <div className="mb-scale-md-15">
                <div className="section-container flex flex-col items-center">
                  <Subtitle text="Our Awards" />
                  <h2 className="mt-2 mb-5 text-center">Celebrating a legacy of excellence</h2>
                  <p className="para-text-sm text-center max-w-2xl">
                    Our commitment to excellence has earned recognition across top industry platforms, reflecting our focus on quality, innovation, and lasting impact.
                  </p>
                </div>
            </div>
            <div className="w-auto px-4">
              {awardsList.map((item,index)=>(
                  <div key={index} className="relative group border-2 border-gray-100 first:rounded-t-2xl last:rounded-b-2xl w-full px-scale-md-15 py-scale-md-7 bg-transparent hover:bg-[var(--color-brand-bright)] transition-all duration-300 ease-in-out">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex flex-row gap-4 items-center justify-between md:justify-start">
                            <div className="flex flex-row gap-4 items-center justify-start">
                                <Image src={item.iconSrc} alt={`${item.name} Logo`} width={45} height={40} className="object-cover" />
                                <p className="para-text-sm w-auto md:min-w-[16rem] lg:min-w-xs xl:min-w-sm 2xl:min-w-lg">{item.name}</p>
                            </div>
                            <div className="flex md:hidden flex-row gap-4 items-center justify-end w-auto md:min-w-[5rem] lg:min-w-[6rem] xl:min-w-[8rem] 2xl:min-w-xs">
                                <p className="para-text-sm">{item.year}</p>
                            </div>
                          </div>
                          <div className="flex flex-row gap-4 items-center justify-start w-auto md:min-w-[18rem] lg:min-w-md xl:min-w-md 2xl:min-w-xl">
                              <h6 className="lg:text-[22px]!">{item.category}</h6>
                          </div>
                          <div className="hidden md:flex flex-row gap-4 items-center justify-end w-auto md:min-w-[5rem] lg:min-w-[6rem] xl:min-w-[8rem] 2xl:min-w-xs">
                              <p className="para-text-sm">{item.year}</p>
                          </div>
                      </div>
                      <div className="hidden xl:block absolute inset-0 -top-10 left-70 xl:left-70 2xl:left-80 z-50">
                        <Image
                          src={item.imageSrc}
                          alt={`${item.name} image`}
                          width={200}
                          height={200}
                          className="object-cover rounded-2xl rotate-20 opacity-0 scale-75 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100"
                        />
                      </div>
                  </div>
              ))}
            </div>
        </div>
    )
}