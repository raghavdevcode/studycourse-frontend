import api from "../api/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MyCourses({ onBrowse, onOpenCourse }) {
  const udata = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchEnrolledCourses() {
    try {
        const res = await api.get(`/api/enrollment/myenrollments`); 
      if (res?.data?.code === 1) {
        setEnrolledCourses(res.data.enrollments);
      } else {
        toast.error("Could not fetch your courses");
      }
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Something went wrong";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

useEffect(() => {
  if (!udata?.isLoggedIn) {
    navigate("/login");
    return;
  }
  fetchEnrolledCourses();
}, [udata?.isLoggedIn, navigate]);

  useEffect(() => {
    document.title = "My Courses - Study Course";
  }, []);

  if (!udata?.isLoggedIn) return null;

  return (
    <section className="w3l-courses">
      <div className="blog pb-5" id="courses">
        <div className="container py-lg-5 py-md-4 py-2">

          {loading ? (
            <div style={{ textAlign: "center", color: "#aaa", paddingTop: "60px" }}>
              <p>Loading your courses...</p>
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#94a3b8"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📚</div>
              <h4 style={{ color: "#fff", marginBottom: "8px" }}>
                No courses enrolled yet
              </h4>
              <p style={{ marginBottom: "24px" }}>
                Explore our courses and enroll to start learning.
              </p>
              <button
                onClick={onBrowse}
                style={{
                  background: "linear-gradient(135deg, #5a8dee, #3b6fd4)",
                  color: "#fff",
                  padding: "12px 28px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <>
              {/* Enrolled count badge */}
              <div style={{
                background: "linear-gradient(135deg, #064e3b, #065f46)",
                borderRadius: "14px",
                padding: "14px 24px",
                marginBottom: "32px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <span style={{ fontSize: "1.5rem", cursor:"context-menu" }}>✅</span>
                <p style={{ color: "#6ee7b7", margin: 0, fontWeight: "bold", cursor:"context-menu" }}>
                  You are enrolled in {enrolledCourses.length} course
                  {enrolledCourses.length > 1 ? "s" : ""}. All lessons are unlocked.
                </p>
              </div>

              {/* Course cards */}
              <div className="row">
                {enrolledCourses.map((course, i) => (
                  <div className="col-lg-4 col-md-6 item" key={i}>
                    <div
                      className="card lesson-img-gap"
                      style={{ position: "relative", cursor: "pointer" }}
                      onClick={() =>
                        onOpenCourse(course.subcatId, course.subcatName)
                      }
                    >
                      <div className="card-body">
                        <div style={{ position: "relative" }}>
                          <img
                            alt={course.subcatName}
                            src={`${process.env.REACT_APP_APIURL}/uploads/${course.thumbnail}`}
                            onError={(e) => {
                              e.target.src = `${process.env.REACT_APP_APIURL}/uploads/defaultpic.jpg`;
                            }}
                            className="img-fluid"
                            style={{ borderRadius: "8px" }}
                          />

                          {/* Enrolled badge */}
                          <span style={{
                            position: "absolute",
                            top: "8px",
                            left: "8px",
                            background: "#4ade80",
                            color: "#0f172a",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            padding: "3px 8px",
                            borderRadius: "20px"
                          }}>
                            ✅ ENROLLED
                          </span>
                        </div>

                        <p className="category-p">{course.subcatName}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default MyCourses;