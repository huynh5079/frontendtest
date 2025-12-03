import { useEffect, useState, type FC } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import {
    MdOutlineDriveFileRenameOutline,
    MdOutlineEmail,
    MdOutlineDescription,
    MdOutlineLeaderboard,
} from "react-icons/md";
import { PiGenderIntersex } from "react-icons/pi";
import { CiCalendarDate } from "react-icons/ci";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { LiaMapMarkerAltSolid } from "react-icons/lia";
import {
    FaGraduationCap,
    FaUniversity,
    FaBookOpen,
    FaChalkboardTeacher,
    FaCertificate,
} from "react-icons/fa";
import { HiOutlineIdentification } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { TbBriefcase2 } from "react-icons/tb";
import { GiSkills } from "react-icons/gi";
import {
    DatePickerElement,
    LoadingSpinner,
    MultiSelect,
} from "../../../components/elements";
import type { OptionMultiSelectData } from "../../../types/app";
import type { RegisterTutor } from "../../../types/auth";
import { useAppDispatch } from "../../../app/store";
import { verifyEmailApiThunk } from "../../../services/auth/authThunk";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { toast } from "react-toastify";
import { get } from "lodash";
import { setRegisterTutorData } from "../../../services/auth/registerTutorSlice";

// --- Subject options ---
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

// --- FormField Component ---
interface FormFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    icon: FC<any>;
    type?: string;
    as?: "textarea" | "select";
    options?: { value: string; label: string }[];
    multiple?: boolean;
    onChangeFile?: (files: File[]) => void;
    onChange?: (e: any) => void; // <-- thêm dòng này
}

const FormField: FC<FormFieldProps> = ({
    name,
    label,
    placeholder,
    icon: Icon,
    type = "text",
    as,
    options,
    multiple,
    onChangeFile,
}) => (
    <div className="form-field">
        <label className="form-label">{label}</label>
        <div className="form-input-container">
            <Icon className="form-input-icon" />
            {onChangeFile ? (
                <input
                    type="file"
                    multiple={multiple}
                    className="form-input"
                    onChange={(e) =>
                        onChangeFile &&
                        onChangeFile(Array.from(e.target.files || []))
                    }
                />
            ) : as === "textarea" ? (
                <Field
                    as="textarea"
                    name={name}
                    placeholder={placeholder}
                    className="form-input"
                />
            ) : as === "select" ? (
                <Field as="select" name={name} className="form-input">
                    <option value="">-- Chọn --</option>
                    {options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </Field>
            ) : (
                <Field
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    className="form-input"
                />
            )}
        </div>
        <ErrorMessage name={name} component="p" className="text-error" />
    </div>
);

// --- Steps Components ---
const Step1: FC<any> = ({ values, setFieldValue }) => (
    <div className="form">
        <FormField
            name="username"
            label="Họ và tên"
            placeholder="Nhập họ và tên"
            icon={MdOutlineDriveFileRenameOutline}
        />
        <FormField
            name="gender"
            label="Giới tính"
            icon={PiGenderIntersex}
            as="select"
            options={[
                { value: "0", label: "Nam" },
                { value: "1", label: "Nữ" },
            ]}
        />
        <div className="form-field">
            <label className="form-label">Ngày sinh</label>
            <div className="form-input-container">
                <CiCalendarDate className="form-input-icon" />
                <DatePickerElement
                    value={values.DateOfBirth}
                    onChange={(date) => setFieldValue("DateOfBirth", date)}
                />
            </div>
            <ErrorMessage
                name="DateOfBirth"
                component="p"
                className="text-error"
            />
        </div>
        <FormField
            name="phoneNumber"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            icon={IoPhonePortraitOutline}
        />
        <FormField
            name="email"
            label="Email"
            placeholder="Nhập email"
            icon={MdOutlineEmail}
            type="email"
        />
        <FormField
            name="address"
            label="Địa chỉ"
            placeholder="Nhập địa chỉ"
            icon={LiaMapMarkerAltSolid}
        />
        <FormField
            name="password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            icon={RiLockPasswordLine}
            type="password"
        />
        <FormField
            name="identityDocuments"
            label="Căn cước công dân"
            icon={HiOutlineIdentification}
            onChangeFile={(files) => setFieldValue("identityDocuments", files)}
            multiple
        />
        <FormField
            name="seftDescription"
            label="Mô tả bản thân"
            placeholder="Mô tả bản thân"
            icon={MdOutlineDescription}
            as="textarea"
        />
    </div>
);

const Step2: FC<any> = ({ setFieldValue }) => {
    const [filteredSubjects, setFilteredSubjects] = useState<
        OptionMultiSelectData[]
    >([]);

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLevel = e.target.value;
        setFieldValue("teachingLevel", selectedLevel);
        const allowedSubjects = levelSubjectsMap[selectedLevel] || [];
        setFilteredSubjects(
            subjectsOptions.filter((s) => allowedSubjects.includes(s.value)),
        );
    };

    return (
        <div className="form">
            <FormField
                name="educationLevel"
                label="Trình độ học vấn"
                icon={FaGraduationCap}
                as="select"
                options={[
                    { value: "Đại học", label: "Đại học" },
                    { value: "Cao đẳng", label: "Cao đẳng" },
                    { value: "Đã tốt nghiệp", label: "Đã tốt nghiệp" },
                ]}
            />
            <FormField
                name="major"
                label="Ngành học"
                placeholder="Nhập ngành học"
                icon={FaBookOpen}
            />
            <FormField
                name="university"
                label="Trường/Đơn vị đào tạo"
                placeholder="Nhập tên trường"
                icon={FaUniversity}
            />
            <FormField
                name="teachingLevel"
                label="Cấp độ giảng dạy"
                icon={MdOutlineLeaderboard}
                as="select"
                options={[
                    { value: "Tiểu học", label: "Tiểu học" },
                    { value: "Trung học cơ sở", label: "Trung học cơ sở" },
                    {
                        value: "Trung học phổ thông",
                        label: "Trung học phổ thông",
                    },
                ]}
                onChange={(e: any) => handleLevelChange(e)}
            />
            <div className="form-field">
                <MultiSelect
                    label="Môn dạy"
                    placeholder="Chọn môn dạy"
                    options={filteredSubjects}
                    onChange={(selected) =>
                        setFieldValue(
                            "teachingSubjects",
                            selected.map((s) => s.value),
                        )
                    }
                />
                <ErrorMessage
                    name="teachingSubjects"
                    component="p"
                    className="text-error"
                />
            </div>
        </div>
    );
};

const Step3: FC<any> = ({ setFieldValue }) => (
    <div className="form">
        <FormField
            name="teachingExperienceYears"
            label="Số năm kinh nghiệm"
            placeholder="Nhập số năm kinh nghiệm"
            icon={TbBriefcase2}
        />
        <FormField
            name="experienceDetails"
            label="Chi tiết kinh nghiệm"
            placeholder="Nhập chi tiết kinh nghiệm"
            icon={FaChalkboardTeacher}
        />
        <FormField
            name="certificatesFiles"
            label="Chứng chỉ / Bằng cấp"
            icon={FaCertificate}
            onChangeFile={(files) => setFieldValue("certificatesFiles", files)}
            multiple
        />
        <FormField
            name="specialSkills"
            label="Kỹ năng đặc biệt"
            placeholder="Nhập kỹ năng đặc biệt"
            icon={GiSkills}
        />
    </div>
);

// --- Main RegisterTutorPage ---
const RegisterTutorPage: FC = () => {
    const dispatch = useAppDispatch();
    const [isStep, setIsStep] = useState(1);

    const initialValues: RegisterTutor = {
        username: "",
        password: "",
        email: "",
        gender: "",
        DateOfBirth: null,
        phoneNumber: "",
        address: "",
        seftDescription: "",
        educationLevel: "",
        university: "",
        major: "",
        teachingExperienceYears: "",
        experienceDetails: "",
        teachingSubjects: [],
        teachingLevel: "",
        specialSkills: "",
        certificatesFiles: [],
        identityDocuments: [],
    };

    const RegisterTutorSchema = Yup.object({
        username: Yup.string().required("Vui lòng nhập họ tên"),
        password: Yup.string()
            .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
            .required("Vui lòng nhập mật khẩu"),
        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Vui lòng nhập email"),
        gender: Yup.string().required("Vui lòng chọn giới tính"),
        DateOfBirth: Yup.date().nullable().required("Vui lòng chọn ngày sinh"),
        phoneNumber: Yup.string()
            .matches(/^[0-9]{9,11}$/, "Số điện thoại không hợp lệ")
            .required("Vui lòng nhập số điện thoại"),
        address: Yup.string().required("Vui lòng nhập địa chỉ"),
        seftDescription: Yup.string()
            .max(500, "Tối đa 500 ký tự")
            .required("Vui lòng nhập mô tả"),
        educationLevel: Yup.string().required("Vui lòng chọn trình độ học vấn"),
        university: Yup.string().required("Vui lòng nhập tên trường"),
        major: Yup.string().required("Vui lòng nhập chuyên ngành"),
        teachingExperienceYears: Yup.number()
            .typeError("Vui lòng nhập số năm hợp lệ")
            .min(0, "Không hợp lệ")
            .required("Vui lòng nhập số năm"),
        experienceDetails: Yup.string().required(
            "Vui lòng mô tả kinh nghiệm giảng dạy",
        ),
        teachingSubjects: Yup.array()
            .min(1, "Vui lòng chọn ít nhất một môn giảng dạy")
            .required("Vui lòng chọn môn giảng dạy"),
        teachingLevel: Yup.string().required("Vui lòng chọn cấp độ giảng dạy"),
        specialSkills: Yup.string()
            .max(200, "Tối đa 200 ký tự")
            .required("Vui lòng nhập kiểu năng đặc biệt"),
        certificatesFiles: Yup.array().min(
            1,
            "Vui lòng tải lên ít nhất một chứng chỉ",
        ),
        identityDocuments: Yup.array().min(
            1,
            "Vui lòng tải lên giấy tờ tùy thân",
        ),
    });

    const handleNextStep = () => setIsStep(isStep + 1);
    const handlePrevStep = () => setIsStep(isStep - 1);

    const handleSubmit = async (
        values: RegisterTutor,
        helpers: FormikHelpers<RegisterTutor>,
    ) => {
        await dispatch(verifyEmailApiThunk({ email: values.email }))
            .unwrap()
            .then(() => {
                dispatch(setRegisterTutorData(values));
                navigateHook(routes.verify_otp.tutor);
            })
            .catch((error) => {
                const errorData = get(error, "message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                helpers.setSubmitting(false);
            });
    };

    // === EFFECTS ===
    useEffect(() => {
        document.title = "Đăng ký trở thành gia sư";
    }, []);

    return (
        <section id="register-tutor-section">
            <div className="rts-container">
                <h2>Đăng ký tài khoản gia sư</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={RegisterTutorSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form>
                            {/* --- Steps header --- */}
                            <div className="rtscr1">
                                {[
                                    "Thông tin cá nhân",
                                    "Học vấn & chuyên môn",
                                    "Kinh nghiệm & kỹ năng",
                                ].map((title, idx) => (
                                    <div
                                        key={idx}
                                        className={`rtscr1-step ${
                                            isStep === idx + 1
                                                ? "rtscr1-step-active"
                                                : ""
                                        }`}
                                        onClick={() => setIsStep(idx + 1)}
                                    >
                                        <span>{idx + 1}</span>
                                        {title}
                                    </div>
                                ))}
                            </div>

                            {/* --- Step Content --- */}
                            {isStep === 1 && (
                                <Step1
                                    values={values}
                                    setFieldValue={setFieldValue}
                                />
                            )}
                            {isStep === 2 && (
                                <Step2
                                    values={values}
                                    setFieldValue={setFieldValue}
                                />
                            )}
                            {isStep === 3 && (
                                <Step3 setFieldValue={setFieldValue} />
                            )}

                            <div className="group-btn">
                                {isStep > 1 && (
                                    <button
                                        type="button"
                                        className="sc-btn"
                                        onClick={handlePrevStep}
                                    >
                                        Quay lại
                                    </button>
                                )}
                                {isStep < 3 ? (
                                    <button
                                        type="button"
                                        className="pr-btn"
                                        onClick={handleNextStep}
                                    >
                                        Tiếp theo
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className={
                                            isSubmitting
                                                ? "disable-btn"
                                                : "pr-btn"
                                        }
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <LoadingSpinner />
                                        ) : (
                                            "Đăng ký"
                                        )}
                                    </button>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </section>
    );
};

export default RegisterTutorPage;
