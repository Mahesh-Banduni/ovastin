import Image from "next/image";
import Subtitle from "../ui/website/Subtitle";
import Button from "../ui/website/Button";

const awardsList = [
  {
    iconSrc: "/images/home/award-logo-1.svg",
    name: "International Property Awards",
    category: "Winner of the International Property Award for Best Residential Development",
    year: "2025",
    imageSrc: "/images/home/award-img-1.webp",
  },
  {
    iconSrc: "/images/home/award-logo-2.svg",
    name: "Luxury Lifestyle Awards",
    category: "The Luxury Lifestyle Awards recognize global excellence in luxury real estate and design.",
    year: "2025",
    imageSrc: "/images/home/award-img-2.webp",
  },
  {
    iconSrc: "/images/home/award-logo-3.svg",
    name: "International Property Awards",
    category: "Global Recognition for Architectural Innovation – International Property Awards",
    year: "2025",
    imageSrc: "/images/home/award-img-3.webp",
  },
  {
    iconSrc: "/images/home/award-logo-4.svg",
    name: "Residential Adviser of the Year",
    category: "Winner – Innovative Design Excellence, International Property Awards",
    year: "2025",
    imageSrc: "/images/home/award-img-4.webp",
  },
  {
    iconSrc: "/images/home/award-logo-5.svg",
    name: "European Property Awards",
    category: "Winner – Innovative Design Excellence, International Property Awards",
    year: "2025",
    imageSrc: "/images/home/award-img-5.webp",
  },
  {
    iconSrc: "/images/home/award-logo-6.svg",
    name: "Residential Adviser of the Year",
    category: "Winner – Innovative Design Excellence, International Property Awards",
    year: "2025",
    imageSrc: "/images/home/award-img-6.webp",
  },
];

export default function OurAwards(){
    return(
        <div className="container py-15 md:py-18 lg:py-20 xl:py-25 flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-15">
            <div className="mb-9 md:mb-12 lg:mb-15 max-w-xl">
                <div className="flex flex-col items-start w-full">
                  <Subtitle text="Our Awards" />
                  <h2 className="mt-2 mb-5 text-start">Celebrating a Legacy of Excellence and Recognition</h2>
                  <p className="para-text-sm text-start max-w-2xl">
                    Our commitment to excellence has earned us recognition on some of the industry's most prestigious platforms. Every award we receive reflects our dedication to quality, innovation, and lasting impact in real estate.
                  </p>
                  <Button variant="secondary" text="Know More" className="mt-5 md:mt-6 lg:mt-7" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
              {awardsList.map((item, index) => (
                <div
                  key={index}
                  className="w-full max-w-[324px] min-h-[360px] mx-auto bg-black hover:bg-[var(--color-brand-bright)] rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 md:p-8 lg:p-10 group"
                >
                  <Image
                    src={item.iconSrc}
                    alt={`${item.name} image`}
                    width={150}
                    height={120}
                    className="object-contain w-28 sm:w-32 md:w-36 lg:w-[150px] h-auto
                        invert
                        group-hover:invert-0
                        transition-all duration-200"
                  />

                  <p className="mt-3.5 text-center italic font-semibold! para-text-sm text-neutral-300! group-hover:text-text-primary/70!">
                    {item.year}
                  </p>
            
                  <p className="mt-2 text-center para-text-sm font-semibold! text-white! group-hover:text-text-primary!">
                    {item.name}
                  </p>
            
                  <p className="mt-1.5 text-center para-text-sm text-neutral-400! group-hover:text-text-primary/80!">
                    {item.category}
                  </p>
                </div>
              ))}
            </div>
        </div>
    )
}