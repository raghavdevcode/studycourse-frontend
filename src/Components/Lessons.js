import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorPage from "./ErrorPage";
import { getLessonsApi } from "../api/lessonApi";
import { useSelector } from "react-redux";
const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

function Lessons({ scid, name, onBack, onLessonClick, onPay }) {
  const [params] = useSearchParams();
  const coursedt = scid || params.get("scid");
  const subcatName = name || params.get("name") || "Course";

  const [lessondata, setlessondata] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const udata = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const abortRef = useRef(null);

  // ---------------- FETCH DATA ----------------
  const fetchcoursebysubcat = useCallback(async () => {
    try {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const apiresp = await getLessonsApi(
         coursedt,
        { signal: abortRef.current.signal }
      );

      if (apiresp?.data?.code === 1) {
        setlessondata(apiresp.data.lessondata || []);
        setEnrolled(apiresp.data.enrolled || false);
      } else {
        setNotFound(true);
      }
    } catch (e) {
      if (e?.name === "CanceledError") return;

      console.error(e);
      toast.error(
        e?.response?.data?.message ||
        e?.message ||
        "Server not responding"
      );
    }
     finally {
            setLoading(false);
        }
  }, [coursedt]);

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    if (!coursedt || !isValidObjectId(coursedt)) {
      setNotFound(true);
      return;
    }
    fetchcoursebysubcat();

    return () => abortRef.current?.abort();
  }, [coursedt, fetchcoursebysubcat]);

  useEffect(() => {
    document.title = "Lessons - Study Course";
  }, []);

  // ---------------- HANDLERS ----------------
  function handleLockedClick() {
    if (!udata?.isLoggedIn) {
      toast.warn("Please login first");
      navigate("/login");
      return;
    }

    if (onPay) {
      onPay(coursedt, subcatName);
    } else {
      navigate(`/payment?scid=${coursedt}&name=${encodeURIComponent(subcatName)}`);
    } 
  }

  function handleLessonClick(lessonId) {
    if (onLessonClick) {
      onLessonClick(lessonId);
    } else {
      navigate(`/details?lid=${lessonId}`);
    }
  }

  if (notFound) return <ErrorPage />;

    if (loading) return  <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <div className="spinner-border text-primary" role="status"></div>
      </div>;
  return (
    <>
      {!onBack && (
        <section className="w3l-breadcrumb">
           <div className="breadcrumb-bg breadcrumb-bg-about py-2">
            <div className="container pt-3 pb-5 p-lg-4 pt-lg-5">
              <h2 className="title mt-5 pt-lg-5 pt-sm-3">Lessons of {lessondata[0]?.subcatid?.subcatname}</h2>
              <ul className="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
                <Link to="/" className="breadcrumb-homelink">Home</Link>
                <li className="active"> / Lessons </li>
              </ul>
            </div>
          </div>

          <div className="waveWrapper waveAnimation">
            <svg viewBox="0 0 500 150" preserveAspectRatio="none">
              <path
                d="M-5.07,73.52 C149.99,150.00 299.66,-102.13 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
                style={{ stroke: "none" }}
              />
            </svg>
          </div>
        </section>
      )}

      {onBack && (
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "1px solid #5a8dee",
              color: "#5a8dee",
              padding: "8px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ← Back to Sub Categories
          </button>
        </div>
      )}

      <section className="w3l-courses">
        <div className="blog pb-5" id="courses">
          <div className="container py-lg-5 py-md-4 py-2">

            {/* ENROLL BANNER */}
            {!enrolled && lessondata.length > 1 && (
              <div style={{
                background: "linear-gradient(135deg, #1e3a5f, #2d4a7a)",
                borderRadius: "14px",
                padding: "20px 28px",
                marginBottom: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px"
              }}>
                <div>
                  <h4 style={{ color: "#fff", margin: 0 }}>
                    🔒 {lessondata.length - 1} lessons locked
                  </h4>
                  <p style={{ color: "#94a3b8", margin: "4px 0 0", fontSize: "0.9rem" }}>
                    Enroll for ₹499 to unlock all lessons with lifetime access
                  </p>
                </div>

                <button
                  onClick={handleLockedClick}
                  style={{
                    background: "linear-gradient(135deg, #5a8dee, #3b6fd4)",
                    border: "none",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "0.95rem"
                  }}
                >
                  Enroll Now — ₹499
                </button>
              </div>
            )}

            {/* ENROLLED STATUS */}
            {enrolled && (
              <div style={{
                background: "linear-gradient(135deg, #064e3b, #065f46)",
                borderRadius: "14px",
                padding: "14px 24px",
                marginBottom: "32px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <span style={{ fontSize: "1.5rem" }}>✅</span>
                <p style={{ color: "#6ee7b7", margin: 0, fontWeight: "bold" }}>
                  You are enrolled! All lessons are unlocked.
                </p>
              </div>
            )}

            {/* LESSON LIST */}
            <div className="row">
              {lessondata.map((data, i) => (
                <div className="col-lg-4 col-md-6 item" key={data._id || i}>
                  <div className="card lesson-img-gap" style={{ position: "relative" }}>
                    <div className="card-body">

                      {data.isLocked ? (
                        <div onClick={handleLockedClick} style={{ cursor: "pointer" }}>
                          <div style={{ position: "relative" }}>
                            <img
                              alt="lessonpic"
                              src={`${process.env.REACT_APP_APIURL}/uploads/${data.thumbnail}`}
                              className="img-fluid"
                              style={{ filter: "brightness(0.35)", borderRadius: "8px" }}
                            />
                            <div style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              textAlign: "center"
                            }}>
                              <div style={{ fontSize: "2rem" }}>🔒</div>
                              <p style={{ color: "#fff", margin: "4px 0 0", fontSize: "0.8rem", fontWeight: "bold" }}>
                                Enroll to Unlock
                              </p>
                            </div>
                          </div>

                          <p className="category-p">{data.title}</p>
                        </div>
                      ) : (
                        <div onClick={() => handleLessonClick(data._id)} style={{ cursor: "pointer" }}>
                          <div style={{ position: "relative" }}>
                            <img
                              alt="lessonpic"
                              src={`${process.env.REACT_APP_APIURL}/uploads/${data.thumbnail}`}
                              className="img-fluid"
                            />
                            {i === 0 && (
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
                                FREE
                              </span>
                            )}
                          </div>

                          <p className="category-p">{data.title}</p>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default Lessons;