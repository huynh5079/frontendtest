import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { navigateHook } from "../../../../routes/routeApp";
import { routes } from "../../../../routes/routeName";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectTutorForAdmin } from "../../../../app/selector";
import { acceptTutorApiThunk, getDetailTutorForAdminApiThunk, provideTutorApiThunk, rejectTutorApiThunk, } from "../../../../services/admin/tutor/adminTutorThunk";
import { csvToArray, useDocumentTitle } from "../../../../utils/helper";
import { get } from "lodash";
import { toast } from "react-toastify";
import ReactQuill from "react-quill-new";
import { Article } from "../../../../components/elements";
const AdminDetailTutorPage = () => {
    const { id } = useParams();
    const tutor = useAppSelector(selectTutorForAdmin);
    const dispatch = useAppDispatch();
    const subjects = csvToArray(tutor?.teachingSubjects || "");
    //reject
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    //provide
    const [isProvideOpen, setIsProvideOpen] = useState(false);
    const [provideText, setProvideText] = useState("");
    useEffect(() => {
        dispatch(getDetailTutorForAdminApiThunk(String(id)))
            .unwrap()
            .then(() => { })
            .catch(() => { })
            .finally(() => { });
    }, [dispatch, id]);
    const acceptTutor = async (tutorId) => {
        await dispatch(acceptTutorApiThunk(tutorId))
            .unwrap()
            .then((res) => {
            const message = get(res, "data.message", "Xử lí thành công");
            toast.success(message);
        })
            .catch((error) => {
            const errorData = get(error, "data.message", "Có lỗi xảy ra");
            toast.error(errorData);
        })
            .finally(() => { });
    };
    const rejectTutor = async (tutorId, resonReject) => {
        await dispatch(rejectTutorApiThunk({
            tutorId,
            params: { rejectReason: resonReject },
        }))
            .unwrap()
            .then((res) => {
            const message = get(res, "message", "Xử lí thành công");
            toast.success(message);
        })
            .catch((error) => {
            const errorData = get(error, "message", "Có lỗi xảy ra");
            toast.error(errorData);
        })
            .finally(() => { });
    };
    const provideTutor = async (tutorId, provideText) => {
        await dispatch(provideTutorApiThunk({
            tutorId,
            params: { provideText: provideText },
        }))
            .unwrap()
            .then((res) => {
            const message = get(res, "message", "Xử lí thành công");
            toast.success(message);
        })
            .catch((error) => {
            const errorData = get(error, "message", "Có lỗi xảy ra");
            toast.error(errorData);
        })
            .finally(() => { });
    };
    useDocumentTitle(`Gia sư ${tutor?.userName}`);
    return (_jsx("section", { id: "admin-detail-tutor-section", children: _jsxs("div", { className: "adts-container", children: [_jsxs("div", { className: "adtscr1", children: [_jsx("h4", { children: "Gia s\u01B0" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "Chi ti\u1EBFt" })] })] }), _jsx("div", { className: "adtscr2", children: _jsx("div", { className: "pr-btn", onClick: () => {
                            navigateHook(routes.admin.tutor.list);
                        }, children: "Quay l\u1EA1i" }) }), _jsxs("div", { className: "adtscr3", children: [_jsxs("div", { className: "adtscr3r1", children: [_jsxs("div", { className: "adtscr3r1c1", children: [_jsx("h5", { children: "\u1EA2nh \u0111\u1EA1i di\u1EC7n" }), _jsx("img", { className: "avatar", src: tutor?.avatarUrl, alt: "" })] }), _jsxs("div", { className: "adtscr3r1c2", children: [_jsx("h5", { children: "M\u00F4n h\u1ECDc" }), _jsx("div", { className: "subject", children: _jsx("ul", { children: subjects.map((subject, index) => (_jsxs("li", { children: [subject, ": ", _jsx("span", { children: "100.000 \u0111" }), "/bu\u1ED5i"] }, index))) }) })] })] }), _jsxs("div", { className: "adtscr3r2", children: [_jsxs("div", { className: "adtscr3r2c1", children: [_jsx("h5", { children: "Th\u00F4ng tin c\u00E1 nh\u00E2n" }), _jsx("h6", { children: "H\u1ECD v\u00E0 t\u00EAn:" }), _jsx("p", { children: tutor?.userName }), _jsx("h6", { children: "Gi\u1EDBi t\u00EDnh:" }), _jsx("h6", { children: "Email:" }), _jsx("p", { children: tutor?.email }), _jsx("h6", { children: "\u0110\u1ECBa ch\u1EC9:" }), _jsx("p", { children: tutor?.address }), _jsx("h6", { children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i:" }), _jsx("p", { children: tutor?.phone }), _jsx("h6", { children: "Ng\u00E0y sinh:" }), _jsx("h6", { children: "M\u00F4 t\u1EA3 b\u1EA3n th\u00E2n:" }), _jsx("p", { children: tutor?.bio })] }), _jsxs("div", { className: "adtscr3r2c2", children: [_jsx("h5", { children: "H\u1ED3 s\u01A1 c\u00E1 nh\u00E2n" }), _jsx("h6", { children: "Tr\u00ECnh \u0111\u1ED9 h\u1ECDc v\u1EA5n:" }), _jsx("p", { children: tutor?.educationLevel }), _jsx("h6", { children: "Ng\u00E0nh h\u1ECDc:" }), _jsx("p", { children: tutor?.major }), _jsx("h6", { children: "Tr\u01B0\u1EDDng/ \u0110\u01A1n v\u1ECB \u0111\u00E0o t\u1EA1o:" }), _jsx("p", { children: tutor?.university }), _jsx("h6", { children: "C\u1EA5p \u0111\u1ED9 gi\u1EA3ng d\u1EA1y:" }), _jsx("p", { children: tutor?.teachingLevel }), _jsx("h6", { children: "S\u1ED1 n\u0103m kinh nghi\u1EC7m:" }), _jsx("p", { children: tutor?.teachingExperienceYears }), _jsx("h6", { children: "H\u00ECnh \u1EA3nh CCCD:" }), tutor?.identityDocuments.map((identityDocument) => (_jsx("img", { src: identityDocument.url, alt: "" }, identityDocument.id))), _jsx("h6", { children: "Ch\u1EE9ng ch\u1EC9 c\u00E1 nh\u00E2n:" }), tutor?.certificates.map((certificate, index) => {
                                            return (_jsxs("div", { children: [_jsxs("h2", { children: [certificate.fileName, " "] }, certificate.id), _jsx("a", { href: certificate.url, download: true, children: "Xem" })] }, index));
                                        })] })] }), tutor?.status === "PendingApproval" ||
                            tutor?.status === "Rejected" ? (_jsxs("div", { className: "adtscr3r3", children: [tutor?.status === "PendingApproval" &&
                                    tutor?.provideNote && (_jsxs("div", { className: "review-container", style: { marginBottom: "1rem" }, children: [_jsx("h2", { style: {
                                                fontWeight: "600",
                                                marginBottom: "0.5rem",
                                            }, children: "C\u00E1c \u0111i\u1EC1u c\u1EA7n b\u1ED5 sung:" }), _jsx(Article, { content: tutor?.provideNote })] })), tutor?.status === "PendingApproval" && (_jsxs("div", { className: "adtscr3r3r1", children: [_jsx("button", { className: "pr-btn", onClick: () => acceptTutor(String(tutor?.userId)), children: "Duy\u1EC7t" }), _jsx("button", { className: "sc-btn", onClick: () => {
                                                setIsRejectOpen(!isRejectOpen),
                                                    setIsProvideOpen(false);
                                            }, children: "T\u1EEB ch\u1ED1i" }), _jsx("button", { className: "pr-btn", onClick: () => {
                                                setIsProvideOpen(!isProvideOpen),
                                                    setIsRejectOpen(false);
                                            }, children: "Y\u00EAu c\u1EA7u b\u1ED5 sung" })] })), isRejectOpen && (_jsx(_Fragment, { children: _jsxs("div", { className: "editor-wrapper", children: [_jsx(ReactQuill, { theme: "snow", value: rejectReason, onChange: setRejectReason, style: { height: "200px" }, placeholder: "Nh\u1EADp l\u00ED do t\u1EEB ch\u1ED1i h\u1ED3 s\u01A1" }), _jsx("button", { className: "pr-btn", onClick: () => rejectTutor(String(tutor?.userId), rejectReason), children: "G\u1EEDi" })] }) })), isProvideOpen && (_jsx(_Fragment, { children: _jsxs("div", { className: "editor-wrapper", children: [_jsx(ReactQuill, { theme: "snow", value: provideText, onChange: setProvideText, style: { height: "200px" }, placeholder: "Nh\u1EADp c\u00E1c \u0111i\u1EC1u c\u1EA7n b\u1ED5 sung th\u00EAm cho h\u1ED3 s\u01A1" }), _jsx("button", { className: "pr-btn", onClick: () => provideTutor(String(tutor?.userId), provideText), children: "G\u1EEDi" })] }) }))] })) : (_jsx(_Fragment, {}))] })] }) }));
};
export default AdminDetailTutorPage;
