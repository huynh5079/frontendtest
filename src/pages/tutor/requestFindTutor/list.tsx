import { useEffect, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListRequestFindTutorForTutor } from "../../../app/selector";
import { getAllRequestFindTutorForTutorApiThunk } from "../../../services/tutor/requestFindTutor/requestFindTutorThunk";
import { routes } from "../../../routes/routeName";
import { navigateHook } from "../../../routes/routeApp";
import { FaArrowCircleDown, FaArrowCircleUp, FaListUl } from "react-icons/fa";
import { formatDate, useDocumentTitle } from "../../../utils/helper";

const ListReuqestFindtutorForTutorPage: FC = () => {
    const dispatch = useAppDispatch();
    const requests = useAppSelector(selectListRequestFindTutorForTutor);

    useEffect(() => {
        dispatch(getAllRequestFindTutorForTutorApiThunk());
    }, [dispatch]);

    const handleViewDetail = (id: string) => {
        const url = routes.tutor.request.detail.replace(":id", id);
        navigateHook(url);
    };

    useDocumentTitle("Danh sách đơn tìm gia sư");

    return (
        <section id="list-request-find-tutor-for-tutor-section">
            <div className="lrftfts-container">
                <div className="lrftftscr1">
                    <h4>Danh sánh</h4>
                    <p>
                        Trang tổng quát <span>Đơn tìm gia sư</span>
                    </p>
                </div>
                <div className="lrftftscr2">
                    <div className="lrftftscr2-item active">
                        <FaListUl className="lrftftscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>3 đơn</p>
                        </div>
                    </div>
                    <div className="lrftftscr2-item">
                        <FaArrowCircleUp className="lrftftscr2-item-icon" />
                        <div className="amount">
                            <h5>Đợi xữ lí</h5>
                            <p>2 đơn</p>
                        </div>
                    </div>
                    <div className="lrftftscr2-item">
                        <FaArrowCircleUp className="lrftftscr2-item-icon" />
                        <div className="amount">
                            <h5>Đã ứng tuyển</h5>
                            <p>2 đơn</p>
                        </div>
                    </div>
                    <div className="lrftftscr2-item">
                        <FaArrowCircleDown className="lrftftscr2-item-icon" />
                        <div className="amount">
                            <h5>Đã từ chối</h5>
                            <p>1 giao dịch</p>
                        </div>
                    </div>
                </div>
                <div className="lrftftscr4">
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
                            {requests?.map((request) => (
                                <tr className="table-body-row" key={request.id}>
                                    <td className="table-body-cell">
                                        {request.studentName}
                                    </td>
                                    <td className="table-body-cell">
                                        {request.subject}
                                    </td>
                                    <td className="table-body-cell">
                                        {request.educationLevel}
                                    </td>
                                    <td className="table-body-cell">
                                        {formatDate(request.createdAt)}
                                    </td>
                                    <td className="table-body-cell">
                                        <button
                                            className="pr-btn"
                                            onClick={() =>
                                                handleViewDetail(request.id)
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

export default ListReuqestFindtutorForTutorPage;
