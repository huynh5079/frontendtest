import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../../../components/elements";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectDetailRequestFindTutorForTutor, selectListApplyRequestFindTutorForTutor, } from "../../../app/selector";
import { applyRequestFindTutorForTutorApiThunk, getApplyRequestFindTutorForTutorApiThunk, getDetailRequestFindTutorForTutorApiThunk, withdrawApplyRequestFindTutorForTutorApiThunk, } from "../../../services/tutor/requestFindTutor/requestFindTutorThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
// Bảng ngày trong tuần (0-6)
const daysOfWeek = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
];
const DetailRequestFindtutorForTutorPage = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const request = useAppSelector(selectDetailRequestFindTutorForTutor);
    const applyRequests = useAppSelector(selectListApplyRequestFindTutorForTutor);
    const isApply = applyRequests?.some((applyRequest) => applyRequest.classRequestId === id);
    const cuurentApplyId = applyRequests?.find((applyRequest) => applyRequest.classRequestId === id)?.id;
    const [isSubmittingApply, setIsSubmittingApply] = useState(false);
    const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);
    useEffect(() => {
        if (id) {
            dispatch(getDetailRequestFindTutorForTutorApiThunk(id));
            dispatch(getApplyRequestFindTutorForTutorApiThunk());
        }
    }, [dispatch, id]);
    // Hàm hiển thị "Không có" nếu giá trị rỗng
    const show = (value) => {
        if (value === null || value === undefined || value === "")
            return "Không có";
        return String(value);
    };
    const handleWithdraw = async (applyId) => {
        if (id) {
            setIsSubmittingWithdraw(true);
            await dispatch(withdrawApplyRequestFindTutorForTutorApiThunk(applyId))
                .unwrap()
                .then((res) => {
                const message = get(res, "data.message", "Đã rút đơn ứng tuyển");
                toast.success(message);
            })
                .catch((error) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
                .finally(() => {
                setIsSubmittingWithdraw(false);
                dispatch(getDetailRequestFindTutorForTutorApiThunk(id));
                dispatch(getApplyRequestFindTutorForTutorApiThunk());
            });
        }
    };
    const handleApply = async () => {
        if (id) {
            setIsSubmittingApply(true);
            await dispatch(applyRequestFindTutorForTutorApiThunk({ classRequestId: id }))
                .unwrap()
                .then((res) => {
                const message = get(res, "data.message", "Ứng tuyển thành công");
                toast.success(message);
            })
                .catch((error) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
                .finally(() => {
                setIsSubmittingApply(false);
                dispatch(getDetailRequestFindTutorForTutorApiThunk(id));
                dispatch(getApplyRequestFindTutorForTutorApiThunk());
            });
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case "Pending":
                return "Chờ xử lý";
            case "Approved":
                return "Đã chấp thuận";
            case "Rejected":
                return "Đã từ chối";
            default:
                return "Không có";
        }
    };
    useDocumentTitle("Chi tiết đơn tìm gia sư");
    return (_jsx("section", { id: "detail-request-find-tutor-for-tutor-section", children: _jsxs("div", { className: "drftfts-container", children: [_jsxs("div", { className: "drftftscr1", children: [_jsx("h4", { children: "Chi ti\u1EBFt" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "\u0110\u01A1n t\u00ECm gia s\u01B0" })] })] }), _jsx("div", { className: "drftftscr3", children: _jsx("button", { className: "pr-btn", onClick: () => navigateHook(routes.tutor.request.list), children: "Quay l\u1EA1i" }) }), _jsxs("div", { className: "drftftscr4", children: [_jsxs("div", { className: "drftftscr4r1", children: [_jsxs("div", { className: "drftftscr4r1c1", children: [_jsx("h4", { children: "H\u1ECDc sinh" }), _jsx("p", { children: show(request?.studentName) }), _jsx("h4", { children: "M\u00F4 t\u1EA3" }), _jsx("p", { children: show(request?.description) }), _jsx("h4", { children: "\u0110\u1ECBa \u0111i\u1EC3m" }), _jsx("p", { children: show(request?.location) }), _jsx("h4", { children: "Y\u00EAu c\u1EA7u \u0111\u1EB7c bi\u1EC7t" }), _jsx("p", { children: show(request?.specialRequirements) }), _jsx("h4", { children: "Ng\u00E0y b\u1EAFt \u0111\u1EA7u" }), _jsx("p", { children: request?.classStartDate
                                                ? formatDate(String(request.classStartDate))
                                                : "Không có" }), _jsx("h4", { children: "Ng\u00E0y h\u1EBFt h\u1EA1n" }), _jsx("p", { children: request?.expiryDate
                                                ? formatDate(String(request.expiryDate))
                                                : "Không có" }), _jsx("h4", { children: "Ng\u00E0y t\u1EA1o" }), _jsx("p", { children: request?.createdAt
                                                ? formatDate(String(request.createdAt))
                                                : "Không có" })] }), _jsxs("div", { className: "drftftscr4r1c2", children: [_jsx("h4", { children: "M\u00F4n h\u1ECDc" }), _jsx("p", { children: show(request?.subject) }), _jsx("h4", { children: "C\u1EA5p b\u1EADc h\u1ECDc" }), _jsx("p", { children: show(request?.educationLevel) }), _jsx("h4", { children: "H\u00ECnh th\u1EE9c h\u1ECDc" }), _jsx("p", { children: show(request?.mode) }), _jsx("h4", { children: "H\u1ECDc ph\u00ED" }), _jsx("p", { children: request?.budget
                                                ? `${request.budget.toLocaleString()} VNĐ`
                                                : "Không có" }), _jsx("h4", { children: "Tr\u1EA1ng th\u00E1i" }), _jsx("p", { children: getStatusText(request?.status) }), _jsx("h4", { children: "L\u1ECBch h\u1ECDc" }), request?.schedules &&
                                            request.schedules.length > 0 ? ([...request.schedules]
                                            .sort((a, b) => {
                                            const order = [1, 2, 3, 4, 5, 6, 0];
                                            return (order.indexOf(a.dayOfWeek) -
                                                order.indexOf(b.dayOfWeek));
                                        })
                                            .map((s, index) => (_jsxs("div", { children: [_jsx("h4", { children: daysOfWeek[s.dayOfWeek] }), _jsxs("p", { children: [show(s.startTime), " \u2192", " ", show(s.endTime)] })] }, index)))) : (_jsx("p", { children: "Kh\u00F4ng c\u00F3" }))] })] }), _jsx("div", { className: "drftftscr4r2", children: !isApply ? (_jsx("button", { className: isSubmittingApply ? "disable-btn" : "pr-btn", onClick: handleApply, children: isSubmittingApply ? (_jsx(LoadingSpinner, {})) : ("Ứng tuyển") })) : (_jsxs(_Fragment, { children: [_jsx("button", { className: "disable-btn", children: "\u0110\u00E3 \u1EE9ng tuy\u1EC3n" }), _jsx("button", { className: isSubmittingWithdraw
                                            ? "disable-btn"
                                            : "delete-btn", onClick: () => {
                                            handleWithdraw(cuurentApplyId);
                                        }, children: isSubmittingWithdraw ? (_jsx(LoadingSpinner, {})) : ("Rút đơn ứng tuyển") })] })) })] })] }) }));
};
export default DetailRequestFindtutorForTutorPage;
