import { FC, useState } from "react";
import { CreateRescheduleModalProps } from "../../types/modal";
import { CreateRescheduleParams } from "../../types/reschedule";
import * as Yup from "yup";
import { differenceInHours } from "date-fns";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import Modal from "./modal";
import {
    MdNotes,
    MdPlayCircleOutline,
    MdStopCircle,
    MdTimer,
} from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../app/store";
import {
    createRescheduleForStudentApiThunk,
    createRescheduleForTutorApiThunk,
} from "../../services/reschedule/rescheduleThunk";
import { selectUserLogin } from "../../app/selector";
import { USER_STUDENT, USER_TUTOR } from "../../utils/helper";
import { toast } from "react-toastify";
import { get } from "lodash";
import { getDetailScheduleLessonForStudentApiThunk } from "../../services/student/learningSchedule/learningScheduleThunk";
import { getDetailScheduleLessonForTutorApiThunk } from "../../services/tutor/schedule/tutorScheduleThunk";
import { LoadingSpinner } from "../elements";

const CreateRescheduleModal: FC<CreateRescheduleModalProps> = ({
    lessonId,
    isOpen,
    setIsOpen,
}) => {
    const dispatch = useAppDispatch();
    const userLogin = useAppSelector(selectUserLogin);

    const [showWarning, setShowWarning] = useState(false);

    const initialValues: CreateRescheduleParams = {
        newStartTime: "",
        newEndTime: "",
        reason: "",
    };

    const handleSubmit = (
        values: CreateRescheduleParams,
        helpers: FormikHelpers<CreateRescheduleParams>
    ) => {
        helpers.setSubmitting(true);
        if (userLogin?.role === USER_STUDENT) {
            dispatch(
                createRescheduleForStudentApiThunk({
                    lessonId: lessonId!,
                    params: values,
                })
            )
                .unwrap()
                .then((res) => {
                    const message = get(
                        res,
                        "message",
                        "Gửi yêu cầu thành công"
                    );
                    toast.success(message);
                    setIsOpen(false);
                    dispatch(
                        getDetailScheduleLessonForStudentApiThunk(lessonId!)
                    );
                })
                .catch((error) => {
                    const errorData = get(
                        error,
                        "data.Message",
                        "Có lỗi xảy ra"
                    );
                    setShowWarning(errorData);
                })
                .finally(() => {
                    helpers.setSubmitting(false);
                });
        } else if (userLogin?.role === USER_TUTOR) {
            dispatch(
                createRescheduleForTutorApiThunk({
                    lessonId: lessonId!,
                    params: values,
                })
            )
                .unwrap()
                .then((res) => {
                    const message = get(
                        res,
                        "message",
                        "Gửi yêu cầu thành công"
                    );
                    toast.success(message);
                    setIsOpen(false);
                    dispatch(
                        getDetailScheduleLessonForTutorApiThunk(lessonId!)
                    );
                })
                .catch((error) => {
                    const errorData = get(
                        error,
                        "data.Message",
                        "Có lỗi xảy ra"
                    );
                    setShowWarning(errorData);
                })
                .finally(() => {
                    helpers.setSubmitting(false);
                });
        }
    };

    const createRescheduleSchema = Yup.object().shape({
        newStartTime: Yup.string().required(
            "Vui lòng chọn thời gian bắt đầu mới"
        ),

        newEndTime: Yup.string()
            .required("Vui lòng chọn thời gian kết thúc mới")
            .test(
                "endTime-after-startTime",
                "Thời gian kết thúc phải lớn hơn thời gian bắt đầu ít nhất 1 giờ",
                function (value) {
                    const { newStartTime } = this.parent;

                    if (!newStartTime || !value) return true; // tránh lỗi khi chưa nhập đủ

                    const start = new Date(newStartTime);
                    const end = new Date(value);

                    // end phải >= start + 1h
                    return differenceInHours(end, start) >= 1;
                }
            ),

        reason: Yup.string()
            .required("Vui lòng nhập lý do dời lịch")
            .min(10, "Lý do phải có ít nhất 10 ký tự"),
    });

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Yêu cầu dời lịch">
            <div className="create-reschedule-modal">
                <Formik
                    initialValues={initialValues}
                    validationSchema={createRescheduleSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="form">
                            <div className="form-field">
                                <label className="form-label">
                                    Thời gian bắt đầu mới
                                </label>
                                <div className="form-input-container">
                                    <MdPlayCircleOutline className="form-input-icon" />
                                    <Field
                                        className="form-input"
                                        type="datetime-local"
                                        name="newStartTime"
                                    />
                                </div>
                                <ErrorMessage
                                    name="newStartTime"
                                    component="p"
                                    className="text-error"
                                />
                            </div>

                            <div className="form-field">
                                <label className="form-label">
                                    Thời gian kết thúc mới
                                </label>
                                <div className="form-input-container">
                                    <MdStopCircle className="form-input-icon" />
                                    <Field
                                        className="form-input"
                                        type="datetime-local"
                                        name="newEndTime"
                                    />
                                </div>
                                <ErrorMessage
                                    name="newEndTime"
                                    component="p"
                                    className="text-error"
                                />
                            </div>

                            <div className="form-field">
                                <label className="form-label">Lý do</label>
                                <div className="form-input-container">
                                    <MdNotes className="form-input-icon" />
                                    <Field
                                        className="form-input"
                                        as="textarea"
                                        name="reason"
                                        rows={3}
                                    />
                                </div>
                                <ErrorMessage
                                    name="reason"
                                    component="p"
                                    className="text-error"
                                />
                            </div>

                            <button
                                type="submit"
                                className={
                                    isSubmitting ? "disable-btn" : "pr-btn"
                                }
                            >
                                {isSubmitting ? (
                                    <LoadingSpinner />
                                ) : (
                                    "Xác nhận yêu cầu"
                                )}
                            </button>

                            {showWarning && (
                                <p className="warning-msg">{showWarning}</p>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
};

export default CreateRescheduleModal;
