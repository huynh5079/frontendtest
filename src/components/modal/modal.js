import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Modal = ({ isOpen, setIsOpen, title, children }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "modal-overlay", onClick: () => setIsOpen(false), children: _jsxs("div", { className: "modal-container", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "modal-header", children: [_jsx("h2", { className: "modal-title", children: title }), _jsx("button", { className: "modal-close-btn", onClick: () => setIsOpen(false), children: "\u00D7" })] }), _jsx("div", { className: "modal-body", children: children })] }) }));
};
export default Modal;
