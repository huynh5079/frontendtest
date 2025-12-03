import { type FC } from "react";

const FooterLandingLogo: FC = () => {
    const text = "TPEDU";

    return (
        <div className="fl-logo">
            <h2 className="fl-logo-text">
                {text.split("").map((char, index) => (
                    <span
                        key={index}
                        className="fl-logo-char"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {char}
                    </span>
                ))}
            </h2>
        </div>
    );
};

export default FooterLandingLogo;
