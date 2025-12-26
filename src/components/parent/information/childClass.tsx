import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectDetailPublicClass,
    selectListAssignedClassForParent,
    selectListChildAccount,
} from "../../../app/selector";
import { getAllChildAccountApiThunk } from "../../../services/parent/childAccount/childAccountThunk";
import { CiTextAlignLeft } from "react-icons/ci";
import {
    getAllAssignedClassForParentApiThunk,
    withdrawClassForParentApiThunk,
} from "../../../services/parent/class/parentClassThunk";
import { formatDate, getModeText, getStatusText } from "../../../utils/helper";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useSearchParams } from "react-router-dom";
import { publicGetDetailClassApiThunk } from "../../../services/public/class/classthunk";
import { toast } from "react-toastify";
import { get } from "lodash";
import { Modal } from "../../modal";
import { LoadingSpinner } from "../../elements";
import { confirmPaymentApiThunk } from "../../../services/wallet/walletThunk";
import { MdAttachMoney } from "react-icons/md";

const ITEMS_PER_PAGE = 6;

const dayOfWeekMap: Record<string, string> = {
    Monday: "Thứ Hai",
    Tuesday: "Thứ Ba",
    Wednesday: "Thứ Tư",
    Thursday: "Thứ Năm",
    Friday: "Thứ Sáu",
    Saturday: "Thứ Bảy",
    Sunday: "Chủ Nhật",
};

const dayOrder: Record<string, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
};

const ParentChildClass: FC = () => {
    const dispatch = useAppDispatch();
    const childAccounts = useAppSelector(selectListChildAccount) || [];
    const childClasses = useAppSelector(selectListAssignedClassForParent) || [];
    const classDetail = useAppSelector(selectDetailPublicClass);

    const [childProfileId, setChildProfileId] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isParentWithdrawClassOpen, setIsParentWithdrawClassOpen] =
        useState(false);
    const [isConfirmPaymentOpen, setIsConfirmPaymentOpen] = useState(false);

    const totalPages = Math.ceil((childClasses?.length || 0) / ITEMS_PER_PAGE);
    const paginatedItems = childClasses?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    /* URL Params */
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    useEffect(() => {
        dispatch(getAllChildAccountApiThunk());
    }, [dispatch]);

    useEffect(() => {
        if (childProfileId) {
            dispatch(getAllAssignedClassForParentApiThunk(childProfileId!));
        }
    }, [childProfileId, dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(publicGetDetailClassApiThunk(id!));
        }
    }, [dispatch, id]);

    const handleBack = () => {
        navigateHook(`/parent/information?tab=class`);
    };

    const handleViewDetail = (id: string) => {
        navigateHook(`/parent/information?tab=class&id=${id}`);
    };

    const handleViewDetailTutor = (id: string) => {
        const url = routes.parent.tutor.detail.replace(":id", id);
        navigateHook(url);
    };

    const canWithdraw = () => {
        // Chỉ cho phép rút khi lớp ở trạng thái Pending hoặc Ongoing
        const status = classDetail?.status;
        return status === "Pending" || status === "Ongoing";
    };

    const handelParentWithdrawClass = async () => {
        setIsSubmitting(true);
        dispatch(
            withdrawClassForParentApiThunk({
                classId: id!,
                studentId: childProfileId,
            }),
        )
            .unwrap()
            .then((res) => {
                toast.success(
                    get(res, "data.message", "Rút đăng ký thành công"),
                );
                setIsParentWithdrawClassOpen(false);
                navigateHook(`/parent/information?tab=class`);
                dispatch(getAllAssignedClassForParentApiThunk(childProfileId!));
            })
            .catch((error) =>
                toast.error(get(error, "data.message", "Có lỗi xảy ra")),
            )
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleConfirmPayment = () => {
        setIsSubmitting(true);
        dispatch(confirmPaymentApiThunk(id!))
            .unwrap()
            .then(() => {
                toast.success("Thanh toán thành công");
                setIsConfirmPaymentOpen(false);
                dispatch(publicGetDetailClassApiThunk(id!));
            })
            .catch((error) => {
                toast.error(get(error, "data.Message", "Có lỗi xảy ra"));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const renderClassList = () => {
        return (
            <>
                <div className="pccr1">
                    <h3>Danh sách lớp học</h3>
                    <button
                        className="pr-btn"
                        onClick={() => navigateHook(routes.parent.course.list)}
                    >
                        Đi tìm lớp học
                    </button>
                </div>

                <div className="pccr2">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">Gia sư</th>
                                <th className="table-head-cell">Môn học</th>
                                <th className="table-head-cell">
                                    Thời gian bắt đầu học
                                </th>
                                <th className="table-head-cell">Trạng thái</th>
                                <th className="table-head-cell">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {paginatedItems.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="table-body-cell no-data"
                                    >
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                paginatedItems?.map((item) => (
                                    <tr
                                        className="table-body-row"
                                        key={item.classId}
                                    >
                                        <td className="table-body-cell">
                                            {item.tutorName}
                                        </td>
                                        <td className="table-body-cell">
                                            {item.subject}
                                        </td>
                                        <td className="table-body-cell">
                                            {formatDate(item.classStartDate)}
                                        </td>
                                        <td className="table-body-cell">
                                            {getStatusText(item.classStatus)}
                                        </td>
                                        <td className="table-body-cell">
                                            <button
                                                className="pr-btn"
                                                onClick={() =>
                                                    handleViewDetail(
                                                        item.classId,
                                                    )
                                                }
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="pagination mt-4">
                            <button
                                className="sc-btn mr-2"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                Trước
                            </button>
                            <span>
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                className="sc-btn ml-2"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </div>
            </>
        );
    };

    const renderClassDetail = () => (
        <>
            <div className="pccr1">
                <h3 className="detail-title">Lớp học đăng ký</h3>

                <div className="btn-group">
                    {/* Action buttons for class */}
                    {canWithdraw() && (
                        <button
                            className="delete-btn withdraw-class-btn"
                            onClick={() => setIsParentWithdrawClassOpen(true)}
                        >
                            Rút khỏi lớp học
                        </button>
                    )}
                    <button className="sc-btn" onClick={handleBack}>
                        Quay lại
                    </button>
                </div>
            </div>

            <div className="detail-class">
                {/* NHÓM 2: Thông tin gia sư */}
                <div className="detail-group">
                    <h3 className="group-title">Thông tin gia sư</h3>
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
                            <p>{classDetail?.educationLevel}</p>
                        </div>
                    </div>
                    <button
                        className="pr-btn"
                        onClick={() =>
                            handleViewDetailTutor(classDetail?.tutorUserId!)
                        }
                    >
                        Xem chi tiết
                    </button>
                    <button className="delete-btn">Báo cáo</button>
                </div>

                {/* NHÓM 3: Hình thức & Học phí */}
                <div className="detail-group">
                    <h3 className="group-title">Thông tin lớp học</h3>
                    <div className="group-content">
                        <div className="detail-item">
                            <h4>Mô tả</h4>
                            <p>{classDetail?.description}</p>
                        </div>

                        <div className="detail-item">
                            <h4>Hình thức học</h4>
                            <p>
                                {classDetail?.mode === "Online"
                                    ? "Học trực tuyến"
                                    : "Học trực tiếp"}
                            </p>
                        </div>

                        {classDetail?.mode === "Offline" && (
                            <div className="detail-item">
                                <h4>Địa điểm</h4>
                                <p>{classDetail?.location}</p>
                            </div>
                        )}

                        <div className="detail-item">
                            <h4>Học phí</h4>
                            <p>
                                {classDetail?.mode === "Offline" ? (
                                    <>
                                        <span
                                            style={{
                                                fontStyle: "italic",
                                                color: "#666",
                                            }}
                                        >
                                            {classDetail?.price?.toLocaleString()}{" "}
                                            VNĐ/tháng (Tham khảo)
                                        </span>
                                        <br />
                                        <span
                                            style={{
                                                fontSize: "0.9em",
                                                color: "#28a745",
                                            }}
                                        >
                                            Đã thanh toán: 50,000 VNĐ (phí kết
                                            nối)
                                        </span>
                                    </>
                                ) : (
                                    `${classDetail?.price?.toLocaleString()} VNĐ/tháng`
                                )}
                            </p>
                        </div>

                        <div className="detail-item">
                            <h4>Trạng thái</h4>
                            <p>{getStatusText(classDetail?.status)}</p>
                        </div>

                        <div className="detail-item">
                            <h4>Số học sinh tham gia</h4>
                            <p>{classDetail?.currentStudentCount}</p>
                        </div>
                    </div>
                </div>

                {/* NHÓM 4: Thời gian & Lịch trình */}
                <div className="detail-group">
                    <h3 className="group-title">Lịch học</h3>
                    <div className="group-content">
                        <div className="detail-item">
                            <h4>Ngày bắt đầu</h4>
                            <p>
                                {formatDate(
                                    String(classDetail?.classStartDate),
                                )}
                            </p>
                        </div>

                        <div className="detail-item">
                            <h4>Ngày tạo</h4>
                            <p>{formatDate(String(classDetail?.createdAt))}</p>
                        </div>

                        <div className="detail-item detail-item-schedule">
                            <h4>Lịch học chi tiết</h4>

                            {classDetail?.scheduleRules
                                ?.slice() // tránh mutate mảng gốc
                                .sort(
                                    (a, b) =>
                                        dayOrder[a.dayOfWeek] -
                                        dayOrder[b.dayOfWeek],
                                )
                                .map((s, index) => (
                                    <div key={index} className="schedule-item">
                                        <p className="schedule-day">
                                            {dayOfWeekMap[s.dayOfWeek] ||
                                                s.dayOfWeek}
                                        </p>

                                        <p className="schedule-time">
                                            {s.startTime} → {s.endTime}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                {/* Ẩn thanh toán thủ công (đã xử lý ngoài hệ thống) */}
                {/* Ẩn thanh toán thủ công (đã xử lý ngoài hệ thống) */}
            </div>
        </>
    );

    return (
        <div className="parent-child-class">
            <h2>Lớp học của con</h2>

            <div className="form">
                <div className="form-field">
                    <label className="form-label">Chọn tài khoản của con</label>
                    <div className="form-input-container">
                        <CiTextAlignLeft className="form-input-icon" />
                        <select
                            className="form-input"
                            value={childProfileId}
                            aria-label="Chọn tài khoản của con"
                            onChange={(e) => {
                                const newChildId = e.target.value;
                                setChildProfileId(newChildId);

                                // Nếu đang xem detail thì quay về list
                                if (id) {
                                    navigateHook(
                                        `/parent/information?tab=class`,
                                    );
                                }
                            }}
                        >
                            <option value="">--- Chọn tài khoản ---</option>
                            {childAccounts.map((t) => (
                                <option key={t.studentId} value={t.studentId}>
                                    {t.username}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {childProfileId && (
                <>{!id ? renderClassList() : renderClassDetail()}</>
            )}

            <Modal
                isOpen={isParentWithdrawClassOpen}
                setIsOpen={setIsParentWithdrawClassOpen}
                title="Rút đăng ký lớp học"
            >
                <section id="student-assign-class-modal">
                    <div className="sacm-container">
                        <h3>Bạn có chắc chắn rút đăng ký lớp học này</h3>
                        <button
                            onClick={handelParentWithdrawClass}
                            className={isSubmitting ? "disable-btn" : "sc-btn"}
                        >
                            {isSubmitting ? <LoadingSpinner /> : "Rút đăng ký"}
                        </button>
                        <p onClick={() => setIsParentWithdrawClassOpen(false)}>
                            Lúc khác
                        </p>
                    </div>
                </section>
            </Modal>
        </div>
    );
};

export default ParentChildClass;
