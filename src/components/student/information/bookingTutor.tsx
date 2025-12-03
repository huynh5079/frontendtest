import { useEffect, useState, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectDetailClassRequestForStudent,
    selectListClassRequestForStudent,
} from "../../../app/selector";
import {
    getAllClassRequestForStudentApiThunk,
    getDetailClassRequestForStudentApiThunk,
} from "../../../services/student/bookingTutor/bookingTutorThunk";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    CancelBookingTutorForStudent,
    UpdateBookingTutorForStudentModal,
} from "../../modal";

const StudentBookingTutor: FC = () => {
    const dispatch = useAppDispatch();
    const bookingTutors = useAppSelector(
        selectListClassRequestForStudent,
    )?.filter((bookingTutor) => bookingTutor.tutorName !== null);
    const bookingTutor = useAppSelector(selectDetailClassRequestForStudent);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [isUpdateBookingTutorModalOpen, setIsUpdateBookingTutorModalOpen] =
        useState(false);
    const [isCancelBookingTutorModalOpen, setIsCancelBookingTutorModalOpen] =
        useState(false);

    // Load danh sách
    useEffect(() => {
        dispatch(getAllClassRequestForStudentApiThunk());
    }, [dispatch]);

    // Load chi tiết khi có id
    useEffect(() => {
        if (id) {
            dispatch(getDetailClassRequestForStudentApiThunk(id));
        }
    }, [dispatch, id]);

    const handleViewDetail = (id: string) => {
        navigate(`/student/information?tab=booking_tutor&id=${id}`);
    };

    const handleBack = () => {
        navigate(`/student/information?tab=booking_tutor`);
    };

    // Bảng ngày trong tuần (0-6)
    const daysOfWeek = [
        "Chủ Nhật",
        "Thứ Hai",
        "Thứ Ba",
        "Thứ Tư",
        "Thứ Năm",
        "Thứ Sáu",
        "Thứ Bảy",
    ];

    const getStatusText = (status: string | null | undefined): string => {
        switch (status) {
            case "Pending":
                return "Chờ xử lý";
            case "Approved":
                return "Đã chấp thuận";
            case "Rejected":
                return "Đã từ chối";
            default:
                return "Không có";
        }
    };

    useDocumentTitle("Danh sách lịch đặt gia sư");

    return (
        <div className="student-booking-tutor">
            {!id ? (
                <>
                    <h3>Danh sách lịch đặt gia sư</h3>
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">Tên gia sư</th>
                                <th className="table-head-cell">Môn học</th>
                                <th className="table-head-cell">Cấp bậc học</th>
                                <th className="table-head-cell">
                                    Thời gian đặt lịch
                                </th>
                                <th className="table-head-cell">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {bookingTutors?.map((bookingTutor) => (
                                <tr key={bookingTutor.id}>
                                    <td className="table-body-cell">
                                        {bookingTutor.tutorName}
                                    </td>
                                    <td className="table-body-cell">
                                        {bookingTutor.subject}
                                    </td>
                                    <td className="table-body-cell">
                                        {bookingTutor.educationLevel}
                                    </td>
                                    <td className="table-body-cell">
                                        {formatDate(bookingTutor.createdAt)}
                                    </td>
                                    <td className="table-body-cell">
                                        <button
                                            className="pr-btn"
                                            onClick={() =>
                                                handleViewDetail(
                                                    bookingTutor.id,
                                                )
                                            }
                                        >
                                            Chi tiết
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                setIsCancelBookingTutorModalOpen(
                                                    true,
                                                )
                                            }
                                        >
                                            Huỷ lịch
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <>
                    <h3>Chi tiết lịch đặt gia sư</h3>
                    <div className="detail-booking-tutor">
                        <div className="dbtc1">
                            <h4>Học sinh</h4>
                            <p>{bookingTutor?.studentName}</p>

                            <h4>Gia sư</h4>
                            <p>{bookingTutor?.tutorName}</p>

                            <h4>Mô tả</h4>
                            <p>{bookingTutor?.description}</p>

                            <h4>Địa điểm</h4>
                            <p>{bookingTutor?.location}</p>

                            <h4>Yêu cầu đặc biệt</h4>
                            <p>{bookingTutor?.specialRequirements}</p>

                            <h4>Ngày bắt đầu</h4>
                            <p>
                                {formatDate(
                                    String(bookingTutor?.classStartDate),
                                )}
                            </p>

                            <h4>Ngày hết hạn</h4>
                            <p>
                                {formatDate(String(bookingTutor?.expiryDate))}
                            </p>

                            <h4>Ngày tạo</h4>
                            <p>{formatDate(String(bookingTutor?.createdAt))}</p>
                        </div>

                        <div className="dbtc2">
                            <h4>Môn học</h4>
                            <p>{bookingTutor?.subject}</p>

                            <h4>Cấp bậc học</h4>
                            <p>{bookingTutor?.educationLevel}</p>

                            <h4>Hình thức học</h4>
                            <p>{bookingTutor?.mode}</p>

                            <h4>Học phí</h4>
                            <p>{bookingTutor?.budget?.toLocaleString()} VNĐ</p>

                            <h4>Trạng thái</h4>
                            <p>{getStatusText(bookingTutor?.status)}</p>

                            <h4>Lịch học</h4>
                            {bookingTutor?.schedules?.map((s, index) => (
                                <div key={index}>
                                    <h4>{daysOfWeek[s.dayOfWeek]}</h4>
                                    <p>
                                        {s.startTime} → {s.endTime}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="group-btn mt-4">
                        <button
                            className="pr-btn"
                            onClick={() =>
                                setIsUpdateBookingTutorModalOpen(true)
                            }
                        >
                            Cập nhật
                        </button>
                        <button className="sc-btn" onClick={handleBack}>
                            Quay lại
                        </button>
                        <button
                            className="delete-btn"
                            onClick={() =>
                                setIsCancelBookingTutorModalOpen(true)
                            }
                        >
                            Huỷ lịch
                        </button>
                    </div>

                    <UpdateBookingTutorForStudentModal
                        isOpen={isUpdateBookingTutorModalOpen}
                        setIsOpen={setIsUpdateBookingTutorModalOpen}
                        selectedBooking={bookingTutor}
                    />
                </>
            )}
            <CancelBookingTutorForStudent
                isOpen={isCancelBookingTutorModalOpen}
                setIsOpen={setIsCancelBookingTutorModalOpen}
                requestId={String(bookingTutor?.id)}
            />
        </div>
    );
};

export default StudentBookingTutor;
