import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MyCourses from "./MyCourses";
import Explore from "./Explore";
import Profile from "./Profile";
import ThemeToggle from "./ThemeToggle";
import STUChangePassword from "./STUChangePassword";
import SubCategories from "./SubCategories";
import Lessons from "./Lessons";
import Details from "./Details";
import CoursePayment from "./CoursePayment";
import Contact from "./Contact";
import api from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/userReducer";
const NAV = [
  {
    section: "Main",
    items: [
      { id: "overview", label: "Dashboard", icon: "grid" },
      { id: "courses", label: "My Courses", icon: "book" },
      { id: "explore", label: "Explore", icon: "search" },
      { id: "contact", label: "Contact", icon: "mail" },
    ],
  },
  {
    section: "Account",
    items: [
      { id: "profile", label: "Profile", icon: "user" },
      { id: "logout", label: "Logout", icon: "logout" },
    ],
  },
];

const ICONS = {
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  bell: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>,
  menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>,
  mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0 1.1.9 2 2 2z" /><polyline points="22,6 12,13 2,6" /></svg>,
};

const PAGE_TITLES = {
  overview: "Dashboard",
  courses: "My Courses",
  explore: "Explore Courses",
  subcategories: "Sub Categories",
  lessons: "Lessons",
  details: "Lesson Details",
  payment: "Secure Payment",
  profile: "My Profile",
  changepassword: "Change Password",
  contact: "Contact Us",
};

function HamburgerBtn({ open, onClick }) {
  return (
    <button
      onClick={onClick}
      className="STUicon-btn STUhamburger-btn"
      title={open ? "Close menu" : "Open menu"}
      aria-label={open ? "Close navigation" : "Open navigation"}
    >
      {open ? ICONS.close : ICONS.menu}
    </button>
  );
}

// ===================== PROGRESS CARD =====================
function ProgressBar({ percent }) {
  return (
    <div style={{
      background: "var(--border-color, #2a2d3e)",
      borderRadius: "99px",
      height: "8px",
      overflow: "hidden",
      marginTop: "6px"
    }}>
      <div style={{
        width: `${percent}%`,
        height: "100%",
        borderRadius: "99px",
        background: percent === 100
          ? "linear-gradient(90deg,#10b981,#34d399)"
          : "linear-gradient(90deg,#4f63ff,#a78bfa)",
        transition: "width 0.6s ease"
      }} />
    </div>
  );
}

// ===================== OVERVIEW =====================
function Overview({ udata, onGoToCourses }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await api.get("/api/progress/get");
        if (res.data.code === 1) setProgress(res.data);
      } catch (e) {
        toast.error(e.customMessage || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, []);

  const initials = udata?.pname
    ? udata.pname.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "SC";

  // Format date
  function formatDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, #4f63ff 0%, #a78bfa 100%)",
        borderRadius: 14,
        padding: "24px 28px",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <div>
          <p style={{ opacity: 0.85, fontSize: 14, margin: "0 0 4px", color: "#fff", cursor: "context-menu" }}>Welcome back,</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", color: "#fff", cursor: "context-menu" }}>
            {udata?.pname || "Student"}
          </h2>
          <p style={{ opacity: 0.75, fontSize: 13, margin: 0, color: "#fff", cursor: "context-menu" }}>{udata?.uname}</p>
        </div>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, fontWeight: 700, color: "#fff", flexShrink: 0, cursor: "context-menu"
        }}>
          {initials}
        </div>
      </div>

      {/* Account Info Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, cursor: "context-menu" }}>
        {[
          { label: "Account Type", value: udata?.utype || "—", color: "#4f63ff" },
          { label: "Status", value: "Active", color: "#10b981" },
          { label: "Account ID", value: udata?.uid ? udata.uid.slice(-6).toUpperCase() : "—", color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} className="STUcard" style={{ textAlign: "center", padding: "16px 12px" }}>
            <p style={{ fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>
              {label}
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, color, margin: 0, wordBreak: "break-all" }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ===== PROGRESS SECTION ===== */}
      <div style={{ cursor: "context-menu" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700 }}>📊 My Progress</h3>

        {loading ? (
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Loading progress...</p>
        ) : !progress || progress.totalWatched === 0 ? (
          /* No progress yet */
          <div className="STUcard" style={{ padding: "20px", textAlign: "center" }}>
            <p style={{ fontSize: 32, margin: "0 0 8px" }}>🎬</p>
            <p style={{ color: "var(--text-secondary)", margin: "0 0 12px", fontSize: 14 }}>
              You haven't watched any lessons yet. Get started!
            </p>
            <button
              onClick={onGoToCourses}
              style={{
                background: "linear-gradient(135deg,#4f63ff,#a78bfa)",
                border: "none", color: "#fff",
                padding: "8px 20px", borderRadius: "8px",
                cursor: "pointer", fontWeight: 600, fontSize: 14
              }}
            >
              🚀 Explore Courses
            </button>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14, marginBottom: 16 }}>
              {[
                { emoji: "✅", label: "Lessons Watched", value: progress.totalWatched, color: "#10b981" },
                { emoji: "🔥", label: "Day Streak", value: `${progress.streak}d`, color: "#f59e0b" },
                { emoji: "📚", label: "Courses Enrolled", value: progress.courseProgress?.length || 0, color: "#4f63ff" },
              ].map(({ emoji, label, value, color }) => (
                <div key={label} className="STUcard" style={{ textAlign: "center", padding: "14px 10px" }}>
                  <p style={{ fontSize: 22, margin: "0 0 4px" }}>{emoji}</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color, margin: "0 0 2px" }}>{value}</p>
                  <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Last Watched */}
            {progress.lastWatched && (
              <div className="STUcard" style={{ padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>🕐</span>
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>Last Watched</p>
                  <p style={{ margin: "2px 0 0", fontWeight: 600, fontSize: 14 }}>
                    {progress.lastWatched.title}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                    {progress.lastWatched.subcatName} · {formatDate(progress.lastWatched.watchedAt)}
                  </p>
                </div>
              </div>
            )}

            {/* Per-Course Progress */}
            {progress.courseProgress?.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {progress.courseProgress.map((c) => (
                  <div key={c.subcatId} className="STUcard" style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{c.subcatName}</span>
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: c.percent === 100 ? "#10b981" : "#a78bfa"
                      }}>
                        {c.percent === 100 ? "✅ Complete" : `${c.watchedCount}/${c.totalLessons} lessons`}
                      </span>
                    </div>
                    <ProgressBar percent={c.percent} />
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--text-secondary)" }}>
                      {c.percent}% completed
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
//studentdashboard starts
function StudentDashboard() {
  const udata = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [page, setPage] = useState("overview");
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [selectedSubCatId, setSelectedSubCatId] = useState(null);
  const [selectedSubCatName, setSelectedSubCatName] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Student Dashboard - Study Course";
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [page]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

  const initials = udata?.pname
    ? udata.pname.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "SC";

  async function handleNav(id) {
    if (id === "logout") {
      try {
        await api.post("/api/auth/logout");

        dispatch(logout());
        sessionStorage.clear();
        localStorage.clear();

        toast.success("Logged out successfully!");
        navigate("/login");
      } catch (err) {
        toast.error(err.customMessage || "Logout failed");
      }
      return;
    }

    setPage(id);
  }

  function renderPage() {
    switch (page) {
      case "overview": return (
        <Overview
          udata={udata}
          onGoToCourses={() => setPage("explore")}
        />
      );
      case "courses":
        return (
          <MyCourses
            onBrowse={() => setPage("explore")}
            onOpenCourse={(id, name) => {
              setSelectedSubCatId(id);
              setSelectedSubCatName(name);
              setPage("lessons");
            }}
          />
        );
      case "explore": return (
        <Explore onCategoryClick={(id) => {
          setSelectedCatId(id);
          setPage("subcategories");
        }} />
      );
      case "subcategories": return (
        <SubCategories
          catId={selectedCatId}
          onBack={() => setPage("explore")}
          onSubCatClick={(id, name) => {
            setSelectedSubCatId(id);
            setSelectedSubCatName(name);
            setPage("lessons");
          }}
        />
      );
      case "lessons": return (
        <Lessons
          scid={selectedSubCatId}
          name={selectedSubCatName}
          onBack={() => {
            if (!selectedCatId) {
              setPage("courses");   // Safe return
            } else {
              setPage("subcategories"); // catId available hai
            }
          }}
          onLessonClick={(id) => {
            setSelectedLessonId(id);
            setPage("details");
          }}
          onPay={(id, name) => {
            setSelectedSubCatId(id);
            setSelectedSubCatName(name);
            setPage("payment");
          }}
        />
      );
      case "details": return (
        <Details
          lessonId={selectedLessonId}
          onBack={() => setPage("lessons")}
        />
      );
      case "payment": return (
        <CoursePayment
          embedded={true}
          subcatId={selectedSubCatId}
          subcatName={selectedSubCatName}
          onSuccess={() => setPage("courses")}
        />
      );
      case "contact": return <Contact embedded={true} />;
      case "profile": return <Profile />;
      case "changepassword": return <STUChangePassword />;
      default: return <Overview udata={udata} onGoToCourses={() => setPage("explore")} />;
    }
  }

  return (
    <div className="dash-root">

      {sidebarOpen && (
        <div
          className="STUsidebar-overlay open"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`STUsidebar${sidebarOpen ? " open" : ""}`}>
        <div className="STUsidebar-logo">
          <div className="STUlogo-icon">
            <img src="images/favicon.png" height="25px" alt="logo" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
            <span className="STUlogo-text" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Student Dashboard
            </span>
            <small style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 11, opacity: 0.6 }}>
              Study Course
            </small>
          </div>
        </div>

        {NAV.map((group) => (
          <div key={group.section} style={{ width: "100%" }}>
            <div className="STUsidebar-section">{group.section}</div>
            {group.items.map((item) => (
              <button
                key={item.id}
                className={`STUnav-item${page === item.id ? " active" : ""}`}
                onClick={() => handleNav(item.id)}
                title={item.label}
              >
                <span className="STUnav-icon">{ICONS[item.icon]}</span>
                <span className="STUnav-label">{item.label}</span>
              </button>
            ))}
          </div>
        ))}

        <div className="STUsidebar-footer" style={{ cursor: "context-menu" }}>
          <div className="STUuser-mini">
            <div className="STUavatar-sm">{initials}</div>
            <div className="STUuser-mini-info">
              <div className="STUuser-mini-name">{udata?.pname || "Student"}</div>
              <div className="STUuser-mini-role">{udata?.utype || "user"}</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="STUmain-content">
        <header className="STUtopbar">
          <HamburgerBtn open={sidebarOpen} onClick={toggleSidebar} />
          <span className="STUtopbar-title">{PAGE_TITLES[page] || "Dashboard"}</span>

          <div style={{ position: "relative", top: "unset", right: "unset" }}>
            <nav className="navigation">
              <ThemeToggle />
            </nav>
          </div>

          <div
            className="STUtopbar-user"
            onClick={() => setPage("profile")}
            style={{ cursor: "pointer" }}
            title="View Profile"
          >
            <div className="STUavatar-sm sm">{initials}</div>
          </div>

        </header>

        <main className="STUscroll-area" style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;