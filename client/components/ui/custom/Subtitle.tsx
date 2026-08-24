type subtitleProps = {
    text: string;
    variant?: string;
    className?: string;
}

export default function Subtitle({text, variant, className}:subtitleProps){
    return(
        <div className={`inline-flex gap-3 ${className}`}>
            <svg xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="16" height="21" viewBox="0 0 16 21" fill="none">
                <path d="M0 0.586136C2.98595 -0.837264 6.57829 0.420845 8.02372 3.3962L15.8136 19.4315C12.8277 20.8549 9.23535 19.5968 7.78993 16.6215L0 0.586136Z" fill="#FED731"></path>
            </svg>
            <p className={`para-text-xs ${variant === "white" ? "text-white!": ""}`}>{text}</p>
            <svg xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="16" height="21" viewBox="0 0 16 21" fill="none">
                <path d="M0 0.586136C2.98595 -0.837264 6.57829 0.420845 8.02372 3.3962L15.8136 19.4315C12.8277 20.8549 9.23535 19.5968 7.78993 16.6215L0 0.586136Z" fill="#FED731"></path>
            </svg>
        </div>
    )
}