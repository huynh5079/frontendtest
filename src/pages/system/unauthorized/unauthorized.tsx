import type { FC } from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage: FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>403 - Not Authenticated</h1>
            <p>
                You don’t have permission to access this page. Please return to
                the previous page or log in with the correct account.
            </p>
            <div className="flex gap-4">
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
