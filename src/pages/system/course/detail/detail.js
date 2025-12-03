import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { FaBookOpen, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { MdAttachMoney, MdDateRange, MdEditNote, MdFeedback, } from "react-icons/md";
import { FeedbackTutor, LoadingSpinner } from "../../../../components/elements";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectBalance, selectDetailPublicClass, selectIsAuthenticated, selectIsEnrolledClassForStudent, selectUserLogin, } from "../../../../app/selector";
import { publicGetDetailClassApiThunk } from "../../../../services/public/class/classthunk";
import { publicGetDetailTutorApiThunk } from "../../../../services/public/tutor/tutorThunk";
import { useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, add } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { vi } from "date-fns/locale"; // <-- import locale Việt Nam
import { formatDate, useDocumentTitle, USER_PARENT, USER_STUDENT, } from "../../../../utils/helper";
import { Modal, RemindLoginModal } from "../../../../components/modal";
import { assignClassForStudentApiThunk, checkAssignClassForStudentApiThunk, withdrawClassForStudentApiThunk, } from "../../../../services/student/class/classThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createFeedbackInClassApiThunk } from "../../../../services/feedback/feedbackThunk";
import { checkBalanceApiThunk, transferWalletApiThunk, } from "../../../../services/wallet/walletThunk";
const locales = { "vi-VN": vi };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});
const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};
const DetailCoursePage = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const classDetail = useAppSelector(selectDetailPublicClass);
    // const tutorDetail = useAppSelector(selectPublicTutor);
    const isAuthendicated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUserLogin);
    const isEnrolledForStduent = useAppSelector(selectIsEnrolledClassForStudent);
    const balance = useAppSelector(selectBalance);
    const today = new Date();
    const [isRemidLoginOpen, setIsRemidLoginOpen] = useState(false);
    const [isStudentAssignClassOpen, setIsStudentAssignClassOpen] = useState(false);
    const [isStudentWithdrawClassOpen, setIsStudentWithdrawClassOpen] = useState(false);
    const [isStudentAssignClassSubmitting, setIsStudentAssignClassSubmitting] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const currentTab = searchParams.get("tab") || "mota"; // default là mô tả
    const handleChangeTab = (tab) => {
        navigate(`?tab=${tab}`);
    };
    useDocumentTitle(`Lớp học ${classDetail?.title}`);
    useEffect(() => {
        dispatch(publicGetDetailClassApiThunk(id));
    }, [id]);
    useEffect(() => {
        if (classDetail) {
            dispatch(publicGetDetailTutorApiThunk(classDetail?.tutorId.toLowerCase()));
        }
    }, [dispatch, classDetail]);
    useEffect(() => {
        if (classDetail && isAuthendicated === true) {
            dispatch(checkAssignClassForStudentApiThunk(id));
        }
    }, [isAuthendicated, classDetail]);
    useEffect(() => {
        if (isAuthendicated === true) {
            dispatch(checkBalanceApiThunk());
        }
    }, [isAuthendicated]);
    const events = useMemo(() => {
        if (!classDetail?.scheduleRules?.length)
            return [];
        // Tạo tuần mẫu: Monday -> Sunday
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        return classDetail.scheduleRules
            .map((rule) => {
            const targetDow = dayMap[rule.dayOfWeek]; // 0–6 (Sun–Sat)
            if (targetDow === undefined)
                return null;
            // Convert Sunday=0 thành vị trí trong tuần mẫu (Monday=1)
            const pos = (targetDow + 6) % 7;
            // => Monday=0, Tuesday=1, ..., Sunday=6
            const eventDate = add(weekStart, { days: pos });
            const [sh, sm] = rule.startTime.split(":").map(Number);
            const [eh, em] = rule.endTime.split(":").map(Number);
            const start = new Date(eventDate);
            start.setHours(sh, sm, 0);
            const end = new Date(eventDate);
            end.setHours(eh, em, 0);
            return { title: "", start, end };
        })
            .filter(Boolean);
    }, [classDetail?.scheduleRules]);
    const daysOfWeekVN = {
        Monday: "Thứ Hai",
        Tuesday: "Thứ Ba",
        Wednesday: "Thứ Tư",
        Thursday: "Thứ Năm",
        Friday: "Thứ Sáu",
        Saturday: "Thứ Bảy",
        Sunday: "Chủ Nhật",
    };
    const handleAssignClass = () => {
        if (isAuthendicated === false) {
            setIsRemidLoginOpen(true);
        }
        else if (isAuthendicated && user?.role === USER_STUDENT) {
            setIsStudentAssignClassOpen(true);
        }
        else if (isAuthendicated && user?.role === USER_PARENT) {
        }
    };
    const handelStudentAssignClass = async () => {
        setIsStudentAssignClassSubmitting(true);
        if (classDetail?.mode === "Online") {
            if (balance?.balance && balance.balance < classDetail?.price) {
                toast.error("Số dư ví của bạn không đủ, vui lòng nạp thêm tiền.");
                setIsStudentAssignClassSubmitting(false);
                return;
            }
        }
        dispatch(assignClassForStudentApiThunk({
            classId: id,
        }))
            .unwrap()
            .then((res) => {
            const message = get(res, "data.message", "Đăng ký thành công");
            toast.success(message);
            if (classDetail?.mode === "Online")
                dispatch(transferWalletApiThunk({
                    toUserId: "0E85EF35-39C1-418A-9A8C-0F83AC9520A6",
                    amount: classDetail?.price,
                    note: "Phí đặt lịch gia sư",
                }));
        })
            .catch((error) => {
            const errorData = get(error, "data.message", "Có lỗi xảy ra");
            toast.error(errorData);
        })
            .finally(() => {
            setIsStudentAssignClassOpen(false);
            dispatch(publicGetDetailClassApiThunk(id));
            setIsStudentAssignClassSubmitting(false);
            dispatch(checkAssignClassForStudentApiThunk(id));
        });
    };
    const initialValues = {
        classId: id,
        toUserId: classDetail?.tutorId,
        comment: "",
        rating: 0,
    };
    const feedbackValidationSchema = Yup.object({
        comment: Yup.string()
            .required("Vui lòng nhập đánh giá")
            .min(10, "Đánh giá phải ít nhất 10 ký tự"),
        rating: Yup.number()
            .min(1, "Vui lòng chọn số sao")
            .max(5, "Tối đa 5 sao")
            .required("Vui lòng chọn số sao"),
    });
    const StarRating = ({ value, onChange }) => {
        const stars = [1, 2, 3, 4, 5];
        return (_jsx("div", { className: "rating-stars", children: stars.map((star) => (_jsx("span", { onClick: () => onChange(star), style: {
                    cursor: "pointer",
                    color: star <= value ? "#FFD700" : "#ccc",
                    fontSize: "40px",
                    marginRight: "8px",
                }, children: "\u2605" }, star))) }));
    };
    const handelStudentWithdrawClass = async () => {
        setIsStudentAssignClassSubmitting(true);
        dispatch(withdrawClassForStudentApiThunk(id))
            .unwrap()
            .then((res) => {
            const message = get(res, "data.message", "Rút đăng ký thành công");
            toast.success(message);
        })
            .catch((error) => {
            const errorData = get(error, "data.message", "Có lỗi xảy ra");
            toast.error(errorData);
        })
            .finally(() => {
            setIsStudentWithdrawClassOpen(false);
            dispatch(publicGetDetailClassApiThunk(id));
            setIsStudentAssignClassSubmitting(false);
            dispatch(checkAssignClassForStudentApiThunk(id));
        });
    };
    const checkDisabledButton = () => {
        const isFull = classDetail?.currentStudentCount === classDetail?.studentLimit;
        // === NEW: Đóng đăng ký trước 1 ngày ===
        const classStart = new Date(classDetail?.classStartDate);
        const oneDayBefore = new Date(classStart);
        oneDayBefore.setDate(oneDayBefore.getDate() - 1);
        const isCloseBefore1Day = today >= oneDayBefore; // hôm nay >= ngày bắt đầu - 1 ngày
        const isEnrolled = isEnrolledForStduent === true;
        return {
            disabled: isFull || isCloseBefore1Day || isEnrolled,
            label: isEnrolled
                ? "Bạn đã đăng ký"
                : isFull
                    ? "Đã đủ số lượng"
                    : isCloseBefore1Day
                        ? "Đã đóng đăng ký"
                        : "Đăng ký khóa học",
        };
    };
    return (_jsxs("section", { id: "detail-course-section", children: [_jsxs("div", { className: "dcs-container", children: [_jsxs("div", { className: "dcscc1", children: [_jsx("h3", { children: classDetail?.title }), _jsxs("div", { className: "tabs", children: [_jsx("div", { className: `tabs-item ${currentTab === "mota" ? "tabs-item-actived" : ""}`, onClick: () => handleChangeTab("mota"), children: "M\u00F4 t\u1EA3" }), _jsx("div", { className: `tabs-item ${currentTab === "lichhoc"
                                            ? "tabs-item-actived"
                                            : ""}`, onClick: () => handleChangeTab("lichhoc"), children: "L\u1ECBch h\u1ECDc" }), _jsx("div", { className: `tabs-item ${currentTab === "danhgia"
                                            ? "tabs-item-actived"
                                            : ""}`, onClick: () => handleChangeTab("danhgia"), children: "\u0110\u00E1nh gi\u00E1" })] }), currentTab === "mota" && (_jsx("div", { className: "content", children: _jsx("p", { children: classDetail?.description }) })), currentTab === "lichhoc" && (_jsxs("div", { className: "content", children: [_jsx("h4", { children: "L\u1ECBch h\u1ECDc" }), classDetail?.scheduleRules && (_jsx(_Fragment, { children: classDetail.scheduleRules.map((rule, index) => (_jsx("div", { className: "schedules", children: _jsxs("p", { className: "schedule-item", children: [daysOfWeekVN[rule.dayOfWeek], " ", "- ", rule.startTime, " -", " ", rule.endTime] }) }, index))) })), _jsx(Calendar, { localizer: localizer, events: events || [], defaultView: Views.WEEK, views: [Views.WEEK], toolbar: false, step: 30, timeslots: 2, min: new Date(2024, 1, 1, 6, 0), max: new Date(2024, 1, 1, 22, 0), components: {
                                            header: ({ date }) => (_jsxs("div", { style: {
                                                    textAlign: "center",
                                                    padding: "8px 0",
                                                    fontWeight: 600,
                                                    fontSize: "14px",
                                                }, children: [format(date, "EEEE", {
                                                        locale: vi,
                                                    }), " "] })),
                                            event: () => (_jsx("div", { style: {
                                                    backgroundColor: "#4CAF50",
                                                    height: "100%",
                                                    borderRadius: "6px",
                                                } })),
                                        }, formats: {
                                            dayFormat: () => "", // Ẩn ngày (17, 18, 19…)
                                            timeGutterFormat: (date) => format(date, "HH:mm", { locale: vi }), // 24h
                                            eventTimeRangeFormat: ({ start, end, }) => `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`, // 24h
                                        }, eventPropGetter: () => ({
                                            style: {
                                                backgroundColor: "#4CAF50",
                                                borderRadius: "6px",
                                                border: "none",
                                            },
                                        }) })] })), currentTab === "danhgia" && (_jsxs("div", { className: "content", children: [_jsx(Formik, { initialValues: initialValues, validationSchema: feedbackValidationSchema, onSubmit: (values, { resetForm, setSubmitting }) => {
                                            const payload = {
                                                classId: id,
                                                toUserId: classDetail?.tutorId,
                                                comment: values.comment,
                                                rating: values.rating,
                                            };
                                            if (!isAuthendicated) {
                                                setIsRemidLoginOpen(true);
                                                return;
                                            }
                                            setSubmitting(true);
                                            dispatch(createFeedbackInClassApiThunk(payload))
                                                .unwrap()
                                                .then((res) => {
                                                const message = get(res, "data.message", "Đánh giá thành công");
                                                toast.success(message);
                                                resetForm();
                                            })
                                                .catch((error) => {
                                                const message = get(error, "data.message", "Có lỗi xảy ra");
                                                toast.error(message);
                                            })
                                                .finally(() => {
                                                setSubmitting(false);
                                            });
                                        }, children: ({ values, setFieldValue, isSubmitting }) => (_jsxs(Form, { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "\u0110\u00E1nh gi\u00E1" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdFeedback, { className: "form-input-icon" }), _jsx(Field, { name: "comment", type: "text", className: "form-input", placeholder: "H\u00E3y \u0111\u1EC3 l\u1EA1i \u0111\u00E1nh gi\u00E1" })] }), _jsx(ErrorMessage, { name: "comment", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx(StarRating, { value: values.rating, onChange: (star) => setFieldValue("rating", star) }), _jsx(ErrorMessage, { name: "rating", component: "p", className: "text-error" })] }), _jsx("button", { type: "submit", className: isSubmitting
                                                        ? "disable-btn"
                                                        : "pr-btn", children: isSubmitting ? (_jsx(LoadingSpinner, {})) : ("Đánh giá") })] })) }), _jsx(FeedbackTutor, { tutorId: id })] }))] }), _jsxs("div", { className: "dcscc2", children: [_jsxs("div", { className: "dcscc2r1", children: [_jsx("h3", { children: "Th\u00F4ng tin gia s\u01B0" }), _jsxs("div", { className: "info", children: [_jsx("div", { className: "avatar" }), _jsx("p", { className: "name", children: "T\u00EAn gi\u00E1 s\u01B0" })] }), _jsx("button", { className: "pr-btn", children: "Xem th\u00F4ng tin" })] }), _jsxs("div", { className: "dcscc2r2", children: [_jsx("h3", { children: "Th\u00F4ng tin kh\u00F3a h\u1ECDc" }), _jsxs("p", { children: [_jsx(FaBookOpen, { className: "icon" }), " ", _jsx("span", { children: "H\u00ECnh th\u1EE9c" }), ":", " ", classDetail?.mode === "Online"
                                                ? "Học trực tuyến"
                                                : "Học tại lớp"] }), classDetail?.mode === "Offline" && (_jsxs("p", { children: [_jsx(FaMapMarkerAlt, { className: "icon" }), " ", _jsx("span", { children: "\u0110\u1ECBa \u0111i\u1EC3m" }), ": ", classDetail?.location] })), _jsxs("p", { children: [_jsx(MdEditNote, { className: "icon" }), " ", _jsx("span", { children: "M\u00F4n h\u1ECDc" }), ": ", classDetail?.subject, " - ", classDetail?.educationLevel] }), _jsxs("p", { children: [_jsx(MdDateRange, { className: "icon" }), " ", _jsx("span", { children: "Ng\u00E0y kh\u00F3a h\u1ECDc b\u1EAFt \u0111\u1EA7u" }), ":", formatDate(String(classDetail?.classStartDate))] }), _jsxs("p", { children: [_jsx(MdAttachMoney, { className: "icon" }), " ", _jsx("span", { children: "Chi ph\u00ED" }), ": ", classDetail?.price, " / th\u00E1ng"] }), _jsxs("p", { children: [_jsx(FaUsers, { className: "icon" }), " ", _jsx("span", { children: "S\u1ED1 ng\u01B0\u1EDDi \u0111\u00E3 \u0111\u0103ng k\u00FD" }), ":", " ", classDetail?.currentStudentCount, "/", classDetail?.studentLimit] }), _jsx("button", { className: checkDisabledButton().disabled
                                            ? "disable-btn"
                                            : "pr-btn", onClick: () => handleAssignClass(), disabled: checkDisabledButton().disabled, children: checkDisabledButton().label }), isEnrolledForStduent && (_jsx("button", { className: "delete-btn", onClick: () => setIsStudentWithdrawClassOpen(true), children: "R\u00FAt \u0111\u0103ng k\u00FD" }))] })] })] }), _jsx(RemindLoginModal, { isOpen: isRemidLoginOpen, setIsOpen: setIsRemidLoginOpen }), _jsx(Modal, { isOpen: isStudentAssignClassOpen, setIsOpen: setIsStudentAssignClassOpen, title: "\u0110\u0103ng k\u00FD l\u1EDBp h\u1ECDc", children: _jsx("section", { id: "student-assign-class-modal", children: _jsxs("div", { className: "sacm-container", children: [_jsx("h3", { children: "B\u1EA1n c\u00F3 ch\u1EAFc ch\u1EAFn \u0111\u0103ng k\u00FD l\u1EDBp h\u1ECDc n\u00E0y" }), _jsx("button", { onClick: () => {
                                    handelStudentAssignClass();
                                }, className: isStudentAssignClassSubmitting
                                    ? "disable-btn"
                                    : "sc-btn", children: isStudentAssignClassSubmitting ? (_jsx(LoadingSpinner, {})) : ("Đăng ký") }), _jsx("p", { onClick: () => setIsStudentAssignClassOpen(false), children: "L\u00FAc kh\u00E1c" })] }) }) }), _jsx(Modal, { isOpen: isStudentWithdrawClassOpen, setIsOpen: setIsStudentWithdrawClassOpen, title: "R\u00FAt \u0111\u0103ng k\u00FD l\u1EDBp h\u1ECDc", children: _jsx("section", { id: "student-assign-class-modal", children: _jsxs("div", { className: "sacm-container", children: [_jsx("h3", { children: "B\u1EA1n c\u00F3 ch\u1EAFc ch\u1EAFn r\u00FAt \u0111\u0103ng k\u00FD l\u1EDBp h\u1ECDc n\u00E0y" }), _jsx("button", { onClick: () => {
                                    handelStudentWithdrawClass();
                                }, className: isStudentAssignClassSubmitting
                                    ? "disable-btn"
                                    : "sc-btn", children: isStudentAssignClassSubmitting ? (_jsx(LoadingSpinner, {})) : ("Rút đăng ký") }), _jsx("p", { onClick: () => setIsStudentAssignClassOpen(false), children: "L\u00FAc kh\u00E1c" })] }) }) })] }));
};
export default DetailCoursePage;
