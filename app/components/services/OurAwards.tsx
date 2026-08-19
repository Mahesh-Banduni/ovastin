import Button from "../ui/website/Button"
import Subtitle from "../ui/website/Subtitle"

export default function OurAwards(){
    return(
        <div className="bg-[#f6f3ec] py-15 md:py-18 lg:py-20 xl:py-25">
            <div className="section-container space-y-9 md:space-y-12 lg:space-y-15">
                <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 md:gap-8 justify-between items-start lg:items-center">
                  <Subtitle text="Our Awards" />
                  <h2 className="max-w-[612px]">We deliver more than promises we build with purpose and precision</h2>
                  <Button variant="secondary" text="Know More" />
                </div>
            </div>
        </div>
    )
}