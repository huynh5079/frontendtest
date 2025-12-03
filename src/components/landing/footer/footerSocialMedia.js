import { jsx as _jsx } from "react/jsx-runtime";
import { FaYoutube, FaGithub, FaFacebook } from "react-icons/fa";
const FooterLandingSocialMedia = () => {
    const socialLink = [
        {
            title: "Youtube",
            href: "https://github.com/pcltuan7103",
            icon: _jsx(FaYoutube, { className: "icon" }),
        },
        {
            title: "Github",
            href: "https://github.com/pcltuan7103",
            icon: _jsx(FaGithub, { className: "icon" }),
        },
        {
            title: "Facebook",
            href: "https://github.com/pcltuan7103",
            icon: _jsx(FaFacebook, { className: "icon" }),
        },
    ];
    return (_jsx("div", { className: "fl-social", children: socialLink.map((item) => (_jsx("a", { href: item.href, target: "_blank", rel: "noopener noreferrer", className: "fl-social-icon", "data-tooltip": item.title, children: item.icon }, item.title))) }));
};
export default FooterLandingSocialMedia;
