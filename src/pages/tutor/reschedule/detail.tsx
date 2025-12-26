import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListReschedule, selectUserLogin } from "../../../app/selector";
import {
    acceptRescheduleApiThunk,
    getAllRescheduleApiThunk,
    rejectRescheduleApiThunk,
} from "../../../services/reschedule/rescheduleThunk";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { formatDate, formatTime } from "../../../utils/helper";
import { Modal } from "../../../components/modal";
import { LoadingSpinner } from "../../../components/elements";
import { toast } from "react-toastify";
import { get } from "lodash";

const TutorDetailReschedulePage: FC = () => {
    const dispatch = useAppDispatch();
    const id = useParams().id;

    const userLogin = useAppSelector(selectUserLogin);
    const reschedules = useAppSelector(selectListReschedule);
    const reschedule = reschedules?.find((item) => item.id === id);

    const isTutorReschedule = reschedule?.requesterName !== userLogin?.username;

    const [isSubmittingAccept, setIsSubmittingAccept] = useState(false);
    const [isSubmittingReject, setIsSubmittingReject] = useState(false);
    const [isAcceptRescheduleOpen, setIsAcceptRescheduleOpen] = useState(false);
    const [isRejectRescheduleOpen, setIsRejectRescheduleOpen] = useState(false);

    useEffect(() => {
        dispatch(getAllRescheduleApiThunk());
    }, [dispatch]);

    const handleAcceptReschedule = async () => {
        setIsSubmittingAccept(true);
        await dispatch(acceptRescheduleApiThunk(id!))
            .unwrap()
            .then((res) => {
                const message = get(res, "data.message", "Đồng ý dời lịch");
                toast.success(message);
                setIsAcceptRescheduleOpen(false);
                navigateHook(routes.tutor.reschedule.list);
                dispatch(getAllRescheduleApiThunk());
            })
            .catch((error) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                setIsSubmittingAccept(false);
            });
    };

    const handleRejectReschedule = async () => {
        setIsSubmittingReject(true);
        await dispatch(rejectRescheduleApiThunk(id!))
            .unwrap()
            .then((res) => {
                const message = get(res, "data.message", "Từ chối dời lịch");
                toast.success(message);
                setIsRejectRescheduleOpen(false);
                navigateHook(routes.tutor.reschedule.list);
                dispatch(getAllRescheduleApiThunk());
            })
            .catch((error) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                setIsSubmittingReject(false);
            });
    };

    return (
        <section id="tutor-detail-reschedule-section">
            <div className="tdrs-container">
                <div className="tdrscr1">
                    <h4>Chi tiết</h4>
                    <p>
                        Trang tổng quát <span>Đơn dời lịch dạy</span>
                    </p>
                </div>

                <div className="tdrscr3">
                    <button
                        className="pr-btn"
                        onClick={() =>
                            navigateHook(routes.tutor.reschedule.list)
                        }
                    >
                        Quay lại
                    </button>
                </div>

                <div className="tdrscr4">
                    <div className="tdrscr4r1">
                        <div className="detail-reschedule">
                            {/* NHÓM 1: Thông tin học sinh */}
                            <div className="detail-group">
                                <h3 className="group-title">
                                    Thông tin yêu cầu
                                </h3>
                                <div className="group-content">
                                    <div className="detail-item">
                                        <h4>Người gửi</h4>
                                        <p>{reschedule?.requesterName}</p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Lí do</h4>
                                        <p>{reschedule?.reason}</p>
                                    </div>
                                </div>
                            </div>

                            {/* NHÓM 2: Thông tin gia sư */}
                            <div className="detail-group">
                                <h3 className="group-title">Lịch học cũ</h3>
                                <div className="group-content">
                                    <div className="detail-item">
                                        <h4>Ngày</h4>
                                        <p>
                                            {formatDate(
                                                reschedule?.oldStartTime!
                                            )}
                                        </p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Giờ bắt đầu</h4>
                                        <p>
                                            {formatTime(
                                                reschedule?.oldStartTime!
                                            )}
                                        </p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Giờ kết thúc</h4>
                                        <p>
                                            {formatTime(
                                                reschedule?.oldEndTime!
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* NHÓM 2: Thông tin gia sư */}
                            <div className="detail-group">
                                <h3 className="group-title">Lịch học mới</h3>
                                <div className="group-content">
                                    <div className="detail-item">
                                        <h4>Ngày</h4>
                                        <p>
                                            {formatDate(
                                                reschedule?.newStartTime!
                                            )}
                                        </p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Giờ bắt đầu</h4>
                                        <p>
                                            {formatTime(
                                                reschedule?.newStartTime!
                                            )}
                                        </p>
                                    </div>

                                    <div className="detail-item">
                                        <h4>Giờ kết thúc</h4>
                                        <p>
                                            {formatTime(
                                                reschedule?.newEndTime!
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isTutorReschedule && reschedule?.status === "Pending" && (
                        <div className="tdrscr4r2">
                            <button
                                className="pr-btn"
                                onClick={() => {
                                    setIsAcceptRescheduleOpen(true);
                                }}
                            >
                                Đồng ý
                            </button>

                            <button
                                className="delete-btn"
                                onClick={() => {
                                    setIsRejectRescheduleOpen(true);
                                }}
                            >
                                Từ chối
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Modal
                isOpen={isAcceptRescheduleOpen}
                setIsOpen={setIsAcceptRescheduleOpen}
                title={"Chấp thuận lịch đặt"}
            >
                <section id="tutor-accept-booking">
                    <div className="tab-container">
                        <h3>Bạn có chắc chắn đồng ý dời lịch dạy này không?</h3>
                        <div className="group-btn">
                            <button className="sc-btn">Hủy</button>
                            <button
                                className={
                                    isSubmittingAccept
                                        ? "disable-btn"
                                        : "pr-btn"
                                }
                                onClick={() => handleAcceptReschedule()}
                            >
                                {isSubmittingAccept ? (
                                    <>
                                        <LoadingSpinner />
                                    </>
                                ) : (
                                    "Đồng ý"
                                )}
                            </button>
                        </div>
                    </div>
                </section>
            </Modal>
            <Modal
                isOpen={isRejectRescheduleOpen}
                setIsOpen={setIsRejectRescheduleOpen}
                title={"Từ chối lịch đặt"}
            >
                <section id="tutor-accept-booking">
                    <div className="tab-container">
                        <h3>
                            Bạn có chắc chắn từ chối dời lịch dạy này không?
                        </h3>
                        <div className="group-btn">
                            <button className="sc-btn">Hủy</button>
                            <button
                                className={
                                    isSubmittingReject
                                        ? "disable-btn"
                                        : "delete-btn"
                                }
                                onClick={() => handleRejectReschedule()}
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
        </section>
    );
};

export default TutorDetailReschedulePage;
