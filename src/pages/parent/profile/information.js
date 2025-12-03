import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ParentBookingTutor, ParentChangePassword, ParentChildAccount, ParentChildReportLearning, ParentChildScheduleSchedule, ParentInformtionSidebar, ParentProfile, ParentRequestFindTutor, ParentWallet, } from "../../../components/parent/information";
import { useAppDispatch } from "../../../app/store";
import { getProfileParentApiThunk } from "../../../services/user/userThunk";
const ParentInformationPage = () => {
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "profile";
    useEffect(() => {
        dispatch(getProfileParentApiThunk());
    }, [dispatch]);
    const renderContent = () => {
        switch (tab) {
            case "change-password":
                return _jsx(ParentChangePassword, {});
            case "wallet":
                return _jsx(ParentWallet, {});
            case "schedule":
                return _jsx(ParentChildScheduleSchedule, {});
            case "booking_tutor":
                return _jsx(ParentBookingTutor, {});
            case "request":
                return _jsx(ParentRequestFindTutor, {});
            case "report":
                return _jsx(ParentChildReportLearning, {});
            case "child-account":
                return _jsx(ParentChildAccount, {});
            case "profile":
            default:
                return _jsx(ParentProfile, {});
        }
    };
    return (_jsx("section", { id: "parent-information-section", children: _jsxs("div", { className: "pis-container", children: [_jsx("div", { className: "piscc1", children: _jsx(ParentInformtionSidebar, { activeTab: tab }) }), _jsx("div", { className: "piscc2", children: renderContent() })] }) }));
};
export default ParentInformationPage;
