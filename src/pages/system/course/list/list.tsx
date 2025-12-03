import { useEffect, type FC } from "react";
import { CourseCard } from "../../../../components/card";
import { FilterCourse } from "../../../../components/course/list";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectListPublicClasses } from "../../../../app/selector";
import { publicGetAllClassesApiThunk } from "../../../../services/public/class/classthunk";
import { useDocumentTitle } from "../../../../utils/helper";

const ListCoursePage: FC = () => {
    const classes = useAppSelector(selectListPublicClasses);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(publicGetAllClassesApiThunk());
    }, [dispatch]);

    useDocumentTitle("Danh sách lớp học");

    return (
        <section id="list-course-section">
            <div className="lcs-container">
                <div className="lcscr1">
                    <h2>Danh sách lớp học</h2>
                </div>
                <div className="lcscr2">
                    <div className="lcscr2c1">
                        <FilterCourse />
                    </div>
                    <div className="lcscr2c2">
                        {classes?.map((item) => (
                            <CourseCard key={item.id} course={item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ListCoursePage;
