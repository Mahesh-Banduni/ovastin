import Button from "../ui/website/Button"
import Subtitle from "../ui/website/Subtitle"

export default function OurServices(){
    return(
        <div className="pt-0 sm:pt-2 pb-15 md:pb-18 lg:pb-20 xl:pb-25">
            <div className="container space-y-9 md:space-y-12 lg:space-y-15">
                <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 md:gap-8 justify-between items-start lg:items-center">
                  <Subtitle text="Our Services" />
                  <h2 className="max-w-[612px]">We offer more than quality services we focus on trusted relationships</h2>
                  <div className="w-40 h-40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 146 146" fill="none" className="title-arrow-icon opasity-5"><path d="M134.697 0C137.445 0 140.081 1.09105 142.024 3.03418C143.967 4.97729 145.059 7.61339 145.059 10.3613V133.193C145.139 133.698 145.182 134.21 145.187 134.724C145.199 136.099 144.938 137.464 144.418 138.737C143.898 140.011 143.129 141.168 142.156 142.142C141.184 143.115 140.027 143.885 138.754 144.406C137.481 144.928 136.117 145.19 134.741 145.179C134.243 145.175 133.746 145.134 133.256 145.059H10.3613C7.61339 145.059 4.97827 143.966 3.03516 142.023C1.09209 140.08 7.15369e-05 137.445 0 134.697C0 131.949 1.09203 129.313 3.03516 127.37C4.97825 125.427 7.6135 124.336 10.3613 124.336H109.693L9.94824 24.5908C8.00809 22.6481 6.91803 20.0151 6.91797 17.2695C6.91797 14.5238 8.0079 11.89 9.94824 9.94727L9.93457 9.93359C10.8968 8.97077 12.0394 8.20666 13.2969 7.68555C14.5543 7.1645 15.9025 6.89648 17.2637 6.89648C18.6246 6.89654 19.9722 7.16459 21.2295 7.68555C22.487 8.20664 23.6296 8.97082 24.5918 9.93359L124.336 109.678V10.3613C124.336 7.61333 125.428 4.97731 127.371 3.03418C129.314 1.09124 131.949 2.54456e-05 134.697 0Z" fill="#ebeced">
                    </path></svg>
                </div>
                </div>
            </div>
        </div>
    )
}