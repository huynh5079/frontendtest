import { type FC } from "react";
import { Modal } from "../modal";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { MdOutlineAttachMoney, MdPhoneAndroid } from "react-icons/md";
import { LoadingSpinner } from "../elements";
import type { CreateWithdrawalRequestParams } from "../../types/wallet";

interface WithdrawalRequestModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSubmit: (values: CreateWithdrawalRequestParams, helpers: FormikHelpers<CreateWithdrawalRequestParams>) => void;
    balance: number;
}

const WithdrawalRequestModal: FC<WithdrawalRequestModalProps> = ({
    isOpen,
    setIsOpen,
    onSubmit,
    balance,
}) => {
    const initialValues: CreateWithdrawalRequestParams = {
        amount: 0,
        method: "MoMo",
        recipientInfo: "",
        recipientName: "",
        note: "",
    };

    const withdrawalSchema = Yup.object().shape({
        amount: Yup.number()
            .min(10000, "Số tiền rút tối thiểu là 10,000 VND")
            .max(balance, `Số tiền không được vượt quá số dư hiện tại: ${balance.toLocaleString()} VND`)
            .required("Vui lòng nhập số tiền"),
        method: Yup.string().required("Vui lòng chọn phương thức"),
        recipientInfo: Yup.string()
            .required("Vui lòng nhập thông tin nhận tiền")
            .when("method", {
                is: "MoMo",
                then: (schema) =>
                    schema.matches(/^0\d{9}$/, "Số điện thoại MoMo không hợp lệ (10 chữ số, bắt đầu bằng 0)"),
            }),
        recipientName: Yup.string(),
        note: Yup.string(),
    });

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Yêu cầu rút tiền">
            <Formik
                initialValues={initialValues}
                validationSchema={withdrawalSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting, values }) => (
                    <Form action="" className="form">
                        <div className="form-field">
                            <label className="form-label">Số tiền (VND)</label>
                            <div className="form-input-container">
                                <MdOutlineAttachMoney className="form-input-icon" />
                                <Field
                                    type="number"
                                    className="form-input"
                                    placeholder="Nhập số tiền (tối thiểu 10,000 VND)"
                                    name="amount"
                                    min="10000"
                                    max={balance}
                                />
                            </div>
                            <ErrorMessage
                                name="amount"
                                component="div"
                                className="text-error"
                            />
                            <p className="form-hint">
                                Số dư hiện tại: <strong>{balance.toLocaleString()} VND</strong>
                            </p>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Phương thức rút tiền</label>
                            <Field as="select" className="form-input" name="method">
                                <option value="MoMo">Ví điện tử MoMo</option>
                                <option value="BankTransfer">Chuyển khoản ngân hàng</option>
                                <option value="PayPal">PayPal</option>
                            </Field>
                            <ErrorMessage
                                name="method"
                                component="div"
                                className="text-error"
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">
                                {values.method === "MoMo"
                                    ? "Số điện thoại MoMo"
                                    : values.method === "BankTransfer"
                                        ? "Số tài khoản ngân hàng"
                                        : "Email PayPal"}
                            </label>
                            <div className="form-input-container">
                                <MdPhoneAndroid className="form-input-icon" />
                                <Field
                                    type="text"
                                    className="form-input"
                                    placeholder={
                                        values.method === "MoMo"
                                            ? "Nhập số điện thoại MoMo (10 chữ số)"
                                            : values.method === "BankTransfer"
                                                ? "Nhập số tài khoản ngân hàng"
                                                : "Nhập email PayPal"
                                    }
                                    name="recipientInfo"
                                />
                            </div>
                            <ErrorMessage
                                name="recipientInfo"
                                component="div"
                                className="text-error"
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Tên người nhận (tùy chọn)</label>
                            <Field
                                type="text"
                                className="form-input"
                                placeholder="Nhập tên người nhận"
                                name="recipientName"
                            />
                            <ErrorMessage
                                name="recipientName"
                                component="div"
                                className="text-error"
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Ghi chú (tùy chọn)</label>
                            <Field
                                as="textarea"
                                className="form-input"
                                placeholder="Nhập ghi chú"
                                name="note"
                                rows={3}
                            />
                            <ErrorMessage
                                name="note"
                                component="div"
                                className="text-error"
                            />
                        </div>

                        <div className="form-note">
                            <p>
                                <strong>Lưu ý:</strong> Yêu cầu rút tiền sẽ được xử lý tự động ngay lập tức. Tiền sẽ được trừ khỏi ví và chuyển đến tài khoản của bạn.
                            </p>
                        </div>

                        <button
                            className={isSubmitting ? "disable-btn" : "pr-btn"}
                            type="submit"
                            style={{
                                padding: "0.75rem 0.5rem",
                                fontSize: "1.25rem",
                            }}
                        >
                            {isSubmitting ? <LoadingSpinner /> : "Gửi yêu cầu"}
                        </button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default WithdrawalRequestModal;

