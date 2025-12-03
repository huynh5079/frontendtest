import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { MdAttachMoney, MdDateRange, MdDescription, MdFormatListBulleted, MdLocationOn, MdMenuBook, MdOutlineCastForEducation, MdSchool, } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectBalance, selectListTutorSchedule, selectPublicTutor, } from "../../../app/selector";
import { useParams } from "react-router-dom";
import { publicGetDetailTutorApiThunk } from "../../../services/public/tutor/tutorThunk";
import { getAllTutorScheduleApiThunk } from "../../../services/booking/bookingThunk";
import { csvToArray, formatDateToYMD, groupSchedulesByWeek, useDocumentTitle, } from "../../../utils/helper";
import { DatePickerElement, LoadingSpinner, WeekCalendar, } from "../../../components/elements";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createClassRequestForStudentApiThunk } from "../../../services/student/bookingTutor/bookingTutorThunk";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { toast } from "react-toastify";
import { get } from "lodash";
import { checkBalanceApiThunk, transferWalletApiThunk, } from "../../../services/wallet/walletThunk";
const StudentBookTutor = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const bookingPrice = 50000;
    const tutor = useAppSelector(selectPublicTutor);
    const tutorSchedules = useAppSelector(selectListTutorSchedule);
    const balance = useAppSelector(selectBalance);
    const busySchedules = groupSchedulesByWeek(Array.isArray(tutorSchedules) ? tutorSchedules : []);
    const tutorSubjects = csvToArray(tutor?.teachingSubjects || "");
    const [classOptions, setClassOptions] = useState([]);
    useEffect(() => {
        dispatch(publicGetDetailTutorApiThunk(id));
        dispatch(checkBalanceApiThunk());
    }, [dispatch, id]);
    useDocumentTitle("Đặt lịch gia sư");
    const initialValues = {
        studentUserId: null,
        tutorId: tutor?.tutorProfileId || null,
        subject: "",
        educationLevel: "",
        description: "",
        location: "",
        budget: 0,
        mode: "Offline",
        classStartDate: "",
        specialRequirements: "",
        schedules: [],
    };
    const validationSchema = Yup.object({
        subject: Yup.string().required("Vui lòng chọn môn học"),
        educationLevel: Yup.string().required("Vui lòng chọn lớp"),
        description: Yup.string().required("Vui lòng nhập mô tả"),
        location: Yup.string().when("mode", {
            is: "Offline",
            then: (schema) => schema.required("Vui lòng nhập địa chỉ học"),
        }),
        mode: Yup.string()
            .oneOf(["Offline", "Online"])
            .required("Vui lòng chọn hình thức học"),
        classStartDate: Yup.string().required("Vui lòng chọn ngày bắt đầu"),
        budget: Yup.number().min(0, "Học phí phải >= 0"),
        schedules: Yup.array()
            .of(Yup.object().shape({
            dayOfWeek: Yup.number().required(),
            startTime: Yup.string().required(),
            endTime: Yup.string().required(),
        }))
            .min(1, "Vui lòng chọn lịch đúng số buổi"),
    });
    return (_jsx("section", { id: "student-book-tutor-section", children: _jsxs("div", { className: "sbts-container", children: [_jsx("h2", { children: "\u0110\u1EB7t l\u1ECBch gia s\u01B0" }), _jsx(Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: (values, { setSubmitting }) => {
                        setSubmitting(true);
                        const totalAmount = values.mode === "Online"
                            ? bookingPrice + values.budget
                            : bookingPrice;
                        if (balance?.balance && balance.balance < totalAmount) {
                            toast.error("Số dư ví của bạn không đủ, vui lòng nạp thêm tiền.");
                            setSubmitting(false);
                            return;
                        }
                        dispatch(createClassRequestForStudentApiThunk(values))
                            .unwrap()
                            .then(() => {
                            dispatch(transferWalletApiThunk({
                                toUserId: "0E85EF35-39C1-418A-9A8C-0F83AC9520A6",
                                amount: totalAmount,
                                note: "Phí đặt lịch gia sư",
                            }))
                                .unwrap()
                                .then((res) => {
                                const message = get(res, "data.message", "Đặt lịch thành công");
                                toast.success(message);
                                navigateHook(routes.student.home);
                            });
                        })
                            .catch((error) => {
                            const errorData = get(error, "data.message", "Có lỗi xảy ra");
                            toast.error(errorData);
                        })
                            .finally(() => {
                            setSubmitting(false);
                        });
                    }, children: ({ values, setFieldValue, isSubmitting }) => {
                        // Load lịch dạy theo startDate
                        useEffect(() => {
                            if (tutor?.tutorProfileId &&
                                values.classStartDate) {
                                const start = formatDateToYMD(new Date(values.classStartDate));
                                const endDate = new Date(values.classStartDate);
                                endDate.setDate(endDate.getDate() + 30);
                                const end = formatDateToYMD(endDate);
                                dispatch(getAllTutorScheduleApiThunk({
                                    tutorProfileId: String(tutor.tutorProfileId),
                                    startDate: start,
                                    endDate: end,
                                }));
                            }
                        }, [
                            dispatch,
                            tutor?.tutorProfileId,
                            values.classStartDate,
                        ]);
                        // Cập nhật classOptions theo teachingLevel
                        const handleSubjectChange = (value) => {
                            setFieldValue("subject", value);
                            setFieldValue("educationLevel", "");
                            const level = tutor?.teachingLevel?.toLowerCase() || "";
                            let options = [];
                            if (level.includes("tiểu học"))
                                options.push(...Array.from({ length: 5 }, (_, i) => `Lớp ${i + 1}`));
                            if (level.includes("trung học cơ sở"))
                                options.push(...Array.from({ length: 4 }, (_, i) => `Lớp ${i + 6}`));
                            if (level.includes("trung học phổ thông"))
                                options.push(...Array.from({ length: 3 }, (_, i) => `Lớp ${i + 10}`));
                            setClassOptions(options);
                        };
                        useEffect(() => {
                            const count = values.schedules.length;
                            let fee = 0;
                            if (count === 1)
                                fee = 500000;
                            else if (count === 2)
                                fee = 800000;
                            else if (count === 3)
                                fee = 1000000;
                            else if (count === 4)
                                fee = 1200000;
                            else if (count === 5)
                                fee = 1500000;
                            else if (count === 6)
                                fee = 1800000;
                            setFieldValue("budget", fee);
                        }, [values.schedules, setFieldValue]);
                        const priceOffline = bookingPrice;
                        const priceOnline = bookingPrice + values.budget;
                        return (_jsxs(Form, { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "M\u00F4n h\u1ECDc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdMenuBook, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "subject", className: "form-input", onChange: (e) => handleSubjectChange(e.target.value), children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn m\u00F4n h\u1ECDc --" }), tutorSubjects.map((s) => (_jsx("option", { value: s, children: s }, s)))] })] }), _jsx(ErrorMessage, { name: "subject", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "L\u1EDBp" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdSchool, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "educationLevel", className: "form-input", children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn l\u1EDBp --" }), classOptions.map((cls) => (_jsx("option", { value: cls, children: cls }, cls)))] })] }), _jsx(ErrorMessage, { name: "educationLevel", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "M\u00F4 t\u1EA3" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdDescription, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "description", className: "form-input", placeholder: "Nh\u1EADp m\u00F4 t\u1EA3" })] }), _jsx(ErrorMessage, { name: "description", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Y\u00EAu c\u1EA7u \u0111\u1EB7c bi\u1EC7t" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdFormatListBulleted, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "specialRequirements", className: "form-input", placeholder: "Nh\u1EADp y\u00EAu c\u1EA7u \u0111\u1EB7c bi\u1EC7t" })] }), _jsx(ErrorMessage, { name: "specialRequirements", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ng\u00E0y b\u1EAFt \u0111\u1EA7u" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdDateRange, { className: "form-input-icon" }), _jsx(DatePickerElement, { placeholder: "Ch\u1ECDn ng\u00E0y b\u1EAFt \u0111\u1EA7u h\u1ECDc", value: values.classStartDate
                                                        ? new Date(values.classStartDate)
                                                        : null, onChange: (date) => setFieldValue("classStartDate", date?.toISOString() || "") })] }), _jsx("p", { className: "note", children: "Sau khi b\u1EA1n ch\u1ECDn ng\u00E0y b\u1EAFt \u0111\u1EA7u h\u1ECDc, l\u1ECBch h\u1ECDc trong tu\u1EA7n s\u1EBD hi\u1EC7n ra \u0111\u1EC3 b\u1EA1n l\u1EF1a ch\u1ECDn bu\u1ED5i h\u1ECDc ph\u00F9 h\u1EE3p." }), _jsx(ErrorMessage, { name: "classStartDate", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "H\u00ECnh th\u1EE9c h\u1ECDc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineCastForEducation, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "mode", className: "form-input", children: [_jsx("option", { value: "Offline", children: "H\u1ECDc t\u1EA1i nh\u00E0" }), _jsx("option", { value: "Online", children: "H\u1ECDc tr\u1EF1c tuy\u1EBFn" })] })] }), _jsx(ErrorMessage, { name: "mode", component: "div", className: "text-error" })] }), values.mode === "Offline" && (_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "\u0110\u1ECBa ch\u1EC9" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdLocationOn, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "location", className: "form-input", placeholder: "Nh\u1EADp \u0111\u1ECBa ch\u1EC9 h\u1ECDc" })] }), _jsx(ErrorMessage, { name: "location", component: "div", className: "text-error" })] })), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "H\u1ECDc ph\u00ED 1 th\u00E1ng" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdAttachMoney, { className: "form-input-icon" }), _jsx(Field, { type: "text", className: "form-input", value: values.budget
                                                        ? values.budget.toLocaleString("vi-VN") + " VND"
                                                        : "", readOnly: true })] }), _jsx("p", { className: "note", children: "H\u1ECDc ph\u00ED s\u1EBD t\u1EF1 \u0111\u1ED9ng c\u1EADp nh\u1EADt khi b\u1EA1n ch\u1ECDn bu\u1ED5i h\u1ECDc" })] }), _jsx("div", { className: "note-container", children: _jsxs("p", { children: ["L\u01B0u \u00FD:", " ", _jsx("span", { children: "\u0110\u1ED1i v\u1EDBi h\u00ECnh th\u1EE9c h\u1ECDc t\u1EA1i nh\u00E0, ch\u00FAng t\u00F4i ch\u1EC9 thu ph\u00ED khi \u0111\u1EB7t l\u1ECBch. C\u00F2n v\u1EDBi h\u00ECnh th\u1EE9c h\u1ECDc tr\u1EF1c tuy\u1EBFn, h\u1ECDc vi\u00EAn c\u1EA7n thanh to\u00E1n tr\u01B0\u1EDBc h\u1ECDc ph\u00ED 1 th\u00E1ng c\u00F9ng v\u1EDBi ph\u00ED \u0111\u1EB7t l\u1ECBch." })] }) }), values.classStartDate && (_jsx("div", { className: "calendar-container", children: _jsx(WeekCalendar, { busySchedules: busySchedules, onSelectedChange: (schedules) => setFieldValue("schedules", schedules) }) })), _jsxs("div", { className: "price-container", children: [_jsx("div", { className: "price-container-col", children: _jsx("h4", { children: "Ph\u00ED \u0111\u1EB7t l\u1ECBch" }) }), _jsx("div", { className: "price-container-col", children: _jsxs("p", { children: [bookingPrice.toLocaleString(), " VN\u0110"] }) })] }), values.mode === "Online" && (_jsxs("div", { className: "price-container", children: [_jsx("div", { className: "price-container-col", children: _jsx("h4", { children: "H\u1ECDc ph\u00ED m\u1ED9t th\u00E1ng" }) }), _jsx("div", { className: "price-container-col", children: _jsxs("p", { children: [values.budget.toLocaleString(), " ", "VN\u0110"] }) })] })), _jsxs("div", { className: "price-container", children: [_jsx("div", { className: "price-container-col", children: _jsx("h4", { children: "T\u1ED5ng c\u1ED9ng" }) }), _jsx("div", { className: "price-container-col", children: _jsx("p", { children: values.mode === "Online"
                                                    ? priceOnline.toLocaleString() +
                                                        " VND"
                                                    : priceOffline.toLocaleString() +
                                                        " VND" }) })] }), _jsx("div", { className: "form-submit", children: _jsx("button", { type: "submit", className: isSubmitting
                                            ? "disable-btn"
                                            : "pr-btn payment-btn", disabled: isSubmitting, children: isSubmitting ? (_jsx(LoadingSpinner, {})) : ("Đặt lịch") }) })] }));
                    } })] }) }));
};
export default StudentBookTutor;
