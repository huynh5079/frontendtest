import { type FC, useState } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { CiCalendar, CiText, CiStickyNote, CiRepeat } from "react-icons/ci";
import Modal from "./modal";
import type { CreateAvailabilityBlockForTutorModalProps } from "../../types/modal";
import type { CreateTutorAvailabilityParams } from "../../types/tutorAvailabilityBlock";
import {
    DateTimePickerElement,
    LoadingSpinner,
    TimePickerElement,
} from "../elements";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { createAvailabilityBlockForTutorApiThunk } from "../../services/tutor/availabilityBlock/tutorAvailabilityBlockThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { getAllScheduleForTutorApiThunk } from "../../services/tutor/schedule/tutorScheduleThunk";
import { selectProfileTutor } from "../../app/selector";

// Validation schema
const CreateAvailabilitySchema = Yup.object().shape({
    title: Yup.string().required("Vui lòng nhập tiêu đề"),
    startTime: Yup.date().required("Vui lòng chọn thời gian bắt đầu"),
    endTime: Yup.date()
        .required("Vui lòng chọn thời gian kết thúc")
        .min(
            Yup.ref("startTime"),
            "Thời gian kết thúc phải sau thời gian bắt đầu",
        ),
    notes: Yup.string().required("Vui lòng nhập ghi chú"),
    recurrenceRule: Yup.object()
        .shape({
            frequency: Yup.string()
                .oneOf(["Daily", "Weekly", "Monthly", "Yearly"])
                .required("Vui lòng chọn tần suất lặp lại"),
            daysOfWeek: Yup.array().when("frequency", {
                is: "Weekly",
                then: (schema) =>
                    schema.min(1, "Vui lòng chọn ít nhất một ngày trong tuần"),
                otherwise: (schema) => schema.min(1, "Vui lòng chọn một ngày"),
            }),
            untilDate: Yup.date().required(
                "Vui lòng chọn ngày kết thúc lặp lại",
            ),
        })
        .required("Vui lòng chọn quy tắc lặp lại"),
});

const weekdays = [
    { label: "Chủ nhật", value: "Sunday" },
    { label: "Thứ 2", value: "Monday" },
    { label: "Thứ 3", value: "Tuesday" },
    { label: "Thứ 4", value: "Wednesday" },
    { label: "Thứ 5", value: "Thursday" },
    { label: "Thứ 6", value: "Friday" },
    { label: "Thứ 7", value: "Saturday" },
];

const CreateAvailabilityBlockForTutorModal: FC<
    CreateAvailabilityBlockForTutorModalProps
> = ({ isOpen, setIsOpen, startDateProps, endDateProps }) => {
    const initialValues: CreateTutorAvailabilityParams = {
        title: "",
        startTime: "",
        endTime: "",
        notes: "",
        recurrenceRule: {
            frequency: "Daily",
            daysOfWeek: [],
            untilDate: dayjs().add(1, "week").toISOString(),
        },
    };

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [untilDate, setUntilDate] = useState<Date | null>(
        dayjs().add(1, "week").toDate(),
    );
    const dispatch = useAppDispatch();
    const tutorProfile = useAppSelector(selectProfileTutor);

    const handleSubmit = async (
        values: CreateTutorAvailabilityParams,
        helpers: FormikHelpers<CreateTutorAvailabilityParams>,
    ) => {
        const formattedValues: CreateTutorAvailabilityParams = {
            ...values,
            startTime: startDate ? dayjs(startDate).format("HH:mm:ss") : "",
            endTime: endDate ? dayjs(endDate).format("HH:mm:ss") : "",
            recurrenceRule: {
                ...values.recurrenceRule!,
                // Nếu Daily thì tự lấy ngày đầu tiên đã chọn
                daysOfWeek:
                    values.recurrenceRule?.frequency === "Daily"
                        ? values.recurrenceRule?.daysOfWeek
                            ? [values.recurrenceRule.daysOfWeek[0]]
                            : []
                        : values.recurrenceRule?.daysOfWeek || [],
                untilDate: untilDate
                    ? dayjs(untilDate).format("YYYY-MM-DDTHH:mm:ss")
                    : "",
            },
        };

        helpers.setSubmitting(true);
        dispatch(createAvailabilityBlockForTutorApiThunk(formattedValues))
            .unwrap()
            .then((res) => {
                toast.success(get(res, "data.message", "Xử lí thành công"));
                setIsOpen(false);
                dispatch(
                    getAllScheduleForTutorApiThunk({
                        tutorProfileId: tutorProfile?.tutorProfileId!,
                        startDate: startDateProps,
                        endDate: endDateProps,
                    }),
                );
                helpers.resetForm();
            })
            .catch((error) => {
                toast.error(get(error, "data.message", "Có lỗi xảy ra"));
            })
            .finally(() => {
                helpers.setSubmitting(false);
            });
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="create-availability-block-for-tutor-modal-section">
                <div className="cabftm-container">
                    <h2>Tạo lịch bận</h2>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={CreateAvailabilitySchema}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue, values, isSubmitting }) => (
                            <Form className="form">
                                {/* Tiêu đề */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Tiêu đề
                                    </label>
                                    <div className="form-input-container">
                                        <CiText className="form-input-icon" />
                                        <Field
                                            name="title"
                                            placeholder="Nhập tiêu đề..."
                                            className="form-input"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="title"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Thời gian bắt đầu */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Thời gian bắt đầu
                                    </label>
                                    <div className="form-input-container">
                                        <CiCalendar className="form-input-icon" />
                                        <TimePickerElement
                                            value={startDate}
                                            onChange={(date) => {
                                                setStartDate(date);
                                                setFieldValue(
                                                    "startTime",
                                                    date,
                                                );
                                            }}
                                            placeholder="Chọn thời gian bắt đầu"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="startTime"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Thời gian kết thúc */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Thời gian kết thúc
                                    </label>
                                    <div className="form-input-container">
                                        <CiCalendar className="form-input-icon" />
                                        <TimePickerElement
                                            value={endDate}
                                            onChange={(date) => {
                                                setEndDate(date);
                                                setFieldValue("endTime", date);
                                            }}
                                            placeholder="Chọn thời gian kết thúc"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="endTime"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Quy tắc lặp lại */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Lặp lại
                                    </label>
                                    <div className="form-input-container">
                                        <CiRepeat className="form-input-icon" />
                                        <Field
                                            as="select"
                                            name="recurrenceRule.frequency"
                                            className="form-input"
                                            onChange={(e: any) => {
                                                const freq = e.target.value;
                                                setFieldValue(
                                                    "recurrenceRule",
                                                    {
                                                        frequency: freq,
                                                        daysOfWeek: [],
                                                        untilDate:
                                                            untilDate?.toISOString(),
                                                    },
                                                );
                                            }}
                                            value={
                                                values.recurrenceRule?.frequency
                                            }
                                        >
                                            <option value="">
                                                -- Chọn tần suất --
                                            </option>
                                            <option value="Daily">
                                                Hằng ngày
                                            </option>
                                            <option value="Weekly">
                                                Hằng tuần
                                            </option>
                                            <option value="Monthly">
                                                Hằng tháng
                                            </option>
                                            <option value="Yearly">
                                                Hằng năm
                                            </option>
                                        </Field>
                                    </div>
                                    <ErrorMessage
                                        name="recurrenceRule.frequency"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Ngày trong tuần */}
                                {values.recurrenceRule?.frequency && (
                                    <div className="form-field">
                                        <label className="form-label">
                                            {values.recurrenceRule.frequency ===
                                            "Weekly"
                                                ? "Chọn ngày trong tuần"
                                                : "Chọn ngày bắt đầu"}
                                        </label>
                                        <div className="days-checkbox-group">
                                            {weekdays.map((day) => {
                                                const checked =
                                                    values.recurrenceRule?.daysOfWeek?.includes(
                                                        day.value,
                                                    );
                                                return (
                                                    <label
                                                        key={day.value}
                                                        className="checkbox-item"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={(e) => {
                                                                const prev =
                                                                    values
                                                                        .recurrenceRule
                                                                        ?.daysOfWeek ||
                                                                    [];
                                                                let updated: string[] =
                                                                    [];

                                                                if (
                                                                    values
                                                                        .recurrenceRule
                                                                        ?.frequency ===
                                                                    "Daily"
                                                                ) {
                                                                    updated = e
                                                                        .target
                                                                        .checked
                                                                        ? [
                                                                              day.value,
                                                                          ]
                                                                        : [];
                                                                } else {
                                                                    updated = e
                                                                        .target
                                                                        .checked
                                                                        ? Array.from(
                                                                              new Set(
                                                                                  [
                                                                                      ...prev,
                                                                                      day.value,
                                                                                  ],
                                                                              ),
                                                                          )
                                                                        : prev.filter(
                                                                              (
                                                                                  d,
                                                                              ) =>
                                                                                  d !==
                                                                                  day.value,
                                                                          );
                                                                }

                                                                setFieldValue(
                                                                    "recurrenceRule.daysOfWeek",
                                                                    updated,
                                                                );
                                                            }}
                                                        />
                                                        {day.label}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        <ErrorMessage
                                            name="recurrenceRule.daysOfWeek"
                                            component="div"
                                            className="text-error"
                                        />
                                    </div>
                                )}

                                {/* Ngày kết thúc lặp */}
                                {values.recurrenceRule && (
                                    <div className="form-field">
                                        <label className="form-label">
                                            Ngày kết thúc lặp lại
                                        </label>
                                        <div className="form-input-container">
                                            <CiCalendar className="form-input-icon" />
                                            <DateTimePickerElement
                                                value={untilDate}
                                                onChange={(date) => {
                                                    setUntilDate(date);
                                                    setFieldValue(
                                                        "recurrenceRule.untilDate",
                                                        date,
                                                    );
                                                }}
                                                placeholder="Chọn ngày kết thúc lặp lại"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="recurrenceRule.untilDate"
                                            component="div"
                                            className="text-error"
                                        />
                                    </div>
                                )}

                                {/* Ghi chú */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Ghi chú
                                    </label>
                                    <div className="form-input-container">
                                        <CiStickyNote className="form-input-icon" />
                                        <Field
                                            as="textarea"
                                            name="notes"
                                            placeholder="Nhập ghi chú..."
                                            className="form-input"
                                            rows={3}
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="notes"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Nút hành động */}
                                <div className="group-btn">
                                    <button
                                        type="button"
                                        className="sc-btn"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className={
                                            isSubmitting
                                                ? "disable-btn"
                                                : "pr-btn"
                                        }
                                    >
                                        {isSubmitting ? (
                                            <LoadingSpinner />
                                        ) : (
                                            "Tạo lịch"
                                        )}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </Modal>
    );
};

export default CreateAvailabilityBlockForTutorModal;
