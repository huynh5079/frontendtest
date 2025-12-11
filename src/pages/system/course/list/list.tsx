import { useEffect, useState, type FC } from "react";
import { CourseCard } from "../../../../components/card";
import { FilterCourse } from "../../../../components/course/list";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectListPublicClasses } from "../../../../app/selector";
import { publicGetAllClassesApiThunk } from "../../../../services/public/class/classthunk";
import { useDocumentTitle } from "../../../../utils/helper";
import { PublicClass } from "../../../../types/public";

const ListCoursePage: FC = () => {
    const classes = useAppSelector(selectListPublicClasses);
    const dispatch = useAppDispatch();

    // Khởi tạo state với mảng rỗng để tránh lỗi undefined
    const [filteredClasses, setFilteredClasses] = useState<PublicClass[]>([]);

    useEffect(() => {
        dispatch(publicGetAllClassesApiThunk());
    }, [dispatch]);

    // Khi classes thay đổi, cập nhật filteredClasses
    useEffect(() => {
        setFilteredClasses(classes || []);
    }, [classes]);

    const handleFilterChange = (filters: {
        titleSearch: string;
        educationLevel: string;
        subject: string;
        modes: string[];
        minPrice: number;
        maxPrice: number;
    }) => {
        const result = (classes || []).filter((item) => {
            // Lọc theo tên lớp (title)
            if (
                filters.titleSearch &&
                !item.title
                    .toLowerCase()
                    .includes(filters.titleSearch.toLowerCase())
            )
                return false;

            // Lọc theo cấp bậc
            if (
                filters.educationLevel &&
                item.educationLevel !== filters.educationLevel
            )
                return false;

            // Lọc theo môn học
            if (filters.subject && item.subject !== filters.subject)
                return false;

            // Lọc theo hình thức (mode)
            if (filters.modes.length > 0 && !filters.modes.includes(item.mode))
                return false;

            // Lọc theo giá
            if (item.price < filters.minPrice || item.price > filters.maxPrice)
                return false;

            return true;
        });

        setFilteredClasses(result);
    };

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
                        {filteredClasses.length > 0 ? (
                            filteredClasses.map((item) => (
                                <CourseCard key={item.id} course={item} />
                            ))
                        ) : (
                            <p>Không có lớp học phù hợp.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ListCoursePage;
