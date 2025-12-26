import { useEffect, useState, type FC } from "react";
import { CourseCard } from "../../../../components/card";
import { FilterCourse } from "../../../../components/course/list";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectListPublicClasses } from "../../../../app/selector";
import { publicGetAllClassesApiThunk } from "../../../../services/public/class/classthunk";
import { useDocumentTitle } from "../../../../utils/helper";
import { PublicClass } from "../../../../types/public";

const educationLevelMap: Record<string, string[]> = {
    "Tiểu học": ["Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5"],
    "Trung học cơ sở": ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"],
    "Trung học phổ thông": ["Lớp 10", "Lớp 11", "Lớp 12"],
};

const ListCoursePage: FC = () => {
    const classes = useAppSelector(selectListPublicClasses);
    const dispatch = useAppDispatch();

    const ITEMS_PER_PAGE = 6;

    const [currentPage, setCurrentPage] = useState(1);
    const [filteredClasses, setFilteredClasses] = useState<PublicClass[]>([]);

    useEffect(() => {
        dispatch(publicGetAllClassesApiThunk());
    }, [dispatch]);

    useEffect(() => {
        setFilteredClasses(classes || []);
    }, [classes]);

    const handleFilterChange = (filters: {
        titleSearch: string;
        educationLevel: string;
        classLevel: string;
        subject: string;
        modes: string[];
        location: string;
        minPrice: number;
        maxPrice: number;
    }) => {
        const result = (classes || []).filter((item) => {
            if (
                filters.titleSearch &&
                !item.title
                    .toLowerCase()
                    .includes(filters.titleSearch.toLowerCase())
            )
                return false;

            // Nếu đã chọn lớp → ưu tiên lớp
            if (filters.classLevel) {
                if (item.educationLevel !== filters.classLevel) return false;
            } else if (filters.educationLevel) {
                const allowed = educationLevelMap[filters.educationLevel] || [];
                if (!allowed.includes(item.educationLevel)) return false;
            }

            if (filters.subject && item.subject !== filters.subject)
                return false;

            if (filters.modes.length > 0 && !filters.modes.includes(item.mode))
                return false;

            // Filter by location (ONLY for offline classes)
            // Khi có filter địa chỉ lớp học:
            // - Chỉ hiển thị các lớp học tại nhà (Offline) có địa chỉ khớp
            // - Các lớp học trực tuyến (Online) KHÔNG được hiển thị
            if (filters.location && filters.location.trim() !== "") {
                // Loại bỏ tất cả các lớp Online khi có filter địa chỉ
                if (item.mode === "Online") {
                    return false; // Online classes không có địa chỉ, loại bỏ
                }
                // Chỉ kiểm tra location cho các lớp Offline
                if (item.mode === "Offline") {
                    // Nếu lớp Offline không có địa chỉ hoặc địa chỉ không khớp -> loại bỏ
                    if (
                        !item.location ||
                        !item.location
                            .toLowerCase()
                            .includes(filters.location.toLowerCase())
                    ) {
                        return false;
                    }
                }
            }

            if (item.price < filters.minPrice || item.price > filters.maxPrice)
                return false;

            return true;
        });

        setCurrentPage(1);
        setFilteredClasses(result);
    };

    const totalPages = Math.max(
        1,
        Math.ceil(filteredClasses.length / ITEMS_PER_PAGE),
    );

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const paginatedClasses = filteredClasses.slice(startIndex, endIndex);

    useDocumentTitle("Danh sách lớp học");

    return (
        <section id="list-course-section">
            <div className="lcs-container">
                <div className="lcscr1">
                    <h2>Danh sách lớp học</h2>
                </div>
                <div className="lcscr2">
                    <div className="lcscr2c1">
                        <FilterCourse onFilterChange={handleFilterChange} />
                    </div>
                    <div className="lcscr2c2">
                        <div className="lcscr2c2-classes">
                            {paginatedClasses.length > 0 ? (
                                paginatedClasses.map((item) => (
                                    <CourseCard key={item.id} course={item} />
                                ))
                            ) : (
                                <p>Không có lớp học phù hợp.</p>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    disabled={currentPage === 1}
                                    className={
                                        currentPage === 1
                                            ? "disable-btn"
                                            : "sc-btn"
                                    }
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                >
                                    Trang trước
                                </button>

                                <span>
                                    {currentPage} / {totalPages}
                                </span>

                                <button
                                    disabled={currentPage === totalPages}
                                    className={
                                        currentPage === totalPages
                                            ? "disable-btn"
                                            : "sc-btn"
                                    }
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                >
                                    Trang sau
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ListCoursePage;
