import { useEffect, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectDetailTutorClass,
    selectListStudentEnrolledClassFortutor,
} from "../../../app/selector";
import {
    deleteClassForTutorApiThunk,
    getAllStudentEnrolledClassForTutorApiThunk,
    getDetailClassApiThunk,
} from "../../../services/tutor/class/classThunk";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import {
    formatDate,
    getModeText,
    getStatusText,
    useDocumentTitle,
} from "../../../utils/helper";
import { Modal, UpdateClassModal } from "../../../components/modal";
import { LoadingSpinner } from "../../../components/elements";
import { get } from "lodash";
import { toast } from "react-toastify";

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
        selectListStudentEnrolledClassFortutor
    );
    const dispatch = useAppDispatch();
    const [isUpdateClassOpen, setIsUpdateClassOpen] = useState(false);
    const [isDeleteClassOpen, setIsDeleteClassOpen] = useState(false);
    const [isDeleteClassSubmitting, setIsDeleteClassSubmitting] =
        useState(false);
    const [tabSubActive, setTabSubActive] = useState("class");

    useEffect(() => {
        Promise.all([
            dispatch(getDetailClassApiThunk(id!)),
            dispatch(getAllStudentEnrolledClassForTutorApiThunk(id!)),
        ]);
    }, [id, dispatch]);

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
                                    onClick={() => setTabSubActive(t)}
                                >
                                    {t === "class" && "Lớp học"}
                                    {t === "student" && "Học sinh"}
                                </div>
                            ))}
                        </div>
                    </div>
                    {tabSubActive === "class" ? (
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
                                                    {getModeText(
                                                        classDetail?.mode
                                                    )}
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
                                                        classDetail?.status
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
                                                            classDetail?.classStartDate
                                                        )
                                                    )}
                                                </p>
                                            </div>

                                            <div className="detail-item">
                                                <h4>Ngày tạo</h4>
                                                <p>
                                                    {formatDate(
                                                        String(
                                                            classDetail?.createdAt
                                                        )
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
                                                            ]
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
                                <button
                                    className="pr-btn"
                                    onClick={() => setIsUpdateClassOpen(true)}
                                >
                                    Cập nhật
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => setIsDeleteClassOpen(true)}
                                >
                                    Xóa lớp học
                                </button>
                            </div>
                        </>
                    ) : (
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
                                    {studentsEnrolled?.map((item) => (
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
                                                <button
                                                    className="pr-btn"
                                                    onClick={() => {}}
                                                >
                                                    Chi tiết
                                                </button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => {}}
                                                >
                                                    Báo cáo
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <UpdateClassModal
                isOpen={isUpdateClassOpen}
                setIsOpen={setIsUpdateClassOpen}
                selectedClass={classDetail}
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
        </section>
    );
};

export default TutorDetailClassPage;
