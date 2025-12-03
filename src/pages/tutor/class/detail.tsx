import { useEffect, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectDetailTutorClass,
    selectListStudentEnrolledClassFortutor,
} from "../../../app/selector";
import {
    deleteClassForTutorApiThunk,
    getAllStudentEnrolledClassForTutorApiThunk,
    getDetailClassApiThunk,
} from "../../../services/tutor/class/classThunk";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import { Modal, UpdateClassModal } from "../../../components/modal";
import { LoadingSpinner } from "../../../components/elements";
import { get } from "lodash";
import { toast } from "react-toastify";

type PaymentStatus = "Pending" | "Paid" | "Unpaid";

const TutorDetailClassPage: FC = () => {
    const { id } = useParams();
    const classDetail = useAppSelector(selectDetailTutorClass);
    const studentsEnrolled = useAppSelector(
        selectListStudentEnrolledClassFortutor
    );
    const dispatch = useAppDispatch();
    const [isUpdateClassOpen, setIsUpdateClassOpen] = useState(false);
    const [isDeleteClassOpen, setIsDeleteClassOpen] = useState(false);
    const [isDeleteClassSubmitting, setIsDeleteClassSubmitting] =
        useState(false);

    useEffect(() => {
        Promise.all([
            dispatch(getDetailClassApiThunk(id!)),
            dispatch(getAllStudentEnrolledClassForTutorApiThunk()),
        ]);
    }, [id, dispatch]);

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
            case "Active":
                return "Đang hoạt động";
            default:
                return "Không có";
        }
    };

    const paymentStatusText: Record<PaymentStatus, string> = {
        Pending: "Chờ thanh toán",
        Paid: "Đã thanh toán",
        Unpaid: "Chưa thanh toán",
    };

    const dayOfWeekVN: any = {
        Monday: "Thứ 2",
        Tuesday: "Thứ 3",
        Wednesday: "Thứ 4",
        Thursday: "Thứ 5",
        Friday: "Thứ 6",
        Saturday: "Thứ 7",
        Sunday: "Chủ nhật",
    };

    useDocumentTitle(`Lớp học ${classDetail?.title}`);

    const handelDeleteClass = async () => {
        setIsDeleteClassSubmitting(true);
        dispatch(deleteClassForTutorApiThunk(id!))
            .unwrap()
            .then((res) => {
                const message = get(res, "data.Message", "Xóa thành công");
                toast.success(message);
            })
            .catch((error) => {
                const errorData = get(error, "data.Message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                setIsDeleteClassOpen(false);
                setIsDeleteClassSubmitting(false);
                navigateHook(routes.tutor.class.list);
            });
    };

    return (
        <section id="detail-tutor-class-section">
            <div className="dtcs-container">
                <div className="dtcscr1">
                    <h4>Chi tiết</h4>
                    <p>
                        Trang tổng quát <span>Lớp học</span>
                    </p>
                </div>

                <div className="dtcscr3">
                    <button
                        className="pr-btn"
                        onClick={() => navigateHook(routes.tutor.class.list)}
                    >
                        Quay lại
                    </button>
                </div>

                <div className="dtcscr4">
                    <div className="dtcscr4r1">
                        <div className="dtcscr4r1c1">
                            <h4>Chủ đề</h4>
                            <p>{show(classDetail?.title)}</p>

                            <h4>Mô tả</h4>
                            <p>{show(classDetail?.description)}</p>

                            <h4>Địa điểm</h4>
                            <p>{show(classDetail?.location)}</p>

                            <h4>Số lượng giới hạn</h4>
                            <p>{show(classDetail?.studentLimit)}</p>

                            <h4>Ngày bắt đầu</h4>
                            <p>
                                {classDetail?.classStartDate
                                    ? formatDate(
                                          String(classDetail.classStartDate)
                                      )
                                    : "Không có"}
                            </p>

                            <h4>Ngày tạo</h4>
                            <p>
                                {classDetail?.createdAt
                                    ? formatDate(String(classDetail.createdAt))
                                    : "Không có"}
                            </p>
                        </div>

                        <div className="dtcscr4r1c2">
                            <h4>Môn học</h4>
                            <p>{show(classDetail?.subject)}</p>

                            <h4>Cấp bậc học</h4>
                            <p>{show(classDetail?.educationLevel)}</p>

                            <h4>Hình thức học</h4>
                            <p>{show(classDetail?.mode)}</p>

                            <h4>Học phí</h4>
                            <p>
                                {classDetail?.price
                                    ? `${classDetail.price.toLocaleString()} VNĐ`
                                    : "Không có"}
                            </p>

                            <h4>Trạng thái</h4>
                            <p>{getStatusText(classDetail?.status)}</p>

                            <h4>Lịch học</h4>
                            {classDetail?.scheduleRules &&
                            classDetail.scheduleRules.length > 0 ? (
                                classDetail.scheduleRules.map((s, index) => (
                                    <div key={index}>
                                        <h4>
                                            {dayOfWeekVN[s.dayOfWeek] ??
                                                s.dayOfWeek}
                                        </h4>
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
                    <div className="dtcscr4r2">
                        <button
                            className="pr-btn"
                            onClick={() => setIsUpdateClassOpen(true)}
                        >
                            Cập nhật
                        </button>
                        <button
                            className="delete-btn"
                            onClick={() => setIsDeleteClassOpen(true)}
                        >
                            Xóa lớp học
                        </button>
                    </div>
                </div>

                {Number(classDetail?.currentStudentCount) > 0 && (
                    <div className="dtcscr5">
                        <h3>Danh sách học viên đăng ký</h3>
                        <table className="table">
                            <thead className="table-head">
                                <tr className="table-head-row">
                                    <th className="table-head-cell">Email</th>
                                    <th className="table-head-cell">
                                        Họ và tên
                                    </th>
                                    <th className="table-head-cell">
                                        Trạng thái
                                    </th>
                                    <th className="table-head-cell">
                                        Thời gian tham gia
                                    </th>
                                    <th className="table-head-cell">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {studentsEnrolled?.map((item) => (
                                    <tr
                                        className="table-body-row"
                                        key={item.studentId}
                                    >
                                        <td className="table-body-cell">
                                            {item.studentEmail}
                                        </td>
                                        <td className="table-body-cell">
                                            {item.studentName}
                                        </td>
                                        <td className="table-body-cell">
                                            {paymentStatusText[
                                                item.paymentStatus as PaymentStatus
                                            ] ?? "Không có"}
                                        </td>
                                        <td className="table-body-cell">
                                            {formatDate(item.createdAt)}
                                        </td>
                                        <td className="table-body-cell">
                                            <button
                                                className="pr-btn"
                                                onClick={() => {}}
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <UpdateClassModal
                isOpen={isUpdateClassOpen}
                setIsOpen={setIsUpdateClassOpen}
                selectedClass={classDetail}
            />
            <Modal
                isOpen={isDeleteClassOpen}
                setIsOpen={setIsDeleteClassOpen}
                title="Xóa lớp học"
            >
                <section id="student-assign-class-modal">
                    <div className="sacm-container">
                        <h3>Bạn có chắc chắn xóa lớp học này</h3>
                        <button
                            onClick={() => {
                                handelDeleteClass();
                            }}
                            className={
                                isDeleteClassSubmitting
                                    ? "disable-btn"
                                    : "delete-btn"
                            }
                        >
                            {isDeleteClassSubmitting ? (
                                <LoadingSpinner />
                            ) : (
                                "Xóa"
                            )}
                        </button>
                        <p onClick={() => setIsDeleteClassSubmitting(false)}>
                            Lúc khác
                        </p>
                    </div>
                </section>
            </Modal>
        </section>
    );
};

export default TutorDetailClassPage;
