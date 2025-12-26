import { useEffect, useMemo, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectAttendanceOverviewForTutor,
    selectDetailTutorClass,
    selectListStudentEnrolledClassFortutor,
    selectStudentAttendanceDetailForTutor,
} from "../../../app/selector";
import {
    deleteClassForTutorApiThunk,
    getAllStudentEnrolledClassForTutorApiThunk,
    getDetailClassApiThunk,
    syncLessonStatusForClassApiThunk,
} from "../../../services/tutor/class/classThunk";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import {
    formatDate,
    formatTime,
    getAttendanceText,
    getModeText,
    getStatusText,
    useDocumentTitle,
} from "../../../utils/helper";
import {
    Modal,
    UpdateClassModal,
    TutorCompleteClassModal,
    TutorCancelClassModal,
} from "../../../components/modal";
import { LoadingSpinner, PieChartStat } from "../../../components/elements";
import { get } from "lodash";
import { toast } from "react-toastify";
import {
    getAttendanceOverviewForTutorApiThunk,
    getStudentAttendanceDetailForTutorApiThunk,
} from "../../../services/attendance/attendanceThunk";
import { CiTextAlignLeft } from "react-icons/ci";
import { ChatModal } from "../../../components/chat";
import {
    getOrCreateOneToOneConversationApiThunk,
    getConversationsApiThunk,
} from "../../../services/chat/chatThunk";
import { setCurrentConversation } from "../../../services/chat/chatSlice";
import { StudentReportUserModal } from "../../../components/modal";

type PaymentStatus = "Pending" | "Paid" | "Unpaid";

const dayOrder: Record<string, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
};

const dayOfWeekMap: Record<string, string> = {
    Monday: "Thứ Hai",
    Tuesday: "Thứ Ba",
    Wednesday: "Thứ Tư",
    Thursday: "Thứ Năm",
    Friday: "Thứ Sáu",
    Saturday: "Thứ Bảy",
    Sunday: "Chủ Nhật",
};

const TutorDetailClassPage: FC = () => {
    const { id } = useParams();
    const classDetail = useAppSelector(selectDetailTutorClass);
    const studentsEnrolled = useAppSelector(
        selectListStudentEnrolledClassFortutor,
    );
    const attendanceOverview = useAppSelector(selectAttendanceOverviewForTutor);
    const studentAttendanceDetail = useAppSelector(
        selectStudentAttendanceDetailForTutor,
    );

    const attendanceChartData = useMemo(() => {
        if (!studentAttendanceDetail) return [];

        return [
            { name: "Có mặt", value: studentAttendanceDetail.presentCount },
            {
                name: "Chưa học",
                value:
                    studentAttendanceDetail.totalLessons -
                    (studentAttendanceDetail.presentCount +
                        studentAttendanceDetail.absentCount +
                        studentAttendanceDetail.excusedCount +
                        studentAttendanceDetail.lateCount),
            },
            { name: "Vắng", value: studentAttendanceDetail.absentCount },
        ];
    }, [studentAttendanceDetail]);

    const dispatch = useAppDispatch();
    const [isUpdateClassOpen, setIsUpdateClassOpen] = useState(false);
    const [isDeleteClassOpen, setIsDeleteClassOpen] = useState(false);
    const [isDeleteClassSubmitting, setIsDeleteClassSubmitting] =
        useState(false);
    const [isCompleteClassOpen, setIsCompleteClassOpen] = useState(false);
    const [isCancelClassOpen, setIsCancelClassOpen] = useState(false);
    const [isSyncingLessonStatus, setIsSyncingLessonStatus] = useState(false);
    const [tabSubActive, setTabSubActive] = useState("class");
    const [statTab, setStatTab] = useState("student");
    const [studentId, setStudentId] = useState("");
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [chatStudentUserId, setChatStudentUserId] = useState<string | null>(
        null,
    );
    const [chatConversationId, setChatConversationId] = useState<string | null>(
        null,
    );
    const [isReportStudentModalOpen, setIsReportStudentModalOpen] =
        useState(false);
    const [selectedStudentUserId, setSelectedStudentUserId] =
        useState<string>("");
    const [selectedStudentName, setSelectedStudentName] = useState<string>("");

    useEffect(() => {
        Promise.all([
            dispatch(getDetailClassApiThunk(id!)),
            dispatch(getAllStudentEnrolledClassForTutorApiThunk(id!)),
        ]);
    }, [id, dispatch]);

    // Debug: Log students data to check if studentUserId is available
    useEffect(() => {
        if (studentsEnrolled && studentsEnrolled.length > 0) {
            console.log("Students enrolled data:", studentsEnrolled);
            studentsEnrolled.forEach((student, index) => {
                console.log(`Student ${index + 1}:`, {
                    studentId: student.studentId,
                    studentUserId: student.studentUserId,
                    studentName: student.studentName,
                    studentEmail: student.studentEmail,
                });
            });
        }
    }, [studentsEnrolled]);

    useEffect(() => {
        if (tabSubActive === "attendance") {
            dispatch(getAttendanceOverviewForTutorApiThunk(id!));
        }
    }, [dispatch, tabSubActive]);

    useEffect(() => {
        if (tabSubActive === "attendance" && studentId) {
            dispatch(
                getStudentAttendanceDetailForTutorApiThunk({
                    classId: id!,
                    studentId,
                }),
            );
        }
    }, [dispatch, tabSubActive, studentId, id]);

    const paymentStatusText: Record<PaymentStatus, string> = {
        Pending: "Chờ thanh toán",
        Paid: "Đã thanh toán",
        Unpaid: "Chưa thanh toán",
    };

    useDocumentTitle(`Lớp học ${classDetail?.title}`);

    const handelDeleteClass = async () => {
        setIsDeleteClassSubmitting(true);
        dispatch(deleteClassForTutorApiThunk(id!))
            .unwrap()
            .then((res) => {
                const message = get(res, "data.Message", "Xóa thành công");
                toast.success(message);
            })
            .catch((error) => {
                const errorData = get(error, "data.Message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                setIsDeleteClassOpen(false);
                setIsDeleteClassSubmitting(false);
                navigateHook(routes.tutor.class.list);
            });
    };

    const handleViewDetail = (lessonId: string) => {
        const url = routes.tutor.lesson_detail.replace(":id", lessonId);
        navigateHook(url);
    };

    const handleOpenChat = async (studentUserId: string) => {
        console.log("handleOpenChat called with studentUserId:", studentUserId);

        if (!studentUserId) {
            toast.error("Không tìm thấy thông tin học sinh");
            return;
        }

        try {
            console.log("Calling getOrCreateOneToOneConversationApiThunk...");
            // Get or create conversation
            const result = await dispatch(
                getOrCreateOneToOneConversationApiThunk(studentUserId),
            ).unwrap();

            console.log("Conversation result:", result);

            if (result?.data) {
                console.log("Setting conversation and opening modal...");
                dispatch(setCurrentConversation(result.data));
                setChatStudentUserId(studentUserId);
                setChatConversationId(result.data.id || null);
                // Refresh conversations list and load online users
                dispatch(getConversationsApiThunk());
                setIsChatModalOpen(true);
                console.log("Modal should be open now");
            } else {
                console.error("No data in result:", result);
                toast.error("Không thể tạo cuộc trò chuyện");
            }
        } catch (error: any) {
            console.error("Error opening chat:", error);
            console.error("Error details:", {
                message: error?.message,
                errorMessage: error?.errorMessage,
                data: error?.data,
                response: error?.response,
            });
            const errorMsg = get(
                error,
                "data.message",
                error?.errorMessage ||
                    error?.message ||
                    "Có lỗi xảy ra khi mở tin nhắn",
            );
            toast.error(errorMsg);
        }
    };

    return (
        <section id="detail-tutor-class-section">
            <div className="dtcs-container">
                <div className="dtcscr1">
                    <h4>Chi tiết</h4>
                    <p>
                        Trang tổng quát <span>Lớp học</span>
                    </p>
                </div>

                <div className="dtcscr3">
                    <button
                        className="pr-btn"
                        onClick={() => navigateHook(routes.tutor.class.list)}
                    >
                        Quay lại
                    </button>
                </div>

                <div className="dtcscr4">
                    <div className="dtcscr4r1">
                        <div className="sub-tabs">
                            {["class", "student"].map((t) => (
                                <div
                                    key={t}
                                    className={`sub-tab ${
                                        tabSubActive === t ? "active" : ""
                                    }`}
                                    onClick={() => {
                                        setTabSubActive(t), setStudentId("");
                                    }}
                                >
                                    {t === "class" && "Lớp học"}
                                    {t === "student" && "Học sinh"}
                                </div>
                            ))}
                            {classDetail?.status === "Ongoing" &&
                                classDetail?.mode === "Online" && (
                                    <div
                                        className={`sub-tab ${
                                            tabSubActive === "attendance"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setTabSubActive("attendance"),
                                                setStudentId("");
                                        }}
                                    >
                                        Điểm danh
                                    </div>
                                )}
                        </div>
                    </div>
                    {tabSubActive === "class" && (
                        <>
                            <div className="dtcscr4r2">
                                <h4 className="detail-title">
                                    Thông tin lớp học
                                </h4>
                                <div className="detail-class">
                                    {/* NHÓM 2: Thông tin gia sư */}
                                    <div className="detail-group">
                                        <h3 className="group-title">
                                            Thông tin gia sư
                                        </h3>
                                        <div className="group-content">
                                            <div className="detail-item">
                                                <h4>Gia sư</h4>
                                                <p>{classDetail?.tutorName}</p>
                                            </div>

                                            <div className="detail-item">
                                                <h4>Môn học</h4>
                                                <p>{classDetail?.subject}</p>
                                            </div>

                                            <div className="detail-item">
                                                <h4>Cấp bậc dạy</h4>
                                                <p>
                                                    {
                                                        classDetail?.educationLevel
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* NHÓM 3: Hình thức & Học phí */}
                                    <div className="detail-group">
                                        <h3 className="group-title">
                                            Thông tin lớp học
                                        </h3>
                                        <div className="group-content">
                                            <div className="detail-item">
                                                <h4>Mô tả</h4>
                                                <p>
                                                    {classDetail?.description}
                                                </p>
                                            </div>

                                            <div className="detail-item">
                                                <h4>Hình thức học</h4>
                                                <p>
                                                    {classDetail?.mode ===
                                                    "Online"
                                                        ? "Học trực tuyến"
                                                        : "Học trực tiếp"}
                                                </p>
                                            </div>

                                            {classDetail?.mode ===
                                                "Offline" && (
                                                <div className="detail-item">
                                                    <h4>Địa điểm</h4>
                                                    <p>
                                                        {classDetail?.location}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="detail-item">
                                                <h4>Học phí</h4>
                                                <p>
                                                    {classDetail?.price?.toLocaleString()}{" "}
                                                    VNĐ
                                                </p>
                                            </div>

                                            <div className="detail-item">
                                                <h4>Trạng thái</h4>
                                                <p>
                                                    {getStatusText(
                                                        classDetail?.status,
                                                    )}
                                                </p>
                                            </div>

                                            <div className="detail-item">
                                                <h4>Số học sinh tham gia</h4>
                                                <p>
                                                    {
                                                        classDetail?.currentStudentCount
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* NHÓM 4: Thời gian & Lịch trình */}
                                    <div className="detail-group">
                                        <h3 className="group-title">
                                            Lịch học
                                        </h3>
                                        <div className="group-content">
                                            <div className="detail-item">
                                                <h4>Ngày bắt đầu</h4>
                                                <p>
                                                    {formatDate(
                                                        String(
                                                            classDetail?.classStartDate,
                                                        ),
                                                    )}
                                                </p>
                                            </div>

                                            <div className="detail-item">
                                                <h4>Ngày tạo</h4>
                                                <p>
                                                    {formatDate(
                                                        String(
                                                            classDetail?.createdAt,
                                                        ),
                                                    )}
                                                </p>
                                            </div>

                                            <div className="detail-item detail-item-schedule">
                                                <h4>Lịch học chi tiết</h4>

                                                {classDetail?.scheduleRules
                                                    ?.slice() // tránh mutate mảng gốc
                                                    .sort(
                                                        (a, b) =>
                                                            dayOrder[
                                                                a.dayOfWeek
                                                            ] -
                                                            dayOrder[
                                                                b.dayOfWeek
                                                            ],
                                                    )
                                                    .map((s, index) => (
                                                        <div
                                                            key={index}
                                                            className="schedule-item"
                                                        >
                                                            <p className="schedule-day">
                                                                {dayOfWeekMap[
                                                                    s.dayOfWeek
                                                                ] ||
                                                                    s.dayOfWeek}
                                                            </p>

                                                            <p className="schedule-time">
                                                                {s.startTime} →{" "}
                                                                {s.endTime}
                                                            </p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dtcscr4r3">
                                {/* Online: đủ chức năng; Offline: luôn có Hủy lớp; không phụ thuộc mode */}
                                {classDetail?.mode === "Online" && (
                                    <>
                                        <button
                                            className="pr-btn"
                                            onClick={() =>
                                                setIsUpdateClassOpen(true)
                                            }
                                        >
                                            Cập nhật
                                        </button>
                                        <button
                                            className="pr-btn"
                                            onClick={async () => {
                                                if (!id) return;
                                                setIsSyncingLessonStatus(true);
                                                try {
                                                    const result =
                                                        await dispatch(
                                                            syncLessonStatusForClassApiThunk(
                                                                id,
                                                            ),
                                                        ).unwrap();
                                                    const completedCount = get(
                                                        result,
                                                        "data.completedLessons",
                                                        0,
                                                    );
                                                    toast.success(
                                                        `Đã đồng bộ ${completedCount} buổi học thành công!`,
                                                    );
                                                    dispatch(
                                                        getDetailClassApiThunk(
                                                            id,
                                                        ),
                                                    );
                                                } catch (error: any) {
                                                    const errorMsg = get(
                                                        error,
                                                        "data.message",
                                                        "Có lỗi xảy ra khi đồng bộ",
                                                    );
                                                    toast.error(errorMsg);
                                                } finally {
                                                    setIsSyncingLessonStatus(
                                                        false,
                                                    );
                                                }
                                            }}
                                            disabled={isSyncingLessonStatus}
                                        >
                                            {isSyncingLessonStatus
                                                ? "Đang đồng bộ..."
                                                : "Đồng bộ buổi học"}
                                        </button>
                                        <button
                                            className="pr-btn"
                                            onClick={() =>
                                                setIsCompleteClassOpen(true)
                                            }
                                        >
                                            Hoàn thành
                                        </button>
                                    </>
                                )}
                                {/* Hủy lớp: luôn hiển thị cho cả Online/Offline khi chưa Cancelled/Completed */}
                                {classDetail?.status !== "Cancelled" &&
                                    classDetail?.status !== "Completed" && (
                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                setIsCancelClassOpen(true)
                                            }
                                        >
                                            Hủy lớp
                                        </button>
                                    )}
                                <button
                                    className="delete-btn"
                                    onClick={() => setIsDeleteClassOpen(true)}
                                >
                                    Xóa lớp học
                                </button>
                            </div>
                        </>
                    )}

                    {tabSubActive === "student" && (
                        <div className="dtcscr4r2">
                            <h4 className="detail-title">
                                Danh sách học viên đăng ký
                            </h4>
                            <table className="table">
                                <thead className="table-head">
                                    <tr className="table-head-row">
                                        <th className="table-head-cell">
                                            Email
                                        </th>
                                        <th className="table-head-cell">
                                            Họ và tên
                                        </th>
                                        <th className="table-head-cell">
                                            Trạng thái
                                        </th>
                                        <th className="table-head-cell">
                                            Thời gian tham gia
                                        </th>
                                        <th className="table-head-cell">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {studentsEnrolled?.length === 0 ? (
                                        <tr className="table-body-row">
                                            <td
                                                colSpan={5}
                                                className="table-body-cell no-data"
                                            >
                                                Chưa có học viên đăng ký
                                            </td>
                                        </tr>
                                    ) : (
                                        studentsEnrolled?.map((item) => (
                                            <tr
                                                className="table-body-row"
                                                key={item.studentId}
                                            >
                                                <td className="table-body-cell">
                                                    {item.studentEmail}
                                                </td>
                                                <td className="table-body-cell">
                                                    {item.studentName}
                                                </td>
                                                <td className="table-body-cell">
                                                    {paymentStatusText[
                                                        item.paymentStatus as PaymentStatus
                                                    ] ?? "Không có"}
                                                </td>
                                                <td className="table-body-cell">
                                                    {formatDate(item.createdAt)}
                                                </td>
                                                <td className="table-body-cell">
                                                    <div className="action-buttons">
                                                        <button
                                                            className="pr-btn"
                                                            onClick={() => {
                                                                console.log(
                                                                    "Nhắn tin button clicked, item:",
                                                                    item,
                                                                );
                                                                console.log(
                                                                    "studentUserId:",
                                                                    item.studentUserId,
                                                                );
                                                                if (
                                                                    item.studentUserId
                                                                ) {
                                                                    handleOpenChat(
                                                                        item.studentUserId,
                                                                    );
                                                                } else {
                                                                    console.warn(
                                                                        "No studentUserId found",
                                                                    );
                                                                    toast.error(
                                                                        "Không tìm thấy thông tin học sinh. Vui lòng tải lại trang.",
                                                                    );
                                                                }
                                                            }}
                                                            disabled={
                                                                !item.studentUserId
                                                            }
                                                            title={
                                                                !item.studentUserId
                                                                    ? "Đang tải thông tin..."
                                                                    : "Nhắn tin với học sinh"
                                                            }
                                                        >
                                                            Nhắn tin
                                                        </button>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => {
                                                                if (
                                                                    item.studentUserId &&
                                                                    item.studentName
                                                                ) {
                                                                    setSelectedStudentUserId(
                                                                        item.studentUserId,
                                                                    );
                                                                    setSelectedStudentName(
                                                                        item.studentName,
                                                                    );
                                                                    setIsReportStudentModalOpen(
                                                                        true,
                                                                    );
                                                                } else {
                                                                    toast.error(
                                                                        "Không tìm thấy thông tin học sinh. Vui lòng tải lại trang.",
                                                                    );
                                                                }
                                                            }}
                                                            disabled={
                                                                !item.studentUserId
                                                            }
                                                            title={
                                                                !item.studentUserId
                                                                    ? "Đang tải thông tin..."
                                                                    : "Báo cáo học sinh"
                                                            }
                                                        >
                                                            Báo cáo
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {tabSubActive === "attendance" && (
                        <div className="dtcscr4r2">
                            <div className="form">
                                <div className="form-field">
                                    <label className="form-label">
                                        Thống kê theo
                                    </label>
                                    <div className="form-input-container">
                                        <CiTextAlignLeft className="form-input-icon" />
                                        <select
                                            className="form-input"
                                            value={statTab}
                                            onChange={(e) => {
                                                setStatTab(e.target.value);
                                                setStudentId("");
                                            }}
                                            aria-label="Thống kê theo"
                                            title="Thống kê theo"
                                        >
                                            <option value="student">
                                                Học viên
                                            </option>
                                            <option value="lesson">
                                                Buổi học
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {statTab === "student" && (
                                <>
                                    {!studentId ? (
                                        <>
                                            <h4 className="detail-title">
                                                Thống kê điểm danh học viên
                                                trong lớp
                                            </h4>
                                            <table className="table">
                                                <thead className="table-head">
                                                    <tr className="table-head-row">
                                                        <th className="table-head-cell">
                                                            Học sinh
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Có mặt
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Vắng
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Buổi học
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Tỷ lệ điểm danh
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Thao tác
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="table-body">
                                                    {attendanceOverview
                                                        ?.students.length ===
                                                    0 ? (
                                                        <tr className="table-body-row">
                                                            <td
                                                                colSpan={6}
                                                                className="table-body-cell no-data"
                                                            >
                                                                Không có dữ liệu
                                                                điểm danh
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        attendanceOverview?.students?.map(
                                                            (item) => (
                                                                <tr
                                                                    className="table-body-row"
                                                                    key={
                                                                        item.studentId
                                                                    }
                                                                >
                                                                    <td className="table-body-cell">
                                                                        {
                                                                            item.studentName
                                                                        }
                                                                    </td>
                                                                    <td className="table-body-cell">
                                                                        {
                                                                            item.presentCount
                                                                        }
                                                                    </td>
                                                                    <td className="table-body-cell">
                                                                        {
                                                                            item.absentCount
                                                                        }
                                                                    </td>
                                                                    <td className="table-body-cell">
                                                                        {
                                                                            item.totalLessons
                                                                        }
                                                                    </td>
                                                                    <td className="table-body-cell">
                                                                        {
                                                                            item.attendanceRate
                                                                        }
                                                                        %
                                                                    </td>
                                                                    <td className="table-body-cell">
                                                                        <button
                                                                            className="pr-btn"
                                                                            onClick={() => {
                                                                                setStudentId(
                                                                                    item.studentId,
                                                                                );
                                                                            }}
                                                                        >
                                                                            Chi
                                                                            tiết
                                                                        </button>
                                                                        {item.attendanceRate <
                                                                            60 && (
                                                                            <button
                                                                                className="delete-btn"
                                                                                onClick={() => {}}
                                                                            >
                                                                                Báo
                                                                                cáo
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                className="sc-btn"
                                                onClick={() => setStudentId("")}
                                            >
                                                Quay lại
                                            </div>
                                            <h4 className="detail-title">
                                                Chi tiết điểm danh của học viên
                                            </h4>
                                            <div className="detail-student-attendance">
                                                <div className="dsac1">
                                                    <h5>Thống kê điểm danh</h5>
                                                    {attendanceChartData.length >
                                                    0 ? (
                                                        <PieChartStat
                                                            data={
                                                                attendanceChartData
                                                            }
                                                        />
                                                    ) : (
                                                        <p>
                                                            Chưa có dữ liệu điểm
                                                            danh
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="dsac2">
                                                    <h5>Danh sách điểm danh</h5>
                                                    <table className="table">
                                                        <thead className="table-head">
                                                            <tr className="table-head-row">
                                                                <th className="table-head-cell">
                                                                    Buổi học
                                                                </th>
                                                                <th className="table-head-cell">
                                                                    Ngày
                                                                </th>
                                                                <th className="table-head-cell">
                                                                    Thời gian
                                                                </th>
                                                                <th className="table-head-cell">
                                                                    Trạng thái
                                                                </th>
                                                                <th className="table-head-cell">
                                                                    Thao tác
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody className="table-body">
                                                            {studentAttendanceDetail
                                                                ?.lessons
                                                                .length ===
                                                            0 ? (
                                                                <tr className="table-body-row">
                                                                    <td
                                                                        colSpan={
                                                                            5
                                                                        }
                                                                        className="table-body-cell no-data"
                                                                    >
                                                                        Không có
                                                                        dữ liệu
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                studentAttendanceDetail?.lessons?.map(
                                                                    (
                                                                        l,
                                                                        index,
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <td className="table-body-cell">
                                                                                Buổi{" "}
                                                                                {
                                                                                    l.lessonNumber
                                                                                }
                                                                            </td>
                                                                            <td className="table-body-cell">
                                                                                {formatDate(
                                                                                    l.lessonDate,
                                                                                )}
                                                                            </td>
                                                                            <td className="table-body-cell">
                                                                                {formatTime(
                                                                                    l.startTime,
                                                                                )}{" "}
                                                                                -{" "}
                                                                                {formatTime(
                                                                                    l.endTime,
                                                                                )}
                                                                            </td>
                                                                            <td className="table-body-cell">
                                                                                {getAttendanceText(
                                                                                    l.status,
                                                                                )}
                                                                            </td>
                                                                            <td className="table-body-cell">
                                                                                <button
                                                                                    className="pr-btn"
                                                                                    onClick={() =>
                                                                                        handleViewDetail(
                                                                                            l.lessonId,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Xem
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ),
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                            {statTab === "lesson" && (
                                <>
                                    <h4 className="detail-title">
                                        Thống kê điểm danh buổi học của lớp
                                    </h4>
                                    <table className="table">
                                        <thead className="table-head">
                                            <tr className="table-head-row">
                                                <th className="table-head-cell">
                                                    Buổi học
                                                </th>
                                                <th className="table-head-cell">
                                                    Ngày
                                                </th>
                                                <th className="table-head-cell">
                                                    Thời gian
                                                </th>
                                                <th className="table-head-cell">
                                                    Sỉ số
                                                </th>
                                                <th className="table-head-cell">
                                                    Tỷ lệ điểm danh
                                                </th>
                                                <th className="table-head-cell">
                                                    Thao tác
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-body">
                                            {attendanceOverview?.lessons
                                                .length === 0 ? (
                                                <tr className="table-body-row">
                                                    <td
                                                        colSpan={6}
                                                        className="table-body-cell no-data"
                                                    >
                                                        Không có dữ liệu điểm
                                                        danh
                                                    </td>
                                                </tr>
                                            ) : (
                                                attendanceOverview?.lessons?.map(
                                                    (item) => (
                                                        <tr
                                                            className="table-body-row"
                                                            key={item.lessonId}
                                                        >
                                                            <td className="table-body-cell">
                                                                Buổi{" "}
                                                                {
                                                                    item.lessonNumber
                                                                }
                                                            </td>
                                                            <td className="table-body-cell">
                                                                {formatDate(
                                                                    item.lessonDate,
                                                                )}
                                                            </td>
                                                            <td className="table-body-cell">
                                                                {formatTime(
                                                                    item.startTime,
                                                                )}{" "}
                                                                -{" "}
                                                                {formatTime(
                                                                    item.endTime,
                                                                )}
                                                            </td>
                                                            <td className="table-body-cell">
                                                                {
                                                                    item.presentCount
                                                                }{" "}
                                                                /{" "}
                                                                {
                                                                    item.totalStudents
                                                                }
                                                            </td>
                                                            <td className="table-body-cell">
                                                                {
                                                                    item.attendanceRate
                                                                }
                                                                %
                                                            </td>
                                                            <td className="table-body-cell">
                                                                <button
                                                                    className="pr-btn"
                                                                    onClick={() =>
                                                                        handleViewDetail(
                                                                            item.lessonId,
                                                                        )
                                                                    }
                                                                >
                                                                    Chi tiết
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <UpdateClassModal
                isOpen={isUpdateClassOpen}
                setIsOpen={setIsUpdateClassOpen}
                selectedClass={classDetail}
            />
            <TutorCompleteClassModal
                isOpen={isCompleteClassOpen}
                setIsOpen={setIsCompleteClassOpen}
                classId={id || null}
            />
            <TutorCancelClassModal
                isOpen={isCancelClassOpen}
                setIsOpen={setIsCancelClassOpen}
                classId={id || null}
            />
            <Modal
                isOpen={isDeleteClassOpen}
                setIsOpen={setIsDeleteClassOpen}
                title="Xóa lớp học"
            >
                <section id="student-assign-class-modal">
                    <div className="sacm-container">
                        <h3>Bạn có chắc chắn xóa lớp học này</h3>
                        <button
                            onClick={() => {
                                handelDeleteClass();
                            }}
                            className={
                                isDeleteClassSubmitting
                                    ? "disable-btn"
                                    : "delete-btn"
                            }
                        >
                            {isDeleteClassSubmitting ? (
                                <LoadingSpinner />
                            ) : (
                                "Xóa"
                            )}
                        </button>
                        <p onClick={() => setIsDeleteClassSubmitting(false)}>
                            Lúc khác
                        </p>
                    </div>
                </section>
            </Modal>
            <ChatModal
                isOpen={isChatModalOpen}
                onClose={() => {
                    setIsChatModalOpen(false);
                    setChatStudentUserId(null);
                    setChatConversationId(null);
                }}
                conversationId={chatConversationId || undefined}
                otherUserId={chatStudentUserId || undefined}
            />

            {/* Report Student Modal */}
            <StudentReportUserModal
                isOpen={isReportStudentModalOpen}
                setIsOpen={setIsReportStudentModalOpen}
                targetUserId={selectedStudentUserId}
                targetUserName={selectedStudentName}
            />
        </section>
    );
};

export default TutorDetailClassPage;
