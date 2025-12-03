import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Modal from "./modal";
import { RemindLogin } from "../../assets/images";
import { navigateHook } from "../../routes/routeApp";
import { routes } from "../../routes/routeName";
const RemindLoginModal = ({ isOpen, setIsOpen }) => {
    return (_jsx(Modal, { isOpen: isOpen, setIsOpen: setIsOpen, title: "Th\u00F4ng b\u00E1o", children: _jsx("section", { id: "remind-login-modal", children: _jsxs("div", { className: "rlm-container", children: [_jsx("img", { src: RemindLogin, alt: "" }), _jsx("h3", { children: "Ch\u00E0o m\u1EEBng b\u1EA1n \u0111\u1EBFn v\u1EDBi n\u1EC1n t\u1EA3ng k\u1EBFt n\u1ED1i gia s\u01B0 TPEDU" }), _jsx("h4", { children: "Ch\u00FAng t\u00F4i s\u1EBD gi\u00FAp b\u1EA1n c\u00F3 tr\u1EA3i nghi\u1EC7m th\u1EADt kh\u00E1c bi\u1EC7t" }), _jsx("button", { onClick: () => {
                            navigateHook(routes.login);
                            setIsOpen(false);
                        }, className: "sc-btn", children: "\u0110\u0103ng nh\u1EADp ho\u1EB7c t\u1EA1o t\u00E0i kho\u1EA3n" }), _jsx("p", { onClick: () => setIsOpen(false), children: "L\u00FAc kh\u00E1c" })] }) }) }));
};
export default RemindLoginModal;
