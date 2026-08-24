type buttonProps = {
    text: string;
    variant: string;
    className?: string;
}

export default function Button({text, variant, className}:buttonProps) {
    return(
        <div className={`group flex items-center gap-0 ${className}`}>
        <button data-text={text} className={`cursor-pointer btn-slide ${variant==='primary' ? "btn-primary" : `${variant==='secondary' ? "btn-secondary" : `${variant==='action' ? "btn-action":"btn-danger" }`}`}`}>
            <span className="btn-label">{text}</span>
        </button>
        <button className={`h-[46px] cursor-pointer px-3.25! py-2! rounded-full! ${variant==='primary' ? "btn-primary" : `${variant==='secondary' ? "btn-secondary" : `${variant==='action' ? "btn-action":"btn-danger" }`}`}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width={16}
              height={16}
              viewBox="0 0 13 13"
              fill="currentcolor"
              className="button-icon"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.6852 0.699706C9.15283 2.23208 6.33294 2.20543 4.76863 0.64111L4.12751 0L2.87044 1.25707L3.51155 1.89819C4.64888 3.03552 6.2047 3.61333 7.75559 3.62933L0 11.3849L1.28227 12.6671L9.03781 4.91156C9.05381 6.46244 9.63162 8.01826 10.769 9.15559L11.4101 9.79671L12.6671 8.53963L12.026 7.89852C10.4624 6.33484 10.4351 3.51431 11.9674 1.98193L12.596 1.35339L11.3137 0.0711669L10.6852 0.699706Z"
                fill="currentcolor"
              />
            </svg>
        </button>
        </div>
    )
}