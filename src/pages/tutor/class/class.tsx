import { useEffect, type FC } from "react";
import { FaListUl, FaUserMinus, FaUsers } from "react-icons/fa";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListTutorClass } from "../../../app/selector";
import { getAllClassApiThunk } from "../../../services/tutor/class/classThunk";
import { formatDate, useDocumentTitle } from "../../../utils/helper";

const TutorClassPage: FC = () => {
    const classes = useAppSelector(selectListTutorClass);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getAllClassApiThunk());
    }, [dispatch]);

    const handleViewDetail = (id: string) => {
        const url = routes.tutor.class.detail.replace(":id", id);
        navigateHook(url);
    };

    useDocumentTitle("Danh sách lớp học");

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
                    <div className="tcscr2-item active">
                        <FaListUl className="tcscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>3 lớp</p>
                        </div>
                    </div>
                    <div className="tcscr2-item">
                        <FaUsers className="tcscr2-item-icon" />
                        <div className="amount">
                            <h5>Lớp đủ thành viên</h5>
                            <p>2 lớp</p>
                        </div>
                    </div>
                    <div className="tcscr2-item">
                        <FaUserMinus className="tcscr2-item-icon" />
                        <div className="amount">
                            <h5>Lớp thiếu thành viên</h5>
                            <p>1 lớp</p>
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
                            {classes?.map((item) => (
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
                </div>
            </div>
        </section>
    );
};

export default TutorClassPage;
