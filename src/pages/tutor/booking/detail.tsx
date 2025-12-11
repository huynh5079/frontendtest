import { useEffect, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectBalance,
    selectDetailBookingForTutor,
} from "../../../app/selector";
import {
    acceptBookingForTutorApiThunk,
    getDetailBookingForTutorApiThunk,
    rejectBookingForTutorApiThunk,
} from "../../../services/tutor/booking/bookingThunk";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import {
    formatDate,
    getStatusText,
    useDocumentTitle,
} from "../../../utils/helper";
import { toast } from "react-toastify";
import { get } from "lodash";
import { LoadingSpinner } from "../../../components/elements";
import { Modal, RemindWalletModal } from "../../../components/modal";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import {
    checkBalanceApiThunk,
    tranferToAdminApiThunk,
} from "../../../services/wallet/walletThunk";
import { WalletBalance } from "../../../types/wallet";

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

const sortOrder = [1, 2, 3, 4, 5, 6, 0]; // Thứ 2 → Thứ 7 → Chủ Nhật

const DetailTutorBookingPage: FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const booking = useAppSelector(selectDetailBookingForTutor);
    const [isSubmittingAccept, setIsSubmittingAccept] = useState(false);
    const [isSubmittingReject, setIsSubmittingReject] = useState(false);
    const [isAcceptBookingOpen, setIsAcceptBookingOpen] = useState(false);
    const [isRejectBookingOpen, setIsRejectBookingOpen] = useState(false);
    const [meetingLink, setMeetingLink] = useState<string | null>(null);
    const depositFee = booking?.budget ? booking.budget * 0.2 : 0;
    const balance: WalletBalance | null = useAppSelector(selectBalance);
    const [isRemindWalletOpen, setIsRemindWalletOpen] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getDetailBookingForTutorApiThunk(id));
            dispatch(checkBalanceApiThunk());
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (!isAcceptBookingOpen) setMeetingLink("");
    }, [isAcceptBookingOpen]);

    const handleAcceptBooking = async (bookingId: string) => {
        setIsSubmittingAccept(true);

        if (balance?.balance && balance.balance < depositFee) {
            setIsRemindWalletOpen(true);
            setIsSubmittingAccept(false);
            return;
        }

        dispatch(
            tranferToAdminApiThunk({
                Amount: depositFee,
                Note: "Phí chấp nhận lịch dạy",
            })
        )
            .unwrap()
            .then(() => {
                dispatch(
                    acceptBookingForTutorApiThunk({
                        boookingId: bookingId,
                        params: {
                            status: "Active",
                            meetingLink: meetingLink!,
                        },
                    })
                )
                    .unwrap()
                    .then((res) => {
                        toast.success(
                            get(res, "data.message", "Đặt lịch thành công")
                        );
                        dispatch(getDetailBookingForTutorApiThunk(id!));
                    })
                    .catch((err) => {
                        toast.error(get(err, "data.message", "Có lỗi xảy ra"));
                    });
            })
            .catch((err) => {
                toast.error(get(err, "data.message", "Có lỗi xảy ra"));
            })
            .finally(() => {
                setIsSubmittingAccept(false);
                setIsAcceptBookingOpen(false);
                dispatch(getDetailBookingForTutorApiThunk(id!));
            });
    };

    const handleRejectBooking = async (bookingId: string) => {
        setIsSubmittingReject(true);
        await dispatch(rejectBookingForTutorApiThunk(bookingId))
            .unwrap()
            .then((res) => {
                const message = get(res, "data.message", "Từ chối thành công");
                toast.success(message);
            })
            .catch((error) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                setIsSubmittingReject(false);
                setIsRejectBookingOpen(false);
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
                        <div className="detail-tutor-booking">
                            {/* NHÓM 1: Thông tin học sinh */}
                            <div className="detail-group">
                                <h3 className="group-title">
                                    Thông tin học sinh
                                </h3>
                                <div className="group-content">
                                    <div className="detail-item">
                                        <h4>Học sinh</h4>
                                        <p>{booking?.studentName}</p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Mô tả</h4>
                                        <p>{booking?.description}</p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Yêu cầu đặc biệt</h4>
                                        <p>{booking?.specialRequirements}</p>
                                    </div>
                                </div>
                            </div>

                            {/* NHÓM 2: Thông tin gia sư */}
                            <div className="detail-group">
                                <h3 className="group-title">
                                    Thông tin gia sư
                                </h3>
                                <div className="group-content">
                                    <div className="detail-item">
                                        <h4>Gia sư</h4>
                                        <p>{booking?.tutorName}</p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Môn học</h4>
                                        <p>{booking?.subject}</p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Cấp bậc học</h4>
                                        <p>{booking?.educationLevel}</p>
                                    </div>
                                </div>
                            </div>

                            {/* NHÓM 3: Hình thức & Học phí */}
                            <div className="detail-group">
                                <h3 className="group-title">
                                    Hình thức học & học phí
                                </h3>
                                <div className="group-content">
                                    <div className="detail-item">
                                        <h4>Hình thức học</h4>
                                        <p>{booking?.mode}</p>
                                    </div>

                                    {booking?.mode === "Offline" && (
                                        <div className="detail-item">
                                            <h4>Địa điểm</h4>
                                            <p>{booking?.location}</p>
                                        </div>
                                    )}

                                    <div className="detail-item">
                                        <h4>Học phí</h4>
                                        <p>
                                            {booking?.budget?.toLocaleString()}{" "}
                                            VNĐ
                                        </p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Trạng thái</h4>
                                        <p>{getStatusText(booking?.status)}</p>
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
                                                String(booking?.classStartDate)
                                            )}
                                        </p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Ngày hết hạn</h4>
                                        <p>
                                            {formatDate(
                                                String(booking?.expiryDate)
                                            )}
                                        </p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Ngày tạo</h4>
                                        <p>
                                            {formatDate(
                                                String(booking?.createdAt)
                                            )}
                                        </p>
                                    </div>

                                    <div className="detail-item detail-item-schedule">
                                        <h4>Lịch học chi tiết</h4>

                                        {[...(booking?.schedules || [])]
                                            .sort(
                                                (a, b) =>
                                                    sortOrder.indexOf(
                                                        a.dayOfWeek
                                                    ) -
                                                    sortOrder.indexOf(
                                                        b.dayOfWeek
                                                    )
                                            )
                                            .map((s, index) => (
                                                <div
                                                    key={index}
                                                    className="schedule-item"
                                                >
                                                    <p className="schedule-day">
                                                        {
                                                            daysOfWeek[
                                                                s.dayOfWeek
                                                            ]
                                                        }
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
                    {booking?.status === "Pending" && (
                        <div className="dtbscr4r2">
                            <button
                                className="pr-btn"
                                onClick={() => setIsAcceptBookingOpen(true)}
                            >
                                Chấp thuận
                            </button>
                            <button
                                className="delete-btn"
                                onClick={() => setIsRejectBookingOpen(true)}
                            >
                                Từ chối
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Modal
                isOpen={isAcceptBookingOpen}
                setIsOpen={setIsAcceptBookingOpen}
                title={"Chấp thuận lịch đặt"}
            >
                <section id="tutor-accept-booking">
                    <div className="tab-container">
                        <h3>
                            Bạn có chắc chắn muốn chấp thuận lịch đặt này không?
                        </h3>
                        {booking?.mode === "Online" && (
                            <div className="form">
                                <h4>
                                    Nếu hình thức học là học trực tuyến vui lòng
                                    cung cấp link học
                                </h4>
                                <div className="form-field">
                                    <label className="form-label">
                                        Link học
                                    </label>
                                    <div className="form-input-container">
                                        <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Vui lòng cung cấp link học"
                                            value={meetingLink || ""}
                                            onChange={(e) =>
                                                setMeetingLink(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        <p>
                            Nếu bạn đồng ý với lịch dạy này, vui lòng thanh toán
                            trước học phí để xác nhận lớp. Lưu ý: khoản phí này
                            chỉ thanh toán một lần duy nhất và không hoàn lại.
                            Trong trường hợp sau khi xác nhận lớp mà hủy, phí
                            này sẽ không được hoàn trả
                        </p>
                        <div className="fee">
                            <h5>Phí chấp nhận (20% học phí)</h5>
                            <span>
                                {depositFee
                                    ? `${depositFee.toLocaleString()} VNĐ`
                                    : "Không có"}
                            </span>
                        </div>
                        <div className="group-btn">
                            <button className="sc-btn">Hủy</button>
                            <button
                                className={
                                    isSubmittingAccept
                                        ? "disable-btn"
                                        : "pr-btn"
                                }
                                onClick={() =>
                                    handleAcceptBooking(booking?.id!)
                                }
                            >
                                {isSubmittingAccept ? (
                                    <>
                                        <LoadingSpinner />
                                    </>
                                ) : (
                                    "Chấp thuận"
                                )}
                            </button>
                        </div>
                    </div>
                </section>
            </Modal>
            <Modal
                isOpen={isRejectBookingOpen}
                setIsOpen={setIsRejectBookingOpen}
                title={"Từ chối lịch đặt"}
            >
                <section id="tutor-accept-booking">
                    <div className="tab-container">
                        <h3>
                            Bạn có chắc chắn muốn từ chối lịch đặt này không?
                        </h3>
                        <div className="group-btn">
                            <button className="sc-btn">Hủy</button>
                            <button
                                className={
                                    isSubmittingReject
                                        ? "disable-btn"
                                        : "delete-btn"
                                }
                                onClick={() =>
                                    handleRejectBooking(booking?.id!)
                                }
                            >
                                {isSubmittingReject ? (
                                    <>
                                        <LoadingSpinner />
                                    </>
                                ) : (
                                    "Từ chối"
                                )}
                            </button>
                        </div>
                    </div>
                </section>
            </Modal>
            <RemindWalletModal
                isOpen={isRemindWalletOpen}
                setIsOpen={setIsRemindWalletOpen}
                routes={routes.tutor.wallet}
            />
        </section>
    );
};

export default DetailTutorBookingPage;
