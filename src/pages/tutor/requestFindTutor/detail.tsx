import { useEffect, useState, type FC } from "react";
import { LoadingSpinner } from "../../../components/elements";
import {
    formatDate,
    getStatusText,
    useDocumentTitle,
} from "../../../utils/helper";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectBalance,
    selectDetailRequestFindTutorForTutor,
    selectListApplyRequestFindTutorForTutor,
} from "../../../app/selector";
import {
    applyRequestFindTutorForTutorApiThunk,
    getApplyRequestFindTutorForTutorApiThunk,
    getDetailRequestFindTutorForTutorApiThunk,
    withdrawApplyRequestFindTutorForTutorApiThunk,
} from "../../../services/tutor/requestFindTutor/requestFindTutorThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
import { Modal, RemindWalletModal } from "../../../components/modal";
import { WalletBalance } from "../../../types/wallet";
import {
    checkBalanceApiThunk,
    tranferToAdminApiThunk,
} from "../../../services/wallet/walletThunk";

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

const DetailRequestFindtutorForTutorPage: FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const request = useAppSelector(selectDetailRequestFindTutorForTutor);
    const applyRequests = useAppSelector(
        selectListApplyRequestFindTutorForTutor
    );
    const applyFee = 50000;
    const balance: WalletBalance | null = useAppSelector(selectBalance);

    const isApply = applyRequests?.some(
        (applyRequest) => applyRequest.classRequestId === id
    );

    const cuurentApplyId = applyRequests?.find(
        (applyRequest) => applyRequest.classRequestId === id
    )?.id;

    const [isSubmittingApply, setIsSubmittingApply] = useState(false);
    const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);
    const [isApplyRequestOpen, setIsApplyRequestOpen] = useState(false);
    const [isWithdrawRequestOpen, setIsWithdrawRequestOpen] = useState(false);
    const [isRemindWalletOpen, setIsRemindWalletOpen] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getDetailRequestFindTutorForTutorApiThunk(id));
            dispatch(getApplyRequestFindTutorForTutorApiThunk());
            dispatch(checkBalanceApiThunk());
        }
    }, [dispatch, id]);

    // Hàm hiển thị "Không có" nếu giá trị rỗng
    const show = (value: any): string => {
        if (value === null || value === undefined || value === "")
            return "Không có";
        return String(value);
    };

    const handleWithdraw = async (applyId: string) => {
        if (id) {
            setIsSubmittingWithdraw(true);
            await dispatch(
                withdrawApplyRequestFindTutorForTutorApiThunk(applyId)
            )
                .unwrap()
                .then((res) => {
                    const message = get(
                        res,
                        "data.message",
                        "Đã rút đơn ứng tuyển"
                    );
                    toast.success(message);
                })
                .catch((error) => {
                    const errorData = get(
                        error,
                        "data.message",
                        "Có lỗi xảy ra"
                    );
                    toast.error(errorData);
                })
                .finally(() => {
                    setIsSubmittingWithdraw(false);
                    setIsWithdrawRequestOpen(false);
                    dispatch(getDetailRequestFindTutorForTutorApiThunk(id));
                    dispatch(getApplyRequestFindTutorForTutorApiThunk());
                });
        }
    };

    const handleApply = async () => {
        if (id) {
            setIsSubmittingApply(true);

            if (balance?.balance && balance.balance < applyFee) {
                setIsRemindWalletOpen(true);
                setIsSubmittingApply(false);
                return;
            }

            dispatch(
                tranferToAdminApiThunk({
                    Amount: applyFee,
                    Note: "Phí chấp nhận lịch dạy",
                })
            )
                .unwrap()
                .then(() => {
                    dispatch(
                        applyRequestFindTutorForTutorApiThunk({
                            classRequestId: id,
                        })
                    )
                        .unwrap()
                        .then((res) => {
                            toast.success(
                                get(res, "data.message", "Ứng tuyển thành công")
                            );
                        })
                        .catch((err) => {
                            toast.error(
                                get(err, "data.message", "Có lỗi xảy ra")
                            );
                        })
                        .finally(() => {
                            setIsApplyRequestOpen(false);
                            setIsSubmittingApply(false);
                            dispatch(
                                getDetailRequestFindTutorForTutorApiThunk(id)
                            );
                            dispatch(
                                getApplyRequestFindTutorForTutorApiThunk()
                            );
                        });
                })
                .catch((err) => {
                    toast.error(get(err, "data.message", "Có lỗi xảy ra"));
                })
                .finally(() => {
                    setIsApplyRequestOpen(false);
                    setIsSubmittingApply(false);
                    dispatch(getDetailRequestFindTutorForTutorApiThunk(id));
                    dispatch(getApplyRequestFindTutorForTutorApiThunk());
                });
        }
    };

    useDocumentTitle("Chi tiết đơn tìm gia sư");

    return (
        <section id="detail-request-find-tutor-for-tutor-section">
            <div className="drftfts-container">
                <div className="drftftscr1">
                    <h4>Chi tiết</h4>
                    <p>
                        Trang tổng quát <span>Đơn tìm gia sư</span>
                    </p>
                </div>

                <div className="drftftscr3">
                    <button
                        className="pr-btn"
                        onClick={() => navigateHook(routes.tutor.request.list)}
                    >
                        Quay lại
                    </button>
                </div>

                <div className="drftftscr4">
                    <div className="drftftscr4r1">
                        <div className="detail-tutor-request">
                            {/* NHÓM 1: Thông tin học sinh */}
                            <div className="detail-group">
                                <h3 className="group-title">
                                    Thông tin học sinh
                                </h3>
                                <div className="group-content">
                                    <div className="detail-item">
                                        <h4>Học sinh</h4>
                                        <p>{request?.studentName}</p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Mô tả</h4>
                                        <p>{request?.description}</p>
                                    </div>

                                    {request?.specialRequirements && (
                                        <div className="detail-item">
                                            <h4>Yêu cầu đặc biệt</h4>
                                            <p>
                                                {request?.specialRequirements}
                                            </p>
                                        </div>
                                    )}
                                    <div className="detail-item">
                                        <h4>Môn học</h4>
                                        <p>{request?.subject}</p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Cấp bậc học</h4>
                                        <p>{request?.educationLevel}</p>
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
                                        <p>{request?.mode}</p>
                                    </div>

                                    {request?.mode === "Offline" && (
                                        <div className="detail-item">
                                            <h4>Địa điểm</h4>
                                            <p>{request?.location}</p>
                                        </div>
                                    )}

                                    <div className="detail-item">
                                        <h4>Học phí</h4>
                                        <p>
                                            {request?.budget?.toLocaleString()}{" "}
                                            VNĐ
                                        </p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Trạng thái</h4>
                                        <p>{getStatusText(request?.status)}</p>
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
                                                String(request?.classStartDate)
                                            )}
                                        </p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Ngày hết hạn</h4>
                                        <p>
                                            {formatDate(
                                                String(request?.expiryDate)
                                            )}
                                        </p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Ngày tạo</h4>
                                        <p>
                                            {formatDate(
                                                String(request?.createdAt)
                                            )}
                                        </p>
                                    </div>

                                    <div className="detail-item detail-item-schedule">
                                        <h4>Lịch học chi tiết</h4>

                                        {[...(request?.schedules || [])]
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
                    <div className="drftftscr4r2">
                        {!isApply ? (
                            <button
                                className="pr-btn"
                                onClick={() => setIsApplyRequestOpen(true)}
                            >
                                Ứng tuyển
                            </button>
                        ) : (
                            <>
                                <button className="disable-btn">
                                    Đã ứng tuyển
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => {
                                        setIsWithdrawRequestOpen(true);
                                    }}
                                >
                                    Rút đơn ứng tuyển
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isApplyRequestOpen}
                setIsOpen={setIsApplyRequestOpen}
                title={"Ứng tuyển yêu cầu"}
            >
                <section id="tutor-accept-booking">
                    <div className="tab-container">
                        <h3>
                            Bạn có chắc chắn muốn ứng tuyển yêu cầu này không?
                        </h3>
                        <p>
                            Nếu bạn ứng tuyển yêu cầu này, vui lòng trả phí để
                            có thể ứng tuyển. Lưu ý: Khi bạn rút khỏi ứng tuyển,
                            phí này sẽ không được hoàn trả
                        </p>
                        <div className="fee">
                            <h5>Phí ứng tuyển</h5>
                            <span>
                                {applyFee
                                    ? `${applyFee.toLocaleString()} VNĐ`
                                    : "Không có"}
                            </span>
                        </div>
                        <div className="group-btn">
                            <button className="sc-btn">Hủy</button>
                            <button
                                className={
                                    isSubmittingApply ? "disable-btn" : "pr-btn"
                                }
                                onClick={handleApply}
                            >
                                {isSubmittingApply ? (
                                    <>
                                        <LoadingSpinner />
                                    </>
                                ) : (
                                    "Ứng tuyển"
                                )}
                            </button>
                        </div>
                    </div>
                </section>
            </Modal>
            <Modal
                isOpen={isWithdrawRequestOpen}
                setIsOpen={setIsWithdrawRequestOpen}
                title={"Ứng tuyển yêu cầu"}
            >
                <section id="tutor-accept-request">
                    <div className="tab-container">
                        <h3>
                            Bạn có chắc chắn muốn rút ứng tuyển khỏi yêu cầu này
                            không?
                        </h3>
                        <p>
                            Lưu ý: Khi bạn rút khỏi ứng tuyển, phí ứng tuyển sẽ
                            không được hoàn trả
                        </p>
                        <div className="group-btn">
                            <button className="sc-btn">Hủy</button>
                            <button
                                className={
                                    isSubmittingWithdraw
                                        ? "disable-btn"
                                        : "delete-btn"
                                }
                                onClick={() => handleWithdraw(cuurentApplyId!)}
                            >
                                {isSubmittingWithdraw ? (
                                    <>
                                        <LoadingSpinner />
                                    </>
                                ) : (
                                    "Rút ứng tuyển"
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

export default DetailRequestFindtutorForTutorPage;
