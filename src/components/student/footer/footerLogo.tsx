import { type FC } from "react";

const FooterStudentLogo: FC = () => {
    const text = "TPEDU";

    return (
        <div className="fs-logo">
            <h2 className="fs-logo-text">
                {text.split("").map((char, index) => (
                    <span
                        key={index}
                        className="fs-logo-char"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {char}
                    </span>
                ))}
            </h2>
        </div>
    );
};

export default FooterStudentLogo;
