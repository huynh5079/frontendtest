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
    // Offline: chỉ cần phí kết nối 50k (backend xử lý), Online: cần 20% học phí
    const CONNECTION_FEE = 50000; // Phí kết nối cho offline
    const depositFee =
        booking?.mode === "Offline"
            ? CONNECTION_FEE
            : booking?.budget
            ? booking.budget * 0.2
            : 0;
    const balance: WalletBalance | null = useAppSelector(selectBalance);
    const [isRemindWalletOpen, setIsRemindWalletOpen] = useState(false);
    const [meetingLinkError, setMeetingLinkError] = useState<string | null>(
        null,
    );
    const [studentAddress, setStudentAddress] = useState<string | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const isValidMeetingLink = (url: string) => {
        const allowedDomains = [
            "meet.google.com",
            "zoom.us",
            "teams.microsoft.com",
        ];

        try {
            const parsedUrl = new URL(url);
            return allowedDomains.some((domain) =>
                parsedUrl.hostname.includes(domain),
            );
        } catch {
            return false;
        }
    };

    useEffect(() => {
        if (id) {
            dispatch(getDetailBookingForTutorApiThunk(id));
            dispatch(checkBalanceApiThunk());
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (!isAcceptBookingOpen) setMeetingLink("");
    }, [isAcceptBookingOpen]);

    const handleAccept = () => {
        if (booking?.mode === "Online") {
            if (!meetingLink) {
                setMeetingLinkError("Vui lòng nhập link học");
                return;
            }

            if (!isValidMeetingLink(meetingLink)) {
                setMeetingLinkError(
                    "Link học không hợp lệ (Zoom / Google Meet / Teams)",
                );
                return;
            }
        }

        setMeetingLinkError(null);
        handleAcceptBooking(booking?.id!);
    };

    const handleAcceptBooking = async (bookingId: string) => {
        setIsSubmittingAccept(true);

        // Kiểm tra số dư: Offline cần 50k, Online cần 20% học phí
        const requiredBalance =
            booking?.mode === "Offline" ? CONNECTION_FEE : depositFee;

        if (balance?.balance! < requiredBalance) {
            setIsRemindWalletOpen(true);
            setIsSubmittingAccept(false);
            return;
        }

        // Chỉ trừ tiền ở frontend nếu là Online (20% học phí)
        // Offline: backend sẽ tự động trừ phí kết nối 50k
        if (booking?.mode === "Online") {
            dispatch(
                tranferToAdminApiThunk({
                    Amount: depositFee,
                    Note: "Phí chấp nhận lịch dạy (20% học phí)",
                }),
            )
                .unwrap()
                .then(() => {
                    dispatch(
                        acceptBookingForTutorApiThunk({
                            boookingId: bookingId,
                            params: {
                                meetingLink: meetingLink || "",
                            },
                        }),
                    )
                        .unwrap()
                        .then((res) => {
                            const message = get(
                                res,
                                "data.message",
                                "Đặt lịch thành công",
                            );
                            toast.success(message);
                            dispatch(getDetailBookingForTutorApiThunk(id!));
                        })
                        .catch((err) => {
                            toast.error(
                                get(err, "data.message", "Có lỗi xảy ra"),
                            );
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
        } else {
            // Offline: backend tự động trừ phí kết nối, không cần trừ ở frontend
            dispatch(
                acceptBookingForTutorApiThunk({
                    boookingId: bookingId,
                    params: {
                        meetingLink: "",
                    },
                }),
            )
                .unwrap()
                .then((res) => {
                    const message = get(
                        res,
                        "data.message",
                        "Đặt lịch thành công",
                    );
                    const address = get(res, "data.studentAddress", null);

                    toast.success(message);

                    // Nếu là offline và có địa chỉ học sinh, hiển thị modal
                    if (booking?.mode === "Offline" && address) {
                        setStudentAddress(address);
                        setIsAddressModalOpen(true);
                    }

                    dispatch(getDetailBookingForTutorApiThunk(id!));
                })
                .catch((err) => {
                    toast.error(get(err, "data.message", "Có lỗi xảy ra"));
                })
                .finally(() => {
                    setIsSubmittingAccept(false);
                    setIsAcceptBookingOpen(false);
                    dispatch(getDetailBookingForTutorApiThunk(id!));
                });
        }
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

                                    {booking?.specialRequirements && (
                                        <div className="detail-item">
                                            <h4>Yêu cầu đặc biệt</h4>
                                            <p>
                                                {booking?.specialRequirements}
                                            </p>
                                        </div>
                                    )}

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

                                    {booking?.mode === "Offline" &&
                                        booking?.status !== "Pending" &&
                                        booking?.location && (
                                            <div className="detail-item">
                                                <h4>Địa điểm</h4>
                                                <p>{booking?.location}</p>
                                            </div>
                                        )}
                                    {booking?.mode === "Offline" &&
                                        booking?.status === "Pending" && (
                                            <div className="detail-item">
                                                <h4>Địa điểm</h4>
                                                <p className="text-muted">
                                                    Địa chỉ sẽ được hiển thị sau
                                                    khi bạn thanh toán phí kết
                                                    nối
                                                </p>
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
                                                String(booking?.classStartDate),
                                            )}
                                        </p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Ngày hết hạn</h4>
                                        <p>
                                            {formatDate(
                                                String(booking?.expiryDate),
                                            )}
                                        </p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Ngày tạo</h4>
                                        <p>
                                            {formatDate(
                                                String(booking?.createdAt),
                                            )}
                                        </p>
                                    </div>

                                    <div className="detail-item detail-item-schedule">
                                        <h4>Lịch học chi tiết</h4>

                                        {[...(booking?.schedules || [])]
                                            .sort(
                                                (a, b) =>
                                                    sortOrder.indexOf(
                                                        a.dayOfWeek,
                                                    ) -
                                                    sortOrder.indexOf(
                                                        b.dayOfWeek,
                                                    ),
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
                                Chấp nhận
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
                title={"Chấp nhận lịch đặt"}
            >
                <section id="tutor-accept-booking">
                    <div className="tab-container">
                        <h3>
                            Bạn có chắc chắn muốn chấp nhận lịch đặt này không?
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
                                    {meetingLinkError && (
                                        <p className="text-error">
                                            {meetingLinkError}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        {booking?.mode === "Online" ? (
                            <>
                                <p>
                                    Nếu bạn đồng ý với lịch dạy này, vui lòng
                                    thanh toán trước học phí để xác nhận lớp.
                                    Lưu ý: khoản phí này chỉ thanh toán một lần
                                    duy nhất và không hoàn lại. Trong trường hợp
                                    sau khi xác nhận lớp mà hủy, phí này sẽ
                                    không được hoàn trả
                                </p>
                                <div className="fee">
                                    <h5>Phí chấp nhận (20% học phí)</h5>
                                    <span>
                                        {depositFee
                                            ? `${depositFee.toLocaleString()} VNĐ`
                                            : "Không có"}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <p>
                                    Nếu bạn đồng ý với lịch dạy này, vui lòng
                                    thanh toán phí kết nối để xác nhận lớp. Lưu
                                    ý: khoản phí này chỉ thanh toán một lần duy
                                    nhất và không hoàn lại. Sau khi chấp nhận,
                                    bạn sẽ nhận được địa chỉ của học sinh.
                                </p>
                                <div className="fee">
                                    <h5>Phí kết nối</h5>
                                    <span>
                                        {CONNECTION_FEE.toLocaleString()} VNĐ
                                    </span>
                                </div>
                            </>
                        )}
                        <div className="group-btn">
                            <button className="sc-btn">Hủy</button>
                            <button
                                className={
                                    isSubmittingAccept ||
                                    (booking?.mode === "Online" && !meetingLink)
                                        ? "disable-btn"
                                        : "pr-btn"
                                }
                                disabled={
                                    isSubmittingAccept ||
                                    (booking?.mode === "Online" && !meetingLink)
                                }
                                onClick={handleAccept}
                            >
                                {isSubmittingAccept ? (
                                    <>
                                        <LoadingSpinner />
                                    </>
                                ) : (
                                    "Chấp nhận"
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
            <Modal
                isOpen={isAddressModalOpen}
                setIsOpen={setIsAddressModalOpen}
                title={"Địa chỉ học sinh"}
            >
                <section id="student-address-modal">
                    <div className="tab-container">
                        <h3>Địa chỉ học sinh:</h3>
                        <div className="address-info">
                            <p>{studentAddress}</p>
                        </div>
                        <div className="group-btn">
                            <button
                                className="pr-btn"
                                onClick={() => setIsAddressModalOpen(false)}
                            >
                                Đã hiểu
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
