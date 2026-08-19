"use client";

import Image from "next/image"
import Button from "../ui/website/Button"
import { useState } from "react"

const HeaderLinks =[
    {name: 'Home', link: '/'},
    {name: 'About', link: '/about'},
    {name: 'Services', link: '/services'},
    {name: 'Contact', link: '/contact'},
]

export default function Header(){
    const [showMobileMenu, setShowMobileValue]= useState<boolean>(false);
    return(
        <div className="sticky top-0 z-40 bg-transparent w-full h-auto flex items-center justify-center">
            <div className="section-container bg-white flex flex-row items-center justify-between px-8! py-5 w-full relative rounded-full border-2 border-gray-100 shadow-sm shadow-gray-50 my-1 md:my-1.25 lg:my-1.5 mx-2! md:mx-2.5! lg:mx-3!">
                <div className="relative h-9 min-w-37">
                    <Image src="/images/logo/ovastin-logo.svg" alt="Ovastin Logo" loading="eager" fill className="object-cover" />
                </div>
                <div className="hidden md:flex flex-row gap-1 md:gap-2 lg:gap-4 items-center justify-center w-full">
                    {HeaderLinks.map((item, index)=>(
                        <a href={item.link} key={index} className="px-1.5 md:px-2 lg:px-4 py-1.5 lg:py-2 text-center para-text-sm leading-[1]!">{item.name}</a>
                    ))}
                </div>
                <div className="inline-flex gap-5 items-center justify-center">
                    <Button text="Get Started" variant="primary" className="hidden sm:flex whitespace-nowrap"/>
                    <div onClick={()=>setShowMobileValue((prev)=>!prev)} className="relative cursor-pointer border border-text-primary p-2 lg:hidden">
                        <svg xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" fill="none" className="navbar-toggle-icon open" height="20"><path d="M2.5 3.33398H17.5V5.00065H2.5V3.33398ZM2.5 9.16732H17.5V10.834H2.5V9.16732ZM2.5 15.0007H17.5V16.6673H2.5V15.0007Z" fill="#191500"></path></svg>
                    </div>
                    {showMobileMenu && (
                      <div className="fixed inset-0 z-50 bg-white flex flex-col pt-24 px-8">
                        {HeaderLinks.map((item) => (
                          <a
                            key={item.name}
                            href={item.link}
                            className="py-4 text-xl border-b"
                            onClick={() => setShowMobileValue(false)}
                          >
                            {item.name}
                          </a>
                        ))}
                    
                        <Button
                          text="Get Started"
                          variant="primary"
                          className="mt-8"
                        />
                      </div>
                    )}
                </div>
            </div>
        </div>
    )
}