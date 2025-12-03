import { useState, type FC, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { UpdateRequestFindTutorForStudentModalProps } from "../../types/modal";
import Modal from "./modal";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import type {
    Schedule,
    UpdateInfoClassRequestParams,
} from "../../types/student";
import { useAppDispatch } from "../../app/store";
import {
    getDetailClassRequestForStudentApiThunk,
    updateInfoClassRequestForStudentApiThunk,
    updateScheduleClassRequestForStudentApiThunk,
} from "../../services/student/bookingTutor/bookingTutorThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import {
    LoadingSpinner,
    WeekCalendarUpdateRequestFindTutor,
} from "../elements";

const UpdateRequestFindTutorForStudentModal: FC<
    UpdateRequestFindTutorForStudentModalProps
> = ({ isOpen, setIsOpen, selectedBooking }) => {
    const dispatch = useAppDispatch();

    const [selectedSchedule, setSelectedSchedule] = useState<Schedule[]>([]);

    useEffect(() => {
        if (selectedBooking) {
            setSelectedSchedule(selectedBooking.schedules || []);
        }
    }, [selectedBooking]);

    const initialValues: UpdateInfoClassRequestParams = {
        description: selectedBooking?.description || "",
        budget: selectedBooking?.budget || 0,
        location: selectedBooking?.location || "",
        mode: selectedBooking?.mode || "Offline",
        onlineStudyLink: selectedBooking?.onlineStudyLink || null,
    };

    const validationSchema = Yup.object().shape({
        description: Yup.string().required("Vui lòng nhập mô tả"),
        mode: Yup.string()
            .oneOf(["Online", "Offline"])
            .required("Chọn hình thức học"),
        location: Yup.string().when("mode", {
            is: "Offline",
            then: (schema) => schema.required("Vui lòng nhập địa chỉ học"),
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
                                updateInfoClassRequestForStudentApiThunk({
                                    classRequestId: String(selectedBooking?.id),
                                    params: values,
                                })
                            ),
                            dispatch(
                                updateScheduleClassRequestForStudentApiThunk({
                                    classRequestId: String(selectedBooking?.id),
                                    params: selectedSchedule,
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
                                dispatch(
                                    getDetailClassRequestForStudentApiThunk(
                                        selectedBooking?.id!
                                    )
                                );
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
                                    getDetailClassRequestForStudentApiThunk(
                                        selectedBooking?.id || ""
                                    )
                                ).unwrap();
                            });
                    }}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form>
                            <div className="form">
                                {/* Mô tả */}
                                <div className="form-field">
                                    <label className="form-label">Mô tả</label>
                                    <div className="form-input-container">
                                        <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                        <Field
                                            name="description"
                                            type="text"
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

                                {/* Hình thức học */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Hình thức học
                                    </label>
                                    <div className="form-input-container">
                                        <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                        <Field
                                            as="select"
                                            name="mode"
                                            className="form-input"
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                setFieldValue(
                                                    "mode",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                -- Chọn hình thức học --
                                            </option>
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

                                {/* Học phí hiển thị */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Học phí 1 tháng
                                    </label>
                                    <div className="form-input-container">
                                        <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                        <Field name="budget">
                                            {({ field }: any) => (
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    {...field}
                                                    value={field.value.toLocaleString()} // hiển thị định dạng
                                                    onChange={(e) => {
                                                        // chuyển string có dấu phẩy về number
                                                        const val = Number(
                                                            e.target.value.replace(
                                                                /,/g,
                                                                ""
                                                            )
                                                        );
                                                        field.onChange({
                                                            target: {
                                                                name: field.name,
                                                                value: val,
                                                            },
                                                        });
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </div>
                                </div>

                                {/* Địa chỉ nếu Offline */}
                                {values.mode === "Offline" && (
                                    <div className="form-field">
                                        <label className="form-label">
                                            Địa chỉ
                                        </label>
                                        <div className="form-input-container">
                                            <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                            <Field
                                                name="location"
                                                type="text"
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
                            </div>

                            <div className="schedule-container">
                                <WeekCalendarUpdateRequestFindTutor
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

export default UpdateRequestFindTutorForStudentModal;
