import { type FC } from "react";

const FooterParentLogo: FC = () => {
    const text = "TPEDU";

    return (
        <div className="fp-logo">
            <h2 className="fp-logo-text">
                {text.split("").map((char, index) => (
                    <span
                        key={index}
                        className="fp-logo-char"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {char}
                    </span>
                ))}
            </h2>
        </div>
    );
};

export default FooterParentLogo;
