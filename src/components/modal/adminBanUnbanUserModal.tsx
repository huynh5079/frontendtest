import { useState, type FC } from "react";
import Modal from "./modal";
import { useAppDispatch } from "../../app/store";
import { banUserApiThunk, unbanUserApiThunk } from "../../services/admin/user/adminUserThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../elements";

interface AdminBanUnbanUserModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    userId: string;
    username: string;
    isBanned: boolean;
    onSuccess?: () => void;
}

const AdminBanUnbanUserModal: FC<AdminBanUnbanUserModalProps> = ({
    isOpen,
    setIsOpen,
    userId,
    username,
    isBanned,
    onSuccess,
}) => {
    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reason, setReason] = useState<string>("");
    const [durationDays, setDurationDays] = useState<number | undefined>(undefined);

    const handleBan = async () => {
        if (!userId) {
            toast.error("Không tìm thấy người dùng");
            return;
        }

        setIsSubmitting(true);

        await dispatch(
            banUserApiThunk({
                userId,
                params: {
                    Reason: reason || undefined,
                    DurationDays: durationDays || undefined,
                },
            })
        )
            .unwrap()
            .then((res) => {
                const message = get(res, "data.message", "Khóa tài khoản thành công");
                toast.success(message);
                setIsOpen(false);
                setReason("");
                setDurationDays(undefined);
                if (onSuccess) {
                    onSuccess();
                }
            })
            .catch((error) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleUnban = async () => {
        if (!userId) {
            toast.error("Không tìm thấy người dùng");
            return;
        }

        setIsSubmitting(true);

        await dispatch(
            unbanUserApiThunk({
                userId,
                params: {
                    Reason: reason || undefined,
                },
            })
        )
            .unwrap()
            .then((res) => {
                const message = get(res, "data.message", "Mở khóa tài khoản thành công");
                toast.success(message);
                setIsOpen(false);
                setReason("");
                if (onSuccess) {
                    onSuccess();
                }
            })
            .catch((error) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isBanned ? "Mở khóa tài khoản" : "Khóa tài khoản"}
        >
            <section id="admin-ban-unban-user-modal">
                <div className="abuum-container">
                    <p className="abuum-warning">
                        {isBanned
                            ? `Bạn có chắc chắn muốn mở khóa tài khoản "${username}" không?`
                            : `Bạn có chắc chắn muốn khóa tài khoản "${username}" không?`}
                    </p>

                    {!isBanned && (
                        <div className="abuum-warning-box">
                            <div className="abuum-warning-header">
                                <span className="abuum-warning-icon">⚠️</span>
                                <strong>Cảnh báo: Hành động này sẽ:</strong>
                            </div>
                            <ul className="abuum-warning-list">
                                <li>Khóa tài khoản người dùng</li>
                                <li>Người dùng không thể đăng nhập</li>
                                <li>Gửi thông báo cho người dùng</li>
                            </ul>
                        </div>
                    )}

                    <div className="form-field">
                        <label className="form-label">
                            Lý do {isBanned ? "mở khóa" : "khóa"} (tùy chọn)
                        </label>
                        <textarea
                            className="form-input"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Nhập lý do..."
                            rows={3}
                            disabled={isSubmitting}
                        />
                    </div>

                    {!isBanned && (
                        <div className="form-field">
                            <label className="form-label">
                                Thời gian khóa (ngày) (tùy chọn)
                            </label>
                            <input
                                type="number"
                                className="form-input"
                                value={durationDays || ""}
                                onChange={(e) =>
                                    setDurationDays(
                                        e.target.value ? Number(e.target.value) : undefined
                                    )
                                }
                                placeholder="Để trống nếu khóa vĩnh viễn"
                                min="1"
                                disabled={isSubmitting}
                            />
                        </div>
                    )}

                    <div className="group-btn">
                        <button
                            className={isSubmitting ? "disable-btn" : "pr-btn"}
                            onClick={isBanned ? handleUnban : handleBan}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <LoadingSpinner />
                            ) : isBanned ? (
                                "Xác nhận mở khóa"
                            ) : (
                                "Xác nhận khóa"
                            )}
                        </button>
                        <button
                            className="sc-btn"
                            onClick={() => setIsOpen(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </section>
        </Modal>
    );
};

export default AdminBanUnbanUserModal;

