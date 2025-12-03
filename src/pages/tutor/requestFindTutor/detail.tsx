import { useEffect, useState, type FC } from "react";
import { LoadingSpinner } from "../../../components/elements";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
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

const DetailRequestFindtutorForTutorPage: FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const request = useAppSelector(selectDetailRequestFindTutorForTutor);
    const applyRequests = useAppSelector(
        selectListApplyRequestFindTutorForTutor,
    );

    const isApply = applyRequests?.some(
        (applyRequest) => applyRequest.classRequestId === id,
    );

    const cuurentApplyId = applyRequests?.find(
        (applyRequest) => applyRequest.classRequestId === id,
    )?.id;

    const [isSubmittingApply, setIsSubmittingApply] = useState(false);
    const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getDetailRequestFindTutorForTutorApiThunk(id));
            dispatch(getApplyRequestFindTutorForTutorApiThunk());
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
                withdrawApplyRequestFindTutorForTutorApiThunk(applyId),
            )
                .unwrap()
                .then((res) => {
                    const message = get(
                        res,
                        "data.message",
                        "Đã rút đơn ứng tuyển",
                    );
                    toast.success(message);
                })
                .catch((error) => {
                    const errorData = get(
                        error,
                        "data.message",
                        "Có lỗi xảy ra",
                    );
                    toast.error(errorData);
                })
                .finally(() => {
                    setIsSubmittingWithdraw(false);
                    dispatch(getDetailRequestFindTutorForTutorApiThunk(id));
                    dispatch(getApplyRequestFindTutorForTutorApiThunk());
                });
        }
    };

    const handleApply = async () => {
        if (id) {
            setIsSubmittingApply(true);
            await dispatch(
                applyRequestFindTutorForTutorApiThunk({ classRequestId: id }),
            )
                .unwrap()
                .then((res) => {
                    const message = get(
                        res,
                        "data.message",
                        "Ứng tuyển thành công",
                    );
                    toast.success(message);
                })
                .catch((error) => {
                    const errorData = get(
                        error,
                        "data.message",
                        "Có lỗi xảy ra",
                    );
                    toast.error(errorData);
                })
                .finally(() => {
                    setIsSubmittingApply(false);
                    dispatch(getDetailRequestFindTutorForTutorApiThunk(id));
                    dispatch(getApplyRequestFindTutorForTutorApiThunk());
                });
        }
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
                        <div className="drftftscr4r1c1">
                            <h4>Học sinh</h4>
                            <p>{show(request?.studentName)}</p>

                            <h4>Mô tả</h4>
                            <p>{show(request?.description)}</p>

                            <h4>Địa điểm</h4>
                            <p>{show(request?.location)}</p>

                            <h4>Yêu cầu đặc biệt</h4>
                            <p>{show(request?.specialRequirements)}</p>

                            <h4>Ngày bắt đầu</h4>
                            <p>
                                {request?.classStartDate
                                    ? formatDate(String(request.classStartDate))
                                    : "Không có"}
                            </p>

                            <h4>Ngày hết hạn</h4>
                            <p>
                                {request?.expiryDate
                                    ? formatDate(String(request.expiryDate))
                                    : "Không có"}
                            </p>

                            <h4>Ngày tạo</h4>
                            <p>
                                {request?.createdAt
                                    ? formatDate(String(request.createdAt))
                                    : "Không có"}
                            </p>
                        </div>

                        <div className="drftftscr4r1c2">
                            <h4>Môn học</h4>
                            <p>{show(request?.subject)}</p>

                            <h4>Cấp bậc học</h4>
                            <p>{show(request?.educationLevel)}</p>

                            <h4>Hình thức học</h4>
                            <p>{show(request?.mode)}</p>

                            <h4>Học phí</h4>
                            <p>
                                {request?.budget
                                    ? `${request.budget.toLocaleString()} VNĐ`
                                    : "Không có"}
                            </p>

                            <h4>Trạng thái</h4>
                            <p>{getStatusText(request?.status)}</p>

                            <h4>Lịch học</h4>
                            {request?.schedules &&
                            request.schedules.length > 0 ? (
                                [...request.schedules]
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
                    <div className="drftftscr4r2">
                        {!isApply ? (
                            <button
                                className={
                                    isSubmittingApply ? "disable-btn" : "pr-btn"
                                }
                                onClick={handleApply}
                            >
                                {isSubmittingApply ? (
                                    <LoadingSpinner />
                                ) : (
                                    "Ứng tuyển"
                                )}
                            </button>
                        ) : (
                            <>
                                <button className="disable-btn">
                                    Đã ứng tuyển
                                </button>
                                <button
                                    className={
                                        isSubmittingWithdraw
                                            ? "disable-btn"
                                            : "delete-btn"
                                    }
                                    onClick={() => {
                                        handleWithdraw(cuurentApplyId!);
                                    }}
                                >
                                    {isSubmittingWithdraw ? (
                                        <LoadingSpinner />
                                    ) : (
                                        "Rút đơn ứng tuyển"
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetailRequestFindtutorForTutorPage;
