import type { FC } from "react";

type ArticleParams = {
    content: string;
};

const Article: FC<ArticleParams> = ({ content }) => {
    return (
        <div
            className="article"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default Article;
