import { useState, type FC, useEffect } from "react";
import type { updateClassModalProps } from "../../types/modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "./modal";
import {
    MdAttachMoney,
    MdDescription,
    MdLinkOff,
    MdLocationOn,
    MdOutlineCastForEducation,
    MdPersonAdd,
    MdTitle,
} from "react-icons/md";
import type { Schedule } from "../../types/student";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner, WeekCalendarUpdate } from "../elements";
import {
    convertScheduleStringToSchedule,
    formatDateToYMD,
    groupSchedulesByWeek,
} from "../../utils/helper";
import { getAllTutorScheduleApiThunk } from "../../services/booking/bookingThunk";
import { selectListTutorSchedule } from "../../app/selector";
import type { UpdateInfoClassForTutorParams } from "../../types/tutor";
import {
    getDetailClassApiThunk,
    updateInfoClassForTutorApiThunk,
    updateScheduleClassForTutorApiThunk,
} from "../../services/tutor/class/classThunk";

const UpdateClassModal: FC<updateClassModalProps> = ({
    selectedClass,
    isOpen,
    setIsOpen,
}) => {
    const dispatch = useAppDispatch();

    const [selectedSchedule, setSelectedSchedule] = useState<Schedule[]>([]);
    const tutorSchedules = useAppSelector(selectListTutorSchedule);
    const scheduleRulesNumber = convertScheduleStringToSchedule(
        selectedClass?.scheduleRules || []
    );

    const busySchedules = groupSchedulesByWeek(
        Array.isArray(tutorSchedules) ? tutorSchedules : []
    );

    useEffect(() => {
        if (selectedClass) {
            setSelectedSchedule(scheduleRulesNumber || []);
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedClass?.tutorProfileId && selectedClass.classStartDate) {
            const start = formatDateToYMD(
                new Date(selectedClass.classStartDate)
            );
            const endDate = new Date(selectedClass.classStartDate);
            endDate.setDate(endDate.getDate() + 30);
            const end = formatDateToYMD(endDate);

            dispatch(
                getAllTutorScheduleApiThunk({
                    tutorProfileId: String(selectedClass?.tutorProfileId),
                    startDate: start,
                    endDate: end,
                })
            );
        }
    }, [dispatch, selectedClass]);

    const initialValues: UpdateInfoClassForTutorParams = {
        title: selectedClass?.title || "",
        description: selectedClass?.description || "",
        price: selectedClass?.price || 0,
        location: selectedClass?.location || "",
        mode: selectedClass?.mode || "Offline",
        studentLimit: selectedClass?.studentLimit || 0,
        onlineStudyLink: selectedClass?.onlineStudyLink || null,
    };

    const validationSchema = Yup.object().shape({
        description: Yup.string().required("Vui lòng nhập mô tả"),
        title: Yup.string().required("Vui lòng nhập tố mô tả"),
        price: Yup.number().required("Vui lòng nhập giá học"),
        studentLimit: Yup.number().required(
            "Vui lòng nhập số lượng học sinh tối đa"
        ),
        mode: Yup.string()
            .oneOf(["Online", "Offline"])
            .required("Chọn hình thức học"),
        location: Yup.string().when("mode", {
            is: "Offline",
            then: (schema) => schema.required("Vui lòng nhập địa chỉ học"),
            otherwise: (schema) => schema.notRequired(),
        }),
        onlineStudyLink: Yup.string().when("mode", {
            is: "Online",
            then: (schema) =>
                schema.required("Vui lòng nhập đường liên kết lớp học"),
            otherwise: (schema) => schema.notRequired(),
        }),
    });

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="update-booking-tutor-for-student-modal">
                <h3>Cập nhật lịch đặt gia sư </h3>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        Promise.all([
                            dispatch(
                                updateInfoClassForTutorApiThunk({
                                    classId: String(selectedClass?.id),
                                    params: values,
                                })
                            ),
                            dispatch(
                                updateScheduleClassForTutorApiThunk({
                                    classId: String(selectedClass?.id),
                                    params: {
                                        scheduleRules: selectedSchedule,
                                    },
                                })
                            ),
                        ])
                            .then((res) => {
                                const message = get(
                                    res,
                                    "data.message",
                                    "Cập nhật thành công"
                                );
                                toast.success(message);
                            })
                            .catch((error) => {
                                const errorData = get(
                                    error,
                                    "data.message",
                                    "Có lỗi xảy ra"
                                );
                                toast.error(errorData);
                            })
                            .finally(() => {
                                setIsOpen(false);
                                dispatch(
                                    getDetailClassApiThunk(
                                        selectedClass?.id || ""
                                    )
                                ).unwrap();
                            });
                    }}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form>
                            <div className="form">
                                {/* Chủ đề */}
                                <div className="form-field">
                                    <label className="form-label">Chủ đề</label>
                                    <div className="form-input-container">
                                        <MdTitle className="form-input-icon" />
                                        <Field
                                            type="text"
                                            name="title"
                                            className="form-input"
                                            placeholder="Nhập chủ đề"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="title"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>
                                {/* Mô tả */}
                                <div className="form-field">
                                    <label className="form-label">Mô tả</label>
                                    <div className="form-input-container">
                                        <MdDescription className="form-input-icon" />
                                        <Field
                                            type="text"
                                            name="description"
                                            className="form-input"
                                            placeholder="Nhập mô tả"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">
                                        Số lượng học sinh tối đa
                                    </label>
                                    <div className="form-input-container">
                                        <MdPersonAdd className="form-input-icon" />
                                        <Field
                                            type="number"
                                            min="1"
                                            name="studentLimit"
                                            className="form-input"
                                            placeholder="Nhập số lượng học sinh tối đa"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="studentLimit"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">
                                        Học phí 1 tháng
                                    </label>
                                    <div className="form-input-container">
                                        <MdAttachMoney className="form-input-icon" />
                                        <Field
                                            type="number"
                                            name="price"
                                            className="form-input"
                                            placeholder="Nhập giá học phí"
                                            onChange={(e: any) => {
                                                const val = Number(
                                                    e.target.value
                                                );
                                                setFieldValue(
                                                    "price",
                                                    val >= 0 ? val : 0
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                {/* Hình thức học */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Hình thức học
                                    </label>
                                    <div className="form-input-container">
                                        <MdOutlineCastForEducation className="form-input-icon" />
                                        <Field
                                            as="select"
                                            name="mode"
                                            className="form-input"
                                        >
                                            <option value="Offline">
                                                Học tại nhà
                                            </option>
                                            <option value="Online">
                                                Học trực tuyến
                                            </option>
                                        </Field>
                                    </div>
                                    <ErrorMessage
                                        name="mode"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>
                                {/* Địa chỉ nếu Offline */}
                                {values.mode === "Offline" && (
                                    <div className="form-field">
                                        <label className="form-label">
                                            Địa chỉ
                                        </label>
                                        <div className="form-input-container">
                                            <MdLocationOn className="form-input-icon" />
                                            <Field
                                                type="text"
                                                name="location"
                                                className="form-input"
                                                placeholder="Nhập địa chỉ học"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="location"
                                            component="div"
                                            className="text-error"
                                        />
                                    </div>
                                )}
                                {/* Đường liên kết lớp học nếu Online */}
                                {values.mode === "Online" && (
                                    <div className="form-field">
                                        <label className="form-label">
                                            Đường liên kết lớp học
                                        </label>
                                        <div className="form-input-container">
                                            <MdLinkOff className="form-input-icon" />
                                            <Field
                                                type="text"
                                                name="onlineStudyLink"
                                                className="form-input"
                                                placeholder="Nhập đường liên kết lớp học"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="onlineStudyLink"
                                            component="div"
                                            className="text-error"
                                        />
                                    </div>
                                )}{" "}
                            </div>

                            <div className="schedule-container">
                                <WeekCalendarUpdate
                                    busySchedules={busySchedules}
                                    onSelectedChange={setSelectedSchedule}
                                    initialEvents={selectedSchedule}
                                />
                            </div>

                            <div className="group-btn">
                                <button
                                    type="submit"
                                    className={
                                        isSubmitting ? "disable-btn" : "pr-btn"
                                    }
                                >
                                    {isSubmitting ? (
                                        <LoadingSpinner />
                                    ) : (
                                        "Cập nhật"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="sc-btn"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Huỷ
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </section>
        </Modal>
    );
};

export default UpdateClassModal;
