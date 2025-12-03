import type { FC } from "react"
import { useDocumentTitle } from "../../../utils/helper"

const TutorDashboardPage: FC = () => {
    useDocumentTitle("Trang tổng quát")

    return (
        <section id="tutor-dashboard-section">
            <div className="tds-container">
                <div className="tdscr1">
                    <div className="tdscr1c1"></div>
                    <div className="tdscr1c2"></div>
                </div>
            </div>
        </section>
    )
}

export default TutorDashboardPage