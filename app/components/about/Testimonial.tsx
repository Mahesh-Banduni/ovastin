"use client";
import {Star} from 'lucide-react';
import Subtitle from '../ui/website/Subtitle';
import Image from 'next/image';
import { useState,  useEffect } from 'react';

const reviewImagesList = [
  { name: "Image 1", link: "/images/home/hero-user1.webp" },
  { name: "Image 2", link: "/images/home/hero-user2.webp" },
  { name: "Image 3", link: "/images/home/hero-user3.webp" },
  { name: "Image 4", link: "/images/home/hero-user4.webp" },
  { name: "Image 5", link: "/images/home/hero-user4.webp" },
];

const testimonialList = [
  {
    author: "Daniel Foster",
    post: "Business Consultant at StratEdge",
    comment:
      "Working with Estalane was simple and reassuring. Every detail was managed perfectly, delivering results we truly value.",
    imageSrc: "/images/about/testimonial-user-image-1.jpg",
    brandImageSrc: '/images/about/testimonial-user-brand-1.svg'
  },
  {
    author: "Michael Anderson",
    post: "Marketing Director at BrightWave",
    comment:
      "Estalane handled everything with precision and care. The experience was seamless, and the outcome exceeded our expectations.",
    imageSrc: "/images/about/testimonial-user-image-2.webp",
    brandImageSrc: '/images/about/testimonial-user-brand-2.svg'
  },
  {
    author: "Thomas Lewis",
    post: "CEO at FinEdge Solutions",
    comment:
      "Estalane made the entire process smooth and stress free. The result was beyond what we imagined a home we truly love.",
    imageSrc: "/images/about/testimonial-user-image-3.webp",
    brandImageSrc: '/images/about/testimonial-user-brand-3.svg'
  },
  {
    author: "Ryan Mitchell",
    post: "Founder at UrbanNest",
    comment:
      "From start to finish, Estalane delivered clarity and confidence. The end result matched exactly what we hoped for.",
    imageSrc: "/images/about/testimonial-user-image-2.webp",
    brandImageSrc: '/images/about/testimonial-user-brand-2.svg'
  },
  {
    author: "Jonathan Reed",
    post: "Product Lead at NovaTech",
    comment:
      "Estalane transformed our vision into reality with ease. The process felt effortless, and the final result was outstanding.",
    imageSrc: "/images/about/testimonial-user-image-1.jpg",
    brandImageSrc: '/images/about/testimonial-user-brand-1.svg'
  },
];

export default function Testimonial(){
    const [isMobile, setIsMobile] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const testimonialPairs = [];
    for (let i = 0; i < testimonialList.length; i += 2) {
      testimonialPairs.push(testimonialList.slice(i, i + 2));
    }

    useEffect(() => {
      const checkScreen = () => {
        setIsMobile(window.innerWidth < 640);
      };

      checkScreen();
      window.addEventListener("resize", checkScreen);

      return () => window.removeEventListener("resize", checkScreen);
    }, []);

    const totalSlides = isMobile
      ? testimonialList.length
      : testimonialPairs.length;

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 3000);

      return () => clearInterval(interval);
    }, [totalSlides]);

    return(
      <div className="section-container py-scale-lg-25 flex flex-col xl:flex-row gap--scale-lg-40">
        <div className="w-full lg:max-w-sm flex flex-col items-start justify-center rounded-[16px] hero-image-reveal">
            <Subtitle text="Testimonials" className="mb-4" />

            <h2 className="mb-scale-sm-5">
              Trusted by homeowners & investors
            </h2>

            <div className="inline-flex gap-2 items-center w-full mb-scale-md-12">
              <p className="para-text-sm max-w-lg">
                Hear what our clients say about their experience working with us.
              </p>
            </div>

            <div className="flex flex-col min-[540px]:flex-row items-center justify-center gap-scale-sm-8 mb-scale-md-8">
              <div className="flex flex-col gap-1 items-start justify-center">
                <span className="gap-2 text-primary inline-flex items-center">
                  <Star className="w-4 h-4 fill-black" />
                  <p className="font-semibold para-text-xs font-semibold!">Reviews</p>
                </span>

                <div className="relative w-full inline-flex items-end gap-2">
                  <div className="flex -space-x-3">
                    {reviewImagesList.map((item) => (
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
        </div>
        <div className="relative w-full overflow-hidden">        
          {/* Mobile Slider */}
          <div className="sm:hidden overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out pb-10"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {testimonialList.map((item, index) => (
                <div
                  key={index}
                  className="min-w-full px-2"
                >
                  <div className="bg-white shadow-lg rounded-sm p-8 flex flex-col items-center text-center">
                    <div className="flex flex-row items-center justify-center gap-6">
                      <Image
                        src={item.imageSrc}
                        alt={item.author}
                        width={150}
                        height={140}
                        className="object-cover"
                      />

                      <div className="flex flex-col items-center">
                        <Image
                          src={item.brandImageSrc}
                          alt={item.author}
                          width={90}
                          height={45}
                          className="object-contain"
                        />

                        <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center mt-5">
                          <Image
                            src="/images/about/quote-icon.svg"
                            alt="Quote"
                            width={18}
                            height={18}
                          />
                        </div>
                      </div>
                    </div>
            
                    <p className="mt-6 para-text-lg font-semibold! text-text-primary!">
                      "{item.comment}"
                    </p>
            
                    <h3 className="mt-8 para-text-md font-semibold!">
                      {item.author}
                    </h3>
            
                    <p className="para-text-sm text-text-secondary">
                      {item.post}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop Slider */}
          <div className="hidden sm:block overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out pb-10"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {testimonialPairs.map((pair, pairIndex) => (
                <div
                  key={pairIndex}
                  className="min-w-full flex gap-8 justify-center"
                >
                  {pair.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white shadow-lg rounded-sm p-8 flex flex-col items-center text-center flex-1 max-w-[470px]"
                    >
                      <div className="flex flex-row items-center justify-center gap-8">
                        <Image
                          src={item.imageSrc}
                          alt={item.author}
                          width={200}
                          height={165}
                          className="object-cover"
                        />

                        <div className="flex flex-col items-center">
                          <Image
                            src={item.brandImageSrc}
                            alt={item.author}
                            width={105}
                            height={50}
                            className="mt-6 object-contain"
                          />

                          <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center mt-5">
                            <Image
                              src="/images/about/quote-icon.svg"
                              alt="Quote"
                              width={18}
                              height={18}
                            />
                          </div>
                        </div>
                      </div>
                
                      <p className="mt-6 para-text-lg font-semibold! text-text-primary! max-w-xs">
                        "{item.comment}"
                      </p>
                
                      <h3 className="mt-8 para-text-md font-semibold! text-text-primary!">
                        {item.author}
                      </h3>
                
                      <p className="para-text-sm text-text-secondary">
                        {item.post}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 z-50">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`cursor-pointer transition-all duration-300 rounded-full ${
                  currentSlide === index
                    ? "w-4 h-4 bg-gray-700"
                    : "w-4 h-4 bg-gray-400"
                }`}
              />
            ))}
          </div>
        
        </div>
      </div>
    )
}