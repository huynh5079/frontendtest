import { useState, type ChangeEvent, type FC } from "react";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import type { CreateClassParams, Schedule } from "../../../../types/tutor";
import { createClassApiThunk } from "../../../../services/tutor/class/classThunk";
import { useAppDispatch } from "../../../../app/store";
import { get } from "lodash";
import { toast } from "react-toastify";
import { navigateHook } from "../../../../routes/routeApp";
import { routes } from "../../../../routes/routeName";
import {
    DatePickerElement,
    LoadingSpinner,
    WeekCalendarCreateClass,
} from "../../../elements";

// Interface giữ nguyên
type WeeklySchedule = Record<
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday",
    { start: string; end: string }[]
>;

interface CreateClassOnlineProps {
    infoTutor: any;
    startDateStudy: Date | null;
    setStartDateStudy: (date: Date | null) => void;
    busySchedules: WeeklySchedule;
}

// Validation schema
const ClassOfflineSchema = Yup.object().shape({
    price: Yup.number()
        .typeError("Học phí phải là số")
        .min(200000, "Tối thiểu 200.000 VND")
        .required("Vui lòng nhập học phí"),
    classStartDate: Yup.date().required("Vui lòng chọn ngày bắt đầu học"),
});

const CreateClassOnline: FC<CreateClassOnlineProps> = ({
    infoTutor,
    startDateStudy,
    setStartDateStudy,
    busySchedules,
}) => {
    const dispatch = useAppDispatch();

    const [selectedSchedules, setSelectedSchedules] = useState<Schedule[]>([]);
    const [sessionsPerWeek, setSessionsPerWeek] = useState<number | "">("");

    // Số buổi học — người dùng tự nhập
    const handleSessionsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numberValue = parseInt(value, 10);

        setSessionsPerWeek(value === "" ? "" : numberValue);
    };

    // Formik initial values
    const initialValues: CreateClassParams = {
        subject: infoTutor?.subject || "",
        educationLevel: infoTutor?.educationLevel || "",
        description: infoTutor?.description || "",
        location: "",
        price: 0, // 🔹 Người dùng tự nhập
        mode: "Offline",
        classStartDate: "",
        onlineStudyLink: "",
        title: infoTutor?.title || "",
        scheduleRules: [],
        studentLimit: infoTutor?.studentLimit || 0,
    };

    // Submit
    const handleSubmit = async (
        values: CreateClassParams,
        helpers: FormikHelpers<CreateClassParams>
    ) => {
        const payload: CreateClassParams = {
            ...values,
            classStartDate: startDateStudy
                ? startDateStudy.toISOString()
                : new Date().toISOString(),
            price: values.price, // 🔹 lấy đúng giá do người dùng nhập
            scheduleRules: selectedSchedules,
        };

        await dispatch(createClassApiThunk(payload))
            .unwrap()
            .then((res: any) => {
                const message = get(res, "data.message", "Tạo thành công");
                toast.success(message);
            })
            .catch((error: any) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                helpers.setSubmitting(false);
                navigateHook(routes.tutor.class.list);
            });
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={ClassOfflineSchema}
            enableReinitialize
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, isSubmitting }) => {
                const isSlotValid =
                    sessionsPerWeek !== "" &&
                    selectedSchedules.length === sessionsPerWeek;

                return (
                    <Form>
                        <div className="form form-2">
                            {/* Số buổi trong 1 tuần */}
                            <div className="form-field">
                                <label className="form-label">
                                    Số buổi trong một tuần
                                </label>
                                <div className="form-input-container">
                                    <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Nhập số buổi trong một tuần"
                                        min={1}
                                        max={7}
                                        value={sessionsPerWeek}
                                        onChange={handleSessionsChange}
                                    />
                                </div>
                            </div>

                            {/* Học phí */}
                            <div className="form-field">
                                <label className="form-label">
                                    Học phí 1 tháng
                                </label>
                                <div className="form-input-container">
                                    <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                    <Field
                                        name="price"
                                        type="number"
                                        className="form-input"
                                        placeholder="Nhập học phí 1 tháng"
                                        min={0}
                                    />
                                </div>
                                <ErrorMessage
                                    name="price"
                                    component="div"
                                    className="text-error"
                                />
                            </div>

                            {/* Link học trực tuyến */}
                            <div className="form-field">
                                <label className="form-label">
                                    Link học trực tuyến
                                </label>
                                <div className="form-input-container">
                                    <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                    <Field
                                        name="onlineStudyLink"
                                        type="text"
                                        className="form-input"
                                        placeholder="Nhập Link học trực tuyến học"
                                    />
                                </div>
                                <ErrorMessage
                                    name="onlineStudyLink"
                                    component="div"
                                    className="text-error"
                                />
                            </div>

                            {/* Ngày bắt đầu */}
                            <div className="form-field">
                                <label className="form-label">
                                    Ngày mong muốn bắt đầu học
                                </label>
                                <div className="form-input-container">
                                    <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                    <DatePickerElement
                                        placeholder="Chọn ngày bắt đầu học"
                                        value={startDateStudy}
                                        onChange={(date: any) => {
                                            setStartDateStudy(date);
                                            setFieldValue(
                                                "classStartDate",
                                                date
                                            );
                                        }}
                                    />
                                </div>
                                <ErrorMessage
                                    name="classStartDate"
                                    component="div"
                                    className="text-error"
                                />
                            </div>
                        </div>

                        {/* Lịch tuần */}
                        <WeekCalendarCreateClass
                            busySchedules={busySchedules}
                            onSelectedChange={setSelectedSchedules}
                            sessionsPerWeek={sessionsPerWeek}
                        />

                        {sessionsPerWeek !== "" && !isSlotValid && (
                            <div className="text-error">
                                ⚠ Vui lòng chọn đúng {sessionsPerWeek} buổi
                                trong tuần
                            </div>
                        )}

                        <div className="form-submit">
                            <button
                                type="submit"
                                className={
                                    isSubmitting
                                        ? "disable-btn"
                                        : "pr-btn payment-btn"
                                }
                                disabled={!isSlotValid}
                            >
                                {isSubmitting ? <LoadingSpinner /> : "Đặt lịch"}
                            </button>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default CreateClassOnline;
