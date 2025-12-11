import { useEffect, useState, useMemo, type FC } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { FaBookOpen, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import {
    MdAttachMoney,
    MdDateRange,
    MdEditNote,
    MdFeedback,
} from "react-icons/md";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, add } from "date-fns";
import { vi } from "date-fns/locale";
import { get } from "lodash";
import { toast } from "react-toastify";

import { FeedbackTutor, LoadingSpinner } from "../../../../components/elements";
import { Modal, RemindLoginModal } from "../../../../components/modal";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import {
    selectBalance,
    selectDetailPublicClass,
    selectIsAuthenticated,
    selectIsEnrolledClassForStudent,
    selectPublicTutor,
    selectUserLogin,
} from "../../../../app/selector";
import { publicGetDetailClassApiThunk } from "../../../../services/public/class/classthunk";
import {
    assignClassForStudentApiThunk,
    checkAssignClassForStudentApiThunk,
    withdrawClassForStudentApiThunk,
} from "../../../../services/student/class/classThunk";
import { createFeedbackInClassApiThunk } from "../../../../services/feedback/feedbackThunk";
import {
    checkBalanceApiThunk,
    transferWalletApiThunk,
} from "../../../../services/wallet/walletThunk";
import {
    formatDate,
    useDocumentTitle,
    USER_PARENT,
    USER_STUDENT,
} from "../../../../utils/helper";
import type { CreateFeedbackInClass } from "../../../../types/feedback";
import type { WalletBalance } from "../../../../types/wallet";
import { publicGetDetailTutorApiThunk } from "../../../../services/public/tutor/tutorThunk";
import { routes } from "../../../../routes/routeName";
import { ClassFeedback } from "../../../../components/course/detail";

/* ================================
   Constants
================================ */
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

const daysOfWeekVN: Record<string, string> = {
    Monday: "Thứ Hai",
    Tuesday: "Thứ Ba",
    Wednesday: "Thứ Tư",
    Thursday: "Thứ Năm",
    Friday: "Thứ Sáu",
    Saturday: "Thứ Bảy",
    Sunday: "Chủ Nhật",
};

/* ================================
   Component
================================ */
const DetailCoursePage: FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    /* Redux state */
    const classDetail = useAppSelector(selectDetailPublicClass);
    const isAuthendicated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUserLogin);
    const isEnrolledForStduent = useAppSelector(
        selectIsEnrolledClassForStudent,
    );
    const balance: WalletBalance | null = useAppSelector(selectBalance);
    const tutor = useAppSelector(selectPublicTutor);

    /* Local state */
    const [isRemidLoginOpen, setIsRemidLoginOpen] = useState(false);
    const [isStudentAssignClassOpen, setIsStudentAssignClassOpen] =
        useState(false);
    const [isStudentWithdrawClassOpen, setIsStudentWithdrawClassOpen] =
        useState(false);
    const [isStudentAssignClassSubmitting, setIsStudentAssignClassSubmitting] =
        useState(false);

    const today = new Date();
    const currentTab = searchParams.get("tab") || "mota";

    /* ================================
       Effects
    ================================= */
    useDocumentTitle(`Lớp học ${classDetail?.title}`);

    useEffect(() => {
        dispatch(publicGetDetailClassApiThunk(id!));
    }, [id]);

    useEffect(() => {
        if (classDetail) {
            dispatch(
                publicGetDetailTutorApiThunk(
                    classDetail?.tutorUserId.toLowerCase(),
                ),
            );
        }
    }, [dispatch, classDetail]);

    useEffect(() => {
        if (classDetail && isAuthendicated) {
            dispatch(checkAssignClassForStudentApiThunk(id!));
        }
    }, [isAuthendicated, classDetail]);

    useEffect(() => {
        if (isAuthendicated) {
            dispatch(checkBalanceApiThunk());
        }
    }, [isAuthendicated]);

    /* ================================
       Handlers
    ================================= */
    const handleChangeTab = (tab: string) => navigate(`?tab=${tab}`);

    const handleAssignClass = () => {
        if (!isAuthendicated) setIsRemidLoginOpen(true);
        else if (user?.role === USER_STUDENT) setIsStudentAssignClassOpen(true);
    };

    const handelStudentAssignClass = async () => {
        setIsStudentAssignClassSubmitting(true);

        if (
            classDetail?.mode === "Online" &&
            balance?.balance! < classDetail?.price!
        ) {
            toast.error("Số dư ví của bạn không đủ, vui lòng nạp thêm tiền.");
            setIsStudentAssignClassSubmitting(false);
            return;
        }

        dispatch(assignClassForStudentApiThunk({ classId: id! }))
            .unwrap()
            .then((res) => {
                const message = get(res, "data.Message", "Đăng ký thành công");
                toast.success(message);
                if (classDetail?.mode === "Online") {
                    dispatch(
                        transferWalletApiThunk({
                            toUserId: "0E85EF35-39C1-418A-9A8C-0F83AC9520A6",
                            amount: classDetail?.price,
                            note: "Phí đặt lịch gia sư",
                        }),
                    );
                }
            })
            .catch((error) => {
                toast.error(get(error, "data.Message", "Có lỗi xảy ra"));
            })
            .finally(() => {
                setIsStudentAssignClassOpen(false);
                setIsStudentAssignClassSubmitting(false);
                dispatch(publicGetDetailClassApiThunk(id!));
                dispatch(checkAssignClassForStudentApiThunk(id!));
            });
    };

    const handelStudentWithdrawClass = async () => {
        setIsStudentAssignClassSubmitting(true);
        dispatch(withdrawClassForStudentApiThunk(id!))
            .unwrap()
            .then((res) =>
                toast.success(
                    get(res, "data.message", "Rút đăng ký thành công"),
                ),
            )
            .catch((error) =>
                toast.error(get(error, "data.message", "Có lỗi xảy ra")),
            )
            .finally(() => {
                setIsStudentWithdrawClassOpen(false);
                setIsStudentAssignClassSubmitting(false);
                dispatch(publicGetDetailClassApiThunk(id!));
                dispatch(checkAssignClassForStudentApiThunk(id!));
            });
    };

    const checkDisabledButton = () => {
        const isFull =
            classDetail?.currentStudentCount === classDetail?.studentLimit;
        const oneDayBefore = new Date(classDetail?.classStartDate!);
        oneDayBefore.setDate(oneDayBefore.getDate() - 1);
        const isCloseBefore1Day = today >= oneDayBefore;
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

    // Điều hướng vào trang detail
    const handleToDetail = (tutorId: string) => {
        if (!isAuthendicated) {
            navigate(routes.tutor.detail.replace(":id", tutorId));
            return;
        }
        if (user?.role === USER_STUDENT) {
            navigate(routes.student.tutor.detail.replace(":id", tutorId));
            return;
        }
        if (user?.role === USER_PARENT) {
            navigate(routes.parent.tutor.detail.replace(":id", tutorId));
            return;
        }
    };

    /* ================================
       Memo: Calendar events
    ================================= */
    const events = useMemo(() => {
        if (!classDetail?.scheduleRules?.length) return [];
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

        return classDetail.scheduleRules
            .map((rule) => {
                const targetDow = dayMap[rule.dayOfWeek];
                if (targetDow === undefined) return null;

                const pos = (targetDow + 6) % 7;
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

    /* ================================
       Render
    ================================= */
    return (
        <section id="detail-course-section">
            {/* Container */}
            <div className="dcs-container">
                {/* Left */}
                <div className="dcscc1">
                    <h3>{classDetail?.title}</h3>
                    {/* Tabs */}
                    <div className="tabs">
                        {["mota", "lichhoc", "danhgia"].map((tab) => (
                            <div
                                key={tab}
                                className={`tabs-item ${
                                    currentTab === tab
                                        ? "tabs-item-actived"
                                        : ""
                                }`}
                                onClick={() => handleChangeTab(tab)}
                            >
                                {tab === "mota"
                                    ? "Mô tả"
                                    : tab === "lichhoc"
                                    ? "Lịch học"
                                    : "Đánh giá"}
                            </div>
                        ))}
                    </div>

                    {/* Tab content */}
                    {currentTab === "mota" && (
                        <div className="content">
                            <h4>Mô tả về lớp học</h4>
                            <p>{classDetail?.description}</p>
                        </div>
                    )}

                    {currentTab === "lichhoc" && (
                        <div className="content">
                            <h4>Lịch học</h4>
                            <div className="schedules">
                                {classDetail?.scheduleRules?.map(
                                    (rule, index) => (
                                        <p
                                            className="schedule-item"
                                            key={index}
                                        >
                                            <span>
                                                {daysOfWeekVN[rule.dayOfWeek]}:{" "}
                                            </span>
                                            {rule.startTime} - {rule.endTime}
                                        </p>
                                    ),
                                )}
                            </div>

                            <Calendar
                                localizer={localizer}
                                events={events || []}
                                defaultView={Views.WEEK}
                                views={[Views.WEEK]}
                                toolbar={false}
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
                                                fontSize: 14,
                                            }}
                                        >
                                            {format(date, "EEEE", {
                                                locale: vi,
                                            })}
                                        </div>
                                    ),
                                    event: () => (
                                        <div
                                            style={{
                                                backgroundColor: "#4CAF50",
                                                height: "100%",
                                                borderRadius: 6,
                                            }}
                                        />
                                    ),
                                }}
                                formats={{
                                    dayFormat: () => "",
                                    timeGutterFormat: (date: any) =>
                                        format(date, "HH:mm", { locale: vi }),
                                    eventTimeRangeFormat: ({
                                        start,
                                        end,
                                    }: any) =>
                                        `${format(start, "HH:mm")} - ${format(
                                            end,
                                            "HH:mm",
                                        )}`,
                                }}
                                eventPropGetter={() => ({
                                    style: {
                                        backgroundColor: "#4CAF50",
                                        borderRadius: 6,
                                        border: "none",
                                    },
                                })}
                            />
                        </div>
                    )}

                    {currentTab === "danhgia" && (
                        <div className="content">
                            <ClassFeedback classDetail={classDetail} />
                        </div>
                    )}
                </div>

                {/* Right */}
                <div className="dcscc2">
                    <div className="dcscc2r1">
                        <h3>Thông tin gia sư</h3>
                        <div className="info">
                            <img src={tutor?.avatarUrl} className="avatar" />
                            <p className="name">{tutor?.username}</p>
                        </div>
                        <button
                            className="pr-btn"
                            onClick={() => handleToDetail(tutor?.tutorId!)}
                        >
                            Xem thông tin
                        </button>
                    </div>

                    <div className="dcscc2r2">
                        <h3>Thông tin lớp học</h3>
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
                            : {classDetail?.subject} -{" "}
                            {classDetail?.educationLevel}
                        </p>
                        <p>
                            <MdDateRange className="icon" />{" "}
                            <span>Ngày khóa học bắt đầu</span>:{" "}
                            {formatDate(String(classDetail?.classStartDate))}
                        </p>
                        <p>
                            <MdAttachMoney className="icon" />{" "}
                            <span>Chi phí</span>:{" "}
                            {classDetail?.price.toLocaleString()} / tháng
                        </p>
                        <p>
                            <FaUsers className="icon" />{" "}
                            <span>Số người đã đăng ký</span>:{" "}
                            {classDetail?.currentStudentCount}/
                            {classDetail?.studentLimit}
                        </p>

                        {classDetail?.status !== "Cancelled" && (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
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
                            onClick={handelStudentAssignClass}
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
                            onClick={handelStudentWithdrawClass}
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
