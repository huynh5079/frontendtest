import { type FC } from "react";
import { useSearchParams } from "react-router-dom";
import {
    StudentRequestFindTutor,
    StudentChangePassword,
    StudentInformtionSidebar,
    StudentReportLearning,
    StudentSchedule,
    StudentWallet,
    StudentBookingTutor,
    StudentProfile,
    StudentAssignedClass,
} from "../../../components/student/information";

const StudentInformationPage: FC = () => {
    const [searchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "profile";

    const renderContent = () => {
        switch (tab) {
            case "change-password":
                return <StudentChangePassword />;
            case "wallet":
                return <StudentWallet />;
            case "schedule":
                return <StudentSchedule />;
            case "booking_tutor":
                return <StudentBookingTutor />;
            case "request":
                return <StudentRequestFindTutor />;
            case "report":
                return <StudentReportLearning />;
            case "assigned_class":
                return <StudentAssignedClass />;
            case "profile":
            default:
                return <StudentProfile />;
        }
    };

    return (
        <section id="student-information-section">
            <div className="sis-container">
                <div className="siscc1">
                    <StudentInformtionSidebar activeTab={tab} />
                </div>
                <div className="siscc2">{renderContent()}</div>
            </div>
        </section>
    );
};

export default StudentInformationPage;
