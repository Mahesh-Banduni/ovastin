"use client";

import { useEffect, useState } from "react";
import { PlayIcon, Star } from "lucide-react";
import Button from "../ui/website/Button";
import Subtitle from "../ui/website/Subtitle";
import Image from "next/image";

const heroReviewImagesList = [
  { name: "Image 1", link: "/images/home/hero-user1.webp" },
  { name: "Image 2", link: "/images/home/hero-user2.webp" },
  { name: "Image 3", link: "/images/home/hero-user3.webp" },
  { name: "Image 4", link: "/images/home/hero-user4.webp" },
  { name: "Image 5", link: "/images/home/hero-user4.webp" },
];

const heroBgImagesList = [
  { name: "Image 1", link: "/images/home/hero1.webp" },
  { name: "Image 2", link: "/images/home/hero2.webp" },
  { name: "Image 3", link: "/images/home/hero3.webp" },
];

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroBgImagesList.length);
    }, 3000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="section-container flex flex-col lg:flex-row gap-3 w-full h-auto lg:min-h-[700px]">
      <div className="bg-[#f6f3ec] w-full lg:w-1/2 p-[30px] md:p-[35px] lg:p-[40px] xl:p-[70px] flex flex-col items-start justify-center rounded-[16px] hero-image-reveal">
        <Subtitle text="Smart Moves Start with Us" className="mb-4" />

        <h1 className="mb-4 lg:mb-16">
          Designed for the Way You Live Today
        </h1>

        <div className="flex flex-col min-[540px]:flex-row items-center justify-center gap-scale-md-8 mb-1 lg:mb-8">
          <Button text="View Services" variant="secondary" />

          <div className="flex flex-col gap-1 items-start justify-center">
            <span className="gap-2 text-primary inline-flex items-center">
              <Star className="w-4 h-4 fill-black" />
              <p className="font-semibold para-text-xs font-semibold!">Reviews</p>
            </span>

            <div className="relative w-full inline-flex items-end gap-2">
              <div className="flex -space-x-3">
                {heroReviewImagesList.map((item) => (
                  <div
                    key={item.name}
                    className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white"
                  >
                    <Image
                      src={item.link}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1">
                <span className="inline-flex">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="w-4 h-4 text-transparent"
                      fill="var(--color-secondary)"
                    />
                  ))}
                </span>

                <p className="para-text-sm leading-[1]">
                  5k+ Clients
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="inline-flex gap-2 items-center w-full">
          <p className="para-text-sm max-w-lg">
            A leading independent real estate developer shaping modern
            communities.
          </p>

          <div className="relative w-32 h-26">
            <Image
              src="/images/home/hero-videobg.webp"
              alt="Video image"
              fill
              className="object-cover rounded-full"
            />
            <p className="absolute inset-0 text-text-neutral inline-flex gap-1 items-center justify-center">
              Watch
              <PlayIcon className="w-4 h-4 fill-current" />
            </p>
          </div>
        </div>
      </div>

      {/* Right Sliding Background */}
      <div className="relative w-full lg:w-1/2 h-[450px] sm:h-[600px] md:h-[800px] lg:min-h-[700px] overflow-hidden rounded-[16px]">
        <div className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          width: `${heroBgImagesList.length * 100}%`,
          transform: `translateX(-${currentImage * (100 / heroBgImagesList.length)}%)`,
        }}
        >
        {heroBgImagesList.map((image, index) => (
          <div
            key={image.name}
            className="relative w-full h-[450px] sm:h-[600px] md:h-[800px] lg:min-h-[700px] flex-shrink-0 hero-image-reveal"
            style={{ width: `${100 / heroBgImagesList.length}%` }}
          >
              <Image
                key={image.name}
                src={image.link}
                alt={image.name}
                fill
                priority
                className="object-cover"
              />
              </div>
            ))}
          </div>

          {/* Optional dark overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {heroBgImagesList.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentImage === index
                    ? "w-8 h-2 bg-white"
                    : "w-2 h-2 bg-white/50"
                }`}
              />
            ))}
          </div>
      </div>
    </div>
  );
}