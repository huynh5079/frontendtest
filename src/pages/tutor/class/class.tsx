import { useEffect, useState, type FC } from "react";
import { FaListUl, FaUserMinus, FaUsers } from "react-icons/fa";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListTutorClass } from "../../../app/selector";
import { getAllClassApiThunk } from "../../../services/tutor/class/classThunk";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import { MdListAlt } from "react-icons/md";

const TutorClassPage: FC = () => {
    const classes = useAppSelector(selectListTutorClass);
    const pendingClasses = classes?.filter((item) => item.status === "Pending");
    const cancelledClasses = classes?.filter(
        (item) => item.status === "Cancelled",
    );
    const ongoingClasses = classes?.filter((item) => item.status === "Ongoing");
    const dispatch = useAppDispatch();

    // 🔥 Filter State
    const [filterStatus, setFilterStatus] = useState<
        "All" | "Pending" | "Cancelled" | "Ongoing"
    >("All");

    // 🔥 Data được lọc theo filterStatus
    const filteredData =
        filterStatus === "All"
            ? classes
            : classes?.filter((b) => b.status === filterStatus);

    useEffect(() => {
        dispatch(getAllClassApiThunk());
    }, [dispatch]);

    const handleViewDetail = (id: string) => {
        const url = routes.tutor.class.detail.replace(":id", id);
        navigateHook(url);
    };

    useDocumentTitle("Danh sách lớp học");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Tổng số trang
    const totalPages = filteredData
        ? Math.ceil(filteredData.length / itemsPerPage)
        : 1;

    // Lấy dữ liệu cho trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData?.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    useEffect(() => {
        setCurrentPage(1); // reset khi đổi filter
    }, [filterStatus]);

    return (
        <section id="tutor-class-section">
            <div className="tcs-container">
                <div className="tcscr1">
                    <h4>Lớp học</h4>
                    <p>
                        Trang tổng quát <span>Lớp học</span>
                    </p>
                </div>
                <div className="tcscr2">
                    {/* ALL */}
                    <div
                        className={`tcscr2-item ${
                            filterStatus === "All" ? "active" : ""
                        }`}
                        onClick={() => setFilterStatus("All")}
                    >
                        <MdListAlt className="tcscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>{classes?.length || 0} lớp</p>
                        </div>
                    </div>

                    {/* Pending */}
                    <div
                        className={`tcscr2-item ${
                            filterStatus === "Pending" ? "active" : ""
                        }`}
                        onClick={() => setFilterStatus("Pending")}
                    >
                        <MdListAlt className="tcscr2-item-icon" />
                        <div className="amount">
                            <h5>Đợi xử lí</h5>
                            <p>{pendingClasses?.length || 0} lớp</p>
                        </div>
                    </div>

                    {/* Cancelled */}
                    <div
                        className={`tcscr2-item ${
                            filterStatus === "Cancelled" ? "active" : ""
                        }`}
                        onClick={() => setFilterStatus("Cancelled")}
                    >
                        <MdListAlt className="tcscr2-item-icon" />
                        <div className="amount">
                            <h5>Đã huỷ</h5>
                            <p>{cancelledClasses?.length || 0} lớp</p>
                        </div>
                    </div>

                    {/* Ongoing */}
                    <div
                        className={`tcscr2-item ${
                            filterStatus === "Ongoing" ? "active" : ""
                        }`}
                        onClick={() => setFilterStatus("Ongoing")}
                    >
                        <MdListAlt className="tcscr2-item-icon" />
                        <div className="amount">
                            <h5>Đang dạy</h5>
                            <p>{ongoingClasses?.length || 0} lớp</p>
                        </div>
                    </div>
                </div>
                <div className="tcscr3">
                    <button
                        className="pr-btn"
                        onClick={() => navigateHook(routes.tutor.class.create)}
                    >
                        Tạo lớp học
                    </button>
                </div>
                <div className="tcscr4">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">Môn dạy</th>
                                <th className="table-head-cell">
                                    Cấp bậc lớp học
                                </th>
                                <th className="table-head-cell">Trạng thái</th>
                                <th className="table-head-cell">
                                    Thời gian bắt đầu học
                                </th>
                                <th className="table-head-cell">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {paginatedData?.map((item) => (
                                <tr className="table-body-row" key={item.id}>
                                    <td className="table-body-cell">
                                        {item.subject}
                                    </td>
                                    <td className="table-body-cell">
                                        {item.educationLevel}
                                    </td>
                                    <td className="table-body-cell">
                                        {item.status}
                                    </td>
                                    <td className="table-body-cell">
                                        {formatDate(item.classStartDate)}
                                    </td>
                                    <td className="table-body-cell">
                                        <button
                                            className="pr-btn"
                                            onClick={() => {
                                                handleViewDetail(item.id);
                                            }}
                                        >
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="sc-btn"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                            >
                                Trang trước
                            </button>

                            <span>
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                className="sc-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                            >
                                Trang sau
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TutorClassPage;
