import { useEffect, type FC } from "react";
import { navigateHook } from "../../../../routes/routeApp";
import { routes } from "../../../../routes/routeName";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectStudentForAdmin } from "../../../../app/selector";
import { getDetailStudentForAdminApiThunk } from "../../../../services/admin/student/adminStudentThunk";
import { formatDate, useDocumentTitle } from "../../../../utils/helper";

const AdminDetailStudentPage: FC = () => {
    const { id } = useParams();
    const student = useAppSelector(selectStudentForAdmin);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getDetailStudentForAdminApiThunk(String(id)))
            .unwrap()
            .then(() => {})
            .catch(() => {})
            .finally(() => {});
    }, [dispatch, id]);

    useDocumentTitle(`Học viên ${student?.username}`);

    return (
        <section id="admin-detail-student-section">
            <div className="adss-container">
                <div className="adsscr1">
                    <h4>Học sinh</h4>
                    <p>
                        Trang tổng quát <span>Chi tiết</span>
                    </p>
                </div>
                <div className="adsscr2">
                    <div
                        className="pr-btn"
                        onClick={() => {
                            navigateHook(routes.admin.student.list);
                        }}
                    >
                        Quay lại
                    </div>
                </div>
                <div className="adsscr3">
                    <div className="adsscr3r1">
                        <div className="adsscr3r1c1">
                            <h5>Ảnh đại diện</h5>
                            <img
                                className="avatar"
                                src={student?.avatarUrl}
                                alt=""
                            />
                        </div>
                        <div className="adsscr3r1c2">
                            <h5>Thông tin cá nhân</h5>

                            <h6>Họ và tên:</h6>
                            <p>{student?.username}</p>

                            <h6>Giới tính:</h6>
                            <p>{student?.gender || "Chưa cập nhật"}</p>

                            <h6>Email:</h6>
                            <p>{student?.email}</p>

                            <h6>Địa chỉ:</h6>
                            <p>{student?.address || "Chưa cập nhật"}</p>

                            <h6>Số điện thoại:</h6>
                            <p>{student?.phone || "Chưa cập nhật"}</p>

                            <h6>Ngày sinh:</h6>
                            <p>{student?.dateOfBirth || "Chưa cập nhật"}</p>

                            <h6>Ngày tham gia:</h6>
                            <p>{formatDate(String(student?.createDate))}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminDetailStudentPage;
