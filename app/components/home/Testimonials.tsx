"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Subtitle from "../ui/website/Subtitle";
import { Star } from "lucide-react";

const testimonialList = [
  {
    author: "Daniel Foster",
    post: "Business Consultant at StratEdge",
    comment:
      "Working with Estalane was simple and reassuring. Every detail was managed perfectly, delivering results we truly value.",
    imageSrc: "/images/home/testimonial-1.webp",
    card: "primary",
  },
  {
    author: "Michael Anderson",
    post: "Marketing Director at BrightWave",
    comment:
      "Estalane handled everything with precision and care. The experience was seamless, and the outcome exceeded our expectations.",
    imageSrc: "/images/home/testimonial-2.webp",
    card: "white",
  },
  {
    author: "Thomas Lewis",
    post: "CEO at FinEdge Solutions",
    comment:
      "Estalane made the entire process smooth and stress free. The result was beyond what we imagined a home we truly love.",
    imageSrc: "/images/home/testimonial-3.webp",
    card: "white",
  },
  {
    author: "Ryan Mitchell",
    post: "Founder at UrbanNest",
    comment:
      "From start to finish, Estalane delivered clarity and confidence. The end result matched exactly what we hoped for.",
    imageSrc: "/images/home/testimonial-4.webp",
    card: "secondary",
  },
  {
    author: "Jonathan Reed",
    post: "Product Lead at NovaTech",
    comment:
      "Estalane transformed our vision into reality with ease. The process felt effortless, and the final result was outstanding.",
    imageSrc: "/images/home/testimonial-5.webp",
    card: "white",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);

  const duplicatedTestimonials = useMemo(
    () => [...testimonialList, ...testimonialList],
    []
  );

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsTransitionEnabled(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (currentIndex === testimonialList.length) {
      const timeout = setTimeout(() => {
        setIsTransitionEnabled(false);
        setCurrentIndex(0);
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  return (
    <div className="py-15 md:py-18 lg:py-20 xl:py-25">
      <div className="space-y-9 md:space-y-12 lg:space-y-15">
        <div className="section-container flex flex-col items-center">
          <Subtitle text="Testimonials" />
          <h2 className="mt-2 mb-5 text-center">Trusted by homeowners & investors</h2>
          <p className="para-text-sm text-center">
            Our projects blend design, quality, and purpose—crafted to elevate everyday living.
          </p>
        </div>

        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`flex flex-row gap-3 sm:gap-4 md:gap-5 ${
              isTransitionEnabled ? "transition-transform duration-700 ease-in-out" : ""
            }`}
            style={{
              transform: `translateX(calc(-${currentIndex} * (424px + 12px)))`,
            }}
          >
            {duplicatedTestimonials.map((item, index) => (
              <div
                key={`${item.author}-${index}`}
                className={`min-w-[320px] sm:min-w-[350px] md:min-w-[400px] lg:min-w-[424px] px-4 md:px-5 lg:px-6 py-9 md:py-9.5 lg:py-10 flex flex-col gap-15 sm:gap-20 md:gap-30 lg:gap-40 w-full rounded-2xl border-2 border-gray-100 ${
                  item.card === "primary"
                    ? "bg-black"
                    : item.card === "secondary"
                    ? "bg-[var(--color-brand-bright)]"
                    : "bg-white"
                }`}
              >
                <div className="flex flex-row gap-3 sm:gap-4 md:gap-5 items-center justify-start">
                  <Image
                    src={item.imageSrc}
                    alt={item.author}
                    width={68}
                    height={68}
                    className="object-cover"
                  />
                  <div className="flex flex-col gap-1.5">
                    <p
                      className={`para-text-sm md:para-text-md lg:para-text-lg lg:text-[20px]! font-semibold! ${
                        item.card === "primary" ? "text-white!" : "text-text-primary!"
                      }`}
                    >
                      {item.author}
                    </p>
                    <p className="para-text-sm text-text-secondary!">{item.post}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-row gap-1 items-center justify-start w-fit">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          item.card === "primary" || item.card === "white"
                            ? "stroke-[var(--color-brand-bright)] fill-[var(--color-brand-bright)] stroke-1"
                            : "fill-white stroke-white stroke-1"
                        }`}
                      />
                    ))}
                    <Star className="w-5 h-5 stroke-text-secondary stroke-1" />
                  </div>

                  <p
                    className={`para-text-sm md:para-text-md lg:para-text-lg lg:text-[21px]! font-semibold! ${
                      item.card === "primary" ? "text-white!" : ""
                    }`}
                  >
                    {item.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex sm:hidden items-center justify-center gap-2">
          {testimonialList.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitionEnabled(true);
                setCurrentIndex(index);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex % testimonialList.length === index
                  ? "w-8 bg-black"
                  : "w-2.5 bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}