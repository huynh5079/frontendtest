import { useEffect, useState, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectDetailClassRequestForStudent,
    selectListChildAccount,
    selectListClassRequestForStudent,
    selectListClassRequetForParent,
} from "../../../app/selector";
import {
    getAllClassRequestForStudentApiThunk,
    getDetailClassRequestForStudentApiThunk,
} from "../../../services/student/bookingTutor/bookingTutorThunk";
import {
    formatDate,
    getStatusText,
    useDocumentTitle,
} from "../../../utils/helper";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    CancelBookingTutorForStudent,
    UpdateBookingTutorForStudentModal,
} from "../../modal";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { CiTextAlignLeft } from "react-icons/ci";
import { getAllClassRequestForParentApiThunk } from "../../../services/parent/classRequest/classRequestThunk";
import { getAllChildAccountApiThunk } from "../../../services/parent/childAccount/childAccountThunk";

const daysOfWeek = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
];

const sortOrder = [1, 2, 3, 4, 5, 6, 0]; // Thứ 2 → Thứ 7 → Chủ Nhật

const ITEMS_PER_PAGE = 6;

const ParentBookingTutor: FC = () => {
    const dispatch = useAppDispatch();
    const bookingTutors = (
        useAppSelector(selectListClassRequetForParent) ?? []
    ).filter((b) => b.tutorName);
    const bookingTutor = useAppSelector(selectDetailClassRequestForStudent);
    const childAccounts = useAppSelector(selectListChildAccount) || [];

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const [isUpdateBookingTutorModalOpen, setIsUpdateBookingTutorModalOpen] =
        useState(false);
    const [isCancelBookingTutorModalOpen, setIsCancelBookingTutorModalOpen] =
        useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [childProfileId, setChildProfileId] = useState<string>("");

    useEffect(() => {
        setCurrentPage(1);
    }, [childProfileId]);

    useEffect(() => {
        dispatch(getAllChildAccountApiThunk());
    }, [dispatch]);

    // Load danh sách
    useEffect(() => {
        if (childProfileId) {
            dispatch(
                getAllClassRequestForParentApiThunk(
                    childProfileId.toLocaleLowerCase()!,
                ),
            );
        }
    }, [dispatch, childProfileId]);

    // Load chi tiết khi có id
    useEffect(() => {
        if (id) {
            dispatch(getDetailClassRequestForStudentApiThunk(id));
        }
    }, [dispatch, id]);

    const handleViewDetail = (id: string) => {
        navigate(`/parent/information?tab=booking_tutor&id=${id}`);
    };

    const handleBack = () => {
        navigate(`/parent/information?tab=booking_tutor`);
    };

    useDocumentTitle("Danh sách lịch đặt gia sư");

    const totalPages = Math.ceil((bookingTutors?.length || 0) / ITEMS_PER_PAGE);
    const paginatedItems = bookingTutors?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleViewDetailTutor = (id: string) => {
        const url = routes.parent.tutor.detail.replace(":id", id);
        navigate(url);
    };

    const renderBookingList = () => {
        return (
            <>
                <div className="sbtr1">
                    <h3>Lịch đặt gia sư</h3>
                    <button
                        className="pr-btn"
                        onClick={() => navigateHook(routes.parent.tutor.list)}
                    >
                        Đi tìm gia sư
                    </button>
                </div>
                <table className="table">
                    <thead className="table-head">
                        <tr className="table-head-row">
                            <th className="table-head-cell">Tên gia sư</th>
                            <th className="table-head-cell">Môn học</th>
                            <th className="table-head-cell">Trạng thái</th>
                            <th className="table-head-cell">
                                Thời gian đặt lịch
                            </th>
                            <th className="table-head-cell">Thao tác</th>
                        </tr>
                    </thead>

                    <tbody className="table-body">
                        {paginatedItems.length === 0 ? (
                            <tr>
                                <td
                                    className="table-body-cell no-data"
                                    colSpan={5}
                                >
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            paginatedItems?.map((b) => (
                                <tr key={b.id}>
                                    <td className="table-body-cell">
                                        {b.tutorName}
                                    </td>
                                    <td className="table-body-cell">
                                        {b.subject}
                                    </td>
                                    <td className="table-body-cell">
                                        {getStatusText(b.status)}
                                    </td>
                                    <td className="table-body-cell">
                                        {formatDate(b.createdAt)}
                                    </td>
                                    <td className="table-body-cell">
                                        <button
                                            className="pr-btn"
                                            onClick={() =>
                                                handleViewDetail(b.id)
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
                    <div className="pagination">
                        <button
                            className="sc-btn"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            Trước
                        </button>
                        <span>
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            className="sc-btn"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Sau
                        </button>
                    </div>
                )}
            </>
        );
    };

    const renderBookingDetail = () => {
        return (
            <>
                <h3 className="detail-title">Chi tiết lịch đặt gia sư</h3>

                <div className="detail-booking-tutor">
                    {/* NHÓM 1: Thông tin học sinh */}
                    <div className="detail-group">
                        <h3 className="group-title">Thông tin học sinh</h3>
                        <div className="group-content">
                            <div className="detail-item">
                                <h4>Học sinh</h4>
                                <p>{bookingTutor?.studentName}</p>
                            </div>

                            <div className="detail-item">
                                <h4>Mô tả</h4>
                                <p>{bookingTutor?.description}</p>
                            </div>

                            {bookingTutor?.specialRequirements && (
                                <div className="detail-item">
                                    <h4>Yêu cầu đặc biệt</h4>
                                    <p>{bookingTutor?.specialRequirements}</p>
                                </div>
                            )}

                            <div className="detail-item">
                                <h4>Môn học</h4>
                                <p>{bookingTutor?.subject}</p>
                            </div>

                            <div className="detail-item">
                                <h4>Cấp bậc học</h4>
                                <p>{bookingTutor?.educationLevel}</p>
                            </div>
                        </div>
                    </div>

                    {/* NHÓM 2: Thông tin gia sư */}
                    <div className="detail-group">
                        <h3 className="group-title">Thông tin gia sư</h3>
                        <div className="group-content">
                            <div className="detail-item">
                                <h4>Gia sư</h4>
                                <p>{bookingTutor?.tutorName}</p>
                            </div>
                        </div>
                        <button
                            className="pr-btn"
                            onClick={() =>
                                handleViewDetailTutor(bookingTutor?.tutorId!)
                            }
                        >
                            Xem chi tiết
                        </button>
                    </div>

                    {/* NHÓM 3: Hình thức & Học phí */}
                    <div className="detail-group">
                        <h3 className="group-title">Hình thức học & học phí</h3>
                        <div className="group-content">
                            <div className="detail-item">
                                <h4>Hình thức học</h4>
                                <p>
                                    {bookingTutor?.mode === "Online"
                                        ? "Học trực tuyến"
                                        : "Học trực tiếp"}
                                </p>
                            </div>

                            {bookingTutor?.mode === "Offline" && (
                                <div className="detail-item">
                                    <h4>Địa điểm</h4>
                                    <p>{bookingTutor?.location}</p>
                                </div>
                            )}

                            <div className="detail-item">
                                <h4>Học phí</h4>
                                <p>
                                    {bookingTutor?.budget?.toLocaleString()} VNĐ
                                </p>
                            </div>

                            <div className="detail-item">
                                <h4>Trạng thái</h4>
                                <p>{getStatusText(bookingTutor?.status)}</p>
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
                                        String(bookingTutor?.classStartDate),
                                    )}
                                </p>
                            </div>

                            <div className="detail-item">
                                <h4>Ngày hết hạn</h4>
                                <p>
                                    {formatDate(
                                        String(bookingTutor?.expiryDate),
                                    )}
                                </p>
                            </div>

                            <div className="detail-item">
                                <h4>Ngày tạo</h4>
                                <p>
                                    {formatDate(
                                        String(bookingTutor?.createdAt),
                                    )}
                                </p>
                            </div>

                            <div className="detail-item detail-item-schedule">
                                <h4>Lịch học chi tiết</h4>

                                {[...(bookingTutor?.schedules || [])]
                                    .sort(
                                        (a, b) =>
                                            sortOrder.indexOf(a.dayOfWeek) -
                                            sortOrder.indexOf(b.dayOfWeek),
                                    )
                                    .map((s, index) => (
                                        <div
                                            key={index}
                                            className="schedule-item"
                                        >
                                            <p className="schedule-day">
                                                {daysOfWeek[s.dayOfWeek]}
                                            </p>
                                            <p className="schedule-time">
                                                {s.startTime} → {s.endTime}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nút */}
                <div className="group-btn mt-4">
                    {bookingTutor?.status === "Pending" && (
                        <button
                            className="pr-btn"
                            onClick={() =>
                                setIsUpdateBookingTutorModalOpen(true)
                            }
                        >
                            Cập nhật
                        </button>
                    )}

                    <button className="sc-btn" onClick={handleBack}>
                        Quay lại
                    </button>

                    {bookingTutor?.status === "Pending" && (
                        <button
                            className="delete-btn"
                            onClick={() =>
                                setIsCancelBookingTutorModalOpen(true)
                            }
                        >
                            Huỷ lịch
                        </button>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="parent-booking-tutor">
            <h2>Lịch đặt gia sư của con</h2>

            <div className="form">
                <div className="form-field">
                    <label className="form-label">Chọn tài khoản của con</label>
                    <div className="form-input-container">
                        <CiTextAlignLeft className="form-input-icon" />
                        <select
                            className="form-input"
                            value={childProfileId}
                            onChange={(e) => {
                                const newChildId = e.target.value;
                                setChildProfileId(newChildId);

                                // Nếu đang xem detail thì quay về list
                                if (id) {
                                    navigateHook(
                                        `/parent/information?tab=booking_tutor`,
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
                <>{!id ? renderBookingList() : renderBookingDetail()}</>
            )}

            <UpdateBookingTutorForStudentModal
                isOpen={isUpdateBookingTutorModalOpen}
                setIsOpen={setIsUpdateBookingTutorModalOpen}
                selectedBooking={bookingTutor}
            />
            <CancelBookingTutorForStudent
                isOpen={isCancelBookingTutorModalOpen}
                setIsOpen={setIsCancelBookingTutorModalOpen}
                requestId={bookingTutor?.id!}
            />
        </div>
    );
};

export default ParentBookingTutor;
