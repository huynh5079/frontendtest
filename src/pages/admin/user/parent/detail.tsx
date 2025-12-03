import { useEffect, type FC } from "react";
import { navigateHook } from "../../../../routes/routeApp";
import { routes } from "../../../../routes/routeName";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import {
    selectParentForAdmin,
} from "../../../../app/selector";
import { formatDate, useDocumentTitle } from "../../../../utils/helper";
import { getDetailParentForAdminApiThunk } from "../../../../services/admin/parent/adminParentThunk";

const AdminDetailParentPage: FC = () => {
    const { id } = useParams();
    const parent = useAppSelector(selectParentForAdmin);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getDetailParentForAdminApiThunk(String(id)))
            .unwrap()
            .then(() => {})
            .catch(() => {})
            .finally(() => {});
    }, [dispatch, id]);

    useDocumentTitle(`Phụ huynh ${parent?.username}`);

    return (
        <section id="admin-detail-parent-section">
            <div className="adps-container">
                <div className="adpscr1">
                    <h4>Phụ huynh</h4>
                    <p>
                        Trang tổng quát <span>Chi tiết</span>
                    </p>
                </div>
                <div className="adpscr2">
                    <div
                        className="pr-btn"
                        onClick={() => {
                            navigateHook(routes.admin.parent.list);
                        }}
                    >
                        Quay lại
                    </div>
                </div>
                <div className="adpscr3">
                    <div className="adpscr3r1">
                        <div className="adpscr3r1c1">
                            <h5>Ảnh đại diện</h5>
                            <img
                                className="avatar"
                                src={parent?.avatarUrl}
                                alt=""
                            />
                        </div>
                        <div className="adpscr3r1c2">
                            <h5>Thông tin cá nhân</h5>

                            <h6>Họ và tên:</h6>
                            <p>{parent?.username}</p>

                            <h6>Giới tính:</h6>
                            <p>{parent?.gender || "Chưa cập nhật"}</p>

                            <h6>Email:</h6>
                            <p>{parent?.email}</p>

                            <h6>Địa chỉ:</h6>
                            <p>{parent?.address || "Chưa cập nhật"}</p>

                            <h6>Số điện thoại:</h6>
                            <p>{parent?.phone || "Chưa cập nhật"}</p>

                            <h6>Ngày sinh:</h6>
                            <p>{parent?.dateOfBirth || "Chưa cập nhật"}</p>

                            <h6>Ngày tham gia:</h6>
                            <p>{formatDate(String(parent?.createDate))}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminDetailParentPage;
