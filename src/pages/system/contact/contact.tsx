import { FC, useState } from "react";
import { MdEmail } from "react-icons/md";

const teamMembers = [
    {
        name: "Phạm Công Lê Tuấn",
        role: "Frontend Developer",
        email: "tuan@example.com",
    },
    {
        name: "Nguyễn Mạnh Tấn Huỳnh",
        role: "Backend Developer",
        email: "nguyenvana@example.com",
    },
    {
        name: "Dương Công Mạnh",
        role: "Backend Developer",
        email: "tranb@example.com",
    },
    {
        name: "Võ Lê Thi",
        role: "Backend Developer",
        email: "tranb@example.com",
    },
    {
        name: "Nguyễn Thị Yến Vy",
        role: "Frontend Developer",
        email: "tranb@example.com",
    },
];

const ContactPage: FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ name, email, message });
        setSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                <h2>Liên hệ với chúng tôi</h2>
                <div className="contact-content">
                    <form onSubmit={handleSubmit} className="form">
                        {submitted && (
                            <div className="success-message">
                                Cảm ơn bạn! Chúng tôi đã nhận được phản hồi.
                            </div>
                        )}
                        <div className="form-field">
                            <label htmlFor="" className="form-label">
                                Họ và tên
                            </label>
                            <div className="form-input-container">
                                <MdEmail className="form-input-icon" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div className="form-field">
                            <label htmlFor="" className="form-label">
                                Email
                            </label>
                            <div className="form-input-container">
                                <MdEmail className="form-input-icon" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div className="form-field">
                            <label htmlFor="" className="form-label">
                                Nội dung
                            </label>
                            <div className="form-input-container">
                                <MdEmail className="form-input-icon" />
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <button type="submit" className="pr-btn">
                            Gửi
                        </button>
                    </form>

                    <div className="team-info">
                        <h3>Thông tin nhóm</h3>
                        <ul>
                            <div className="r1">
                                {teamMembers.slice(0, 3).map((member, idx) => (
                                    <li key={idx}>
                                        <strong>
                                            {member.name}
                                            {" - "}
                                            <span>{member.role}</span>
                                        </strong>
                                        <a href={`mailto:${member.email}`}>
                                            {member.email}
                                        </a>
                                    </li>
                                ))}
                            </div>
                            <div className="r2">
                                {teamMembers.slice(3, 6).map((member, idx) => (
                                    <li key={idx}>
                                        <strong>
                                            {member.name}
                                            {" - "}
                                            <span>{member.role}</span>
                                        </strong>
                                        <a href={`mailto:${member.email}`}>
                                            {member.email}
                                        </a>
                                    </li>
                                ))}
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
