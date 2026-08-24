"use client";

import Image from "next/image";
import Subtitle from "../ui/custom/Subtitle";
import Button from "../ui/custom/Button";
import { useState } from "react";

const projectList= [
    {title:"The Havenstone Residences",bgImgSrc:"/images/home/p-bg-1.webp", description:"Building a real estate development is a complicated task requiring both deep understanding…"},
    {title:"Celestia Grand Residences",bgImgSrc:"/images/home/p-bg-2.webp", description:"Building a real estate development is a complicated task requiring both deep understanding…"},
    {title:"The Arborea Collection",bgImgSrc:"/images/home/p-bg-3.webp", description:"Building a real estate development is a complicated task requiring both deep understanding…"},
    {title:"Willow Park Residences",bgImgSrc:"/images/home/p-bg-4.webp", description:"Building a real estate development is a complicated task requiring both deep understanding…"},
    {title:"Elmwoord Grand Heights",bgImgSrc:"/images/home/p-bg-5.webp", description:"Building a real estate development is a complicated task requiring both deep understanding…"},
    {title:"Riverstone Edge Residences",bgImgSrc:"/images/home/p-bg-6.webp", description:"Building a real estate development is a complicated task requiring both deep understanding…"},
]

export default function OurProjects() {
  const [hovered, setHovered] = useState<number | null>(null);

  // Split into rows of 3
  const rows = [];
  for (let i = 0; i < projectList.length; i += 3) {
    rows.push(projectList.slice(i, i + 3));
  }

  return (
    <div className="section-container section-padding">
      <div className="space-y-scale-md-15">
        <div className="flex flex-col items-center">
          <Subtitle text="Our Projects" />
          <h2 className="mt-2 mb-5 text-center">Our Signature Developments</h2>
          <p className="para-text-sm text-center">
            Our projects blend design, quality, and purpose—crafted to elevate
            everyday living.
          </p>
        </div>

        <div className="hidden lg:block max-w-7xl mx-auto space-y-6">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-6 h-[400px]">
              {row.map((item, colIndex) => {
                const index = rowIndex * 3 + colIndex;
                const isHovered = hovered === index;
                const isRowHovered =
                  hovered !== null && Math.floor(hovered / 3) === rowIndex;

                return (
                  <div
                    key={index}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 1024) {
                        setHovered(index);
                      }
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 1024) {
                        setHovered(null);
                      }
                    }}
                    className={`
                      group
                      relative
                      rounded-xl
                      overflow-hidden
                      flex-1 lg:transition-[flex-grow] lg:duration-700 lg:ease-in-out
                      ${isRowHovered
                        ? isHovered
                          ? "lg:flex-[3]"
                          : "lg:flex-1"
                        : "lg:flex-1"}`}
                  >
                    <Image
                      src={item.bgImgSrc}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    <div className="absolute inset-0 z-10 flex flex-col justify-end items-center p-10 gap-4 transition-all duration-500 lg:group-hover:bg-black/50 group-hover:bg-black/50">
                      <p className="text-white font-semibold">
                        #{String(index + 1).padStart(2, "0")}
                      </p>

                      <h6 className="text-white text-center">
                        {item.title}
                      </h6>

                      <p className="para-text-sm text-gray-100! text-center opacity-100 lg:opacity-0 max-h-full lg:max-h-0 overflow-hidden transition-all duration-500 group-hover:opacity-100 group-hover:max-h-40">
                        {item.description}
                      </p>

                      <div className="opacity-100 lg:opacity-0 translate-y-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                        <Button
                          text="View Details"
                          variant="secondary"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6 max-w-7xl mx-auto">
          {projectList.map((item, index) => (
            <div
              key={index}
              className="group relative h-[400px] rounded-xl overflow-hidden"
            >
              <Image
                src={item.bgImgSrc}
                alt={item.title}
                fill
                className="object-cover"
              />
        
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
              <div className="absolute inset-0 z-10 flex flex-col justify-end items-center p-10 gap-4 bg-black/30">
                <p className="text-white font-semibold">
                  #{String(index + 1).padStart(2, "0")}
                </p>
        
                <h6 className="text-white text-center">
                  {item.title}
                </h6>
        
                <p className="para-text-sm text-gray-100! text-center">
                  {item.description}
                </p>
        
                <Button
                  text="View Details"
                  variant="secondary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}