import { FC, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListReschedule, selectUserLogin } from "../../../app/selector";
import {
    acceptRescheduleApiThunk,
    getAllRescheduleApiThunk,
    rejectRescheduleApiThunk,
} from "../../../services/reschedule/rescheduleThunk";
import {
    formatDate,
    formatTime,
    getStatusText,
    useDocumentTitle,
} from "../../../utils/helper";
import { navigateHook } from "../../../routes/routeApp";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { get } from "lodash";
import { Modal } from "../../modal";
import { LoadingSpinner } from "../../elements";

const ITEMS_PER_PAGE = 6;

const StudentListReschedule: FC = () => {
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const userLogin = useAppSelector(selectUserLogin);
    const reschedules = useAppSelector(selectListReschedule);
    const reschedule = reschedules?.find((item) => item.id === id);

    const isTutorReschedule = reschedule?.requesterName !== userLogin?.username;

    const [currentPage, setCurrentPage] = useState(1);
    const [tabSubActive, setTabSubActive] = useState("all");
    const [isSubmittingAccept, setIsSubmittingAccept] = useState(false);
    const [isSubmittingReject, setIsSubmittingReject] = useState(false);
    const [isAcceptRescheduleOpen, setIsAcceptRescheduleOpen] = useState(false);
    const [isRejectRescheduleOpen, setIsRejectRescheduleOpen] = useState(false);

    const filteredReschedules = useMemo(() => {
        if (!reschedules) return [];

        switch (tabSubActive) {
            case "personal":
                return reschedules.filter(
                    (item) => item.requesterName === userLogin?.username,
                );
            case "tutor":
                return reschedules.filter(
                    (item) => item.requesterName !== userLogin?.username,
                );
            default:
                return reschedules;
        }
    }, [reschedules, tabSubActive, userLogin]);

    useEffect(() => {
        dispatch(getAllRescheduleApiThunk());
    }, [dispatch]);

    /* Pagination */
    const totalPages = Math.ceil(
        (filteredReschedules.length || 0) / ITEMS_PER_PAGE,
    );

    const paginatedItems = filteredReschedules.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    const handleChangeTab = (tab: string) => {
        setTabSubActive(tab);
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleViewDetail = (id: string) =>
        navigateHook(`/student/information?tab=reschedule&id=${id}`);

    const handleBack = () =>
        navigateHook(`/student/information?tab=reschedule`);

    const handleAcceptReschedule = async () => {
        setIsSubmittingAccept(true);
        await dispatch(acceptRescheduleApiThunk(id!))
            .unwrap()
            .then((res) => {
                const message = get(res, "data.message", "Đồng ý dời lịch");
                toast.success(message);
                setIsAcceptRescheduleOpen(false);
                navigateHook(`/student/information?tab=reschedule`);
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
                navigateHook(`/student/information?tab=reschedule`);
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

    useDocumentTitle("Danh sách đơn yêu cầu dời lịch học");

    return (
        <div className="student-reschedule">
            {!id ? (
                <>
                    <div className="srr1">
                        <h3>Danh sách đơn yêu cầu dời lịch học</h3>
                    </div>

                    <div className="sub-tabs">
                        {["all", "personal", "tutor"].map((t) => (
                            <div
                                key={t}
                                className={`sub-tab ${
                                    tabSubActive === t ? "active" : ""
                                }`}
                                onClick={() => handleChangeTab(t)}
                            >
                                {t === "all" && "Tất cả"}
                                {t === "personal" && "Bản thân"}
                                {t === "tutor" && "Gia sư"}
                            </div>
                        ))}
                    </div>

                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Người gửi yêu cầu
                                </th>
                                <th className="table-head-cell">Trạng thái</th>
                                <th className="table-head-cell">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {paginatedItems && paginatedItems.length > 0 ? (
                                paginatedItems.map((reschedule) => (
                                    <tr key={reschedule.id}>
                                        <td className="table-body-cell">
                                            {reschedule.requesterName}
                                        </td>
                                        <td className="table-body-cell">
                                            {getStatusText(reschedule.status)}
                                        </td>
                                        <td className="table-body-cell">
                                            <button
                                                className="pr-btn"
                                                onClick={() =>
                                                    handleViewDetail(
                                                        reschedule.id,
                                                    )
                                                }
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="table-body-cell no-data"
                                    >
                                        Chưa có yêu cầu dời lịch nào
                                    </td>
                                </tr>
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
                </>
            ) : (
                <>
                    <div className="srr1">
                        <h3>Chi tiết đơn yêu cầu</h3>
                        <button className="sc-btn" onClick={handleBack}>
                            Quay lại
                        </button>
                    </div>
                    <div className="detail-reschedule">
                        {/* NHÓM 1: Thông tin học sinh */}
                        <div className="detail-group">
                            <h3 className="group-title">Thông tin yêu cầu</h3>
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
                                        {formatDate(reschedule?.oldStartTime!)}
                                    </p>
                                </div>

                                <div className="detail-item">
                                    <h4>Giờ bắt đầu</h4>
                                    <p>
                                        {formatTime(reschedule?.oldStartTime!)}
                                    </p>
                                </div>

                                <div className="detail-item">
                                    <h4>Giờ kết thúc</h4>
                                    <p>{formatTime(reschedule?.oldEndTime!)}</p>
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
                                        {formatDate(reschedule?.newStartTime!)}
                                    </p>
                                </div>

                                <div className="detail-item">
                                    <h4>Giờ bắt đầu</h4>
                                    <p>
                                        {formatTime(reschedule?.newStartTime!)}
                                    </p>
                                </div>

                                <div className="detail-item">
                                    <h4>Giờ kết thúc</h4>
                                    <p>{formatTime(reschedule?.newEndTime!)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isTutorReschedule && reschedule?.status === "Pending" && (
                        <div className="group-btn">
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
                </>
            )}
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
        </div>
    );
};

export default StudentListReschedule;
