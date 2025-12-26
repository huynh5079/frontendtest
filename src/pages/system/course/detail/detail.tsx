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
    selectIsEnrolledClassForParent,
    selectIsEnrolledClassForStudent,
    selectListChildAccount,
    selectProfileStudent,
    selectPublicTutor,
    selectUserLogin,
} from "../../../../app/selector";
import { publicGetDetailClassApiThunk } from "../../../../services/public/class/classthunk";
import {
    assignClassForStudentApiThunk,
    checkAssignClassForStudentApiThunk,
    withdrawClassForStudentApiThunk,
} from "../../../../services/student/class/classThunk";
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
import type { WalletBalance } from "../../../../types/wallet";
import { publicGetDetailTutorApiThunk } from "../../../../services/public/tutor/tutorThunk";
import { routes } from "../../../../routes/routeName";
import { ClassFeedback } from "../../../../components/course/detail";
import { getAllChildAccountApiThunk } from "../../../../services/parent/childAccount/childAccountThunk";
import { CiTextAlignLeft } from "react-icons/ci";
import {
    assignClassForParentApiThunk,
    checkAssignClassForParentApiThunk,
    withdrawClassForParentApiThunk,
} from "../../../../services/parent/class/parentClassThunk";

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
    const studentProfile = useAppSelector(selectProfileStudent);
    const isEnrolledForStudent = useAppSelector(
        selectIsEnrolledClassForStudent,
    );
    const isEnrolledForParent = useAppSelector(selectIsEnrolledClassForParent);
    const balance: WalletBalance | null = useAppSelector(selectBalance);
    const tutor = useAppSelector(selectPublicTutor);
    const childAccounts = useAppSelector(selectListChildAccount);

    /* Local state */
    const [isRemidLoginOpen, setIsRemidLoginOpen] = useState(false);
    const [isStudentAssignClassOpen, setIsStudentAssignClassOpen] =
        useState(false);
    const [isParentAssignClassOpen, setIsParentAssignClassOpen] =
        useState(false);
    const [isStudentWithdrawClassOpen, setIsStudentWithdrawClassOpen] =
        useState(false);
    const [isStudentAssignClassSubmitting, setIsStudentAssignClassSubmitting] =
        useState(false);
    const [childProfileId, setChildProfileId] = useState<string>("");
    const [isChildEnrolledClass, setIsChildEnrolledClass] = useState(false);

    const today = new Date();
    const currentTab = searchParams.get("tab") || "mota";

    /* ================================
       Effects
    ================================= */
    useDocumentTitle(`Lớp học ${classDetail?.title}`);

    useEffect(() => {
        setIsChildEnrolledClass(isEnrolledForParent);
    }, [isEnrolledForParent]);

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
        if (classDetail && isAuthendicated && user?.role === USER_STUDENT) {
            dispatch(
                checkAssignClassForStudentApiThunk({
                    classId: classDetail?.id!,
                    studentId: studentProfile?.studentProfileId!,
                }),
            );
        }
    }, [isAuthendicated, classDetail, studentProfile, id]);

    useEffect(() => {
        if (
            classDetail &&
            isAuthendicated &&
            user?.role === USER_PARENT &&
            childProfileId
        ) {
            dispatch(
                checkAssignClassForParentApiThunk({
                    studentId: childProfileId.toLocaleLowerCase(),
                    classId: id!,
                }),
            );
        }
    }, [isAuthendicated, classDetail, childProfileId, id]);

    useEffect(() => {
        if (isAuthendicated) {
            dispatch(checkBalanceApiThunk());
        }
    }, [isAuthendicated]);

    useEffect(() => {
        if (isAuthendicated && user?.role === USER_PARENT) {
            dispatch(getAllChildAccountApiThunk());
        }
    }, [isAuthendicated]);

    /* ================================
       Handlers
    ================================= */
    const handleChangeTab = (tab: string) => navigate(`?tab=${tab}`);

    const handleAssignClass = () => {
        if (!isAuthendicated) setIsRemidLoginOpen(true);
        else if (user?.role === USER_STUDENT) setIsStudentAssignClassOpen(true);
        else if (user?.role === USER_PARENT) setIsParentAssignClassOpen(true);
    };

    // student
    const handelStudentAssignClass = async () => {
        setIsStudentAssignClassSubmitting(true);

        dispatch(
            assignClassForStudentApiThunk({
                classId: id!,
                studentId: studentProfile?.studentProfileId!,
            }),
        )
            .unwrap()
            .then((res) => {
                const message = get(res, "data.Message", "Đăng ký thành công");
                toast.success(message);
                setIsStudentAssignClassOpen(false);
                dispatch(publicGetDetailClassApiThunk(id!));
                dispatch(
                    checkAssignClassForStudentApiThunk({
                        classId: classDetail?.id!,
                        studentId: studentProfile?.studentProfileId!,
                    }),
                );
            })
            .catch((error) => {
                toast.error(get(error, "data.Message", "Có lỗi xảy ra"));
            })
            .finally(() => {
                setIsStudentAssignClassSubmitting(false);
            });
    };

    const handelStudentWithdrawClass = async () => {
        setIsStudentAssignClassSubmitting(true);
        dispatch(
            withdrawClassForStudentApiThunk({
                classId: id!,
                studentId: studentProfile?.studentProfileId!,
            }),
        )
            .unwrap()
            .then(async (res) => {
                toast.success(
                    get(res, "data.message", "Rút đăng ký thành công"),
                );
                setIsStudentWithdrawClassOpen(false);
                // Wait a bit to ensure backend transaction is committed
                await new Promise((resolve) => setTimeout(resolve, 300));
                // Refresh class detail to update currentStudentCount
                await dispatch(publicGetDetailClassApiThunk(id!));
                dispatch(
                    checkAssignClassForStudentApiThunk({
                        classId: classDetail?.id!,
                        studentId: studentProfile?.studentProfileId!,
                    }),
                );
            })
            .catch((error) =>
                toast.error(get(error, "data.message", "Có lỗi xảy ra")),
            )
            .finally(() => {
                setIsStudentAssignClassSubmitting(false);
            });
    };

    //parent
    const handelParentAssignClass = async () => {
        setIsStudentAssignClassSubmitting(true);

        dispatch(
            assignClassForParentApiThunk({
                classId: id!,
                studentId: childProfileId,
            }),
        )
            .unwrap()
            .then((res) => {
                const message = get(res, "data.Message", "Đăng ký thành công");
                toast.success(message);
                setIsParentAssignClassOpen(false);
                dispatch(publicGetDetailClassApiThunk(id!));
                setChildProfileId("");
                setIsChildEnrolledClass(false);
            })
            .catch((error) => {
                toast.error(get(error, "data.Message", "Có lỗi xảy ra"));
            })
            .finally(() => {
                setIsStudentAssignClassSubmitting(false);
            });
    };

    const handelParentWithdrawClass = async () => {
        setIsStudentAssignClassSubmitting(true);
        dispatch(
            withdrawClassForParentApiThunk({
                classId: id!,
                studentId: childProfileId,
            }),
        )
            .unwrap()
            .then(async (res) => {
                toast.success(
                    get(res, "data.message", "Rút đăng ký thành công"),
                );
                setIsParentAssignClassOpen(false);
                // Wait a bit to ensure backend transaction is committed
                await new Promise((resolve) => setTimeout(resolve, 300));
                // Refresh class detail to update currentStudentCount
                await dispatch(publicGetDetailClassApiThunk(id!));
                setChildProfileId("");
                setIsChildEnrolledClass(false);
            })
            .catch((error) =>
                toast.error(get(error, "data.message", "Có lỗi xảy ra")),
            )
            .finally(() => {
                setIsStudentAssignClassSubmitting(false);
            });
    };

    const checkDisabledButton = () => {
        const isFull =
            classDetail?.currentStudentCount === classDetail?.studentLimit;
        const oneDayBefore = new Date(classDetail?.classStartDate!);
        oneDayBefore.setDate(oneDayBefore.getDate() - 1);
        const isCloseBefore1Day = today >= oneDayBefore;
        const isEnrolled = isEnrolledForStudent === true;

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
                        {["mota", "lichhoc"].map((tab: any) => (
                            <div
                                key={tab}
                                className={`tabs-item ${
                                    currentTab === tab
                                        ? "tabs-item-actived"
                                        : ""
                                }`}
                                onClick={() => handleChangeTab(tab)}
                            >
                                {tab === "mota" ? "Mô tả" : "Lịch học"}
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
                </div>

                {/* Right */}
                <div className="dcscc2">
                    <div className="dcscc2r1">
                        <h3>Thông tin gia sư</h3>
                        <div className="info">
                            <img
                                src={tutor?.avatarUrl}
                                className="avatar"
                                alt={tutor?.username || "Tutor avatar"}
                            />
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
                                <span>Địa điểm</span>:{" "}
                                <span className="address-text">
                                    {classDetail?.location}
                                </span>
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
                        <div className="price-text">
                            <h6>
                                <MdAttachMoney className="icon" />
                                Học phí 1 tháng:{" "}
                                <span>
                                    {classDetail?.price.toLocaleString()}{" "}
                                    VNĐ/tháng
                                </span>
                            </h6>
                        </div>
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
                                {isEnrolledForStudent && (
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

            {/* student */}
            <Modal
                isOpen={isStudentAssignClassOpen}
                setIsOpen={setIsStudentAssignClassOpen}
                title="Đăng ký lớp học"
            >
                <section id="student-assign-class-modal">
                    <div className="sacm-container">
                        <h3>Bạn có chắc chắn đăng ký lớp học này</h3>
                        {classDetail?.mode === "Offline" ? (
                            <div
                                style={{
                                    marginBottom: "15px",
                                    padding: "10px",
                                    backgroundColor: "#f0f8f0",
                                    borderRadius: "5px",
                                }}
                            >
                                <p
                                    style={{
                                        margin: "5px 0",
                                        fontSize: "0.95em",
                                    }}
                                >
                                    <strong>Lớp học offline:</strong>
                                </p>
                                <p
                                    style={{
                                        margin: "5px 0",
                                        fontSize: "0.9em",
                                        color: "#666",
                                    }}
                                >
                                    • Học phí{" "}
                                    {classDetail?.price?.toLocaleString()}{" "}
                                    VNĐ/tháng chỉ là thông tin tham khảo
                                </p>
                                <p
                                    style={{
                                        margin: "5px 0",
                                        fontSize: "0.9em",
                                        color: "#28a745",
                                        fontWeight: "bold",
                                    }}
                                >
                                    • Phí đăng ký: <strong>50,000 VNĐ</strong>{" "}
                                    (phí kết nối)
                                </p>
                                <p
                                    style={{
                                        margin: "5px 0",
                                        fontSize: "0.85em",
                                        color: "#666",
                                        fontStyle: "italic",
                                    }}
                                >
                                    Sau khi đăng ký, bạn và gia sư sẽ tự trao
                                    đổi về học phí
                                </p>
                            </div>
                        ) : (
                            <div
                                style={{
                                    marginBottom: "15px",
                                    padding: "10px",
                                    backgroundColor: "#fff3cd",
                                    borderRadius: "5px",
                                }}
                            >
                                <p
                                    style={{
                                        margin: "5px 0",
                                        fontSize: "0.95em",
                                    }}
                                >
                                    <strong>Học phí cần thanh toán:</strong>{" "}
                                    <span
                                        style={{
                                            color: "#d9534f",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {classDetail?.price?.toLocaleString()}{" "}
                                        VNĐ/tháng
                                    </span>
                                </p>
                                <p
                                    style={{
                                        margin: "5px 0",
                                        fontSize: "0.85em",
                                        color: "#666",
                                    }}
                                >
                                    Số tiền sẽ được trừ từ ví của bạn
                                </p>
                            </div>
                        )}
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
                                    : "delete-btn"
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

            {/* parent */}
            <Modal
                isOpen={isParentAssignClassOpen}
                setIsOpen={setIsParentAssignClassOpen}
                title="Đăng ký lớp học"
            >
                <section id="student-assign-class-modal">
                    <div className="sacm-container">
                        <h3>
                            Bạn có chắc chắn muốn đăng ký lớp học này cho con
                            của mình không?
                        </h3>
                        {classDetail?.mode === "Offline" ? (
                            <div
                                style={{
                                    marginBottom: "15px",
                                    padding: "10px",
                                    backgroundColor: "#f0f8f0",
                                    borderRadius: "5px",
                                }}
                            >
                                <p
                                    style={{
                                        margin: "5px 0",
                                        fontSize: "0.95em",
                                    }}
                                >
                                    <strong>Lớp học offline:</strong>
                                </p>
                                <p
                                    style={{
                                        margin: "5px 0",
                                        fontSize: "0.9em",
                                        color: "#666",
                                    }}
                                >
                                    • Học phí{" "}
                                    {classDetail?.price?.toLocaleString()}{" "}
                                    VNĐ/tháng chỉ là thông tin tham khảo
                                </p>
                                <p
                                    style={{
                                        margin: "5px 0",
                                        fontSize: "0.9em",
                                        color: "#28a745",
                                        fontWeight: "bold",
                                    }}
                                >
                                    • Phí đăng ký: <strong>50,000 VNĐ</strong>{" "}
                                    (phí kết nối)
                                </p>
                                <p
                                    style={{
                                        margin: "5px 0",
                                        fontSize: "0.85em",
                                        color: "#666",
                                        fontStyle: "italic",
                                    }}
                                >
                                    Sau khi đăng ký, con bạn và gia sư sẽ tự
                                    trao đổi về học phí
                                </p>
                            </div>
                        ) : (
                            <div
                                style={{
                                    marginBottom: "15px",
                                    padding: "10px",
                                    backgroundColor: "#fff3cd",
                                    borderRadius: "5px",
                                }}
                            >
                                <p
                                    style={{
                                        margin: "5px 0",
                                        fontSize: "0.95em",
                                    }}
                                >
                                    <strong>Học phí cần thanh toán:</strong>{" "}
                                    <span
                                        style={{
                                            color: "#d9534f",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {classDetail?.price?.toLocaleString()}{" "}
                                        VNĐ/tháng
                                    </span>
                                </p>
                                <p
                                    style={{
                                        margin: "5px 0",
                                        fontSize: "0.85em",
                                        color: "#666",
                                    }}
                                >
                                    Số tiền sẽ được trừ từ ví của bạn
                                </p>
                            </div>
                        )}
                        <div className="form">
                            <div className="form-field">
                                <label className="form-label">
                                    Chọn tài khoản của con
                                </label>
                                <div className="form-input-container">
                                    <CiTextAlignLeft className="form-input-icon" />
                                    <select
                                        className="form-input"
                                        value={childProfileId}
                                        aria-label="Chọn tài khoản của con"
                                        onChange={(e) =>
                                            setChildProfileId(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            --- Chọn tài khoản ---
                                        </option>
                                        {childAccounts?.map((t) => (
                                            <option
                                                key={t.studentId}
                                                value={t.studentId}
                                            >
                                                {t.username}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        {!isChildEnrolledClass ? (
                            <button
                                onClick={handelParentAssignClass}
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
                        ) : (
                            <>
                                <button className="disable-btn">
                                    Đã đăng ký
                                </button>
                                <button
                                    onClick={handelParentWithdrawClass}
                                    className={
                                        isStudentAssignClassSubmitting
                                            ? "disable-btn"
                                            : "delete-btn"
                                    }
                                >
                                    {isStudentAssignClassSubmitting ? (
                                        <LoadingSpinner />
                                    ) : (
                                        "Huỷ đăng ký"
                                    )}
                                </button>
                            </>
                        )}
                        <p onClick={() => setIsParentAssignClassOpen(false)}>
                            Lúc khác
                        </p>
                    </div>
                </section>
            </Modal>
        </section>
    );
};

export default DetailCoursePage;
