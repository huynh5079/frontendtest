import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { MdAttachMoney, MdDateRange, MdDescription, MdLinkOff, MdLocationOn, MdMenuBook, MdOutlineCastForEducation, MdPersonAdd, MdSchool, MdTitle, } from "react-icons/md";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectBalance, selectListTutorSchedule, selectProfileTutor, } from "../../../app/selector";
import { csvToArray, formatDateToYMD, groupSchedulesByWeek, useDocumentTitle, } from "../../../utils/helper";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { checkBalanceApiThunk, transferWalletApiThunk, } from "../../../services/wallet/walletThunk";
import { toast } from "react-toastify";
import { createClassApiThunk } from "../../../services/tutor/class/classThunk";
import { get } from "lodash";
import { getAllTutorScheduleApiThunk } from "../../../services/booking/bookingThunk";
import { DatePickerElement, LoadingSpinner, WeekCalendar, } from "../../../components/elements";
const TutorCreateClassPage = () => {
    const dispatch = useAppDispatch();
    const createClassFee = 50000;
    const tutorInfo = useAppSelector(selectProfileTutor);
    const balance = useAppSelector(selectBalance);
    const tutorSchedules = useAppSelector(selectListTutorSchedule);
    const busySchedules = groupSchedulesByWeek(Array.isArray(tutorSchedules) ? tutorSchedules : []);
    const tutorSubjects = csvToArray(tutorInfo?.teachingSubjects || "");
    const [classOptions, setClassOptions] = useState([]);
    useEffect(() => {
        dispatch(checkBalanceApiThunk());
    }, [dispatch]);
    useDocumentTitle("Tạo lớp học");
    const initialValues = {
        subject: "",
        educationLevel: "",
        description: "",
        location: "",
        price: 0,
        mode: "Offline",
        classStartDate: "",
        title: "",
        scheduleRules: [],
        onlineStudyLink: "",
        studentLimit: 0,
    };
    const validationSchema = Yup.object({
        subject: Yup.string().required("Vui lòng chọn môn học"),
        educationLevel: Yup.string().required("Vui lòng chọn lớp"),
        description: Yup.string().required("Vui lòng nhập mô tả"),
        title: Yup.string().required("Vui lòng nhập chủ đề"),
        onlineStudyLink: Yup.string().when("mode", {
            is: "Online",
            then: (schema) => schema.required("Vui lòng nhập đường liên kết lớp học"),
        }),
        location: Yup.string().when("mode", {
            is: "Offline",
            then: (schema) => schema.required("Vui lòng nhập địa chỉ học"),
        }),
        mode: Yup.string()
            .oneOf(["Offline", "Online"])
            .required("Vui lòng chọn hình thức học"),
        classStartDate: Yup.string().required("Vui lòng chọn ngày bắt đầu"),
        price: Yup.number().min(0, "Học phí phải >= 0"),
        scheduleRules: Yup.array()
            .of(Yup.object().shape({
            dayOfWeek: Yup.number().required(),
            startTime: Yup.string().required(),
            endTime: Yup.string().required(),
        }))
            .min(1, "Vui lòng chọn lịch đúng số buổi"),
    });
    return (_jsx("section", { id: "tutor-create-class-section", children: _jsxs("div", { className: "tccs-container", children: [_jsxs("div", { className: "tccscr1", children: [_jsx("h4", { children: "T\u1EA1o l\u1EDBp h\u1ECDc" }), _jsxs("p", { children: ["L\u1EDBp h\u1ECDc ", _jsx("span", { children: "T\u1EA1o l\u1EDBp h\u1ECDc" })] })] }), _jsx("div", { className: "tccscr2", children: _jsx("button", { className: "sc-btn", onClick: () => {
                            navigateHook(routes.tutor.class.list);
                        }, children: "Quay l\u1EA1i" }) }), _jsx("div", { className: "tccscr3", children: _jsx(Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: (values, { setSubmitting, resetForm }) => {
                            setSubmitting(true);
                            if (balance?.balance &&
                                balance.balance < createClassFee) {
                                toast.error("Số dư ví của bạn không đủ, vui lòng nạp thêm tiền.");
                                setSubmitting(false);
                                return;
                            }
                            dispatch(createClassApiThunk(values))
                                .unwrap()
                                .then(() => {
                                dispatch(transferWalletApiThunk({
                                    toUserId: "0E85EF35-39C1-418A-9A8C-0F83AC9520A6",
                                    amount: createClassFee,
                                    note: "Phí tạo lớp học",
                                }))
                                    .unwrap()
                                    .then((res) => {
                                    const message = get(res, "data.message", "Tạo thành công");
                                    toast.success(message);
                                });
                            })
                                .catch((error) => {
                                const errorData = get(error, "data.message", "Có lỗi xảy ra");
                                toast.error(errorData);
                            })
                                .finally(() => {
                                setSubmitting(false);
                                resetForm();
                            });
                        }, children: ({ values, setFieldValue, isSubmitting }) => {
                            // Load lịch dạy theo startDate
                            useEffect(() => {
                                if (tutorInfo?.tutorProfileId &&
                                    values.classStartDate) {
                                    const start = formatDateToYMD(new Date(values.classStartDate));
                                    const endDate = new Date(values.classStartDate);
                                    endDate.setDate(endDate.getDate() + 30);
                                    const end = formatDateToYMD(endDate);
                                    dispatch(getAllTutorScheduleApiThunk({
                                        tutorProfileId: String(tutorInfo?.tutorProfileId),
                                        startDate: start,
                                        endDate: end,
                                    }));
                                }
                            }, [
                                dispatch,
                                tutorInfo?.tutorProfileId,
                                values.classStartDate,
                            ]);
                            // Cập nhật classOptions theo teachingLevel
                            const handleSubjectChange = (value) => {
                                setFieldValue("subject", value);
                                setFieldValue("educationLevel", "");
                                const level = tutorInfo?.teachingLevel?.toLowerCase() ||
                                    "";
                                let options = [];
                                if (level.includes("tiểu học"))
                                    options.push(...Array.from({ length: 5 }, (_, i) => `Lớp ${i + 1}`));
                                if (level.includes("trung học cơ sở"))
                                    options.push(...Array.from({ length: 4 }, (_, i) => `Lớp ${i + 6}`));
                                if (level.includes("trung học phổ thông"))
                                    options.push(...Array.from({ length: 3 }, (_, i) => `Lớp ${i + 10}`));
                                setClassOptions(options);
                            };
                            return (_jsxs(Form, { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ch\u1EE7 \u0111\u1EC1" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdTitle, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "title", className: "form-input", placeholder: "Nh\u1EADp ch\u1EE7 \u0111\u1EC1" })] }), _jsx(ErrorMessage, { name: "title", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "M\u00F4 t\u1EA3" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdDescription, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "description", className: "form-input", placeholder: "Nh\u1EADp m\u00F4 t\u1EA3" })] }), _jsx(ErrorMessage, { name: "description", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "M\u00F4n h\u1ECDc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdMenuBook, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "subject", className: "form-input", onChange: (e) => handleSubjectChange(e.target.value), children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn m\u00F4n h\u1ECDc --" }), tutorSubjects.map((s) => (_jsx("option", { value: s, children: s }, s)))] })] }), _jsx(ErrorMessage, { name: "subject", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "L\u1EDBp" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdSchool, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "educationLevel", className: "form-input", children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn l\u1EDBp --" }), classOptions.map((cls) => (_jsx("option", { value: cls, children: cls }, cls)))] })] }), _jsx(ErrorMessage, { name: "educationLevel", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "S\u1ED1 l\u01B0\u1EE3ng h\u1ECDc sinh t\u1ED1i \u0111a" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdPersonAdd, { className: "form-input-icon" }), _jsx(Field, { type: "number", min: "1", name: "studentLimit", className: "form-input", placeholder: "Nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1ECDc sinh t\u1ED1i \u0111a" })] }), _jsx(ErrorMessage, { name: "studentLimit", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "H\u1ECDc ph\u00ED 1 th\u00E1ng" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdAttachMoney, { className: "form-input-icon" }), _jsx(Field, { type: "number", name: "price", className: "form-input", placeholder: "Nh\u1EADp gi\u00E1 h\u1ECDc ph\u00ED", onChange: (e) => {
                                                            const val = Number(e.target.value);
                                                            setFieldValue("price", val >= 0 ? val : 0);
                                                        } })] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "H\u00ECnh th\u1EE9c h\u1ECDc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineCastForEducation, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "mode", className: "form-input", children: [_jsx("option", { value: "Offline", children: "H\u1ECDc t\u1EA1i nh\u00E0" }), _jsx("option", { value: "Online", children: "H\u1ECDc tr\u1EF1c tuy\u1EBFn" })] })] }), _jsx(ErrorMessage, { name: "mode", component: "div", className: "text-error" })] }), values.mode === "Offline" && (_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "\u0110\u1ECBa ch\u1EC9" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdLocationOn, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "location", className: "form-input", placeholder: "Nh\u1EADp \u0111\u1ECBa ch\u1EC9 h\u1ECDc" })] }), _jsx(ErrorMessage, { name: "location", component: "div", className: "text-error" })] })), values.mode === "Online" && (_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "\u0110\u01B0\u1EDDng li\u00EAn k\u1EBFt l\u1EDBp h\u1ECDc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdLinkOff, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "onlineStudyLink", className: "form-input", placeholder: "Nh\u1EADp \u0111\u01B0\u1EDDng li\u00EAn k\u1EBFt l\u1EDBp h\u1ECDc" })] }), _jsx(ErrorMessage, { name: "onlineStudyLink", component: "div", className: "text-error" })] })), " ", _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ng\u00E0y b\u1EAFt \u0111\u1EA7u" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdDateRange, { className: "form-input-icon" }), _jsx(DatePickerElement, { placeholder: "Ch\u1ECDn ng\u00E0y b\u1EAFt \u0111\u1EA7u h\u1ECDc", value: values.classStartDate
                                                            ? new Date(values.classStartDate)
                                                            : null, onChange: (date) => setFieldValue("classStartDate", date?.toISOString() ||
                                                            "") })] }), _jsx("p", { className: "note", children: "Sau khi b\u1EA1n ch\u1ECDn ng\u00E0y b\u1EAFt \u0111\u1EA7u h\u1ECDc, l\u1ECBch h\u1ECDc trong tu\u1EA7n s\u1EBD hi\u1EC7n ra \u0111\u1EC3 b\u1EA1n l\u1EF1a ch\u1ECDn bu\u1ED5i h\u1ECDc ph\u00F9 h\u1EE3p." }), _jsx(ErrorMessage, { name: "classStartDate", component: "div", className: "text-error" })] }), values.classStartDate && (_jsx("div", { className: "calendar-container", children: _jsx(WeekCalendar, { busySchedules: busySchedules, onSelectedChange: (scheduleRules) => setFieldValue("scheduleRules", scheduleRules) }) })), _jsxs("div", { className: "price-container", children: [_jsx("div", { className: "price-container-col", children: _jsx("h4", { children: "Ph\u00ED \u0111\u1EB7t l\u1ECBch" }) }), _jsx("div", { className: "price-container-col", children: _jsxs("p", { children: [createClassFee.toLocaleString(), " ", "VN\u0110"] }) })] }), _jsx("div", { className: "form-submit", children: _jsx("button", { type: "submit", className: isSubmitting
                                                ? "disable-btn"
                                                : "pr-btn payment-btn", disabled: isSubmitting, children: isSubmitting ? (_jsx(LoadingSpinner, {})) : ("Tạo lớp học") }) })] }));
                        } }) })] }) }));
};
export default TutorCreateClassPage;
