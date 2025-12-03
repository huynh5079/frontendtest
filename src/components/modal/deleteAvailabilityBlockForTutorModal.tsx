import { type FC, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CiCalendar, CiText, CiStickyNote } from "react-icons/ci";
import Modal from "./modal";
import type { DeleteAvailabilityBlockForTutorModalProps } from "../../types/modal";
import type { CreateTutorAvailabilityParams } from "../../types/tutorAvailabilityBlock";
import { DateTimePickerElement } from "../elements";
import { useAppDispatch } from "../../app/store";
import {
    deleteAvailabilityBlockForTutorApiThunk,
    getAllAvailabilityBlockForTutorApiThunk,
} from "../../services/tutor/availabilityBlock/tutorAvailabilityBlockThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { useEffect } from "react";
import dayjs from "dayjs";

const CreateAvailabilitySchema = Yup.object().shape({
    title: Yup.string().required("Vui lòng nhập tiêu đề"),
    startTime: Yup.date().required("Vui lòng chọn thời gian bắt đầu"),
    endTime: Yup.date()
        .required("Vui lòng chọn thời gian kết thúc")
        .min(
            Yup.ref("startTime"),
            "Thời gian kết thúc phải sau thời gian bắt đầu",
        ),
    notes: Yup.string().optional(),
});

const DeleteAvailabilityBlockForTutorModal: FC<
    DeleteAvailabilityBlockForTutorModalProps
> = ({
    isOpen,
    setIsOpen,
    startDateProps,
    endDateProps,
    selectedAvailabilityBlock,
}) => {
    const initialValues: CreateTutorAvailabilityParams = {
        title: "",
        startTime: selectedAvailabilityBlock?.startTime || "",
        endTime: selectedAvailabilityBlock?.endTime || "",
        notes: "",
        recurrenceRule: null,
    };

    useEffect(() => {
        if (selectedAvailabilityBlock) {
            if (selectedAvailabilityBlock.startTime) {
                setStartDate(
                    dayjs(selectedAvailabilityBlock.startTime).toDate(),
                );
            }
            if (selectedAvailabilityBlock.endTime) {
                setEndDate(dayjs(selectedAvailabilityBlock.endTime).toDate());
            }
        }
    }, [selectedAvailabilityBlock]);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const dispatch = useAppDispatch();

    const handleSubmit = async (values: CreateTutorAvailabilityParams) => {
        console.log(values);
    };

    const handleDelete = async () => {
        await dispatch(
            deleteAvailabilityBlockForTutorApiThunk(
                selectedAvailabilityBlock?.id.toLowerCase()!,
            ),
        )
            .unwrap()
            .then((res) => {
                const message = get(res, "message", "Xử lí thành công");
                toast.success(message);
                setIsOpen(false);
                dispatch(
                    getAllAvailabilityBlockForTutorApiThunk({
                        startTime: startDateProps,
                        endTime: endDateProps,
                    }),
                );
            })
            .catch((error) => {
                const errorData = get(error, "message", "Có lỗi xảy ra");
                toast.error(errorData);
            });
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="delete-availability-block-for-tutor-modal-section">
                <div className="dabftm-container">
                    <h2>Tạo lịch bận</h2>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={CreateAvailabilitySchema}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue, isSubmitting }) => (
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
                                        <DateTimePickerElement
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
                                        <DateTimePickerElement
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

                                {/* Ghi chú */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Ghi chú (tuỳ chọn)
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
                                </div>

                                {/* Nút hành động */}
                                <div className="group-btn">
                                    <div
                                        className="sc-btn"
                                        onClick={handleDelete}
                                    >
                                        Xoá
                                    </div>
                                    <button type="submit" className="pr-btn">
                                        {isSubmitting
                                            ? "Đang cập nhật"
                                            : "Cập nhật"}
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

export default DeleteAvailabilityBlockForTutorModal;
