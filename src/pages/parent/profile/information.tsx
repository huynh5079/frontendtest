import { useEffect, type FC } from "react";
import { useSearchParams } from "react-router-dom";
import {
    ParentBookingTutor,
    ParentChangePassword,
    ParentChildAccount,
    ParentChildClass,
    ParentChildReportLearning,
    ParentChildScheduleSchedule,
    ParentFavoriteTutor,
    ParentInformtionSidebar,
    ParentLessonDetail,
    ParentProfile,
    ParentRequestFindTutor,
    ParentWallet,
} from "../../../components/parent/information";
import { useAppDispatch } from "../../../app/store";
import { getProfileParentApiThunk } from "../../../services/user/userThunk";
import { ChatPage } from "../../system/chat";

const ParentInformationPage: FC = () => {
    const dispatch = useAppDispatch();

    const [searchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "profile";

    useEffect(() => {
        dispatch(getProfileParentApiThunk());
    }, [dispatch]);

    const renderContent = () => {
        if (tab.startsWith("schedule/lesson_detail/")) {
            return <ParentLessonDetail />;
        }

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
            case "favorite":
                return <ParentFavoriteTutor />;
            case "class":
                return <ParentChildClass />;
            case "chat":
                return <ChatPage />;
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
