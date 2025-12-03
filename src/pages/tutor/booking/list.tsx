import { useEffect, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListBookingForTutor } from "../../../app/selector";
import { getAllBookingForTutorApiThunk } from "../../../services/tutor/booking/bookingThunk";
import { FaArrowCircleDown, FaArrowCircleUp, FaListUl } from "react-icons/fa";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";

const ListTutorBookingPage: FC = () => {
    const dispatch = useAppDispatch();
    const bookings = useAppSelector(selectListBookingForTutor);

    useEffect(() => {
        dispatch(getAllBookingForTutorApiThunk());
    }, [dispatch]);

    const handleViewDetail = (id: string) => {
        const url = routes.tutor.booking.detail.replace(":id", id);
        navigateHook(url);
    };

    useDocumentTitle("Danh sách lịch đặt");

    return (
        <section id="list-tutor-booking-section">
            <div className="ltbs-container">
                <div className="ltbscr1">
                    <h4>Danh sánh</h4>
                    <p>
                        Trang tổng quát <span>Lịch đặt</span>
                    </p>
                </div>
                <div className="ltbscr2">
                    <div className="ltbscr2-item active">
                        <FaListUl className="ltbscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>3 đơn</p>
                        </div>
                    </div>
                    <div className="ltbscr2-item">
                        <FaArrowCircleUp className="ltbscr2-item-icon" />
                        <div className="amount">
                            <h5>Đợi xữ lí</h5>
                            <p>2 đơn</p>
                        </div>
                    </div>
                    <div className="ltbscr2-item">
                        <FaArrowCircleUp className="ltbscr2-item-icon" />
                        <div className="amount">
                            <h5>Đã chấp thuận</h5>
                            <p>2 đơn</p>
                        </div>
                    </div>
                    <div className="ltbscr2-item">
                        <FaArrowCircleDown className="ltbscr2-item-icon" />
                        <div className="amount">
                            <h5>Đã từ chối</h5>
                            <p>1 giao dịch</p>
                        </div>
                    </div>
                </div>
                <div className="ltbscr4">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Tên người đặt
                                </th>
                                <th className="table-head-cell">Môn học</th>
                                <th className="table-head-cell">Cấp bậc học</th>
                                <th className="table-head-cell">
                                    Thời gian gửi
                                </th>
                                <th className="table-head-cell">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {bookings?.map((booking) => (
                                <tr className="table-body-row" key={booking.id}>
                                    <td className="table-body-cell">
                                        {booking.studentName}
                                    </td>
                                    <td className="table-body-cell">
                                        {booking.subject}
                                    </td>
                                    <td className="table-body-cell">
                                        {booking.educationLevel}
                                    </td>
                                    <td className="table-body-cell">
                                        {formatDate(booking.createdAt)}
                                    </td>
                                    <td className="table-body-cell">
                                        <button
                                            className="pr-btn"
                                            onClick={() =>
                                                handleViewDetail(booking.id)
                                            }
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default ListTutorBookingPage;
