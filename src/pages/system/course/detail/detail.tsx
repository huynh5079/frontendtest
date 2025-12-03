import { useEffect, useState, type FC } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { FaBookOpen, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import {
    MdAttachMoney,
    MdDateRange,
    MdEditNote,
    MdFeedback,
} from "react-icons/md";
import { FeedbackTutor, LoadingSpinner } from "../../../../components/elements";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import {
    selectBalance,
    selectDetailPublicClass,
    selectIsAuthenticated,
    selectIsEnrolledClassForStudent,
    selectUserLogin,
} from "../../../../app/selector";
import { publicGetDetailClassApiThunk } from "../../../../services/public/class/classthunk";
import { publicGetDetailTutorApiThunk } from "../../../../services/public/tutor/tutorThunk";
import { useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, add } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { vi } from "date-fns/locale"; // <-- import locale Việt Nam
import {
    formatDate,
    useDocumentTitle,
    USER_PARENT,
    USER_STUDENT,
} from "../../../../utils/helper";
import { Modal, RemindLoginModal } from "../../../../components/modal";
import {
    assignClassForStudentApiThunk,
    checkAssignClassForStudentApiThunk,
    withdrawClassForStudentApiThunk,
} from "../../../../services/student/class/classThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import type { CreateFeedbackInClass } from "../../../../types/feedback";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createFeedbackInClassApiThunk } from "../../../../services/feedback/feedbackThunk";
import type { WalletBalance } from "../../../../types/wallet";
import {
    checkBalanceApiThunk,
    transferWalletApiThunk,
} from "../../../../services/wallet/walletThunk";

const locales = { "vi-VN": vi };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

const dayMap: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};

const DetailCoursePage: FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const classDetail = useAppSelector(selectDetailPublicClass);
    // const tutorDetail = useAppSelector(selectPublicTutor);
    const isAuthendicated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUserLogin);
    const isEnrolledForStduent = useAppSelector(
        selectIsEnrolledClassForStudent,
    );
    const balance: WalletBalance | null = useAppSelector(selectBalance);

    const today = new Date();

    const [isRemidLoginOpen, setIsRemidLoginOpen] = useState(false);
    const [isStudentAssignClassOpen, setIsStudentAssignClassOpen] =
        useState(false);
    const [isStudentWithdrawClassOpen, setIsStudentWithdrawClassOpen] =
        useState(false);
    const [isStudentAssignClassSubmitting, setIsStudentAssignClassSubmitting] =
        useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const currentTab = searchParams.get("tab") || "mota"; // default là mô tả

    const handleChangeTab = (tab: string) => {
        navigate(`?tab=${tab}`);
    };

    useDocumentTitle(`Lớp học ${classDetail?.title}`);

    useEffect(() => {
        dispatch(publicGetDetailClassApiThunk(id!));
    }, [id]);

    useEffect(() => {
        if (classDetail) {
            dispatch(
                publicGetDetailTutorApiThunk(
                    classDetail?.tutorId.toLowerCase(),
                ),
            );
        }
    }, [dispatch, classDetail]);

    useEffect(() => {
        if (classDetail && isAuthendicated === true) {
            dispatch(checkAssignClassForStudentApiThunk(id!));
        }
    }, [isAuthendicated, classDetail]);

    useEffect(() => {
        if (isAuthendicated === true) {
            dispatch(checkBalanceApiThunk());
        }
    }, [isAuthendicated]);

    const events = useMemo(() => {
        if (!classDetail?.scheduleRules?.length) return [];

        // Tạo tuần mẫu: Monday -> Sunday
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

        return classDetail.scheduleRules
            .map((rule) => {
                const targetDow = dayMap[rule.dayOfWeek]; // 0–6 (Sun–Sat)
                if (targetDow === undefined) return null;

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

    const daysOfWeekVN: { [key: string]: string } = {
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
        } else if (isAuthendicated && user?.role === USER_STUDENT) {
            setIsStudentAssignClassOpen(true);
        } else if (isAuthendicated && user?.role === USER_PARENT) {
        }
    };

    const handelStudentAssignClass = async () => {
        setIsStudentAssignClassSubmitting(true);

        if (classDetail?.mode === "Online") {
            if (balance?.balance && balance.balance < classDetail?.price!) {
                toast.error(
                    "Số dư ví của bạn không đủ, vui lòng nạp thêm tiền.",
                );
                setIsStudentAssignClassSubmitting(false);
                return;
            }
        }

        dispatch(
            assignClassForStudentApiThunk({
                classId: id!,
            }),
        )
            .unwrap()
            .then((res) => {
                const message = get(res, "data.message", "Đăng ký thành công");
                toast.success(message);
                if (classDetail?.mode === "Online")
                    dispatch(
                        transferWalletApiThunk({
                            toUserId: "0E85EF35-39C1-418A-9A8C-0F83AC9520A6",
                            amount: classDetail?.price,
                            note: "Phí đặt lịch gia sư",
                        }),
                    );
            })
            .catch((error) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                setIsStudentAssignClassOpen(false);
                dispatch(publicGetDetailClassApiThunk(id!));
                setIsStudentAssignClassSubmitting(false);
                dispatch(checkAssignClassForStudentApiThunk(id!));
            });
    };

    const initialValues: CreateFeedbackInClass = {
        classId: id!,
        toUserId: classDetail?.tutorId!,
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

    const StarRating = ({ value, onChange }: any) => {
        const stars = [1, 2, 3, 4, 5];

        return (
            <div className="rating-stars">
                {stars.map((star) => (
                    <span
                        key={star}
                        onClick={() => onChange(star)}
                        style={{
                            cursor: "pointer",
                            color: star <= value ? "#FFD700" : "#ccc",
                            fontSize: "40px",
                            marginRight: "8px",
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const handelStudentWithdrawClass = async () => {
        setIsStudentAssignClassSubmitting(true);
        dispatch(withdrawClassForStudentApiThunk(id!))
            .unwrap()
            .then((res) => {
                const message = get(
                    res,
                    "data.message",
                    "Rút đăng ký thành công",
                );
                toast.success(message);
            })
            .catch((error) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                setIsStudentWithdrawClassOpen(false);
                dispatch(publicGetDetailClassApiThunk(id!));
                setIsStudentAssignClassSubmitting(false);
                dispatch(checkAssignClassForStudentApiThunk(id!));
            });
    };

    const checkDisabledButton = () => {
        const isFull =
            classDetail?.currentStudentCount === classDetail?.studentLimit;

        // === NEW: Đóng đăng ký trước 1 ngày ===
        const classStart = new Date(classDetail?.classStartDate as string);
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

    return (
        <section id="detail-course-section">
            <div className="dcs-container">
                <div className="dcscc1">
                    <h3>{classDetail?.title}</h3>
                    <div className="tabs">
                        <div
                            className={`tabs-item ${
                                currentTab === "mota" ? "tabs-item-actived" : ""
                            }`}
                            onClick={() => handleChangeTab("mota")}
                        >
                            Mô tả
                        </div>
                        <div
                            className={`tabs-item ${
                                currentTab === "lichhoc"
                                    ? "tabs-item-actived"
                                    : ""
                            }`}
                            onClick={() => handleChangeTab("lichhoc")}
                        >
                            Lịch học
                        </div>
                        <div
                            className={`tabs-item ${
                                currentTab === "danhgia"
                                    ? "tabs-item-actived"
                                    : ""
                            }`}
                            onClick={() => handleChangeTab("danhgia")}
                        >
                            Đánh giá
                        </div>
                    </div>
                    {currentTab === "mota" && (
                        <div className="content">
                            <p>{classDetail?.description}</p>
                        </div>
                    )}
                    {currentTab === "lichhoc" && (
                        <div className="content">
                            <h4>Lịch học</h4>
                            {classDetail?.scheduleRules && (
                                <>
                                    {classDetail.scheduleRules.map(
                                        (rule, index) => (
                                            <div
                                                key={index}
                                                className="schedules"
                                            >
                                                <p className="schedule-item">
                                                    {
                                                        daysOfWeekVN[
                                                            rule.dayOfWeek
                                                        ]
                                                    }{" "}
                                                    - {rule.startTime} -{" "}
                                                    {rule.endTime}
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </>
                            )}
                            <Calendar
                                localizer={localizer}
                                events={events || []}
                                defaultView={Views.WEEK}
                                views={[Views.WEEK]}
                                toolbar={false} // Không có nút điều hướng
                                step={30}
                                timeslots={2}
                                min={new Date(2024, 1, 1, 6, 0)}
                                max={new Date(2024, 1, 1, 22, 0)}
                                components={{
                                    header: ({ date }: any) => (
                                        <div
                                            style={{
                                                textAlign: "center",
                                                padding: "8px 0",
                                                fontWeight: 600,
                                                fontSize: "14px",
                                            }}
                                        >
                                            {format(date, "EEEE", {
                                                locale: vi,
                                            })}{" "}
                                            {/* Thứ Hai, Thứ Ba ... */}
                                        </div>
                                    ),
                                    event: () => (
                                        <div
                                            style={{
                                                backgroundColor: "#4CAF50",
                                                height: "100%",
                                                borderRadius: "6px",
                                            }}
                                        />
                                    ),
                                }}
                                formats={{
                                    dayFormat: () => "", // Ẩn ngày (17, 18, 19…)
                                    timeGutterFormat: (date: any) =>
                                        format(date, "HH:mm", { locale: vi }), // 24h
                                    eventTimeRangeFormat: ({
                                        start,
                                        end,
                                    }: any) =>
                                        `${format(start, "HH:mm")} - ${format(
                                            end,
                                            "HH:mm",
                                        )}`, // 24h
                                }}
                                eventPropGetter={() => ({
                                    style: {
                                        backgroundColor: "#4CAF50",
                                        borderRadius: "6px",
                                        border: "none",
                                    },
                                })}
                            />
                        </div>
                    )}
                    {currentTab === "danhgia" && (
                        <div className="content">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={feedbackValidationSchema}
                                onSubmit={(
                                    values,
                                    { resetForm, setSubmitting },
                                ) => {
                                    const payload: CreateFeedbackInClass = {
                                        classId: id!,
                                        toUserId: classDetail?.tutorId!,
                                        comment: values.comment,
                                        rating: values.rating,
                                    };

                                    if (!isAuthendicated) {
                                        setIsRemidLoginOpen(true);
                                        return;
                                    }

                                    setSubmitting(true);

                                    dispatch(
                                        createFeedbackInClassApiThunk(payload),
                                    )
                                        .unwrap()
                                        .then((res) => {
                                            const message = get(
                                                res,
                                                "data.message",
                                                "Đánh giá thành công",
                                            );
                                            toast.success(message);
                                            resetForm();
                                        })
                                        .catch((error) => {
                                            const message = get(
                                                error,
                                                "data.message",
                                                "Có lỗi xảy ra",
                                            );
                                            toast.error(message);
                                        })
                                        .finally(() => {
                                            setSubmitting(false);
                                        });
                                }}
                            >
                                {({ values, setFieldValue, isSubmitting }) => (
                                    <Form className="form">
                                        {/* Nhập nội dung đánh giá */}
                                        <div className="form-field">
                                            <label className="form-label">
                                                Đánh giá
                                            </label>
                                            <div className="form-input-container">
                                                <MdFeedback className="form-input-icon" />
                                                <Field
                                                    name="comment"
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Hãy để lại đánh giá"
                                                />
                                            </div>
                                            <ErrorMessage
                                                name="comment"
                                                component="p"
                                                className="text-error"
                                            />
                                        </div>

                                        {/* Rating sao */}
                                        <div className="form-field">
                                            <StarRating
                                                value={values.rating}
                                                onChange={(star: number) =>
                                                    setFieldValue(
                                                        "rating",
                                                        star,
                                                    )
                                                }
                                            />
                                            <ErrorMessage
                                                name="rating"
                                                component="p"
                                                className="text-error"
                                            />
                                        </div>

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
                                                "Đánh giá"
                                            )}
                                        </button>
                                    </Form>
                                )}
                            </Formik>

                            <FeedbackTutor tutorId={id!} />
                        </div>
                    )}
                </div>
                <div className="dcscc2">
                    <div className="dcscc2r1">
                        <h3>Thông tin gia sư</h3>
                        <div className="info">
                            <div className="avatar"></div>
                            <p className="name">Tên giá sư</p>
                        </div>
                        <button className="pr-btn">Xem thông tin</button>
                    </div>
                    <div className="dcscc2r2">
                        <h3>Thông tin khóa học</h3>
                        <p>
                            <FaBookOpen className="icon" />{" "}
                            <span>Hình thức</span>:{" "}
                            {classDetail?.mode === "Online"
                                ? "Học trực tuyến"
                                : "Học tại lớp"}
                        </p>
                        {classDetail?.mode === "Offline" && (
                            <p>
                                <FaMapMarkerAlt className="icon" />{" "}
                                <span>Địa điểm</span>: {classDetail?.location}
                            </p>
                        )}
                        <p>
                            <MdEditNote className="icon" /> <span>Môn học</span>
                            : {classDetail?.subject}
                            {" - "}
                            {classDetail?.educationLevel}
                        </p>
                        <p>
                            <MdDateRange className="icon" />{" "}
                            <span>Ngày khóa học bắt đầu</span>:
                            {formatDate(String(classDetail?.classStartDate))}
                        </p>
                        <p>
                            <MdAttachMoney className="icon" />{" "}
                            <span>Chi phí</span>: {classDetail?.price} / tháng
                        </p>
                        <p>
                            <FaUsers className="icon" />{" "}
                            <span>Số người đã đăng ký</span>:{" "}
                            {classDetail?.currentStudentCount}/
                            {classDetail?.studentLimit}
                        </p>
                        <button
                            className={
                                checkDisabledButton().disabled
                                    ? "disable-btn"
                                    : "pr-btn"
                            }
                            onClick={() => handleAssignClass()}
                            disabled={checkDisabledButton().disabled}
                        >
                            {checkDisabledButton().label}
                        </button>
                        {isEnrolledForStduent && (
                            <button
                                className="delete-btn"
                                onClick={() =>
                                    setIsStudentWithdrawClassOpen(true)
                                }
                            >
                                Rút đăng ký
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <RemindLoginModal
                isOpen={isRemidLoginOpen}
                setIsOpen={setIsRemidLoginOpen}
            />
            <Modal
                isOpen={isStudentAssignClassOpen}
                setIsOpen={setIsStudentAssignClassOpen}
                title="Đăng ký lớp học"
            >
                <section id="student-assign-class-modal">
                    <div className="sacm-container">
                        <h3>Bạn có chắc chắn đăng ký lớp học này</h3>
                        <button
                            onClick={() => {
                                handelStudentAssignClass();
                            }}
                            className={
                                isStudentAssignClassSubmitting
                                    ? "disable-btn"
                                    : "sc-btn"
                            }
                        >
                            {isStudentAssignClassSubmitting ? (
                                <LoadingSpinner />
                            ) : (
                                "Đăng ký"
                            )}
                        </button>
                        <p onClick={() => setIsStudentAssignClassOpen(false)}>
                            Lúc khác
                        </p>
                    </div>
                </section>
            </Modal>
            <Modal
                isOpen={isStudentWithdrawClassOpen}
                setIsOpen={setIsStudentWithdrawClassOpen}
                title="Rút đăng ký lớp học"
            >
                <section id="student-assign-class-modal">
                    <div className="sacm-container">
                        <h3>Bạn có chắc chắn rút đăng ký lớp học này</h3>
                        <button
                            onClick={() => {
                                handelStudentWithdrawClass();
                            }}
                            className={
                                isStudentAssignClassSubmitting
                                    ? "disable-btn"
                                    : "sc-btn"
                            }
                        >
                            {isStudentAssignClassSubmitting ? (
                                <LoadingSpinner />
                            ) : (
                                "Rút đăng ký"
                            )}
                        </button>
                        <p onClick={() => setIsStudentAssignClassOpen(false)}>
                            Lúc khác
                        </p>
                    </div>
                </section>
            </Modal>
        </section>
    );
};

export default DetailCoursePage;
