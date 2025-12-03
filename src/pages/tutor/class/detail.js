import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectDetailTutorClass, selectListStudentEnrolledClassFortutor, } from "../../../app/selector";
import { deleteClassForTutorApiThunk, getAllStudentEnrolledClassForTutorApiThunk, getDetailClassApiThunk, } from "../../../services/tutor/class/classThunk";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import { Modal, UpdateClassModal } from "../../../components/modal";
import { LoadingSpinner } from "../../../components/elements";
import { get } from "lodash";
import { toast } from "react-toastify";
const TutorDetailClassPage = () => {
    const { id } = useParams();
    const classDetail = useAppSelector(selectDetailTutorClass);
    const studentsEnrolled = useAppSelector(selectListStudentEnrolledClassFortutor);
    const dispatch = useAppDispatch();
    const [isUpdateClassOpen, setIsUpdateClassOpen] = useState(false);
    const [isDeleteClassOpen, setIsDeleteClassOpen] = useState(false);
    const [isDeleteClassSubmitting, setIsDeleteClassSubmitting] = useState(false);
    useEffect(() => {
        Promise.all([
            dispatch(getDetailClassApiThunk(id)),
            dispatch(getAllStudentEnrolledClassForTutorApiThunk()),
        ]);
    }, [id, dispatch]);
    // Hàm hiển thị "Không có" nếu giá trị rỗng
    const show = (value) => {
        if (value === null || value === undefined || value === "")
            return "Không có";
        return String(value);
    };
    const getStatusText = (status) => {
        switch (status) {
            case "Pending":
                return "Chờ xử lý";
            case "Approved":
                return "Đã chấp thuận";
            case "Rejected":
                return "Đã từ chối";
            case "Active":
                return "Đang hoạt động";
            default:
                return "Không có";
        }
    };
    const paymentStatusText = {
        Pending: "Chờ thanh toán",
        Paid: "Đã thanh toán",
        Unpaid: "Chưa thanh toán",
    };
    const dayOfWeekVN = {
        Monday: "Thứ 2",
        Tuesday: "Thứ 3",
        Wednesday: "Thứ 4",
        Thursday: "Thứ 5",
        Friday: "Thứ 6",
        Saturday: "Thứ 7",
        Sunday: "Chủ nhật",
    };
    useDocumentTitle(`Lớp học ${classDetail?.title}`);
    const handelDeleteClass = async () => {
        setIsDeleteClassSubmitting(true);
        dispatch(deleteClassForTutorApiThunk(id))
            .unwrap()
            .then((res) => {
            const message = get(res, "data.Message", "Xóa thành công");
            toast.success(message);
        })
            .catch((error) => {
            const errorData = get(error, "data.Message", "Có lỗi xảy ra");
            toast.error(errorData);
        })
            .finally(() => {
            setIsDeleteClassOpen(false);
            setIsDeleteClassSubmitting(false);
            navigateHook(routes.tutor.class.list);
        });
    };
    return (_jsxs("section", { id: "detail-tutor-class-section", children: [_jsxs("div", { className: "dtcs-container", children: [_jsxs("div", { className: "dtcscr1", children: [_jsx("h4", { children: "Chi ti\u1EBFt" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "L\u1EDBp h\u1ECDc" })] })] }), _jsx("div", { className: "dtcscr3", children: _jsx("button", { className: "pr-btn", onClick: () => navigateHook(routes.tutor.class.list), children: "Quay l\u1EA1i" }) }), _jsxs("div", { className: "dtcscr4", children: [_jsxs("div", { className: "dtcscr4r1", children: [_jsxs("div", { className: "dtcscr4r1c1", children: [_jsx("h4", { children: "Ch\u1EE7 \u0111\u1EC1" }), _jsx("p", { children: show(classDetail?.title) }), _jsx("h4", { children: "M\u00F4 t\u1EA3" }), _jsx("p", { children: show(classDetail?.description) }), _jsx("h4", { children: "\u0110\u1ECBa \u0111i\u1EC3m" }), _jsx("p", { children: show(classDetail?.location) }), _jsx("h4", { children: "S\u1ED1 l\u01B0\u1EE3ng gi\u1EDBi h\u1EA1n" }), _jsx("p", { children: show(classDetail?.studentLimit) }), _jsx("h4", { children: "Ng\u00E0y b\u1EAFt \u0111\u1EA7u" }), _jsx("p", { children: classDetail?.classStartDate
                                                    ? formatDate(String(classDetail.classStartDate))
                                                    : "Không có" }), _jsx("h4", { children: "Ng\u00E0y t\u1EA1o" }), _jsx("p", { children: classDetail?.createdAt
                                                    ? formatDate(String(classDetail.createdAt))
                                                    : "Không có" })] }), _jsxs("div", { className: "dtcscr4r1c2", children: [_jsx("h4", { children: "M\u00F4n h\u1ECDc" }), _jsx("p", { children: show(classDetail?.subject) }), _jsx("h4", { children: "C\u1EA5p b\u1EADc h\u1ECDc" }), _jsx("p", { children: show(classDetail?.educationLevel) }), _jsx("h4", { children: "H\u00ECnh th\u1EE9c h\u1ECDc" }), _jsx("p", { children: show(classDetail?.mode) }), _jsx("h4", { children: "H\u1ECDc ph\u00ED" }), _jsx("p", { children: classDetail?.price
                                                    ? `${classDetail.price.toLocaleString()} VNĐ`
                                                    : "Không có" }), _jsx("h4", { children: "Tr\u1EA1ng th\u00E1i" }), _jsx("p", { children: getStatusText(classDetail?.status) }), _jsx("h4", { children: "L\u1ECBch h\u1ECDc" }), classDetail?.scheduleRules &&
                                                classDetail.scheduleRules.length > 0 ? (classDetail.scheduleRules.map((s, index) => (_jsxs("div", { children: [_jsx("h4", { children: dayOfWeekVN[s.dayOfWeek] ??
                                                            s.dayOfWeek }), _jsxs("p", { children: [show(s.startTime), " \u2192", " ", show(s.endTime)] })] }, index)))) : (_jsx("p", { children: "Kh\u00F4ng c\u00F3" }))] })] }), _jsxs("div", { className: "dtcscr4r2", children: [_jsx("button", { className: "pr-btn", onClick: () => setIsUpdateClassOpen(true), children: "C\u1EADp nh\u1EADt" }), _jsx("button", { className: "delete-btn", onClick: () => setIsDeleteClassOpen(true), children: "X\u00F3a l\u1EDBp h\u1ECDc" })] })] }), Number(classDetail?.currentStudentCount) > 0 && (_jsxs("div", { className: "dtcscr5", children: [_jsx("h3", { children: "Danh s\u00E1ch h\u1ECDc vi\u00EAn \u0111\u0103ng k\u00FD" }), _jsxs("table", { className: "table", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { className: "table-head-row", children: [_jsx("th", { className: "table-head-cell", children: "Email" }), _jsx("th", { className: "table-head-cell", children: "H\u1ECD v\u00E0 t\u00EAn" }), _jsx("th", { className: "table-head-cell", children: "Tr\u1EA1ng th\u00E1i" }), _jsx("th", { className: "table-head-cell", children: "Th\u1EDDi gian tham gia" }), _jsx("th", { className: "table-head-cell", children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { className: "table-body", children: studentsEnrolled?.map((item) => (_jsxs("tr", { className: "table-body-row", children: [_jsx("td", { className: "table-body-cell", children: item.studentEmail }), _jsx("td", { className: "table-body-cell", children: item.studentName }), _jsx("td", { className: "table-body-cell", children: paymentStatusText[item.paymentStatus] ?? "Không có" }), _jsx("td", { className: "table-body-cell", children: formatDate(item.createdAt) }), _jsx("td", { className: "table-body-cell", children: _jsx("button", { className: "pr-btn", onClick: () => { }, children: "Chi ti\u1EBFt" }) })] }, item.studentId))) })] })] }))] }), _jsx(UpdateClassModal, { isOpen: isUpdateClassOpen, setIsOpen: setIsUpdateClassOpen, selectedClass: classDetail }), _jsx(Modal, { isOpen: isDeleteClassOpen, setIsOpen: setIsDeleteClassOpen, title: "X\u00F3a l\u1EDBp h\u1ECDc", children: _jsx("section", { id: "student-assign-class-modal", children: _jsxs("div", { className: "sacm-container", children: [_jsx("h3", { children: "B\u1EA1n c\u00F3 ch\u1EAFc ch\u1EAFn x\u00F3a l\u1EDBp h\u1ECDc n\u00E0y" }), _jsx("button", { onClick: () => {
                                    handelDeleteClass();
                                }, className: isDeleteClassSubmitting
                                    ? "disable-btn"
                                    : "delete-btn", children: isDeleteClassSubmitting ? (_jsx(LoadingSpinner, {})) : ("Xóa") }), _jsx("p", { onClick: () => setIsDeleteClassSubmitting(false), children: "L\u00FAc kh\u00E1c" })] }) }) })] }));
};
export default TutorDetailClassPage;
