import api from "../api/api";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function getInitials(name) {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";
}

function StudentDetail() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [courseProgress, setCourseProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const [userRes, enrollRes, progressRes] = await Promise.all([
                api.get(`/api/auth/searchuser/${userId}`),
                api.get(`/api/enrollment/student/${userId}`),
                api.get(`/api/progress/student/${userId}`)
            ]);

            if (userRes?.data?.code === 1) setStudent(userRes.data.udata);
            if (enrollRes?.data?.code === 1) setEnrollments(enrollRes.data.enrollments || []);
            if (progressRes?.data?.code === 1) setCourseProgress(progressRes.data.courseProgress || []);

        } catch (e) {
            toast.error(e?.response?.data?.message || e?.message || "Server not responding");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        document.title = "Student Detail - Study Course";
        fetchAllData();
    }, [userId, fetchAllData]);

    if (loading) {
        return (
            <div className="sd-wrapper">
                <div className="sd-loading">
                    <span className="spinner-border spinner-border-sm" role="status" />
                    <span style={{ marginLeft: "10px" }}>Loading student data...</span>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="sd-wrapper">
                <div className="sd-empty">Student not found</div>
            </div>
        );
    }

    return (
        <div className="sd-wrapper">

            {/* Back Button */}
            <button className="sd-back-btn" onClick={() => navigate(-1)}>
                ← Back
            </button>

            {/* Profile Card */}
            <div className="sd-card sd-profile-card">
                <div className="sd-profile-header">
                    <div className="sd-avatar">{getInitials(student.name)}</div>
                    <div className="sd-profile-info">
                        <h2 className="sd-name">{student.name}</h2>
                        <p className="sd-email">{student.username}</p>
                        <span className={`sd-badge ${student.usertype === "admin" ? "sd-badge-admin" : "sd-badge-user"}`}>
                            {student.usertype}
                        </span>
                    </div>
                </div>
                <hr className="sd-divider" />
                <div className="sd-info-grid">
                    <div className="sd-info-item">
                        <p className="sd-info-label">Phone</p>
                        <p className="sd-info-value">{student.phone || "—"}</p>
                    </div>
                    <div className="sd-info-item">
                        <p className="sd-info-label">Account Status</p>
                        <p className="sd-info-value">
                            <span className={`sd-status ${student.isActivated ? "sd-status-active" : "sd-status-inactive"}`}>
                                {student.isActivated ? "✔ Activated" : "✘ Not Activated"}
                            </span>
                        </p>
                    </div>
                    <div className="sd-info-item">
                        <p className="sd-info-label">Total Enrollments</p>
                        <p className="sd-info-value">{enrollments.length}</p>
                    </div>
                    <div className="sd-info-item">
                        <p className="sd-info-label">Courses In Progress</p>
                        <p className="sd-info-value">
                            {courseProgress.filter(c => c.percent > 0 && c.percent < 100).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Enrolled Courses */}
            <div className="sd-card">
                <h3 className="sd-section-title">📋 Enrolled Courses</h3>
                {enrollments.length === 0 ? (
                    <p className="sd-empty-text">No enrollments found</p>
                ) : (
                    <div className="sd-course-grid">
                        {enrollments.map((enroll, i) => (
                            <div className="sd-course-card" key={i}>
                                <div className="sd-course-thumb">
                                    <img
                                        src={`/uploads/${enroll.thumbnail}`}
                                        alt={enroll.subcatName}
                                        onError={(e) => { e.target.src = "/uploads/defaultpic.jpg"; }}
                                    />
                                </div>
                                <div className="sd-course-info">
                                    <p className="sd-course-name">{enroll.subcatName}</p>
                                    <p className="sd-course-date">
                                        Enrolled: {new Date(enroll.enrolledAt).toLocaleDateString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Course Progress */}
            <div className="sd-card">
                <h3 className="sd-section-title">📊 Course Progress</h3>
                {courseProgress.length === 0 ? (
                    <p className="sd-empty-text">No progress data found</p>
                ) : (
                    <div className="sd-progress-list">
                        {courseProgress.map((cp, i) => (
                            <div className="sd-progress-item" key={i}>
                                <div className="sd-progress-top">
                                    <span className="sd-progress-name">{cp.subcatName}</span>
                                    <span className="sd-progress-percent">{cp.percent}%</span>
                                </div>
                                <div className="sd-progress-bar-bg">
                                    <div
                                        className="sd-progress-bar-fill"
                                        style={{ width: `${cp.percent}%` }}
                                    />
                                </div>
                                <p className="sd-progress-lessons">
                                    {cp.watchedCount} / {cp.totalLessons} lessons watched
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

export default StudentDetail;