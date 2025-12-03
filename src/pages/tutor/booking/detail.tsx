import { useEffect, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectDetailBookingForTutor } from "../../../app/selector";
import {
    acceptBookingForTutorApiThunk,
    getDetailBookingForTutorApiThunk,
    rejectBookingForTutorApiThunk,
} from "../../../services/tutor/booking/bookingThunk";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import { toast } from "react-toastify";
import { get } from "lodash";
import { LoadingSpinner } from "../../../components/elements";

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

const DetailTutorBookingPage: FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const booking = useAppSelector(selectDetailBookingForTutor);
    const [isSubmittingAccept, setIsSubmittingAccept] = useState(false);
    const [isSubmittingReject, setIsSubmittingReject] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getDetailBookingForTutorApiThunk(id));
        }
    }, [dispatch, id]);

    // Hàm hiển thị "Không có" nếu giá trị rỗng
    const show = (value: any): string => {
        if (value === null || value === undefined || value === "")
            return "Không có";
        return String(value);
    };

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

    const handleAcceptBooking = async (bookingId: string) => {
        setIsSubmittingAccept(true);
        await dispatch(acceptBookingForTutorApiThunk(bookingId))
            .unwrap()
            .then((res) => {
                const message = get(res, "data.message", "Xử lí thành công");
                toast.success(message);
            })
            .catch((error) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                setIsSubmittingAccept(false);
                dispatch(getDetailBookingForTutorApiThunk(id!));
            });
    };

    const handleRejectBooking = async (bookingId: string) => {
        setIsSubmittingReject(true);
        await dispatch(rejectBookingForTutorApiThunk(bookingId))
            .unwrap()
            .then((res) => {
                const message = get(res, "data.message", "Xử lí thành công");
                toast.success(message);
            })
            .catch((error) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                setIsSubmittingReject(false);
                dispatch(getDetailBookingForTutorApiThunk(id!));
            });
    };

    useDocumentTitle("Chi tiết lịch đặt");

    return (
        <section id="detail-tutor-booking-section">
            <div className="dtbs-container">
                <div className="dtbscr1">
                    <h4>Chi tiết</h4>
                    <p>
                        Trang tổng quát <span>Lịch đặt</span>
                    </p>
                </div>

                <div className="dtbscr3">
                    <button
                        className="pr-btn"
                        onClick={() => navigateHook(routes.tutor.booking.list)}
                    >
                        Quay lại
                    </button>
                </div>

                <div className="dtbscr4">
                    <div className="dtbscr4r1">
                        <div className="dtbscr4r1c1">
                            <h4>Học sinh</h4>
                            <p>{show(booking?.studentName)}</p>

                            <h4>Gia sư</h4>
                            <p>{show(booking?.tutorName)}</p>

                            <h4>Mô tả</h4>
                            <p>{show(booking?.description)}</p>

                            <h4>Địa điểm</h4>
                            <p>{show(booking?.location)}</p>

                            <h4>Yêu cầu đặc biệt</h4>
                            <p>{show(booking?.specialRequirements)}</p>

                            <h4>Ngày bắt đầu</h4>
                            <p>
                                {booking?.classStartDate
                                    ? formatDate(String(booking.classStartDate))
                                    : "Không có"}
                            </p>

                            <h4>Ngày hết hạn</h4>
                            <p>
                                {booking?.expiryDate
                                    ? formatDate(String(booking.expiryDate))
                                    : "Không có"}
                            </p>

                            <h4>Ngày tạo</h4>
                            <p>
                                {booking?.createdAt
                                    ? formatDate(String(booking.createdAt))
                                    : "Không có"}
                            </p>
                        </div>

                        <div className="dtbscr4r1c2">
                            <h4>Môn học</h4>
                            <p>{show(booking?.subject)}</p>

                            <h4>Cấp bậc học</h4>
                            <p>{show(booking?.educationLevel)}</p>

                            <h4>Hình thức học</h4>
                            <p>{show(booking?.mode)}</p>

                            <h4>Học phí</h4>
                            <p>
                                {booking?.budget
                                    ? `${booking.budget.toLocaleString()} VNĐ`
                                    : "Không có"}
                            </p>

                            <h4>Trạng thái</h4>
                            <p>{getStatusText(booking?.status)}</p>

                            <h4>Lịch học</h4>
                            {booking?.schedules &&
                            booking.schedules.length > 0 ? (
                                [...booking.schedules]
                                    .sort((a, b) => {
                                        const order = [1, 2, 3, 4, 5, 6, 0];
                                        return (
                                            order.indexOf(a.dayOfWeek) -
                                            order.indexOf(b.dayOfWeek)
                                        );
                                    })
                                    .map((s, index) => (
                                        <div key={index}>
                                            <h4>{daysOfWeek[s.dayOfWeek]}</h4>
                                            <p>
                                                {show(s.startTime)} →{" "}
                                                {show(s.endTime)}
                                            </p>
                                        </div>
                                    ))
                            ) : (
                                <p>Không có</p>
                            )}
                        </div>
                    </div>
                    <div className="dtbscr4r2">
                        <button
                            className={
                                isSubmittingAccept ? "disable-btn" : "pr-btn"
                            }
                            onClick={() =>
                                handleAcceptBooking(String(booking?.id))
                            }
                        >
                            {isSubmittingAccept ? (
                                <LoadingSpinner />
                            ) : (
                                "Chấp thuận"
                            )}
                        </button>
                        <button
                            className={
                                isSubmittingReject
                                    ? "disable-btn"
                                    : "delete-btn"
                            }
                            onClick={() =>
                                handleRejectBooking(String(booking?.id))
                            }
                        >
                            {isSubmittingReject ? (
                                <LoadingSpinner />
                            ) : (
                                "Từ chối"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetailTutorBookingPage;
