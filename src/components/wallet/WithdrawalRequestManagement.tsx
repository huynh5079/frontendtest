import { type FC } from "react";
import { Modal } from "../modal";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { LoadingSpinner } from "../elements";
import type { ApproveWithdrawalRequestParams, RejectWithdrawalRequestParams } from "../../types/wallet";

interface WithdrawalRequestManagementProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    requestId: string;
    userName?: string;
    amount: number;
    method: string;
    status: string;
    recipientInfo: string;
    recipientName?: string;
    note?: string;
    onApprove: (requestId: string, params: ApproveWithdrawalRequestParams) => Promise<void>;
    onReject: (requestId: string, params: RejectWithdrawalRequestParams) => Promise<void>;
}

const WithdrawalRequestManagement: FC<WithdrawalRequestManagementProps> = ({
    isOpen,
    setIsOpen,
    requestId,
    userName,
    amount,
    method,
    status,
    recipientInfo,
    recipientName,
    note,
    onApprove,
    onReject,
}) => {
    const approveInitialValues: ApproveWithdrawalRequestParams = {
        adminNote: "",
    };

    const rejectInitialValues: RejectWithdrawalRequestParams = {
        reason: "",
        adminNote: "",
    };

    const approveSchema = Yup.object().shape({
        adminNote: Yup.string(),
    });

    const rejectSchema = Yup.object().shape({
        reason: Yup.string().required("Vui lòng nhập lý do từ chối"),
        adminNote: Yup.string(),
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            Pending: "Chờ duyệt",
            Approved: "Đã duyệt",
            Processing: "Đang xử lý",
            Succeeded: "Thành công",
            Completed: "Hoàn thành",
            Failed: "Thất bại",
            Rejected: "Từ chối",
            Cancelled: "Đã hủy",
        };
        return statusMap[status] || status;
    };

    const getMethodText = (method: string) => {
        const methodMap: Record<string, string> = {
            MoMo: "Ví điện tử MoMo",
            BankTransfer: "Chuyển khoản ngân hàng",
            PayPal: "PayPal",
        };
        return methodMap[method] || method;
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Chi tiết yêu cầu rút tiền">
            <div className="withdrawal-request-detail">
                <div className="detail-section">
                    <h5>Thông tin người dùng</h5>
                    <div className="detail-item">
                        <label>Người yêu cầu:</label>
                        <span>{userName || "N/A"}</span>
                    </div>
                </div>

                <div className="detail-section">
                    <h5>Thông tin yêu cầu</h5>
                    <div className="detail-item">
                        <label>Số tiền:</label>
                        <span className="amount-value">{formatCurrency(amount)}</span>
                    </div>
                    <div className="detail-item">
                        <label>Phương thức:</label>
                        <span>{getMethodText(method)}</span>
                    </div>
                    <div className="detail-item">
                        <label>Thông tin nhận tiền:</label>
                        <span>{recipientInfo}</span>
                    </div>
                    {recipientName && (
                        <div className="detail-item">
                            <label>Tên người nhận:</label>
                            <span>{recipientName}</span>
                        </div>
                    )}
                    <div className="detail-item">
                        <label>Trạng thái:</label>
                        <span className={`status-badge ${status === "Pending" ? "status-pending" : status === "Succeeded" || status === "Completed" ? "status-succeeded" : "status-failed"}`}>
                            {getStatusText(status)}
                        </span>
                    </div>
                    {note && (
                        <div className="detail-item">
                            <label>Ghi chú của người dùng:</label>
                            <span>{note}</span>
                        </div>
                    )}
                </div>

                {status === "Pending" && (
                    <div className="action-section" style={{ marginTop: "2rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
                        <h5>Thao tác</h5>
                        
                        {/* Approve Form */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <h6 style={{ marginBottom: "0.5rem", color: "#059669" }}>Duyệt yêu cầu</h6>
                            <Formik
                                initialValues={approveInitialValues}
                                validationSchema={approveSchema}
                                onSubmit={async (values, helpers) => {
                                    try {
                                        await onApprove(requestId, values);
                                        setIsOpen(false);
                                    } catch (error) {
                                        helpers.setSubmitting(false);
                                    }
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div className="form-field">
                                            <label className="form-label">Ghi chú (tùy chọn)</label>
                                            <Field
                                                as="textarea"
                                                className="form-input"
                                                placeholder="Nhập ghi chú cho người dùng"
                                                name="adminNote"
                                                rows={3}
                                            />
                                        </div>
                                        <button
                                            className={isSubmitting ? "disable-btn" : "pr-btn"}
                                            type="submit"
                                            style={{
                                                backgroundColor: "#059669",
                                                width: "100%",
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? <LoadingSpinner /> : "Duyệt yêu cầu"}
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>

                        {/* Reject Form */}
                        <div>
                            <h6 style={{ marginBottom: "0.5rem", color: "#dc2626" }}>Từ chối yêu cầu</h6>
                            <Formik
                                initialValues={rejectInitialValues}
                                validationSchema={rejectSchema}
                                onSubmit={async (values, helpers) => {
                                    try {
                                        await onReject(requestId, values);
                                        setIsOpen(false);
                                    } catch (error) {
                                        helpers.setSubmitting(false);
                                    }
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div className="form-field">
                                            <label className="form-label">Lý do từ chối *</label>
                                            <Field
                                                as="textarea"
                                                className="form-input"
                                                placeholder="Nhập lý do từ chối yêu cầu"
                                                name="reason"
                                                rows={3}
                                                required
                                            />
                                            <ErrorMessage
                                                name="reason"
                                                component="div"
                                                className="text-error"
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Ghi chú (tùy chọn)</label>
                                            <Field
                                                as="textarea"
                                                className="form-input"
                                                placeholder="Nhập ghi chú bổ sung"
                                                name="adminNote"
                                                rows={2}
                                            />
                                        </div>
                                        <button
                                            className={isSubmitting ? "disable-btn" : "pr-btn"}
                                            type="submit"
                                            style={{
                                                backgroundColor: "#dc2626",
                                                width: "100%",
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? <LoadingSpinner /> : "Từ chối yêu cầu"}
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default WithdrawalRequestManagement;

