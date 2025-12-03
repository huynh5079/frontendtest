import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSearchParams } from "react-router-dom";
import { StudentRequestFindTutor, StudentChangePassword, StudentInformtionSidebar, StudentReportLearning, StudentSchedule, StudentWallet, StudentBookingTutor, StudentProfile, StudentAssignedClass, } from "../../../components/student/information";
const StudentInformationPage = () => {
    const [searchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "profile";
    const renderContent = () => {
        switch (tab) {
            case "change-password":
                return _jsx(StudentChangePassword, {});
            case "wallet":
                return _jsx(StudentWallet, {});
            case "schedule":
                return _jsx(StudentSchedule, {});
            case "booking_tutor":
                return _jsx(StudentBookingTutor, {});
            case "request":
                return _jsx(StudentRequestFindTutor, {});
            case "report":
                return _jsx(StudentReportLearning, {});
            case "assigned_class":
                return _jsx(StudentAssignedClass, {});
            case "profile":
            default:
                return _jsx(StudentProfile, {});
        }
    };
    return (_jsx("section", { id: "student-information-section", children: _jsxs("div", { className: "sis-container", children: [_jsx("div", { className: "siscc1", children: _jsx(StudentInformtionSidebar, { activeTab: tab }) }), _jsx("div", { className: "siscc2", children: renderContent() })] }) }));
};
export default StudentInformationPage;
