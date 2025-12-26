import { useEffect, useState, type FC } from "react";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaMapMarkerAlt,
    FaUserFriends,
    FaPhoneAlt,
    FaLink,
    FaEdit,
    FaTrash,
    FaVenusMars,
} from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import { DatePickerElement, LoadingSpinner, MultiSelect } from "../../elements";
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
    linkChildAccountApiThunk,
    updateChildAccountApiThunk,
    unlinkChildAccountApiThunk,
} from "../../../services/parent/childAccount/childAccountThunk";
import type {
    CreateChildAccountParams,
    LinkExistingChildRequest,
    UpdateChildRequest,
} from "../../../types/parent";
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

const ITEMS_PER_PAGE = 6;

const ParentChildAccount: FC = () => {
    const dispatch = useAppDispatch();
    const parentProfile = useAppSelector(selectProfileParent);
    const childAccounts = useAppSelector(selectListChildAccount);
    const childAccount = useAppSelector(selectDetailChildAccount);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [currentPage, setCurrentPage] = useState(1);

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

    const totalPages = Math.ceil((childAccounts?.length || 0) / ITEMS_PER_PAGE);
    const paginatedItems = childAccounts?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
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
        gender: "Nam",
        dateOfBirth: "",
    };

    const validationSchema = Yup.object({
        username: Yup.string().required("Vui lòng nhập họ và tên"),
        email: Yup.string().email("Email không hợp lệ"),
        educationLevelId: Yup.string().required(
            "Vui lòng chọn trình độ học vấn",
        ),
        preferredSubjects: Yup.string().required(
            "Vui lòng nhập môn học yêu thích",
        ),
        relationship: Yup.string().required("Vui lòng nhập mối quan hệ"),
        initialPassword: Yup.string()
            .min(8, "Mật khẩu tối thiểu 8 ký tự")
            .required("Vui lòng nhập mật khẩu"),
        gender: Yup.string().required("Vui lòng chọn giới tính"),
        dateOfBirth: Yup.string().required("Vui lòng chọn ngày sinh"),
    });

    const handleSubmit = async (
        values: CreateChildAccountParams,
        helpers: FormikHelpers<CreateChildAccountParams>,
    ) => {
        await dispatch(createChildAccountApiThunk(values))
            .unwrap()
            .then(() => {
                toast.success("Tạo tài khoản thành công");
                dispatch(getAllChildAccountApiThunk());
                helpers.resetForm();
                setIsStep(1);
            })
            .catch((error) => {
                toast.error(get(error, "message", "Có lỗi xảy ra"));
            })
            .finally(() => {
                helpers.setSubmitting(false);
            });
    };

    // --- LINK ACCOUNT LOGIC ---
    const initialValuesLink: LinkExistingChildRequest = {
        studentEmail: "",
        relationship: "",
    };

    const validationSchemaLink = Yup.object({
        studentEmail: Yup.string()
            .email("Email không hợp lệ")
            .required("Vui lòng nhập email"),
        relationship: Yup.string().required("Vui lòng nhập mối quan hệ"),
    });

    const handleLinkSubmit = async (
        values: LinkExistingChildRequest,
        helpers: FormikHelpers<LinkExistingChildRequest>,
    ) => {
        await dispatch(linkChildAccountApiThunk(values))
            .unwrap()
            .then(() => {
                toast.success("Liên kết tài khoản thành công");
                dispatch(getAllChildAccountApiThunk()); // Refresh list
                setIsStep(1);
            })
            .catch((error) => {
                toast.error(get(error, "message", "Có lỗi xảy ra"));
            })
            .finally(() => {
                helpers.setSubmitting(false);
            });
    };

    // --- UPDATE ACCOUNT LOGIC ---
    // State to hold data for the child being updated
    const [updatingChild, setUpdatingChild] = useState<UpdateChildRequest>({});

    const initialValuesUpdate: UpdateChildRequest = {
        username: updatingChild.username || "",
        phone: updatingChild.phone || "",
        address: updatingChild.address || "",
        educationLevel: updatingChild.educationLevel || "",
        preferredSubjects: updatingChild.preferredSubjects || "",
        gender: updatingChild.gender || "Nam",
        dateOfBirth: updatingChild.dateOfBirth || "",
    };

    const validationSchemaUpdate = Yup.object({
        username: Yup.string().required("Vui lòng nhập họ và tên"),
        // Phone/Address optional but if entered should be valid if needed
        educationLevel: Yup.string().required("Vui lòng chọn trình độ"),
        preferredSubjects: Yup.string().required("Vui lòng nhập môn học"),
    });

    const handleUpdateSubmit = async (
        values: UpdateChildRequest,
        helpers: FormikHelpers<UpdateChildRequest>,
    ) => {
        if (!id) return;
        await dispatch(
            updateChildAccountApiThunk({ studentId: id, params: values }),
        )
            .unwrap()
            .then((res) => {
                toast.success(get(res, "message", "Cập nhật thành công"));
                dispatch(getDetailChildAccountApiThunk(id)); // Refresh detail
                setIsStep(1); // Go back to detail view
            })
            .catch((error) => {
                toast.error(get(error, "message", "Có lỗi xảy ra"));
            })
            .finally(() => {
                helpers.setSubmitting(false);
            });
    };

    // --- UNLINK LOGIC ---
    const handleUnlink = async () => {
        if (!id) return;
        if (
            window.confirm(
                "Bạn có chắc chắn muốn gỡ liên kết với tài khoản này không? Hành động này không thể hoàn tác.",
            )
        ) {
            await dispatch(unlinkChildAccountApiThunk(id))
                .unwrap()
                .then((res) => {
                    toast.success(
                        get(res, "message", "Gỡ liên kết thành công"),
                    );
                    navigate(`/parent/information?tab=child-account`); // Go back to list
                    dispatch(getAllChildAccountApiThunk());
                })
                .catch((error) => {
                    toast.error(get(error, "message", "Có lỗi xảy ra"));
                });
        }
    };

    // Helper to start Update: pre-fill data
    const handleStartUpdate = () => {
        if (!childAccount) return;
        setUpdatingChild({
            username: childAccount.username,
            phone: childAccount.phone,
            address: childAccount.address,
            educationLevel: childAccount.educationLevel || "",
            preferredSubjects: childAccount.preferredSubjects,
            gender: childAccount.gender || "Nam",
            dateOfBirth: childAccount.dateOfBirth || "",
        });
        // Select logic for education level to filter subjects map
        // (Re-using handleLevelChange logic might be tricky without event,
        //  so we manually trigger subject filter if needed, or just let user pick)
        if (childAccount.educationLevel) {
            const allowedSubjects =
                levelSubjectsMap[childAccount.educationLevel] || [];
            const newFiltered = subjectsOptions.filter((s) =>
                allowedSubjects.includes(s.value),
            );
            setFilteredSubjects(newFiltered);
        }
        setIsStep(4);
    };

    const handleLevelChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
        setFieldValue: any,
        fieldName: string = "educationLevelId",
    ) => {
        const selectedLevel = e.target.value;
        setFieldValue(fieldName, selectedLevel);

        const allowedSubjects = levelSubjectsMap[selectedLevel] || [];
        const newFiltered = subjectsOptions.filter((s) =>
            allowedSubjects.includes(s.value),
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
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        className="pr-btn"
                                        onClick={() => setIsStep(2)}
                                    >
                                        Tạo tài khoản
                                    </button>
                                    <button
                                        className="pr-btn"
                                        onClick={() => setIsStep(3)}
                                    >
                                        Liên kết tài khoản
                                    </button>
                                </div>
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
                                        {paginatedItems?.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="table-body-cell no-data"
                                                >
                                                    Không có tài khoản con
                                                </td>
                                            </tr>
                                        ) : (
                                            <>
                                                {paginatedItems?.map(
                                                    (childAccount) => (
                                                        <tr
                                                            key={
                                                                childAccount.studentId
                                                            }
                                                        >
                                                            <td className="table-body-cell">
                                                                {
                                                                    childAccount.username
                                                                }
                                                            </td>
                                                            <td className="table-body-cell">
                                                                {
                                                                    childAccount.email
                                                                }
                                                            </td>
                                                            <td className="table-body-cell">
                                                                <button
                                                                    onClick={() =>
                                                                        handleViewDetail(
                                                                            childAccount.studentId,
                                                                        )
                                                                    }
                                                                    className="pr-btn"
                                                                >
                                                                    Chi tiết
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </>
                                        )}
                                    </tbody>
                                </table>

                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="sc-btn"
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                        >
                                            Trước
                                        </button>
                                        <span>
                                            {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            className="sc-btn"
                                            onClick={handleNextPage}
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            Sau
                                        </button>
                                    </div>
                                )}
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
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        className="pr-btn"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "5px",
                                        }}
                                        onClick={handleStartUpdate}
                                    >
                                        <FaEdit /> Cập nhật
                                    </button>
                                    <button
                                        className="pr-btn"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "5px",
                                        }}
                                        onClick={handleUnlink}
                                    >
                                        <FaTrash /> Gỡ liên kết
                                    </button>
                                    <button
                                        className="pr-btn"
                                        onClick={handleBack}
                                    >
                                        Quay lại
                                    </button>
                                </div>
                            </div>
                            <div className="pcas1r2 pcas1r2-detail">
                                <div className="pcas1r2dr1">
                                    <img src={childAccount?.avatarUrl} alt="" />
                                </div>
                                <div className="pcas1r2dr2">
                                    <div className="child-account-detail">
                                        <div className="group-content">
                                            <div className="detail-item">
                                                <h4>Họ và tên:</h4>
                                                <p>{childAccount?.username}</p>
                                            </div>

                                            <div className="detail-item">
                                                <h4>Email:</h4>
                                                <p>{childAccount?.email}</p>
                                            </div>

                                            <div className="detail-item">
                                                <h4>Ngày sinh:</h4>
                                                <p>
                                                    {childAccount?.dateOfBirth ||
                                                        "Chưa cập nhật"}
                                                </p>
                                            </div>
                                            <div className="detail-item">
                                                <h4>Giới tính:</h4>
                                                <p>
                                                    {childAccount?.gender ===
                                                    "male"
                                                        ? "Nam"
                                                        : childAccount?.gender ===
                                                          "female"
                                                        ? "Nữ"
                                                        : "Chưa cập nhật"}
                                                </p>
                                            </div>
                                            <div className="detail-item">
                                                <h4>Trình độ học vấn:</h4>
                                                <p>
                                                    {childAccount?.educationLevel ||
                                                        "Chưa cập nhật"}
                                                </p>
                                            </div>
                                            <div className="detail-item">
                                                <h4>Môn học yêu thích:</h4>
                                                <p>
                                                    {
                                                        childAccount?.preferredSubjects
                                                    }
                                                </p>
                                            </div>
                                            <div className="detail-item">
                                                <h4>Mối quan hệ:</h4>
                                                <p>
                                                    {childAccount?.relationship}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
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
                        {({ isSubmitting, setFieldValue, values }) => (
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
                                                    setFieldValue,
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
                                                    .join(", "),
                                            )
                                        }
                                    />
                                    <ErrorMessage
                                        name="preferredSubjects"
                                        component="div"
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

            {isStep === 3 && (
                <div
                    className={`pca-step-2 step ${
                        isStep === 3 ? "step-active" : "step-hidden"
                    }`}
                >
                    <button className="sc-btn" onClick={() => setIsStep(1)}>
                        Quay lại
                    </button>
                    <div style={{ marginTop: "20px" }}>
                        <h3>Liên kết tài khoản con có sẵn</h3>
                        <p style={{ marginBottom: "20px", color: "#666" }}>
                            Nhập email của tài khoản học sinh đã tồn tại để liên
                            kết.
                        </p>
                    </div>

                    <Formik
                        initialValues={initialValuesLink}
                        validationSchema={validationSchemaLink}
                        onSubmit={handleLinkSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="form">
                                <div className="form-field">
                                    <label className="form-label">
                                        Email học sinh
                                    </label>
                                    <div className="form-input-container">
                                        <FaEnvelope className="form-input-icon" />
                                        <Field
                                            type="email"
                                            name="studentEmail"
                                            className="form-input"
                                            placeholder="Nhập email học sinh"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="studentEmail"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

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

                                <button
                                    type="submit"
                                    className="pr-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <LoadingSpinner />
                                    ) : (
                                        "Liên kết tài khoản"
                                    )}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}

            {isStep === 4 && (
                <div
                    className={`pca-step-2 step ${
                        isStep === 4 ? "step-active" : "step-hidden"
                    }`}
                >
                    <button className="sc-btn" onClick={() => setIsStep(1)}>
                        Quay lại
                    </button>
                    <div style={{ marginTop: "20px" }}>
                        <h3>Cập nhật thông tin con</h3>
                    </div>

                    <Formik
                        initialValues={initialValuesUpdate}
                        validationSchema={validationSchemaUpdate}
                        onSubmit={handleUpdateSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, setFieldValue, values }) => (
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

                                {/* Address */}
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
                                </div>

                                {/* Phone */}
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
                                </div>

                                {/* Giới tính */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Giới tính
                                    </label>
                                    <div className="form-input-container">
                                        <FaVenusMars className="form-input-icon" />
                                        <Field
                                            as="select"
                                            name="gender"
                                            className="form-input"
                                        >
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </Field>
                                    </div>
                                    <ErrorMessage
                                        name="gender"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Ngày sinh */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Ngày sinh
                                    </label>
                                    <div className="form-input-container">
                                        <CiCalendarDate className="form-input-icon" />
                                        <DatePickerElement
                                            value={
                                                values.dateOfBirth
                                                    ? new Date(
                                                          values.dateOfBirth,
                                                      )
                                                    : null
                                            }
                                            onChange={(date) =>
                                                setFieldValue(
                                                    "dateOfBirth",
                                                    date?.toISOString() || "",
                                                )
                                            }
                                            maxDate={new Date()}
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="dateOfBirth"
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
                                            name="educationLevel"
                                            className="form-input"
                                            onChange={(e: any) =>
                                                handleLevelChange(
                                                    e,
                                                    setFieldValue,
                                                    "educationLevel",
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
                                                    .join(", "),
                                            )
                                        }
                                        value={
                                            updatingChild.preferredSubjects
                                                ? updatingChild.preferredSubjects
                                                      .split(", ")
                                                      .map((s) => ({
                                                          label: s,
                                                          value: s,
                                                      }))
                                                : []
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
                                        "Cập nhật"
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
