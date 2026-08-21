export default function Hero({text, link}: {text: string, link: string}) {
    return(
        <div className="relative h-[350px] sm:h-[450px] md:h-[600px] lg:h-[90vh] w-full bg-cover bg-no-repeat bg-center hero-image-reveal" style={{backgroundImage: "url(/images/about/hero-bg.webp)"}}>
            <div className="absolute inset-0 bg-black/50 bg-opacity-50 z-10"></div>
            <div className="relative max-w-[1720px] h-full mx-auto py-scale-sm-40 px-scale-md-10 flex flex-col items-center justify-end gap-scale-md-15 z-50">
                <p className="hero-h text-text-neutral!">{text}</p>
                <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-7xl xl:max-w-[1320px] gap-5 border-t border-t-text-neutral/10">
                    <div className="flex items-center gap-2 pt-scale-md-6">
                      <>
                        <a href="/" className="para-text-sm md:para-text-md text-neutral-200! font-semibold!">
                          Home
                        </a>
                        <p className="para-text-sm md:para-text-md text-neutral-300!">{'>'}</p>
                        <a href={link} className="para-text-sm md:para-text-md text-neutral-300! font-semibold!">
                          {text}
                        </a>
                      </>
                    </div>
                    <div><h5 className="max-[400px]:text-[16px]! text-neutral-300! text-center">Built on Vision, Driven by Purpose</h5></div>
                </div>
            </div>
            <div className="absolute -bottom-px left-0 right-0 h-14 sm:h-18 md:h-22 lg:h-25 bg-white z-50 rounded-t-[80px]"></div>
        </div>
    )
}