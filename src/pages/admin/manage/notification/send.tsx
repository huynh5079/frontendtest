import { useState, type FC } from "react";
import { useDocumentTitle } from "../../../../utils/helper";
import { adminSendNotificationApi, type SendNotificationRequest } from "../../../../services/admin/notification/adminNotificationApi";
import { toast } from "react-toastify";
import { get } from "lodash";
import "../../../../assets/scss/admin/manage/notification/admin_send_notification.scss";
import { MdSend, MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AdminSendNotificationPage: FC = () => {
    useDocumentTitle("Gửi thông báo");
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<SendNotificationRequest>({
        title: "",
        message: "",
        role: undefined,
        userId: undefined,
        userEmail: undefined,
        userIds: undefined,
        userEmails: undefined,
        relatedEntityId: undefined,
    });
    
    const [recipientType, setRecipientType] = useState<"all" | "role" | "user" | "users">("all");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userIdsInput, setUserIdsInput] = useState(""); // Input text cho nhiều userIds (comma-separated)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.message.trim()) {
            toast.error("Vui lòng nhập tiêu đề và nội dung thông báo");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const payload: SendNotificationRequest = {
                title: formData.title.trim(),
                message: formData.message.trim(),
                relatedEntityId: formData.relatedEntityId?.trim() || undefined,
            };

            // Xử lý recipient type
            if (recipientType === "user" && formData.userEmail) {
                payload.userEmail = formData.userEmail.trim();
            } else if (recipientType === "users" && userIdsInput.trim()) {
                // Parse comma-separated emails
                payload.userEmails = userIdsInput
                    .split(",")
                    .map(email => email.trim())
                    .filter(email => email.length > 0);
            } else if (recipientType === "role" && formData.role) {
                payload.role = formData.role;
            }
            // Nếu recipientType === "all", không cần thêm gì, backend sẽ gửi cho tất cả

            const response = await adminSendNotificationApi(payload);
            const sentCount = get(response, "sentCount", 0);
            const totalRecipients = get(response, "totalRecipients", 0);
            
            toast.success(`Đã gửi thông báo thành công cho ${sentCount}/${totalRecipients} người dùng`);
            
            // Reset form
            setFormData({
                title: "",
                message: "",
                role: undefined,
                userId: undefined,
                userEmail: undefined,
                userIds: undefined,
                userEmails: undefined,
                relatedEntityId: undefined,
            });
            setRecipientType("all");
            setUserIdsInput("");
        } catch (error: any) {
            const errorMessage = get(error, "response.data.message", get(error, "message", "Có lỗi xảy ra khi gửi thông báo"));
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="admin-send-notification-section">
            <div className="container">
                <div className="header-section">
                    <button 
                        className="back-button"
                        onClick={() => navigate(-1)}
                        type="button"
                    >
                        <MdArrowBack /> Quay lại
                    </button>
                    <h1 className="page-title">Gửi thông báo</h1>
                </div>

                <form className="notification-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title" className="form-label required">
                            Tiêu đề
                        </label>
                        <input
                            id="title"
                            type="text"
                            className="form-input"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Nhập tiêu đề thông báo"
                            required
                            maxLength={1000}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message" className="form-label required">
                            Nội dung
                        </label>
                        <textarea
                            id="message"
                            className="form-textarea"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Nhập nội dung thông báo"
                            required
                            rows={6}
                            maxLength={1000}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Người nhận</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="recipientType"
                                    value="all"
                                    checked={recipientType === "all"}
                                    onChange={(e) => setRecipientType(e.target.value as any)}
                                />
                                <span>Tất cả người dùng</span>
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="recipientType"
                                    value="role"
                                    checked={recipientType === "role"}
                                    onChange={(e) => setRecipientType(e.target.value as any)}
                                />
                                <span>Theo vai trò</span>
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="recipientType"
                                    value="user"
                                    checked={recipientType === "user"}
                                    onChange={(e) => setRecipientType(e.target.value as any)}
                                />
                                <span>Một người dùng cụ thể</span>
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="recipientType"
                                    value="users"
                                    checked={recipientType === "users"}
                                    onChange={(e) => setRecipientType(e.target.value as any)}
                                />
                                <span>Nhiều người dùng (phân cách bằng dấu phẩy)</span>
                            </label>
                        </div>

                        {recipientType === "role" && (
                            <select
                                className="form-select"
                                value={formData.role || ""}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                            >
                                <option value="">Chọn vai trò</option>
                                <option value="Student">Học viên</option>
                                <option value="Tutor">Gia sư</option>
                                <option value="Parent">Phụ huynh</option>
                            </select>
                        )}

                        {recipientType === "user" && (
                            <div>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.userEmail || ""}
                                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value, userId: undefined })}
                                    placeholder="Nhập email người dùng (ví dụ: user@example.com)"
                                />
                                <small style={{ display: "block", marginTop: "0.5rem", color: "#666", fontSize: "0.875rem" }}>
                                    💡 Tip: Bạn có thể tìm email của user trong trang Quản lý → Học viên/Gia sư/Phụ huynh
                                </small>
                            </div>
                        )}

                        {recipientType === "users" && (
                            <div>
                                <textarea
                                    className="form-textarea"
                                    value={userIdsInput}
                                    onChange={(e) => setUserIdsInput(e.target.value)}
                                    placeholder="Nhập các email, phân cách bằng dấu phẩy (ví dụ: user1@example.com, user2@example.com, user3@example.com)"
                                    rows={3}
                                />
                                <small style={{ display: "block", marginTop: "0.5rem", color: "#666", fontSize: "0.875rem" }}>
                                    💡 Tip: Bạn có thể copy danh sách email từ trang Quản lý → Học viên/Gia sư/Phụ huynh
                                </small>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="relatedEntityId" className="form-label">
                            ID Entity liên quan (tùy chọn)
                        </label>
                        <input
                            id="relatedEntityId"
                            type="text"
                            className="form-input"
                            value={formData.relatedEntityId || ""}
                            onChange={(e) => setFormData({ ...formData, relatedEntityId: e.target.value })}
                            placeholder="VD: ClassId (nếu có)"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-cancel"
                            onClick={() => navigate(-1)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="btn btn-submit"
                            disabled={isSubmitting || !formData.title.trim() || !formData.message.trim()}
                        >
                            {isSubmitting ? "Đang gửi..." : (
                                <>
                                    <MdSend /> Gửi thông báo
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AdminSendNotificationPage;

