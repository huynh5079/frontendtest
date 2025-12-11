import { useEffect, useState, type FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store";

import {
    selectDetailClassRequestForStudent,
    selectListClassRequestForStudent,
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
import {
    CancelBookingTutorForStudent,
    UpdateBookingTutorForStudentModal,
} from "../../modal";
import { routes } from "../../../routes/routeName";
import { navigateHook } from "../../../routes/routeApp";

/* ================================
   Constant
================================ */
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

/* ================================
   Component
================================ */
const StudentBookingTutor: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    /* Redux state */
    const bookingTutors = (
        useAppSelector(selectListClassRequestForStudent) || []
    ).filter((b) => b?.tutorName);

    const bookingTutor = useAppSelector(selectDetailClassRequestForStudent);

    /* Local UI state */
    const [isUpdateBookingTutorModalOpen, setIsUpdateBookingTutorModalOpen] =
        useState(false);
    const [isCancelBookingTutorModalOpen, setIsCancelBookingTutorModalOpen] =
        useState(false);

    /* URL Params */
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    /* Pagination state */
    const [currentPage, setCurrentPage] = useState(1);

    /* Set page title */
    useDocumentTitle("Danh sách lịch đặt gia sư");

    /* Load list */
    useEffect(() => {
        dispatch(getAllClassRequestForStudentApiThunk());
    }, [dispatch]);

    /* Load detail when id changes */
    useEffect(() => {
        if (id) {
            dispatch(getDetailClassRequestForStudentApiThunk(id));
        }
    }, [dispatch, id]);

    /* ================================
       Handlers
    ================================= */
    const handleViewDetail = (id: string) => {
        navigate(`/student/information?tab=booking_tutor&id=${id}`);
    };

    const handleViewDetailTutor = (id: string) => {
        const url = routes.student.tutor.detail.replace(":id", id);
        navigate(url);
    };

    const handleBack = () => {
        navigate(`/student/information?tab=booking_tutor`);
    };

    const totalPages = Math.ceil((bookingTutors?.length || 0) / ITEMS_PER_PAGE);
    const paginatedItems = bookingTutors?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    /* ================================
       Render Booking List
    ================================= */
    const renderBookingList = () => (
        <>
            <div className="sbtr1">
                <h3>Lớp học đăng ký</h3>
                <button
                    className="pr-btn"
                    onClick={() => navigateHook(routes.student.tutor.list)}
                >
                    Đi tìm lớp học
                </button>
            </div>

            <table className="table">
                <thead className="table-head">
                    <tr className="table-head-row">
                        <th className="table-head-cell">Tên gia sư</th>
                        <th className="table-head-cell">Môn học</th>
                        <th className="table-head-cell">Trạng thái</th>
                        <th className="table-head-cell">Thời gian đặt lịch</th>
                        <th className="table-head-cell">Thao tác</th>
                    </tr>
                </thead>

                <tbody className="table-body">
                    {paginatedItems?.map((b) => (
                        <tr key={b.id}>
                            <td className="table-body-cell">{b.tutorName}</td>
                            <td className="table-body-cell">{b.subject}</td>
                            <td className="table-body-cell">
                                {getStatusText(b.status)}
                            </td>
                            <td className="table-body-cell">
                                {formatDate(b.createdAt)}
                            </td>
                            <td className="table-body-cell">
                                <button
                                    className="pr-btn"
                                    onClick={() => handleViewDetail(b.id)}
                                >
                                    Chi tiết
                                </button>
                            </td>
                        </tr>
                    ))}
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

    /* ================================
       Render Booking Detail
    ================================= */
    const renderBookingDetail = () => (
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

                        <div className="detail-item">
                            <h4>Yêu cầu đặc biệt</h4>
                            <p>{bookingTutor?.specialRequirements}</p>
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

                        <div className="detail-item">
                            <h4>Môn học</h4>
                            <p>{bookingTutor?.subject}</p>
                        </div>

                        <div className="detail-item">
                            <h4>Cấp bậc học</h4>
                            <p>{bookingTutor?.educationLevel}</p>
                        </div>
                    </div>
                    <div
                        className="pr-btn"
                        onClick={() =>
                            handleViewDetailTutor(bookingTutor?.tutorId!)
                        }
                    >
                        Xem chi tiết
                    </div>
                </div>

                {/* NHÓM 3: Hình thức & Học phí */}
                <div className="detail-group">
                    <h3 className="group-title">Hình thức học & học phí</h3>
                    <div className="group-content">
                        <div className="detail-item">
                            <h4>Hình thức học</h4>
                            <p>{bookingTutor?.mode}</p>
                        </div>

                        {bookingTutor?.mode === "Offline" && (
                            <div className="detail-item">
                                <h4>Địa điểm</h4>
                                <p>{bookingTutor?.location}</p>
                            </div>
                        )}

                        <div className="detail-item">
                            <h4>Học phí</h4>
                            <p>{bookingTutor?.budget?.toLocaleString()} VNĐ</p>
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
                                    String(bookingTutor?.classStartDate)
                                )}
                            </p>
                        </div>

                        <div className="detail-item">
                            <h4>Ngày hết hạn</h4>
                            <p>
                                {formatDate(String(bookingTutor?.expiryDate))}
                            </p>
                        </div>

                        <div className="detail-item">
                            <h4>Ngày tạo</h4>
                            <p>{formatDate(String(bookingTutor?.createdAt))}</p>
                        </div>

                        <div className="detail-item detail-item-schedule">
                            <h4>Lịch học chi tiết</h4>

                            {[...(bookingTutor?.schedules || [])]
                                .sort(
                                    (a, b) =>
                                        sortOrder.indexOf(a.dayOfWeek) -
                                        sortOrder.indexOf(b.dayOfWeek)
                                )
                                .map((s, index) => (
                                    <div key={index} className="schedule-item">
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
                        onClick={() => setIsUpdateBookingTutorModalOpen(true)}
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
                        onClick={() => setIsCancelBookingTutorModalOpen(true)}
                    >
                        Huỷ lịch
                    </button>
                )}
            </div>

            <UpdateBookingTutorForStudentModal
                isOpen={isUpdateBookingTutorModalOpen}
                setIsOpen={setIsUpdateBookingTutorModalOpen}
                selectedBooking={bookingTutor}
            />
        </>
    );

    /* ================================
       Main return
    ================================= */
    return (
        <div className="student-booking-tutor">
            {!id ? renderBookingList() : renderBookingDetail()}

            <CancelBookingTutorForStudent
                isOpen={isCancelBookingTutorModalOpen}
                setIsOpen={setIsCancelBookingTutorModalOpen}
                requestId={bookingTutor?.id!}
            />
        </div>
    );
};

export default StudentBookingTutor;
