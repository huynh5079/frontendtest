import { useEffect, useState, type FC } from "react";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaMapMarkerAlt,
    FaUserFriends,
    FaPhoneAlt,
} from "react-icons/fa";
import type { CreateChildAccountParams } from "../../../types/parent";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import { LoadingSpinner, MultiSelect } from "../../elements";
import type { OptionMultiSelectData } from "../../../types/app";
import {
    selectDetailChildAccount,
    selectListChildAccount,
    selectProfileParent,
} from "../../../app/selector";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { MdOutlineLeaderboard } from "react-icons/md";
import {
    createChildAccountApiThunk,
    getAllChildAccountApiThunk,
    getDetailChildAccountApiThunk,
} from "../../../services/parent/childAccount/childAccountThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDocumentTitle } from "../../../utils/helper";

export const subjectsOptions: OptionMultiSelectData[] = [
    { value: "Toán", label: "Toán" },
    { value: "Tiếng Việt", label: "Tiếng Việt" },
    { value: "Tiếng Anh", label: "Tiếng Anh" },
    { value: "Ngữ văn", label: "Ngữ Văn" },
    { value: "Vật Lí", label: "Vật Lí" },
    { value: "Hóa Học", label: "Hóa Học" },
    { value: "Sinh Học", label: "Sinh Học" },
];

const levelSubjectsMap: Record<string, string[]> = {
    "Tiểu học": ["Toán", "Tiếng Việt", "Tiếng Anh"],
    "Trung học cơ sở": [
        "Toán",
        "Tiếng Anh",
        "Ngữ văn",
        "Vật Lí",
        "Hóa Học",
        "Sinh Học",
    ],
    "Trung học phổ thông": [
        "Toán",
        "Tiếng Anh",
        "Ngữ văn",
        "Vật Lí",
        "Hóa Học",
        "Sinh Học",
    ],
};

const ParentChildAccount: FC = () => {
    const dispatch = useAppDispatch();
    const parentProfile = useAppSelector(selectProfileParent);
    const childAccounts = useAppSelector(selectListChildAccount);
    const childAccount = useAppSelector(selectDetailChildAccount);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const [isStep, setIsStep] = useState(1);

    const handleNextStep = () => setIsStep(isStep + 1);
    const handlePrevStep = () => setIsStep(isStep - 1);
    const [filteredSubjects, setFilteredSubjects] = useState<
        OptionMultiSelectData[]
    >([]);

    useEffect(() => {
        dispatch(getAllChildAccountApiThunk());
    }, [dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(getDetailChildAccountApiThunk(id));
        }
    }, [dispatch, id]);

    const handleViewDetail = (id: string) => {
        navigate(`/parent/information?tab=child-account&id=${id}`);
    };

    const handleBack = () => {
        navigate(`/parent/information?tab=child-account`);
    };

    const initialValues: CreateChildAccountParams = {
        username: "",
        email: "",
        address: parentProfile?.address || "",
        phone: parentProfile?.phone || "",
        educationLevelId: "",
        preferredSubjects: "",
        relationship: "",
        initialPassword: "",
    };

    const validationSchema = Yup.object({
        username: Yup.string().required("Vui lòng nhập họ và tên"),
        email: Yup.string().email("Email không hợp lệ"),
        educationLevelId: Yup.string().required(
            "Vui lòng chọn trình độ học vấn"
        ),
        preferredSubjects: Yup.string().required(
            "Vui lòng nhập môn học yêu thích"
        ),
        relationship: Yup.string().required("Vui lòng nhập mối quan hệ"),
        initialPassword: Yup.string()
            .min(8, "Mật khẩu tối thiểu 8 ký tự")
            .required("Vui lòng nhập mật khẩu"),
    });

    const handleSubmit = async (
        values: CreateChildAccountParams,
        helpers: FormikHelpers<CreateChildAccountParams>
    ) => {
        await dispatch(createChildAccountApiThunk(values))
            .unwrap()
            .then((res) => {
                const message = get(res, "message", "Tạo tài khoản thành công");
                toast.success(message);
            })
            .catch((error) => {
                const errorData = get(error, "message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                helpers.setSubmitting(false);
                helpers.resetForm();
                setIsStep(1);
            });
    };

    const handleLevelChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
        setFieldValue: any
    ) => {
        const selectedLevel = e.target.value;
        setFieldValue("educationLevelId", selectedLevel);

        const allowedSubjects = levelSubjectsMap[selectedLevel] || [];
        const newFiltered = subjectsOptions.filter((s) =>
            allowedSubjects.includes(s.value)
        );
        setFilteredSubjects(newFiltered);
    };

    useDocumentTitle("Danh sách tài khoản của con");

    return (
        <div className="parent-child-account">
            {isStep === 1 && (
                <>
                    {!id ? (
                        <div
                            className={`pca-step-1 step ${
                                isStep === 1 ? "step-active" : "step-hidden"
                            }`}
                        >
                            <div className="pcas1r1">
                                <h3>Danh sách tài khoản của con</h3>
                                <button
                                    className="pr-btn"
                                    onClick={handleNextStep}
                                >
                                    Tạo tài khoản
                                </button>
                            </div>
                            <div className="pcas1r2">
                                <table className="table">
                                    <thead className="table-head">
                                        <tr className="table-head-row">
                                            <th className="table-head-cell">
                                                Họ và Tên
                                            </th>
                                            <th className="table-head-cell">
                                                Email
                                            </th>
                                            <th className="table-head-cell">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body">
                                        {childAccounts?.map((childAccount) => (
                                            <tr key={childAccount.studentId}>
                                                <td className="table-body-cell">
                                                    {childAccount.username}
                                                </td>
                                                <td className="table-body-cell">
                                                    {childAccount.email}
                                                </td>
                                                <td className="table-body-cell">
                                                    <button
                                                        onClick={() =>
                                                            handleViewDetail(
                                                                childAccount.studentId
                                                            )
                                                        }
                                                        className="pr-btn"
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
                    ) : (
                        <div
                            className={`pca-step-1 step ${
                                isStep === 1 ? "step-active" : "step-hidden"
                            }`}
                        >
                            <div className="pcas1r1">
                                <h3>Chi tiết tài khoản của con</h3>
                                <button className="pr-btn" onClick={handleBack}>
                                    Quay lại
                                </button>
                            </div>
                            <div className="pcas1r2 pcas1r2-detail">
                                <div className="pcas1r2dc1">
                                    <img src={childAccount?.avatarUrl} alt="" />
                                </div>
                                <div className="pcas1r2dc2">
                                    <h4>Họ và tên:</h4>
                                    <p>{childAccount?.username}</p>
                                    <h4>Email:</h4>
                                    <p>{childAccount?.email}</p>
                                    <h4>Ngày sinh:</h4>
                                    <p>
                                        {childAccount?.dateOfBirth ||
                                            "Chưa cập nhật"}
                                    </p>
                                    <h4>Giới tính:</h4>
                                    <p>
                                        {childAccount?.gender ||
                                            "Chưa cập nhật"}
                                    </p>
                                    <h4>Trình độ học vấn:</h4>
                                    <p>
                                        {childAccount?.educationLevel ||
                                            "Chưa cập nhật"}
                                    </p>
                                    <h4>Môn học yêu thích:</h4>
                                    <p>{childAccount?.preferredSubjects}</p>
                                    <h4>Mối quan hệ:</h4>
                                    <p>{childAccount?.relationship}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {isStep === 2 && (
                <div
                    className={`pca-step-2 step ${
                        isStep === 2 ? "step-active" : "step-hidden"
                    }`}
                >
                    <button className="sc-btn" onClick={handlePrevStep}>
                        Quay lại
                    </button>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, setFieldValue }) => (
                            <Form className="form">
                                {/* Họ và tên */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Họ và tên
                                    </label>
                                    <div className="form-input-container">
                                        <FaUser className="form-input-icon" />
                                        <Field
                                            type="text"
                                            name="username"
                                            className="form-input"
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="username"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Email */}
                                <div className="form-field">
                                    <label className="form-label">Email</label>
                                    <div className="form-input-container">
                                        <FaEnvelope className="form-input-icon" />
                                        <Field
                                            type="email"
                                            name="email"
                                            className="form-input"
                                            placeholder="Nhập email"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Mật khẩu */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Mật khẩu
                                    </label>
                                    <div className="form-input-container">
                                        <FaLock className="form-input-icon" />
                                        <Field
                                            type="password"
                                            name="initialPassword"
                                            className="form-input"
                                            placeholder="Nhập mật khẩu"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="initialPassword"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Địa chỉ */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Địa chỉ
                                    </label>
                                    <div className="form-input-container">
                                        <FaMapMarkerAlt className="form-input-icon" />
                                        <Field
                                            type="text"
                                            name="address"
                                            className="form-input"
                                            placeholder="Nhập địa chỉ"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="address"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Mối quan hệ */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Mối quan hệ
                                    </label>
                                    <div className="form-input-container">
                                        <FaUserFriends className="form-input-icon" />
                                        <Field
                                            as="select"
                                            name="relationship"
                                            className="form-input"
                                        >
                                            <option value="">
                                                -- Chọn mối quan hệ --
                                            </option>
                                            <option value="Cha/Con">
                                                Cha/Con
                                            </option>
                                            <option value="Mẹ/Con">
                                                Mẹ/Con
                                            </option>
                                            <option value="Anh/Em">
                                                Anh/Em
                                            </option>
                                            <option value="Chị/Em">
                                                Chị/Em
                                            </option>
                                        </Field>
                                    </div>
                                    <ErrorMessage
                                        name="relationship"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Số đth */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Số điện thoại
                                    </label>
                                    <div className="form-input-container">
                                        <FaPhoneAlt className="form-input-icon" />
                                        <Field
                                            type="text"
                                            name="phone"
                                            className="form-input"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="phone"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Cấp bậc học */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Cấp bậc học
                                    </label>
                                    <div className="form-input-container">
                                        <MdOutlineLeaderboard className="form-input-icon" />
                                        <Field
                                            as="select"
                                            name="educationLevelId"
                                            className="form-input"
                                            onChange={(e: any) =>
                                                handleLevelChange(
                                                    e,
                                                    setFieldValue
                                                )
                                            }
                                        >
                                            <option value="">
                                                -- Chọn cấp độ --
                                            </option>
                                            <option value="Tiểu học">
                                                Tiểu học
                                            </option>
                                            <option value="Trung học cơ sở">
                                                Trung học cơ sở
                                            </option>
                                            <option value="Trung học phổ thông">
                                                Trung học phổ thông
                                            </option>
                                        </Field>
                                    </div>
                                    <ErrorMessage
                                        name="educationLevelId"
                                        component="p"
                                        className="text-error"
                                    />
                                </div>

                                {/* Môn học yêu thích */}
                                <div className="form-field">
                                    <MultiSelect
                                        label="Môn học yêu thích"
                                        placeholder="Chọn môn học yêu thích"
                                        options={filteredSubjects}
                                        onChange={(selected) =>
                                            setFieldValue(
                                                "preferredSubjects",
                                                selected
                                                    .map((s) => s.value)
                                                    .join(", ")
                                            )
                                        }
                                    />
                                    <ErrorMessage
                                        name="preferredSubjects"
                                        component="p"
                                        className="text-error"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="pr-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <LoadingSpinner />
                                    ) : (
                                        "Tạo tài khoản"
                                    )}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}
        </div>
    );
};

export default ParentChildAccount;
