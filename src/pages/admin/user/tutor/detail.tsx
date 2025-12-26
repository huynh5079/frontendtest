import { useEffect, useState, type FC } from "react";
import { navigateHook } from "../../../../routes/routeApp";
import { routes } from "../../../../routes/routeName";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectTutorForAdmin } from "../../../../app/selector";
import {
    acceptTutorApiThunk,
    getDetailTutorForAdminApiThunk,
    provideTutorApiThunk,
    rejectTutorApiThunk,
} from "../../../../services/admin/tutor/adminTutorThunk";
import { csvToArray, useDocumentTitle } from "../../../../utils/helper";
import { get } from "lodash";
import { toast } from "react-toastify";
import ReactQuill from "react-quill-new";
import { Article } from "../../../../components/elements";

const AdminDetailTutorPage: FC = () => {
    const { id } = useParams();
    const tutor = useAppSelector(selectTutorForAdmin);
    const dispatch = useAppDispatch();
    const subjects = csvToArray(tutor?.teachingSubjects || "");
    //reject
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    //provide
    const [isProvideOpen, setIsProvideOpen] = useState(false);
    const [provideText, setProvideText] = useState("");

    useEffect(() => {
        dispatch(getDetailTutorForAdminApiThunk(String(id)))
            .unwrap()
            .then(() => {})
            .catch(() => {})
            .finally(() => {});
    }, [dispatch, id]);

    const acceptTutor = async (tutorId: string) => {
        await dispatch(acceptTutorApiThunk(tutorId))
            .unwrap()
            .then((res) => {
                const message = get(res, "data.message", "Xử lí thành công");
                toast.success(message);
            })
            .catch((error) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {});
    };

    const rejectTutor = async (tutorId: string, resonReject: string) => {
        await dispatch(
            rejectTutorApiThunk({
                tutorId,
                params: { rejectReason: resonReject },
            }),
        )
            .unwrap()
            .then((res) => {
                const message = get(res, "message", "Xử lí thành công");
                toast.success(message);
            })
            .catch((error) => {
                const errorData = get(error, "message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {});
    };

    const provideTutor = async (tutorId: string, provideText: string) => {
        await dispatch(
            provideTutorApiThunk({
                tutorId,
                params: { provideText: provideText },
            }),
        )
            .unwrap()
            .then((res) => {
                const message = get(res, "message", "Xử lí thành công");
                toast.success(message);
            })
            .catch((error) => {
                const errorData = get(error, "message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {});
    };

    useDocumentTitle(`Gia sư ${tutor?.userName}`);

    return (
        <section id="admin-detail-tutor-section">
            <div className="adts-container">
                <div className="adtscr1">
                    <h4>Gia sư</h4>
                    <p>
                        Trang tổng quát <span>Chi tiết</span>
                    </p>
                </div>
                <div className="adtscr2">
                    <div
                        className="pr-btn"
                        onClick={() => {
                            navigateHook(routes.admin.tutor.list);
                        }}
                    >
                        Quay lại
                    </div>
                </div>
                <div className="adtscr3">
                    <div className="adtscr3r1">
                        <div className="adtscr3r1c1">
                            <h5>Ảnh đại diện</h5>
                            <img
                                className="avatar"
                                src={tutor?.avatarUrl}
                                alt=""
                            />
                        </div>
                        <div className="adtscr3r1c2">
                            <h5>Môn học</h5>
                            <div className="subject">
                                <ul>
                                    {subjects.map((subject, index) => (
                                        <li key={index}>
                                            {subject}: <span>100.000 đ</span>
                                            /buổi
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="adtscr3r2">
                        <div className="adtscr3r2c1">
                            <h5>Thông tin cá nhân</h5>

                            <h6>Họ và tên:</h6>
                            <p>{tutor?.userName}</p>

                            <h6>Giới tính:</h6>

                            <h6>Email:</h6>
                            <p>{tutor?.email}</p>

                            <h6>Địa chỉ:</h6>
                            <p>{tutor?.address}</p>

                            <h6>Số điện thoại:</h6>
                            <p>{tutor?.phone}</p>

                            <h6>Ngày sinh:</h6>

                            <h6>Mô tả bản thân:</h6>
                            <p>{tutor?.bio}</p>
                        </div>
                        <div className="adtscr3r2c2">
                            <h5>Hồ sơ cá nhân</h5>

                            <h6>Trình độ học vấn:</h6>
                            <p>{tutor?.educationLevel}</p>

                            <h6>Ngành học:</h6>
                            <p>{tutor?.major}</p>

                            <h6>Trường/ Đơn vị đào tạo:</h6>
                            <p>{tutor?.university}</p>

                            <h6>Cấp độ giảng dạy:</h6>
                            <p>{tutor?.teachingLevel}</p>

                            <h6>Số năm kinh nghiệm:</h6>
                            <p>{tutor?.teachingExperienceYears}</p>

                            <h6>Hình ảnh CCCD:</h6>
                            {tutor?.identityDocuments.map(
                                (identityDocument) => (
                                    <img
                                        key={identityDocument.id}
                                        src={identityDocument.url}
                                        alt=""
                                    />
                                ),
                            )}

                            <h6>Chứng chỉ cá nhân:</h6>

                            {tutor?.certificates.map((certificate, index) => (
                                <div key={certificate.id ?? index}>
                                    <h2>{certificate.fileName}</h2>

                                    <a
                                        href={certificate.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Xem
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                    {tutor?.status === "PendingApproval" ||
                    tutor?.status === "Rejected" ? (
                        <div className="adtscr3r3">
                            {tutor?.status === "PendingApproval" &&
                                tutor?.provideNote && (
                                    <div
                                        className="review-container"
                                        style={{ marginBottom: "1rem" }}
                                    >
                                        <h2
                                            style={{
                                                fontWeight: "600",
                                                marginBottom: "0.5rem",
                                            }}
                                        >
                                            Các điều cần bổ sung:
                                        </h2>
                                        <Article content={tutor?.provideNote} />
                                    </div>
                                )}
                            {tutor?.status === "PendingApproval" && (
                                <div className="adtscr3r3r1">
                                    <button
                                        className="pr-btn"
                                        onClick={() =>
                                            acceptTutor(String(tutor?.userId))
                                        }
                                    >
                                        Duyệt
                                    </button>
                                    <button
                                        className="sc-btn"
                                        onClick={() => {
                                            setIsRejectOpen(!isRejectOpen),
                                                setIsProvideOpen(false);
                                        }}
                                    >
                                        Từ chối
                                    </button>
                                    <button
                                        className="pr-btn"
                                        onClick={() => {
                                            setIsProvideOpen(!isProvideOpen),
                                                setIsRejectOpen(false);
                                        }}
                                    >
                                        Yêu cầu bổ sung
                                    </button>
                                </div>
                            )}
                            {isRejectOpen && (
                                <>
                                    <div className="editor-wrapper">
                                        <ReactQuill
                                            theme="snow"
                                            value={rejectReason}
                                            onChange={setRejectReason}
                                            style={{ height: "200px" }}
                                            placeholder="Nhập lí do từ chối hồ sơ"
                                        />
                                        <button
                                            className="pr-btn"
                                            onClick={() =>
                                                rejectTutor(
                                                    String(tutor?.userId),
                                                    rejectReason,
                                                )
                                            }
                                        >
                                            Gửi
                                        </button>
                                    </div>
                                </>
                            )}
                            {isProvideOpen && (
                                <>
                                    <div className="editor-wrapper">
                                        <ReactQuill
                                            theme="snow"
                                            value={provideText}
                                            onChange={setProvideText}
                                            style={{ height: "200px" }}
                                            placeholder="Nhập các điều cần bổ sung thêm cho hồ sơ"
                                        />
                                        <button
                                            className="pr-btn"
                                            onClick={() =>
                                                provideTutor(
                                                    String(tutor?.userId),
                                                    provideText,
                                                )
                                            }
                                        >
                                            Gửi
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AdminDetailTutorPage;
