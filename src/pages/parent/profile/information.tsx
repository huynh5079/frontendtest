import { useEffect, type FC } from "react";
import { useSearchParams } from "react-router-dom";
import {
    ParentBookingTutor,
    ParentChangePassword,
    ParentChildAccount,
    ParentChildReportLearning,
    ParentChildScheduleSchedule,
    ParentInformtionSidebar,
    ParentProfile,
    ParentRequestFindTutor,
    ParentWallet,
} from "../../../components/parent/information";
import { useAppDispatch } from "../../../app/store";
import { getProfileParentApiThunk } from "../../../services/user/userThunk";

const ParentInformationPage: FC = () => {
    const dispatch = useAppDispatch();

    const [searchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "profile";

    useEffect(() => {
        dispatch(getProfileParentApiThunk());
    }, [dispatch]);

    const renderContent = () => {
        switch (tab) {
            case "change-password":
                return <ParentChangePassword />;
            case "wallet":
                return <ParentWallet />;
            case "schedule":
                return <ParentChildScheduleSchedule />;
            case "booking_tutor":
                return <ParentBookingTutor />;
            case "request":
                return <ParentRequestFindTutor />;
            case "report":
                return <ParentChildReportLearning />;
            case "child-account":
                return <ParentChildAccount />;
            case "profile":
            default:
                return <ParentProfile />;
        }
    };

    return (
        <section id="parent-information-section">
            <div className="pis-container">
                <div className="piscc1">
                    <ParentInformtionSidebar activeTab={tab} />
                </div>
                <div className="piscc2">{renderContent()}</div>
            </div>
        </section>
    );
};

export default ParentInformationPage;
