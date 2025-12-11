import { useEffect, useState, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectDetailPublicClass,
    selectListAssignedClassForStudent,
} from "../../../app/selector";
import { getAllAssignedClassForStudentApiThunk } from "../../../services/student/class/classThunk";
import { formatDate, getModeText, getStatusText } from "../../../utils/helper";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useSearchParams } from "react-router-dom";
import { publicGetDetailClassApiThunk } from "../../../services/public/class/classthunk";

const ITEMS_PER_PAGE = 6;

const dayOfWeekMap: Record<string, string> = {
    Monday: "Thứ Hai",
    Tuesday: "Thứ Ba",
    Wednesday: "Thứ Tư",
    Thursday: "Thứ Năm",
    Friday: "Thứ Sáu",
    Saturday: "Thứ Bảy",
    Sunday: "Chủ Nhật",
};

const dayOrder: Record<string, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
};

const StudentAssignedClass: FC = () => {
    const dispatch = useAppDispatch();
    const assignedClasses = useAppSelector(selectListAssignedClassForStudent);
    const classDetail = useAppSelector(selectDetailPublicClass);

    const [currentPage, setCurrentPage] = useState(1);

    /* URL Params */
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    useEffect(() => {
        dispatch(getAllAssignedClassForStudentApiThunk());
    }, [dispatch]);

    /* Load detail when id changes */
    useEffect(() => {
        if (id) {
            dispatch(publicGetDetailClassApiThunk(id!));
        }
    }, [dispatch, id]);

    const handleViewDetail = (id: string) => {
        navigateHook(`/student/information?tab=assigned_class&id=${id}`);
    };

    const handleBack = () => {
        navigateHook(`/student/information?tab=assigned_class`);
    };

    /* Pagination */
    const totalPages = Math.ceil(
        (assignedClasses?.length || 0) / ITEMS_PER_PAGE
    );
    const paginatedItems = assignedClasses?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleViewDetailTutor = (id: string) => {
        const url = routes.student.tutor.detail.replace(":id", id);
        navigateHook(url);
    };

    const renderBookingList = () => (
        <>
            <div className="sacr1">
                <h3>Lớp học đăng ký</h3>
                <button
                    className="pr-btn"
                    onClick={() => navigateHook(routes.student.course.list)}
                >
                    Đi tìm lớp học
                </button>
            </div>

            <div className="sacr2">
                <table className="table">
                    <thead className="table-head">
                        <tr className="table-head-row">
                            <th className="table-head-cell">Gia sư</th>
                            <th className="table-head-cell">Môn học</th>
                            <th className="table-head-cell">
                                Thời gian bắt đầu học
                            </th>
                            <th className="table-head-cell">Trạng thái</th>
                            <th className="table-head-cell">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {paginatedItems?.map((item) => (
                            <tr className="table-body-row" key={item.classId}>
                                <td className="table-body-cell">
                                    {item.tutorName}
                                </td>
                                <td className="table-body-cell">
                                    {item.subject}
                                </td>
                                <td className="table-body-cell">
                                    {formatDate(item.classStartDate)}
                                </td>
                                <td className="table-body-cell">
                                    {getStatusText(item.classStatus)}
                                </td>
                                <td className="table-body-cell">
                                    <button
                                        className="pr-btn"
                                        onClick={() =>
                                            handleViewDetail(item.classId)
                                        }
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
            </div>
        </>
    );

    /* ================================
       Render Booking Detail
    ================================= */
    const renderBookingDetail = () => (
        <>
            <div className="sacr1">
                <h3 className="detail-title">Lớp học đăng ký</h3>
                <button className="sc-btn" onClick={handleBack}>
                    Quay lại
                </button>
            </div>

            <div className="detail-class">
                {/* NHÓM 2: Thông tin gia sư */}
                <div className="detail-group">
                    <h3 className="group-title">Thông tin gia sư</h3>
                    <div className="group-content">
                        <div className="detail-item">
                            <h4>Gia sư</h4>
                            <p>{classDetail?.tutorName}</p>
                        </div>

                        <div className="detail-item">
                            <h4>Môn học</h4>
                            <p>{classDetail?.subject}</p>
                        </div>

                        <div className="detail-item">
                            <h4>Cấp bậc dạy</h4>
                            <p>{classDetail?.educationLevel}</p>
                        </div>
                    </div>
                    <button
                        className="pr-btn"
                        onClick={() =>
                            handleViewDetailTutor(classDetail?.tutorUserId!)
                        }
                    >
                        Xem chi tiết
                    </button>
                    <button className="delete-btn">Báo cáo</button>
                </div>

                {/* NHÓM 3: Hình thức & Học phí */}
                <div className="detail-group">
                    <h3 className="group-title">Thông tin lớp học</h3>
                    <div className="group-content">
                        <div className="detail-item">
                            <h4>Mô tả</h4>
                            <p>{classDetail?.description}</p>
                        </div>

                        <div className="detail-item">
                            <h4>Hình thức học</h4>
                            <p>{getModeText(classDetail?.mode)}</p>
                        </div>

                        {classDetail?.mode === "Offline" && (
                            <div className="detail-item">
                                <h4>Địa điểm</h4>
                                <p>{classDetail?.location}</p>
                            </div>
                        )}

                        <div className="detail-item">
                            <h4>Học phí</h4>
                            <p>{classDetail?.price?.toLocaleString()} VNĐ</p>
                        </div>

                        <div className="detail-item">
                            <h4>Trạng thái</h4>
                            <p>{getStatusText(classDetail?.status)}</p>
                        </div>

                        <div className="detail-item">
                            <h4>Số học sinh tham gia</h4>
                            <p>{classDetail?.currentStudentCount}</p>
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
                                    String(classDetail?.classStartDate)
                                )}
                            </p>
                        </div>

                        <div className="detail-item">
                            <h4>Ngày tạo</h4>
                            <p>{formatDate(String(classDetail?.createdAt))}</p>
                        </div>

                        <div className="detail-item detail-item-schedule">
                            <h4>Lịch học chi tiết</h4>

                            {classDetail?.scheduleRules
                                ?.slice() // tránh mutate mảng gốc
                                .sort(
                                    (a, b) =>
                                        dayOrder[a.dayOfWeek] -
                                        dayOrder[b.dayOfWeek]
                                )
                                .map((s, index) => (
                                    <div key={index} className="schedule-item">
                                        <p className="schedule-day">
                                            {dayOfWeekMap[s.dayOfWeek] ||
                                                s.dayOfWeek}
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
        </>
    );

    return (
        <div className="student-assigned-class">
            {!id ? renderBookingList() : renderBookingDetail()}
        </div>
    );
};

export default StudentAssignedClass;
