import { jsx as _jsx } from "react/jsx-runtime";
const Article = ({ content }) => {
    return (_jsx("div", { className: "article", dangerouslySetInnerHTML: { __html: content } }));
};
export default Article;
