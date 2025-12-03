import { useEffect, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListAssignedClassForStudent } from "../../../app/selector";
import { getAllAssignedClassForStudentApiThunk } from "../../../services/student/class/classThunk";
import { formatDate, getStatusText } from "../../../utils/helper";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";

const StudentAssignedClass: FC = () => {
    const dispatch = useAppDispatch();
    const assignedClasses = useAppSelector(selectListAssignedClassForStudent);

    useEffect(() => {
        dispatch(getAllAssignedClassForStudentApiThunk());
    }, []);

    const handleViewDetail = (classId: string) => {
        const url = routes.student.course.detail.replace(":id", classId);
        navigateHook(url);
    };

    return (
        <div className="student-assigned-class">
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
                            <th className="table-head-cell">Tên lớp học</th>
                            <th className="table-head-cell">Gia sư</th>
                            <th className="table-head-cell">
                                Thời gian bắt đầu học
                            </th>
                            <th className="table-head-cell">Trạng thái</th>
                            <th className="table-head-cell">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {assignedClasses?.map((item) => (
                            <tr className="table-body-row" key={item.classId}>
                                <td className="table-body-cell">
                                    {item.classTitle}
                                </td>
                                <td className="table-body-cell">
                                    {item.tutorName}
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
            </div>
        </div>
    );
};

export default StudentAssignedClass;
