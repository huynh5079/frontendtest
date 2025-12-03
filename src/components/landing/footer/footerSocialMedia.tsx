import type { FC } from "react";
import { FaYoutube, FaGithub, FaFacebook } from "react-icons/fa";

const FooterLandingSocialMedia: FC = () => {
    const socialLink = [
        {
            title: "Youtube",
            href: "https://github.com/pcltuan7103",
            icon: <FaYoutube className="icon" />,
        },
        {
            title: "Github",
            href: "https://github.com/pcltuan7103",
            icon: <FaGithub className="icon" />,
        },
        {
            title: "Facebook",
            href: "https://github.com/pcltuan7103",
            icon: <FaFacebook className="icon" />,
        },
    ];

    return (
        <div className="fl-social">
            {socialLink.map((item) => (
                <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fl-social-icon"
                    data-tooltip={item.title}
                >
                    {item.icon}
                </a>
            ))}
        </div>
    );
};

export default FooterLandingSocialMedia;
